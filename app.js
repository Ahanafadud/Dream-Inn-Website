/**
 * ESM entry (local / non-Passenger).
 * On cPanel Phusion Passenger, use app.cjs instead — Passenger require() cannot load ESM.
 */
import { pathToFileURL } from "node:url";
import { existsSync } from "node:fs";
import { join } from "node:path";

const cwd = process.cwd();
const candidates = [
  join(cwd, "output", "server", "index.mjs"),
  join(cwd, ".output", "server", "index.mjs"),
];

const entry = candidates.find((path) => existsSync(path));
if (!entry) {
  throw new Error(
    "Nitro server not found. Expected output/server/index.mjs (or .output/). Re-download the build package.",
  );
}

await import(pathToFileURL(entry).href);
