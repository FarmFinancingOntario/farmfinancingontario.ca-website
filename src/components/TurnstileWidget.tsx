import { useEffect, useRef, useState } from "react";

type TurnstileRenderOptions = {
  sitekey: string;
  theme?: "auto" | "light" | "dark";
  callback?: (token: string) => void;
  "expired-callback"?: () => void;
  "error-callback"?: () => void;
};

type TurnstileApi = {
  render: (
    container: HTMLElement,
    options: TurnstileRenderOptions,
  ) => string;
  reset: (widgetId?: string) => void;
  remove?: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

type TurnstileWidgetProps = {
  siteKey?: string;
  error?: string;
  onTokenChange: (token: string) => void;
};

const scriptId = "cloudflare-turnstile-script";
const scriptSrc =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

function TurnstileWidget({
  siteKey,
  error,
  onTokenChange,
}: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!siteKey) {
      setIsReady(false);
      return;
    }

    let cancelled = false;

    const renderWidget = () => {
      if (
        cancelled ||
        !window.turnstile ||
        !containerRef.current ||
        widgetIdRef.current
      ) {
        return;
      }

      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        theme: "light",
        callback: onTokenChange,
        "expired-callback": () => onTokenChange(""),
        "error-callback": () => onTokenChange(""),
      });
      setIsReady(true);
    };

    if (window.turnstile) {
      renderWidget();
    } else {
      let script = document.getElementById(scriptId) as HTMLScriptElement | null;

      if (!script) {
        script = document.createElement("script");
        script.id = scriptId;
        script.src = scriptSrc;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }

      script.addEventListener("load", renderWidget);

      return () => {
        cancelled = true;
        script?.removeEventListener("load", renderWidget);
        if (widgetIdRef.current && window.turnstile?.remove) {
          window.turnstile.remove(widgetIdRef.current);
        }
        widgetIdRef.current = null;
        onTokenChange("");
      };
    }

    return () => {
      cancelled = true;
      if (widgetIdRef.current && window.turnstile?.remove) {
        window.turnstile.remove(widgetIdRef.current);
      }
      widgetIdRef.current = null;
      onTokenChange("");
    };
  }, [onTokenChange, siteKey]);

  if (!siteKey) {
    return (
      <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
        Form verification is not configured.
      </div>
    );
  }

  return (
    <div>
      <div
        ref={containerRef}
        className="min-h-[65px]"
        aria-label="Form verification"
      />
      {!isReady && (
        <p className="mt-2 text-sm text-stone-600">Loading verification...</p>
      )}
      {error && (
        <p id="turnstile-error" className="mt-2 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}

export default TurnstileWidget;
