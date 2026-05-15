import { cp, mkdir, rm } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const src = resolve(root, "src/tools/skills/bundled");
const targets = [
    resolve(root, "dist/tools/skills/bundled"),
    resolve(root, "dist/bundled"),
];

for (const dest of targets) {
    await rm(dest, { recursive: true, force: true });
    await mkdir(dirname(dest), { recursive: true });
    await cp(src, dest, { recursive: true });
    console.log(`copied bundled skills -> ${dest}`);
}
