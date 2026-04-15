import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Abstract base class for objects that can be serialized to JSON and written to a file.
 * This class provides a mechanism to persist data by merging it with existing JSON content
 * in a simulation.json file, ensuring that multiple instances can contribute to the same file
 * without overwriting each other.
 */
export abstract class JSONWritable {
   //The file path where the JSON data will be written. 
  protected filePath = path.join(__dirname, "../simulation.json");

  /**
   * Returns a unique key for object's data in the JSON file.
   * This key is used to identify and merge the object's JSON representation
   * with existing data in the file.
   * @returns A string key for the JSON object.
   */
  abstract getKey(): string;

  /**
   * Converts the object to a JSON representation.
   * Subclasses must implement this to define how their data is structured in JSON.
   * @returns An object that can be serialized to JSON.
   */
  abstract toJSON(): any;

  /**
   * Writes the object's JSON data to the file, merging it with any existing data.
   * If the file doesn't exist, it creates a new one. The data is merged using the key
   * returned by getKey(), so multiple objects can coexist in the same file.
   * Logs success or error messages to the console.
   */
  write() {
    let existing = {};

    try {
      // Check if the file exists and read its content
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, "utf-8");
        // Parse the JSON, defaulting to empty object if file is empty
        existing = raw ? JSON.parse(raw) : {};
      }

      // Merge the new data with existing data using the object's key
      const updated = {
        ...existing,
        [this.getKey()]: this.toJSON(),
      };

      // Write the updated JSON back to the file 
      fs.writeFileSync(this.filePath, JSON.stringify(updated, null, 2));
      console.log(`Data persisted to ${this.filePath}`);
    } catch (err) {
      console.error(`Error writing to ${this.filePath}:`, err);
    }
  }
}