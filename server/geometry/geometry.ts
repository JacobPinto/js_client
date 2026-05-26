import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { JSONWritable } from "../jsonWritable.js";

class GeometryInfo extends JSONWritable {
  private _name: string;
  private _createdAt: Date;
  private _geometryFilePath: string;


  get name(): string {
    return this._name;
  }

  get geometryFilePath(): string {
    return this._geometryFilePath;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  constructor(name: string, filePath: string) {
    super();
    this._name = name;
    this._geometryFilePath = filePath;
    this._createdAt = new Date();
  }

  getKey(): string {
    return `geometry`; // #TBD remove name
  }

  toJSON(): any {
    return {
      load_file: this._name
    };
  }
}


// geometry storage
export const geometryStore: GeometryInfo[] = [];


// Config-Based Loader

export function loadGeometryFromFile(filePath: string) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  const geometryName = path.basename(filePath);

  const geometry = new GeometryInfo(geometryName, filePath);
  geometryStore.push(geometry);

  console.log("[Geometry] Loaded from config:", geometryName);

  return raw;
}

// Router Setup

const router = express.Router();
const upload = multer({ dest: "uploads/" });

/* 
   Upload + Load File Endpoint
   POST /geometry/loadfile
*/

router.post("/loadfile", upload.single("file"), (req: any, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const tempPath = req.file.path;
    const raw = fs.readFileSync(tempPath, "utf-8");

    // Store in a fixed folder (NO USER)
    const geometryFolder = path.join("data", "geometry");
    fs.mkdirSync(geometryFolder, { recursive: true });

    const finalPath = path.join(geometryFolder, req.file.originalname);
    fs.writeFileSync(finalPath, raw);

    // cleanup temp upload
    fs.unlinkSync(tempPath);

    const geometryName = req.file.originalname;

    const geometry = new GeometryInfo(geometryName, finalPath);
    geometryStore.push(geometry);
    geometry.write();
    console.log("[Geometry] File loaded:", geometryName);

    res.json({
      success: true,
      message: `Geometry loaded`,
      geometryName
    });

  } catch (err: any) {
    console.error("[Geometry] Upload error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Export Router

export default router;