import { describe, expect, it } from "vitest";
import { getSkill, listSkills, searchSkills } from "../src/tools/skills/catalog";

describe("skills catalog", () => {
    it("lists all bundled skills (migration playbooks + project review)", () => {
        const ids = listSkills().map((skill) => skill.id);

        // Migration playbooks
        expect(ids).toEqual(expect.arrayContaining([
            "migration-playbook",
            "site-migration",
            "template-migration",
            "component-migration",
            "content-migration",
            "code-migration",
            "page-design-setup",
        ]));

        // Project review / audit skills from best-practices
        expect(ids).toEqual(expect.arrayContaining([
            "data-templates",
            "content-items",
            "media",
            "presentation-layer",
            "sxa-page-structure",
            "sxa-renderings",
            "headless-configuration",
            "headless-graphql",
            "security",
            "workflow",
            "solution-code",
            "frontend-performance",
        ]));
    });

    it("retrieves a migration skill by id or friendly name", () => {
        expect(getSkill("component-migration")?.id).toBe("component-migration");
        expect(getSkill("Component Migration")?.id).toBe("component-migration");
    });

    it("retrieves a project-review skill by id", () => {
        const skill = getSkill("data-templates");
        expect(skill?.id).toBe("data-templates");
        expect(skill?.content).toContain("# Data Templates");
    });

    it("tags each skill with a category (migration or project-review)", () => {
        const skills = listSkills();
        const migrations = skills.filter((s) => s.category === "migration").map((s) => s.id);
        const reviews = skills.filter((s) => s.category === "project-review").map((s) => s.id);

        expect(migrations).toEqual(expect.arrayContaining([
            "migration-playbook",
            "site-migration",
            "template-migration",
            "component-migration",
            "content-migration",
            "code-migration",
            "page-design-setup",
        ]));
        expect(reviews).toEqual(expect.arrayContaining([
            "data-templates",
            "security",
            "workflow",
            "frontend-performance",
        ]));
        expect(skills.filter((s) => s.category === "uncategorized")).toHaveLength(0);
    });

    it("returns the full markdown content for a skill", () => {
        const skill = getSkill("site-migration");

        expect(skill?.content).toContain("name: site-migration");
        expect(skill?.content).toContain("# Site Migration");
        expect(skill?.content).toContain("Rebuild the site structure in XM Cloud");
    });

    it("searches rendering-focused queries toward component migration", () => {
        const results = searchSkills("rendering variant migration", 3);

        expect(results.length).toBeGreaterThan(0);
        expect(results[0]?.skill.id).toBe("component-migration");
        expect(results[0]?.matchedOn.length).toBeGreaterThan(0);
    });

    it("searches broad planning queries toward the migration playbook", () => {
        const results = searchSkills("xp to xm cloud migration plan", 2);

        expect(results.length).toBeGreaterThan(0);
        expect(results[0]?.skill.id).toBe("migration-playbook");
    });

    it("searches audit queries toward project-review skills", () => {
        const results = searchSkills("template audit field validation", 3);

        expect(results.length).toBeGreaterThan(0);
        expect(results.map((result) => result.skill.id)).toContain("data-templates");
    });
});
