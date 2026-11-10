import "server-only";

import { z } from "zod";

/*
 * Request validation for the JSON endpoints. Errors use Laravel-style dotted keys
 * ("title.en", "content.en.2.text"), which is what the admin forms read from `errors`.
 *
 *   const parsed = await validate(request, Schema);
 *   if (parsed instanceof Response) return parsed;
 */

export type FieldErrors = Record<string, string>;

export function validationError(errors: FieldErrors, status = 422): Response {
  const message = Object.values(errors)[0] ?? "The given data was invalid.";
  return Response.json({ message, errors }, { status });
}

export function zodErrors(error: z.ZodError): FieldErrors {
  const errors: FieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path.map(String).join(".") || "form";
    errors[key] ??= issue.message;
  }
  return errors;
}

export async function readJson(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    return {};
  }
}

export async function validate<S extends z.ZodType>(request: Request, schema: S): Promise<z.output<S> | Response> {
  const result = await schema.safeParseAsync(await readJson(request));
  return result.success ? result.data : validationError(zodErrors(result.error));
}

// --- Reusable field rules, with readable messages --------------------------------------------

const label = (name: string) => name.replace(/_/g, " ");

/** A required, trimmed string. */
export const requiredString = (name: string, max: number) =>
  z
    .string({ error: `The ${label(name)} field is required.` })
    .trim()
    .min(1, `The ${label(name)} field is required.`)
    .max(max, `The ${label(name)} may not be greater than ${max} characters.`);

/** An optional string; null, undefined and "" all become "". */
export const optionalString = (name: string, max: number) =>
  z
    .string()
    .nullish()
    .transform((value) => (value ?? "").trim())
    .pipe(z.string().max(max, `The ${label(name)} may not be greater than ${max} characters.`));

/** An optional URL; empty becomes null. */
export const optionalUrl = (name: string, max = 255) =>
  z
    .string()
    .nullish()
    .transform((value) => (value ?? "").trim() || null)
    .pipe(
      z
        .url({ error: `The ${label(name)} must be a valid URL.`, protocol: /^https?$/ })
        .max(max, `The ${label(name)} may not be greater than ${max} characters.`)
        .nullable(),
    );

/** A list of strings: trims each item and drops empty ones. */
export const cleanList = (name: string, maxItems: number, maxLength: number) =>
  z
    .array(z.string().nullish())
    .nullish()
    .transform((items) => (items ?? []).map((item) => (item ?? "").trim()).filter((item) => item !== ""))
    .pipe(
      z
        .array(z.string().max(maxLength, `Each ${label(name)} item may not be greater than ${maxLength} characters.`))
        .max(maxItems, `The ${label(name)} may not have more than ${maxItems} items.`),
    );

export const dateString = (name: string) =>
  z
    .string({ error: `The ${label(name)} field is required.` })
    .regex(/^\d{4}-\d{2}-\d{2}$/, `The ${label(name)} must be a date (YYYY-MM-DD).`)
    .refine((value) => !Number.isNaN(Date.parse(`${value}T00:00:00Z`)), `The ${label(name)} must be a valid date.`);

/** Laravel's alpha_dash: letters, numbers, dashes and underscores. */
export const slugString = (name = "slug") =>
  requiredString(name, 120).regex(/^[A-Za-z0-9_-]+$/, `The ${name} may only contain letters, numbers, dashes and underscores.`);

export const booleanish = z
  .union([z.boolean(), z.literal(1), z.literal(0), z.literal("1"), z.literal("0"), z.literal("true"), z.literal("false"), z.literal("on")])
  .nullish()
  .transform((value) => value === true || value === 1 || value === "1" || value === "true" || value === "on");
