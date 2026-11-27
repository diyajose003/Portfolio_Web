export interface MessageInput {
  name: string;
  email: string;
  message: string;
}

export type MessageErrors = Partial<Record<keyof MessageInput, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const LIMITS = { name: 100, email: 200, message: 5000 } as const;
const MIN_MESSAGE = 10;

/** Validates the contact form before anything is sent. Returns an empty object when valid. */
export function validateMessage(input: MessageInput): MessageErrors {
  const name = input.name.trim();
  const email = input.email.trim();
  const message = input.message.trim();
  const errors: MessageErrors = {};

  if (!name) errors.name = "Enter your name";
  else if (name.length > LIMITS.name) errors.name = `Keep it under ${LIMITS.name} characters`;

  if (!email) errors.email = "Enter your email so you can get a reply";
  else if (email.length > LIMITS.email || !EMAIL.test(email)) errors.email = "Enter a valid email address";

  if (!message) errors.message = "Write a message";
  else if (message.length < MIN_MESSAGE) errors.message = `Write at least ${MIN_MESSAGE} characters`;
  else if (message.length > LIMITS.message) errors.message = `Keep it under ${LIMITS.message} characters`;

  return errors;
}
