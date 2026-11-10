import "server-only";

import { z } from "zod";

import { BLOCK_TYPES, CATEGORIES, COVERS, EMPLOYMENT_TYPES, LANGUAGES, PROJECT_STATUSES } from "@/server/content";
import type { ContentBlock } from "@frontend/lib/types";
import {
  booleanish,
  cleanList,
  dateString,
  optionalString,
  optionalUrl,
  requiredString,
  slugString,
} from "@/server/validation";

// Zod versions of the Laravel form requests (app/Http/Requests/Admin/*), including their prepareForValidation steps.
// Error keys are dotted paths, like Laravel's, so the forms show each message next to its field.

const oneOf = <T extends readonly [string, ...string[]]>(name: string, values: T) =>
  z.enum(values, { error: `The selected ${name.replace(/_/g, " ")} is invalid.` });

/** Integer cast like PHP's (int): "" and junk become 0. */
const intCast = z.preprocess((value) => {
  const number = Number.parseInt(String(value ?? ""), 10);
  return Number.isNaN(number) ? 0 : number;
}, z.number().int());

const bilingualRequired = (name: string, max: number) =>
  z.object({ en: requiredString(`${name}.en`, max), bn: requiredString(`${name}.bn`, max) }, { error: `The ${name} field is required.` });

const bilingualOptional = (name: string, max: number) =>
  z
    .object({ en: optionalString(`${name}.en`, max), bn: optionalString(`${name}.bn`, max) })
    .nullish()
    .transform((value) => value ?? { en: "", bn: "" });

/** English required, Bangla optional (posts, projects, experience). */
const englishRequired = (name: string, max: number) =>
  z.object({ en: requiredString(`${name}.en`, max), bn: optionalString(`${name}.bn`, max) }, { error: `The ${name}.en field is required.` });

const bilingualList = (name: string, maxItems: number, maxLength: number) =>
  z
    .object({ en: cleanList(`${name}.en`, maxItems, maxLength), bn: cleanList(`${name}.bn`, maxItems, maxLength) })
    .nullish()
    .transform((value) => value ?? { en: [], bn: [] });

// --- Article content blocks (ContentBlockValidation) --------------------------------------------

const block = z.object({
  type: z.enum(BLOCK_TYPES, { error: "Choose a block type." }),
  text: z.string().max(5000, "A block may not be greater than 5000 characters.").nullish(),
  source: z.string().max(200, "The source may not be greater than 200 characters.").nullish(),
  level: z.preprocess((v) => (v === "" || v === null || v === undefined ? undefined : Number(v)), z.number().int().optional()),
  language: z.string().max(30, "The language may not be greater than 30 characters.").nullish(),
  code: z.string().max(10000, "A code block may not be greater than 10000 characters.").nullish(),
  items: z.array(z.string().max(500, "Each item may not be greater than 500 characters.")).max(30, "A list may not have more than 30 items.").nullish(),
});

type RawBlock = z.output<typeof block>;

function blocks(required: boolean) {
  const list = z.array(block, { error: "The content must be a list of blocks." });
  return z
    .object({
      en: required ? list.min(1, "The content.en field is required.") : list.nullish(),
      bn: list.nullish(),
    }, { error: required ? "The content.en field is required." : undefined })
    .nullish()
    .superRefine((content, ctx) => {
      for (const lang of LANGUAGES) {
        (content?.[lang] ?? []).forEach((item, index) => {
          const add = (field: string, message: string) => ctx.addIssue({ code: "custom", path: [lang, index, field], message });

          if (item.type === "list") {
            if ((item.items ?? []).filter((entry) => entry.trim() !== "").length === 0) add("items", "A list block needs at least one item.");
            return;
          }
          if (item.type === "code") {
            if (!item.language?.trim()) add("language", "A code block needs a language, such as ts or bash.");
            if (!item.code?.trim()) add("code", "A code block cannot be empty.");
            return;
          }
          if (!item.text?.trim()) add("text", "This block cannot be empty.");
          if (item.type === "heading" && item.level !== 2 && item.level !== 3) add("level", "A heading must be level 2 or 3.");
        });
      }
    })
    .transform((content) => ({ en: (content?.en ?? []).map(toBlock), bn: (content?.bn ?? []).map(toBlock) }));
}

/** Keeps only the fields each block type uses. */
function toBlock(item: RawBlock): ContentBlock {
  switch (item.type) {
    case "heading":
      return { type: "heading", level: item.level === 3 ? 3 : 2, text: item.text ?? "" };
    case "quote":
      return item.source ? { type: "quote", text: item.text ?? "", source: item.source } : { type: "quote", text: item.text ?? "" };
    case "list":
      return { type: "list", items: item.items ?? [] };
    case "code":
      return { type: "code", language: item.language ?? "", code: item.code ?? "" };
    case "callout":
      return { type: "callout", text: item.text ?? "" };
    default:
      return { type: "paragraph", text: item.text ?? "" };
  }
}

const cover = z
  .string()
  .nullish()
  .transform((value) => value || null)
  .pipe(z.enum(COVERS, { error: "The selected cover is invalid." }).nullable());

// --- Requests ---------------------------------------------------------------------------------------

export const postSchema = z.object({
  slug: slugString(),
  title: englishRequired("title", 200),
  excerpt: englishRequired("excerpt", 500),
  date: dateString("date"),
  category: oneOf("category", CATEGORIES),
  tags: cleanList("tags", 20, 40),
  cover,
  published: booleanish,
  content: blocks(true),
});

export const projectSchema = z.object({
  slug: slugString(),
  name: englishRequired("name", 200),
  summary: englishRequired("summary", 500),
  role: bilingualOptional("role", 200),
  period: bilingualOptional("period", 100),
  highlights: bilingualList("highlights", 12, 300),
  content: blocks(false),
  stack: cleanList("stack", 20, 40),
  status: oneOf("status", PROJECT_STATUSES),
  cover,
  url: optionalUrl("url"),
  repo: optionalUrl("repo"),
  featured: booleanish,
  sort_order: intCast.pipe(
    z.number().min(0, "The sort order must be at least 0.").max(10000, "The sort order may not be greater than 10000."),
  ),
});

export const experienceSchema = z
  .object({
    company: requiredString("company", 200),
    company_url: optionalUrl("company_url"),
    role: englishRequired("role", 200),
    employment_type: oneOf("employment_type", EMPLOYMENT_TYPES),
    location: bilingualOptional("location", 200),
    start_date: dateString("start_date"),
    current: booleanish,
    end_date: z
      .string()
      .nullish()
      .transform((value) => value || null),
    summary: englishRequired("summary", 1000),
    highlights: bilingualList("highlights", 12, 300),
    stack: cleanList("stack", 20, 40),
  })
  // An unticked "current role" box sends an end date; a ticked one clears it.
  .transform(({ current, ...rest }) => ({ ...rest, end_date: current ? null : rest.end_date }))
  .superRefine((value, ctx) => {
    if (value.end_date === null) return;
    const parsed = dateString("end_date").safeParse(value.end_date);
    if (!parsed.success) {
      ctx.addIssue({ code: "custom", path: ["end_date"], message: parsed.error.issues[0].message });
    } else if (value.end_date < value.start_date) {
      ctx.addIssue({ code: "custom", path: ["end_date"], message: "The end date must be a date after or equal to the start date." });
    }
  });

/** Laravel's "required" on an array: empty fails. */
const requiredList = (name: string, maxItems: number, maxLength: number) =>
  cleanList(name, maxItems, maxLength).refine((items) => items.length > 0, `The ${name} field is required.`);

export const siteSchema = z.object({
  name: bilingualRequired("name", 120),
  title: bilingualRequired("title", 200),
  description: bilingualRequired("description", 300),
  intro: bilingualRequired("intro", 1000),
  about: bilingualRequired("about", 1000),
  // Shown as a badge in the hero, for example "Open to new opportunities". Empty hides it.
  availability: bilingualOptional("availability", 120),
  interests: z.object({ en: requiredList("interests.en", 10, 200), bn: requiredList("interests.bn", 10, 200) }),
  email: z
    .string()
    .nullish()
    .transform((value) => (value ?? "").trim() || null)
    .pipe(z.email("The email must be a valid email address.").max(254).nullable()),
  social: z
    .object({ github: optionalUrl("social.github"), linkedin: optionalUrl("social.linkedin"), x: optionalUrl("social.x") })
    .nullish()
    .transform((value) => value ?? { github: null, linkedin: null, x: null }),
  year: z.coerce
    .number({ error: "The year must be an integer." })
    .int("The year must be an integer.")
    .min(2000, "The year must be at least 2000.")
    .max(2100, "The year may not be greater than 2100."),
});

export const aboutSchema = z.object({
  role: bilingualRequired("role", 200),
  location: bilingualRequired("location", 120),
  languages: bilingualRequired("languages", 200),
  yearsInSoftware: intCast.pipe(
    z.number().min(0, "The years in software must be at least 0.").max(80, "The years in software may not be greater than 80."),
  ),
  story: z.object({
    en: cleanList("story.en", 10, 2000).refine((items) => items.length > 0, "The story.en field is required."),
    bn: cleanList("story.bn", 10, 2000).refine((items) => items.length > 0, "The story.bn field is required."),
  }),
  skills: z
    .array(
      z.object({
        name: bilingualRequired("skill name", 100),
        items: cleanList("skill items", 30, 100).refine((items) => items.length > 0, "Add at least one skill to this group."),
      }),
    )
    .max(20, "You may not have more than 20 skill groups.")
    .nullish()
    .transform((value) => value ?? []),
  principles: z
    .array(z.object({ title: bilingualRequired("principle title", 200), body: bilingualRequired("principle body", 1000) }))
    .max(20, "You may not have more than 20 principles.")
    .nullish()
    .transform((value) => value ?? []),
  education: z
    .array(
      z.object({
        degree: bilingualRequired("degree", 200),
        school: bilingualRequired("school", 200),
        period: bilingualRequired("period", 100),
      }),
    )
    .max(10, "You may not have more than 10 education entries.")
    .nullish()
    .transform((value) => value ?? []),
});
