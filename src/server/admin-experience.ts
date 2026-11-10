import "server-only";

import type { z } from "zod";

import type { experienceSchema } from "@/server/admin-validation";

/** Maps the validated form (snake_case, like the Laravel request) to the experiences table columns. */
export function experienceRow(data: z.output<typeof experienceSchema>) {
  return {
    company: data.company,
    companyUrl: data.company_url,
    role: data.role,
    employmentType: data.employment_type,
    location: data.location,
    startDate: data.start_date,
    endDate: data.end_date,
    summary: data.summary,
    highlights: data.highlights,
    stack: data.stack,
  };
}
