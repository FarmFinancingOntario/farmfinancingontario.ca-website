export interface Env {
  CASHLY_WEBHOOK_URL: string;
  TURNSTILE_SECRET_KEY: string;
  ALLOWED_ORIGIN?: string;
  RATE_LIMIT_KV?: RateLimitStore;
}

type LeadSubmission = {
  fullName?: string;
  email?: string;
  phone?: string;
  propertyType?: string;
  financingNeed?: string;
  financingAmount?: string;
  message?: string;
  companyWebsite?: string;
  consent?: boolean;
  turnstileToken?: string;
  formStartedAt?: string;
  source?: string;
  formName?: string;
  submittedAt?: string;
};

type RateLimitStore = {
  get(key: string): Promise<string | null>;
  put(
    key: string,
    value: string,
    options?: { expirationTtl?: number },
  ): Promise<void>;
};

type TurnstileVerifyResponse = {
  success: boolean;
  hostname?: string;
  "error-codes"?: string[];
};

type WorkerHandler = {
  fetch(request: Request, env: Env): Promise<Response>;
};

const maxBodyBytes = 25_000;
const minimumCompletionSeconds = 2;
const maximumCompletionSeconds = 60 * 60;
const rateLimitWindowSeconds = 10 * 60;
const rateLimitMaxSubmissions = 5;

const requiredFields: Array<keyof LeadSubmission> = [
  "fullName",
  "email",
  "phone",
  "propertyType",
  "financingNeed",
  "financingAmount",
];

const fieldLimits: Partial<Record<keyof LeadSubmission, number>> = {
  fullName: 120,
  email: 160,
  phone: 40,
  propertyType: 80,
  financingNeed: 80,
  financingAmount: 80,
  message: 2000,
  source: 120,
  formName: 160,
};

function configuredOrigins(env: Env) {
  return (env.ALLOWED_ORIGIN || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function isOriginAllowed(request: Request, env: Env) {
  const allowedOrigins = configuredOrigins(env);
  if (allowedOrigins.length === 0) {
    return true;
  }

  const origin = request.headers.get("Origin");
  return !origin || allowedOrigins.includes(origin);
}

function corsHeaders(request: Request, env: Env) {
  const origin = request.headers.get("Origin") || "";
  const allowedOrigins = configuredOrigins(env);
  const allowedOrigin =
    allowedOrigins.length === 0
      ? origin || "*"
      : allowedOrigins.includes(origin)
        ? origin
        : allowedOrigins[0];

  return {
    "Access-Control-Allow-Origin": allowedOrigin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

function jsonResponse(
  request: Request,
  env: Env,
  body: Record<string, unknown>,
  status = 200,
) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders(request, env),
    },
  });
}

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("X-Forwarded-For");
  return (
    request.headers.get("CF-Connecting-IP") ||
    forwardedFor?.split(",")[0]?.trim() ||
    "unknown"
  );
}

function isBodyTooLarge(request: Request) {
  const contentLength = request.headers.get("Content-Length");
  return Boolean(contentLength && Number(contentLength) > maxBodyBytes);
}

function normalizeSubmission(payload: LeadSubmission) {
  return {
    ...payload,
    fullName: payload.fullName?.trim(),
    email: payload.email?.trim().toLowerCase(),
    phone: payload.phone?.trim(),
    propertyType: payload.propertyType?.trim(),
    financingNeed: payload.financingNeed?.trim(),
    financingAmount: payload.financingAmount?.trim(),
    message: payload.message?.trim(),
    source: payload.source?.trim(),
    formName: payload.formName?.trim(),
  };
}

function validateSubmission(payload: LeadSubmission) {
  const missingFields = requiredFields.filter((field) => {
    const value = payload[field];
    return typeof value !== "string" || value.trim().length === 0;
  });

  for (const [field, maxLength] of Object.entries(fieldLimits)) {
    const value = payload[field as keyof LeadSubmission];
    if (typeof value === "string" && value.length > maxLength) {
      return `${field} is too long.`;
    }
  }

  if (missingFields.length > 0) {
    return `Missing required fields: ${missingFields.join(", ")}.`;
  }

  if (!payload.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    return "A valid email address is required.";
  }

  if (payload.consent !== true) {
    return "Consent is required.";
  }

  if (!payload.turnstileToken) {
    return "Verification is required.";
  }

  if (!payload.formStartedAt) {
    return "Submission timing is required.";
  }

  const startedAt = Date.parse(payload.formStartedAt);
  if (Number.isNaN(startedAt)) {
    return "Submission timing is invalid.";
  }

  const elapsedSeconds = (Date.now() - startedAt) / 1000;
  if (elapsedSeconds < minimumCompletionSeconds) {
    return "Please wait a moment before submitting.";
  }

  if (elapsedSeconds > maximumCompletionSeconds) {
    return "Please refresh the page and submit again.";
  }

  return null;
}

async function verifyTurnstile(
  token: string,
  request: Request,
  env: Env,
) {
  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          secret: env.TURNSTILE_SECRET_KEY,
          response: token,
          remoteip: getClientIp(request),
          idempotency_key: crypto.randomUUID(),
        }),
      },
    );

    if (!response.ok) {
      return { success: false, "error-codes": ["siteverify-http-error"] };
    }

    return (await response.json()) as TurnstileVerifyResponse;
  } catch {
    return { success: false, "error-codes": ["siteverify-network-error"] };
  }
}

async function enforceRateLimit(request: Request, env: Env) {
  if (!env.RATE_LIMIT_KV) {
    return null;
  }

  const clientIp = getClientIp(request);
  const bucket = Math.floor(Date.now() / (rateLimitWindowSeconds * 1000));
  const key = `contact-form:${clientIp}:${bucket}`;
  const currentCount = Number((await env.RATE_LIMIT_KV.get(key)) || "0");
  const safeCurrentCount = Number.isFinite(currentCount) ? currentCount : 0;

  if (safeCurrentCount >= rateLimitMaxSubmissions) {
    return "Too many submissions. Please try again later.";
  }

  await env.RATE_LIMIT_KV.put(key, String(safeCurrentCount + 1), {
    expirationTtl: rateLimitWindowSeconds + 120,
  });

  return null;
}

export default {
  async fetch(request, env): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(request, env),
      });
    }

    if (isBodyTooLarge(request)) {
      return jsonResponse(
        request,
        env,
        { success: false, error: "Request body is too large." },
        413,
      );
    }

    if (request.method !== "POST") {
      return jsonResponse(
        request,
        env,
        { success: false, error: "Method not allowed." },
        405,
      );
    }

    if (!isOriginAllowed(request, env)) {
      return jsonResponse(
        request,
        env,
        { success: false, error: "Origin not allowed." },
        403,
      );
    }

    if (!env.CASHLY_WEBHOOK_URL) {
      return jsonResponse(
        request,
        env,
        { success: false, error: "Cashly webhook URL is not configured." },
        500,
      );
    }

    if (!env.TURNSTILE_SECRET_KEY) {
      return jsonResponse(
        request,
        env,
        { success: false, error: "Turnstile secret key is not configured." },
        500,
      );
    }

    let payload: LeadSubmission;

    try {
      payload = normalizeSubmission((await request.json()) as LeadSubmission);
    } catch {
      return jsonResponse(
        request,
        env,
        { success: false, error: "Invalid JSON body." },
        400,
      );
    }

    if (payload.companyWebsite?.trim()) {
      return jsonResponse(request, env, { success: true });
    }

    const validationError = validateSubmission(payload);
    if (validationError) {
      return jsonResponse(
        request,
        env,
        { success: false, error: validationError },
        400,
      );
    }

    const rateLimitError = await enforceRateLimit(request, env);
    if (rateLimitError) {
      return jsonResponse(
        request,
        env,
        { success: false, error: rateLimitError },
        429,
      );
    }

    const turnstileResult = await verifyTurnstile(
      payload.turnstileToken as string,
      request,
      env,
    );

    if (!turnstileResult.success) {
      return jsonResponse(
        request,
        env,
        { success: false, error: "Verification failed. Please try again." },
        400,
      );
    }

    const leadPayload = { ...payload };
    delete leadPayload.companyWebsite;
    delete leadPayload.turnstileToken;

    const cashlyPayload = {
      ...leadPayload,
      receivedAt: new Date().toISOString(),
      integration: "cashly-webhook",
    };

    try {
      const cashlyResponse = await fetch(env.CASHLY_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cashlyPayload),
      });

      if (!cashlyResponse.ok) {
        const errorText = await cashlyResponse.text();
        return jsonResponse(
          request,
          env,
          {
            success: false,
            error: "Cashly CRM webhook rejected the submission.",
            details: errorText.slice(0, 300),
          },
          502,
        );
      }

      return jsonResponse(request, env, { success: true });
    } catch {
      return jsonResponse(
        request,
        env,
        { success: false, error: "Unable to reach Cashly CRM webhook." },
        502,
      );
    }
  },
} satisfies WorkerHandler;
