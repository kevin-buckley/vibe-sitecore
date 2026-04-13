import { describe, expect, it } from "vitest";
import { buildDiscoverPowershellCommandsScript } from "../src/tools/powershell/discover-powershell-commands-script";

describe("discover-powershell-commands script builder", () => {
    it("builds the default noun patterns as a PowerShell array", () => {
        const script = buildDiscoverPowershellCommandsScript();

        expect(script).toContain("$nounPatterns = @(");
        expect(script).toContain("'*Item*', '*Template*', '*Rendering*'");
        expect(script).not.toContain("'*Item*, *Template*, *Rendering*'");
    });

    it("builds a single wildcard pattern for a filter", () => {
        const script = buildDiscoverPowershellCommandsScript("Item");

        expect(script).toContain("$filterPattern = '*Item*'");
        expect(script).toContain("Get-Command -Name $filterPattern");
        expect(script).toContain("Get-Command -Noun $filterPattern");
    });

    it("escapes single quotes in the filter and returns an explicit empty array on no matches", () => {
        const script = buildDiscoverPowershellCommandsScript("O'Brien");

        expect(script).toContain("$filterPattern = '*O''Brien*'");
        expect(script).toContain("'[]'");
    });

    it("uses command name matching so verb-only filters like Publish can still discover Publish-Item", () => {
        const script = buildDiscoverPowershellCommandsScript("Publish");

        expect(script).toContain("Get-Command -Name $filterPattern");
        expect(script).toContain("Get-Command -Noun $filterPattern");
        expect(script).toContain("Sort-Object Name -Unique");
    });
});