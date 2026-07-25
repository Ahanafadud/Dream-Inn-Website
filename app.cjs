/**
 * cPanel / Phusion Passenger startup (CommonJS).
 * Passenger uses require() — it cannot load ESM app.js when package.json has "type": "module".
 * Set Application startup file to: app.cjs
 */
const { pathToFileURL } = require("node:url");
const { existsSync } = require("node:fs");
const { join } = require("node:path");

// Load .env if present (cPanel often sets vars in the UI instead)
try {
  require("dotenv").config();
} catch {
  // dotenv may only exist inside the Nitro bundle; env from cPanel UI is enough
}

const candidates = [
  join(process.cwd(), "output", "server", "index.mjs"),
  join(process.cwd(), ".output", "server", "index.mjs"),
];

const entry = candidates.find((path) => existsSync(path));
if (!entry) {
  throw new Error(
    "Nitro server not found. Expected output/server/index.mjs next to app.cjs.",
  );
}

import(pathToFileURL(entry).href).catch((err) => {
  console.error("Failed to start Nitro server:", err);
  process.exit(1);
});
