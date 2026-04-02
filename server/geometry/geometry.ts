import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";

import { UserInfo } from "../user/user.js";
class GeometryInfo {
  private _name: string;
  private _createdAt: Date;
  private _owner: UserInfo;
  private _pathToUserGeometryFolder: string;

  get owner(): UserInfo {
    return this._owner;
  }

  get name(): string {
    return this._name;
  }

  constructor(name: string, owner: UserInfo) {
    this._name = name;
    this._owner = owner;
    this._createdAt = new Date();
    this._pathToUserGeometryFolder = `${this._owner.pathToUserFolder}/geometry`;
  }
}

// #TBD remove owner and user info from geomtry.

class GeometryByUser {
  private _owner: UserInfo;
  private _geometries: GeometryInfo[] = [];

  get owner(): UserInfo {
    return this._owner;
  }

  get geometries(): GeometryInfo[] {
    return this._geometries;
  }

  constructor(owner: UserInfo) {
    this._owner = owner;
  }

  public addGeometry(name: string): GeometryInfo {
    const geometry = new GeometryInfo(name, this._owner);
    this._geometries.push(geometry);
    return geometry;
  }
}

// in memory storage for geometries

export const geometryArray = {
  geometryByUser: [] as GeometryByUser[]
};


//Helper: Get/Create User Geometry


function getOrCreateUserGeometry(user: UserInfo): GeometryByUser {
  let userGeometry = geometryArray.geometryByUser.find(
    (g) => g.owner.userId === user.userId
  );

  if (!userGeometry) {
    userGeometry = new GeometryByUser(user);
    geometryArray.geometryByUser.push(userGeometry);
  }

  return userGeometry;
}

// Config-Based Loader

export function loadGeometryFromFile(filePath: string, user: UserInfo) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const raw = fs.readFileSync(filePath, "utf-8");

  const userGeometry = getOrCreateUserGeometry(user);

  const geometryName = path.basename(filePath);

  userGeometry.addGeometry(geometryName);

  console.log("[Geometry] Loaded from config:", geometryName);

  return raw;
}

// Router Setup

const router = express.Router();
const upload = multer({ dest: "uploads/" });

/* =========================
   Upload + Load File Endpoint
   POST /:userId/geometry/loadfile
========================= */

router.post("/loadfile", upload.single("file"), (req: any, res) => {
  try {
    const userId = req.userId;
    const user: UserInfo = req.user;

    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const tempPath = req.file.path;
    const raw = fs.readFileSync(tempPath, "utf-8");

    // Optional: persist file in user's geometry folder
    const userFolder = `${user.pathToUserFolder}/geometry`;
    fs.mkdirSync(userFolder, { recursive: true });

    const finalPath = path.join(userFolder, req.file.originalname);
    fs.writeFileSync(finalPath, raw);

    // cleanup temp upload
    fs.unlinkSync(tempPath);

    const userGeometry = getOrCreateUserGeometry(user);

    const geometryName = req.file.originalname;
    userGeometry.addGeometry(geometryName);

    console.log("[Geometry] File loaded via API:", geometryName);

    res.json({
      success: true,
      message: `Geometry loaded for user ${userId}`,
      geometryName
    });

  } catch (err: any) {
    console.error("[Geometry] Upload error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

/* =========================
   Export Router
========================= */

export default router;