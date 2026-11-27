"use client";

import { useState, type FormEvent } from "react";
import { validateMessage, type MessageErrors, type MessageInput } from "@/lib/validate";

const ENDPOINT = "https://api.web3forms.com/submit";
const TIMEOUT_MS = 15_000;

type Status = "idle" | "sending" | "sent" | "error";

interface ContactFormProps {
  accessKey: string;
  recipientName: string;
}

const EMPTY: MessageInput = { name: "", email: "", message: "" };

export default function ContactForm({ accessKey, recipientName }: ContactFormProps) {
  const [values, setValues] = useState<MessageInput>(EMPTY);
  const [errors, setErrors] = useState<MessageErrors>({});
  const [status, setStatus] = useState<Status>("idle");

  const update = (field: keyof MessageInput, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;

    const honeypot = new FormData(event.currentTarget).get("botcheck");
    const found = validateMessage(values);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      return;
    }

    setStatus("sending");
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    try {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: accessKey,
          subject: `New message from your portfolio (${values.name.trim()})`,
          from_name: "Portfolio contact form",
          name: values.name.trim(),
          email: values.email.trim(),
          message: values.message.trim(),
          botcheck: honeypot ? "on" : "",
        }),
        signal: controller.signal,
      });
      const result: unknown = await response.json().catch(() => null);
      const ok = response.ok && typeof result === "object" && result !== null && (result as { success?: boolean }).success;
      setStatus(ok ? "sent" : "error");
      if (ok) setValues(EMPTY);
    } catch {
      setStatus("error");
    } finally {
      clearTimeout(timer);
    }
  }

  if (status === "sent") {
    return (
      <div role="status" className="card p-6">
        <p className="font-medium text-ink">Message sent</p>
        <p className="mt-1 text-sm text-muted">Thanks for reaching out. {recipientName} will reply by email.</p>
        <button type="button" className="btn btn-secondary mt-4" onClick={() => setStatus("idle")}>
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="card space-y-4 p-6" aria-label="Contact form">
      {/* Hidden from people; bots that fill it are rejected by Web3Forms. */}
      <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <Field label="Name" id="cf-name" error={errors.name}>
        <input
          id="cf-name"
          className="input"
          autoComplete="name"
          maxLength={100}
          value={values.name}
          onChange={(e) => update("name", e.target.value)}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? "cf-name-error" : undefined}
        />
      </Field>
      <Field label="Email" id="cf-email" error={errors.email}>
        <input
          id="cf-email"
          type="email"
          className="input"
          autoComplete="email"
          maxLength={200}
          placeholder="you@example.com"
          value={values.email}
          onChange={(e) => update("email", e.target.value)}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? "cf-email-error" : undefined}
        />
      </Field>
      <Field label="Message" id="cf-message" error={errors.message}>
        <textarea
          id="cf-message"
          className="input min-h-32"
          maxLength={5000}
          value={values.message}
          onChange={(e) => update("message", e.target.value)}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "cf-message-error" : undefined}
        />
      </Field>
      {status === "error" && (
        <p role="alert" className="text-sm text-danger">
          Your message couldn&apos;t be sent. Check your connection and try again.
        </p>
      )}
      <button type="submit" className="btn btn-primary" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}

interface FieldProps {
  label: string;
  id: string;
  error?: string;
  children: React.ReactNode;
}

function Field({ label, id, error, children }: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-ink">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
