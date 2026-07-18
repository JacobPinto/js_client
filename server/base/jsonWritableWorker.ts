import { parentPort } from "worker_threads";
import { writeJSON } from "./jsonWritable.js";

if (!parentPort) throw new Error("Must be run as a Worker");

parentPort.on("message", (msg: { key: string; data: object; filePath?: string }) => {
  writeJSON(msg.key, msg.data, msg.filePath);
});
