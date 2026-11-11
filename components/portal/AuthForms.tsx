"use client";

import { useActionState, useState } from "react";
import { signIn, signUp, sendReset, type AuthState } from "@/app/(portal)/portal/login/actions";

type Mode = "signin" | "signup" | "reset";

const inputClass =
  "w-full px-3.5 py-3 border border-sand rounded-[10px] bg-cream font-sans text-[15px] text-espresso focus:outline-none focus:border-sage-dark";

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block text-left mt-4">
      <span className="block font-sans text-xs text-espresso-light mb-1.5">{label}</span>
      <input className={inputClass} {...props} />
    </label>
  );
}

function Feedback({ state }: { state: AuthState }) {
  if (state.error) return <p className="font-sans text-sm text-terracotta-dark mt-4">{state.error}</p>;
  if (state.message) return <p className="font-sans text-sm text-sage-dark mt-4">{state.message}</p>;
  return null;
}

const buttonClass =
  "w-full mt-6 bg-terracotta hover:bg-terracotta-dark text-white rounded-full px-6 py-3 font-sans font-medium transition-colors disabled:opacity-60";

export function AuthForms() {
  const [mode, setMode] = useState<Mode>("signin");
  const [inState, inAction, inPending] = useActionState(signIn, {});
  const [upState, upAction, upPending] = useActionState(signUp, {});
  const [resetState, resetAction, resetPending] = useActionState(sendReset, {});

  const link = "underline underline-offset-2 hover:text-espresso";

  if (mode === "signup") {
    return (
      <form action={upAction} className="font-sans">
        <p className="text-sm text-espresso-light mt-5">Create your account to open your practice space.</p>
        <Field label="Your name" name="full_name" autoComplete="name" required />
        <Field label="Email" name="email" type="email" autoComplete="email" required />
        <Field label="Password (at least 8 characters)" name="password" type="password" autoComplete="new-password" minLength={8} required />
        <button className={buttonClass} disabled={upPending}>{upPending ? "Creating…" : "Create account"}</button>
        <Feedback state={upState} />
        <p className="text-[13px] text-espresso-light mt-5">
          Already have an account? <button type="button" className={link} onClick={() => setMode("signin")}>Sign in</button>
        </p>
      </form>
    );
  }

  if (mode === "reset") {
    return (
      <form action={resetAction} className="font-sans">
        <p className="text-sm text-espresso-light mt-5">Enter your email and we&rsquo;ll send you a link to choose a new password.</p>
        <Field label="Email" name="email" type="email" autoComplete="email" required />
        <button className={buttonClass} disabled={resetPending}>{resetPending ? "Sending…" : "Send reset link"}</button>
        <Feedback state={resetState} />
        <p className="text-[13px] text-espresso-light mt-5">
          <button type="button" className={link} onClick={() => setMode("signin")}>Back to sign in</button>
        </p>
      </form>
    );
  }

  return (
    <form action={inAction} className="font-sans">
      <p className="text-sm text-espresso-light mt-5">Welcome back. Sign in to your practice space.</p>
      <Field label="Email" name="email" type="email" autoComplete="email" required />
      <Field label="Password" name="password" type="password" autoComplete="current-password" required />
      <button className={buttonClass} disabled={inPending}>{inPending ? "Signing in…" : "Sign in"}</button>
      <Feedback state={inState} />
      <p className="text-[13px] text-espresso-light mt-5">
        <button type="button" className={link} onClick={() => setMode("reset")}>Forgotten your password?</button>
      </p>
      <p className="text-[13px] text-espresso-light mt-2">
        New here? <button type="button" className={link} onClick={() => setMode("signup")}>Create your account</button>
      </p>
    </form>
  );
}
