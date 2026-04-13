const DEFAULT_NOUN_PATTERNS = [
    "*Item*",
    "*Template*",
    "*Rendering*",
    "*Layout*",
    "*Publish*",
    "*Role*",
    "*User*",
    "*Index*",
    "*Archive*",
    "*Workflow*",
    "*Clone*",
    "*Field*",
    "*Language*",
    "*Package*",
    "*Acl*",
];

function escapePowerShellSingleQuotedString(value: string): string {
    return value.replaceAll("'", "''");
}

export function buildDiscoverPowershellCommandsScript(filter?: string): string {
    if (filter) {
        const filterPattern = `*${escapePowerShellSingleQuotedString(filter)}*`;

        return [
            `$filterPattern = '${filterPattern}'`,
            "$commands = @(",
            "    @(",
            "        Get-Command -Name $filterPattern -ErrorAction SilentlyContinue",
            "    ) + @(",
            "        Get-Command -Noun $filterPattern -ErrorAction SilentlyContinue",
            "    ) | Sort-Object Name -Unique | Select-Object Name, @{Name='CommandType'; Expression = { $_.CommandType.ToString() }}",
            ")",
            "if ($commands.Count -eq 0) {",
            "    '[]'",
            "} else {",
            "    $commands | ConvertTo-Json -Compress",
            "}",
        ].join("\n");
    }

    const nounPatternList = DEFAULT_NOUN_PATTERNS
        .map((nounPattern) => `'${escapePowerShellSingleQuotedString(nounPattern)}'`)
        .join(", ");

    return [
        `$nounPatterns = @(${nounPatternList})`,
        "$commands = @(Get-Command -Noun $nounPatterns -ErrorAction SilentlyContinue | Sort-Object Name | Select-Object Name, @{Name='CommandType'; Expression = { $_.CommandType.ToString() }})",
        "if ($commands.Count -eq 0) {",
        "    '[]'",
        "} else {",
        "    $commands | ConvertTo-Json -Compress",
        "}",
    ].join("\n");
}