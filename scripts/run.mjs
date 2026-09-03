import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

const toolBinaries = {
  next: path.join(rootDir, "node_modules", "next", "dist", "bin", "next"),
  eslint: path.join(rootDir, "node_modules", "eslint", "bin", "eslint.js"),
  prisma: path.join(rootDir, "node_modules", "prisma", "build", "index.js"),
};

const [, , tool, ...args] = process.argv;

if (!tool || !(tool in toolBinaries)) {
  console.error(
    `Usage: node scripts/run.mjs <${Object.keys(toolBinaries).join("|")}> [args...]`
  );
  process.exit(1);
}

const result = spawnSync(process.execPath, [toolBinaries[tool], ...args], {
  cwd: rootDir,
  stdio: "inherit",
  env: process.env,
});

process.exit(result.status ?? 1);
