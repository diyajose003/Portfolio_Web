import client from "@/tina/__generated__/client";
import type {
  SettingsQuery,
  SkillsQuery,
  ProjectsConnectionQuery,
  ExperienceConnectionQuery,
  EducationConnectionQuery,
} from "@/tina/__generated__/types";

/** What useTina needs to make a query live-editable: the query, its variables and its data. */
export interface TinaResult<TData> {
  query: string;
  variables: Record<string, unknown>;
  data: TData;
}

export interface SiteContent {
  settings: TinaResult<SettingsQuery>;
  skills: TinaResult<SkillsQuery>;
  projects: TinaResult<ProjectsConnectionQuery>;
  experience: TinaResult<ExperienceConnectionQuery>;
  education: TinaResult<EducationConnectionQuery>;
}

const MAX_ITEMS = 100;

function strip<TData>(result: { query: string; variables: object; data: TData }): TinaResult<TData> {
  return { query: result.query, variables: { ...result.variables }, data: result.data };
}

/** Loads all page content at build time. Throws so a broken build never replaces the live site. */
export async function loadContent(): Promise<SiteContent> {
  try {
    const [settings, skills, projects, experience, education] = await Promise.all([
      client.queries.settings({ relativePath: "site.json" }),
      client.queries.skills({ relativePath: "skills.json" }),
      client.queries.projectsConnection({ first: MAX_ITEMS }),
      client.queries.experienceConnection({ first: MAX_ITEMS }),
      client.queries.educationConnection({ first: MAX_ITEMS }),
    ]);
    return {
      settings: strip(settings),
      skills: strip(skills),
      projects: strip(projects),
      experience: strip(experience),
      education: strip(education),
    };
  } catch (error: unknown) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(`Could not load site content from TinaCMS: ${reason}`);
  }
}
