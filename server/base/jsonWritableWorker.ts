import { parentPort } from "worker_threads";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

if (!parentPort) throw new Error("Must be run as a Worker");

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DEFAULT_PATH = path.join(__dirname, "../../simulation.json");

type KeyValueMsg  = { type: "keyValue";   key: string; data: object; filePath: string };
type ArrayMergeMsg = { type: "arrayMerge"; arrayKey: string; idField: string; id: number; data: object; filePath: string };
type WorkerMsg = KeyValueMsg | ArrayMergeMsg;

function readExisting(filePath: string): any {
  if (!fs.existsSync(filePath)) return {};
  const raw = fs.readFileSync(filePath, "utf-8");
  return raw ? JSON.parse(raw) : {};
}

parentPort.on("message", (msg: WorkerMsg) => {
  const filePath = msg.filePath;

  try {
    const existing = readExisting(filePath);

    if (msg.type === "keyValue") {
      existing[msg.key] = msg.data;

    } else if (msg.type === "arrayMerge") {
      if (!Array.isArray(existing[msg.arrayKey])) existing[msg.arrayKey] = [];
      const arr = existing[msg.arrayKey];
      const idx = arr.findIndex((item: any) => item[msg.idField] === msg.id);
      if (idx >= 0) arr[idx] = msg.data;
      else arr.push(msg.data);
    }

    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(existing, null, 2));
    console.log(`[jsonWriter] wrote "${msg.type}" to ${filePath}`);
  } catch (err) {
    console.error("[jsonWriter] error:", err);
  }
});

