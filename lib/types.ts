import type {
  SettingsQuery,
  SkillsQuery,
  ProjectsQuery,
  ExperienceQuery,
  EducationQuery,
} from "@/tina/__generated__/types";

export type Settings = SettingsQuery["settings"];
export type Skills = SkillsQuery["skills"];
export type ProjectNode = ProjectsQuery["projects"];
export type ExperienceNode = ExperienceQuery["experience"];
export type EducationNode = EducationQuery["education"];
