import { Worker } from "worker_threads";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Single shared worker thread for all JSON file writes.
// ES modules are cached after first import, so every importer gets the same instance.
const jsonWriter = new Worker(path.join(__dirname, "jsonWritableWorker.js"));

jsonWriter.on("error", (err) => console.error("[jsonWriter] worker error:", err));

export default jsonWriter;
