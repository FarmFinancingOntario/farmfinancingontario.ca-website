export interface Env {
  CASHLY_WEBHOOK_URL: string;
  ALLOWED_ORIGIN?: string;
}

type LeadSubmission = {
  fullName?: string;
  email?: string;
  phone?: string;
  propertyType?: string;
  financingNeed?: string;
  financingAmount?: string;
  message?: string;
  consent?: boolean;
  source?: string;
  formName?: string;
  submittedAt?: string;
};

type WorkerHandler = {
  fetch(request: Request, env: Env): Promise<Response>;
};

const requiredFields: Array<keyof LeadSubmission> = [
  "fullName",
  "email",
  "phone",
  "propertyType",
  "financingNeed",
  "financingAmount",
];

function corsHeaders(request: Request, env: Env) {
  const origin = request.headers.get("Origin") || "";
  const allowedOrigin = env.ALLOWED_ORIGIN || origin || "*";

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

function validateSubmission(payload: LeadSubmission) {
  const missingFields = requiredFields.filter((field) => {
    const value = payload[field];
    return typeof value !== "string" || value.trim().length === 0;
  });

  if (missingFields.length > 0) {
    return `Missing required fields: ${missingFields.join(", ")}.`;
  }

  if (!payload.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    return "A valid email address is required.";
  }

  if (payload.consent !== true) {
    return "Consent is required.";
  }

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

    if (request.method !== "POST") {
      return jsonResponse(
        request,
        env,
        { success: false, error: "Method not allowed." },
        405,
      );
    }

    if (env.ALLOWED_ORIGIN) {
      const origin = request.headers.get("Origin");
      if (origin && origin !== env.ALLOWED_ORIGIN) {
        return jsonResponse(
          request,
          env,
          { success: false, error: "Origin not allowed." },
          403,
        );
      }
    }

    if (!env.CASHLY_WEBHOOK_URL) {
      return jsonResponse(
        request,
        env,
        { success: false, error: "Cashly webhook URL is not configured." },
        500,
      );
    }

    let payload: LeadSubmission;

    try {
      payload = (await request.json()) as LeadSubmission;
    } catch {
      return jsonResponse(
        request,
        env,
        { success: false, error: "Invalid JSON body." },
        400,
      );
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

    const cashlyPayload = {
      ...payload,
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
