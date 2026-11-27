"use client";

import { useTina } from "tinacms/dist/react";
import type { SiteContent } from "@/lib/content";
import {
  contactLinks,
  hasRichText,
  navSections,
  safePdfPath,
  visibleEducation,
  visibleExperience,
  visibleProjects,
  visibleSkillGroups,
} from "@/lib/visibility";
import Header from "./sections/Header";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Skills from "./sections/Skills";
import Projects from "./sections/Projects";
import Experience from "./sections/Experience";
import Education from "./sections/Education";
import Contact from "./sections/Contact";
import Footer from "./sections/Footer";

function nodes<T>(edges: ReadonlyArray<{ node?: T | null } | null> | null | undefined): (T | null)[] {
  return (edges ?? []).map((e) => e?.node ?? null);
}

/**
 * Renders the whole page. useTina makes every query live-editable inside /admin;
 * on the public site it simply returns the build-time data.
 */
export default function Portfolio(props: SiteContent) {
  const { settings } = useTina(props.settings).data;
  const { skills } = useTina(props.skills).data;
  const projectData = useTina(props.projects).data;
  const experienceData = useTina(props.experience).data;
  const educationData = useTina(props.education).data;

  const skillGroups = visibleSkillGroups(skills.groups);
  const projects = visibleProjects(nodes(projectData.projectsConnection.edges));
  const experience = visibleExperience(nodes(experienceData.experienceConnection.edges));
  const education = visibleEducation(nodes(educationData.educationConnection.edges));
  const contact = contactLinks(settings);
  const resume = safePdfPath(settings.resume);

  const sections = navSections({
    about: hasRichText(settings.about),
    skills: skillGroups.length > 0,
    projects: projects.length > 0,
    experience: experience.length > 0,
    education: education.length > 0,
    contact: contact.hasAny,
  });
  const shows = new Set(sections.map((s) => s.id));

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header name={settings.name} sections={sections} />
      <main id="main">
        <Hero settings={settings} resume={resume} showContact={shows.has("contact")} />
        {shows.has("about") && <About settings={settings} />}
        {shows.has("skills") && <Skills skills={skills} groups={skillGroups} />}
        {shows.has("projects") && <Projects projects={projects} />}
        {shows.has("experience") && <Experience items={experience} />}
        {shows.has("education") && <Education items={education} />}
        {shows.has("contact") && <Contact settings={settings} contact={contact} />}
      </main>
      <Footer name={settings.name} contact={contact} resume={resume} />
    </>
  );
}
