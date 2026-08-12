"use client";

import { useFormState, useFormStatus } from "react-dom";
import { login, type LoginState } from "@/app/(public)/login/actions";

const initialState: LoginState = { error: "", username: "" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button className="btn btn-primary btn-block" type="submit" disabled={pending}>
      {pending ? "Memproses..." : "Masuk"}
    </button>
  );
}

export function LoginForm() {
  const [state, formAction] = useFormState(login, initialState);

  return (
    <form action={formAction} className="form-stack">
      {state.error !== "" && (
        <div className="flash flash-danger" role="alert">{state.error}</div>
      )}
      <div className="form-group">
        <label htmlFor="username">Username</label>
        <input
          id="username"
          name="username"
          type="text"
          defaultValue={state.username}
          autoComplete="username"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required />
      </div>
      <SubmitButton />
    </form>
  );
}
