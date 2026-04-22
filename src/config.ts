import path from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";
import fs from "node:fs";
import 'dotenv/config.js';

const ConfigSchema = z.object({
    name: z.string().default("vibe-sitecore"),
    version: z.string().optional(),
    powershell: z.object({
        domain: z.string(),
        username: z.string(),
        password: z.string(),
        serverUrl: z.string().url(),
    }).default({
        domain: "sitecore",
        username: "admin",
        password: "b",
        serverUrl: "https://xmcloudcm.localhost/",
    }),
    authorizationHeader: z.string().default("")
});

export const envSchema = z.object({
    POWERSHELL_DOMAIN: z.string().optional(),
    POWERSHELL_USERNAME: z.string().optional(),
    POWERSHELL_PASSWORD: z.string().optional(),
    POWERSHELL_SERVER_URL: z.string().url().optional(),
    AUTORIZATION_HEADER: z.string().optional(),
});

export const envStartSchema = z.object({
    //* The transport to use for the server. Can be one of 'stdio' or 'sse'.
    //* If not specified, the default is 'stdio'.
    //* The 'stdio' transport is used for local work.
    //* The 'streamable-http' transport is used for HTTP-based communication.
    //* The 'sse' remains for legacy support.
    TRANSPORT: z.string().default("stdio").optional().transform((val) => {
        if (val?.toLowerCase() === "sse") return "sse";
        if (val?.toLowerCase() === "streamable-http") return "streamable-http";
        return "stdio";
    })
});

export type Config = z.infer<typeof ConfigSchema>;
export type EnvConfig = z.infer<typeof envSchema>;
export type EnvStartConfig = z.infer<typeof envStartSchema>;

// Read package.json data
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packagePath = path.resolve(__dirname, '..', 'package.json');
const packageData = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
const { version, name } = packageData;

const ENV: EnvConfig = envSchema.parse(process.env);
const config: Config = {
    name: `${name} ${version}`,
    powershell: {
        domain: ENV.POWERSHELL_DOMAIN || "sitecore",
        username: ENV.POWERSHELL_USERNAME || "admin",
        password: ENV.POWERSHELL_PASSWORD || "b",
        serverUrl: ENV.POWERSHELL_SERVER_URL || "https://xmcloudcm.localhost/",
    },
    authorizationHeader: ENV.AUTORIZATION_HEADER || "",
};

export { config };