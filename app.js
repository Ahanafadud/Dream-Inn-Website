/**
 * cPanel "Setup Node.js App" startup file.
 * Points Passenger / the Node selector at the Nitro production server.
 */
import { pathToFileURL } from "node:url";
import { join } from "node:path";

const entry = join(process.cwd(), ".output", "server", "index.mjs");
await import(pathToFileURL(entry).href);
