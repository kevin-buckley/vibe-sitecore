import { describe, expect, it } from "vitest";
import { getSkill, listSkills, searchSkills } from "../src/tools/skills/catalog";

describe("skills catalog", () => {
    it("lists the bundled migration skills", () => {
        const skills = listSkills().map((skill) => skill.id);

        expect(skills).toEqual([
            "migration-playbook",
            "site-migration",
            "template-migration",
            "component-migration",
            "content-migration",
            "code-migration",
        ]);
    });

    it("retrieves a skill by id or friendly name", () => {
        expect(getSkill("component-migration")?.id).toBe("component-migration");
        expect(getSkill("Component Migration")?.id).toBe("component-migration");
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
});