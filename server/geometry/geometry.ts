import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";

class GeometryInfo {
  private _name: string;
  private _createdAt: Date;
  private _filePath: string;


  get name(): string {
    return this._name;
  }

  get filePath(): string {
    return this._filePath;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  constructor(name: string, filePath: string) {
    this._name = name;
    this._filePath = filePath;
    this._createdAt = new Date();
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