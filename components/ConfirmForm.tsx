"use client";

import type { FormEvent, ReactNode } from "react";

export function ConfirmForm({
  action,
  confirmText,
  className,
  children,
}: {
  action: (formData: FormData) => void;
  confirmText: string;
  className?: string;
  children: ReactNode;
}) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (!window.confirm(confirmText)) {
      event.preventDefault();
    }
  }

  return (
    <form action={action} onSubmit={handleSubmit} className={className}>
      {children}
    </form>
  );
}
