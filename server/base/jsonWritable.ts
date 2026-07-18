import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_PATH = path.join(__dirname, "../simulation.json");

/**
 * Serializes any object to the simulation JSON file under a given key,
 * merging with existing content so multiple callers can coexist in the same file.
 */
export function writeJSON(key: string, data: object, filePath: string = DEFAULT_PATH): void {
  let existing: Record<string, unknown> = {};

  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, "utf-8");
      existing = raw ? JSON.parse(raw) : {};
    }

    const updated = { ...existing, [key]: data };

    fs.writeFileSync(filePath, JSON.stringify(updated, null, 2));
    console.log(`Data persisted to ${filePath}`);
  } catch (err) {
    console.error(`Error writing to ${filePath}:`, err);
  }
}

