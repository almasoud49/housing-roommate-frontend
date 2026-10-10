"use client";

import { useEffect, useRef } from "react";

interface GoogleId {
  accounts: {
    id: {
      initialize: (cfg: { client_id: string; callback: (r: { credential: string }) => void }) => void;
      renderButton: (el: HTMLElement, opts: Record<string, unknown>) => void;
    };
  };
}

// `hl=en` pins the button language to English (matches the rest of the UI); without it Google follows the browser locale.
const SCRIPT_SRC = "https://accounts.google.com/gsi/client?hl=en";
export const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

/**
 * Google Identity Services button. Calls `onCredential(idToken)` which the
 * caller posts to `POST /auth/google-login`. Renders nothing unless
 * `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is configured.
 */
export default function GoogleSignIn({
  onCredential,
  text = "continue_with",
}: {
  onCredential: (idToken: string) => void;
  /** Google button label: "Sign in with…", "Sign up with…" or "Continue with…". */
  text?: "signin_with" | "signup_with" | "continue_with";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const cb = useRef(onCredential);

  useEffect(() => {
    cb.current = onCredential;
  }, [onCredential]);

  useEffect(() => {
    if (!googleClientId) return;
    const init = () => {
      const g = (window as unknown as { google?: GoogleId }).google;
      if (!g || !ref.current) return;
      g.accounts.id.initialize({ client_id: googleClientId, callback: (r) => cb.current(r.credential) });
      // Google caps the button width at 400px; fill the container up to that.
      const width = Math.min(400, Math.max(200, Math.round(ref.current.offsetWidth) || 320));
      g.accounts.id.renderButton(ref.current, { theme: "outline", size: "large", width, text, shape: "rectangular" });
    };
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`);
    if (existing) {
      if ((window as unknown as { google?: GoogleId }).google) init();
      else existing.addEventListener("load", init, { once: true });
      return;
    }
    const s = document.createElement("script");
    s.src = SCRIPT_SRC;
    s.async = true;
    s.onload = init;
    document.head.appendChild(s);
  }, [text]);

  if (!googleClientId) return null;
  return <div ref={ref} className="flex w-full justify-center" />;
}
