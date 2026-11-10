import type { Localized } from "@frontend/lib/i18n/config";

// The About page. Edited in the admin and passed to the page as the `profile` prop.
// Work history is separate: see the `experiences` prop.
export type SkillGroup = {
  name: Localized<string>;
  items: string[];
};

export type Principle = {
  title: Localized<string>;
  body: Localized<string>;
};

export type Education = {
  degree: Localized<string>;
  school: Localized<string>;
  period: Localized<string>;
};

export type Profile = {
  role: Localized<string>;
  location: Localized<string>;
  languages: Localized<string>;
  yearsInSoftware: number;
  story: Localized<string[]>;
  skills: SkillGroup[];
  principles: Principle[];
  education: Education[];
};
