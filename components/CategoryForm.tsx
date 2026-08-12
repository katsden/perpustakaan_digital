"use client";

import { useFormState, useFormStatus } from "react-dom";
import type { CategoryFormState } from "@/app/admin/kategori/actions";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button className="btn btn-primary" type="submit" disabled={pending}>
      {pending ? "Menyimpan..." : label}
    </button>
  );
}

export function CategoryForm({
  action,
  initialName = "",
  submitLabel,
}: {
  action: (state: CategoryFormState, formData: FormData) => Promise<CategoryFormState>;
  initialName?: string;
  submitLabel: string;
}) {
  const [state, formAction] = useFormState(action, { error: "", name: initialName });

  return (
    <form action={formAction}>
      {state.error !== "" && (
        <div className="flash flash-danger">{state.error}</div>
      )}
      <div className="form-group">
        <label htmlFor="name">Nama Kategori *</label>
        <input id="name" name="name" type="text" defaultValue={state.name} required />
      </div>
      <div className="form-actions">
        <SubmitButton label={submitLabel} />
        <a className="btn btn-light" href="/admin/kategori">Batal</a>
      </div>
    </form>
  );
}
