import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { JSONWritable } from "../jsonWritable.js";
import { idCounter } from "../idCounter.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const upload = multer({ dest: "uploads/" });

class GeometryInfo extends JSONWritable {
  private _id: number;
  private _name: string;
  private _createdAt: Date;
  private _geometryFilePath: string;

  constructor(
    id: number,
    name: string,
    filePath: string
  ) {
    super();

    this._id = id;
    this._name = name;
    this._geometryFilePath = filePath;
    this._createdAt = new Date();
  }

  get id(): number {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get geometryFilePath(): string {
    return this._geometryFilePath;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  getKey(): string {
    return "geometry";
  }

  toJSON() {
    return {
      id: this._id,
      load_file: `./${this.name}`
    };
  }

  write() {
    let existing: any = {};

    try {
      if (fs.existsSync(this.filePath)) {
        existing = JSON.parse(
          fs.readFileSync(this.filePath, "utf-8")
        );
      }

      if (!Array.isArray(existing.geometry)) {
        existing.geometry = [];
      }

      const index = existing.geometry.findIndex(
        (g: any) => g.id === this._id
      );

      if (index >= 0) {
        existing.geometry[index] = this.toJSON();
      } else {
        existing.geometry.push(this.toJSON());
      }

      fs.writeFileSync(
        this.filePath,
        JSON.stringify(existing, null, 2)
      );

      console.log(
        `Geometry ${this._id} persisted to ${this.filePath}`
      );
    } catch (err) {
      console.error(err);
    }
  }
}

class GeometryManager {
  private _geometries: Map<number, GeometryInfo> =
    new Map();

  addGeometry(geometry: GeometryInfo) {
    this._geometries.set(
      geometry.id,
      geometry
    );
  }

  deleteGeometry(id: number) {
    return this._geometries.delete(id);
  }

  loadFromFile() {
    try {
      const simulationPath = path.join(
        __dirname,
        "../../simulation.json"
      );

      if (!fs.existsSync(simulationPath)) {
        return;
      }

      const data = JSON.parse(
        fs.readFileSync(simulationPath, "utf-8")
      );

      const loadedIds: number[] = [];

      if (Array.isArray(data.geometry)) {
        data.geometry.forEach((g: any) => {
          const geometry =
            new GeometryInfo(
              g.id,
              path.basename(g.load_file),
              g.load_file
            );

          this._geometries.set(
            geometry.id,
            geometry
          );

          loadedIds.push(g.id);

          console.log(
            `Loaded geometry ${g.id}`
          );
        });
      }

      idCounter.sync(
        "geometry",
        loadedIds
      );
    } catch (err) {
      console.warn(
        "Geometry load failed:",
        err
      );
    }
  }
}

const geometryManager =
  new GeometryManager();

geometryManager.loadFromFile();

export function loadGeometryFromFile(
  filePath: string
) {
  if (!fs.existsSync(filePath)) {
    throw new Error(
      `File not found: ${filePath}`
    );
  }

  const geometryId =
    idCounter.next("geometry");

  const geometryName =
    path.basename(filePath);

  const geometry =
    new GeometryInfo(
      geometryId,
      geometryName,
      filePath
    );

  geometryManager.addGeometry(
    geometry
  );

  geometry.write();

  return fs.readFileSync(
    filePath,
    "utf-8"
  );
}

router.post(
  "/loadfile",
  upload.single("file"),
  (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          error: "No file uploaded"
        });
      }

      const geometryFolder =
        path.join(
          "data",
          "geometry"
        );

      fs.mkdirSync(
        geometryFolder,
        { recursive: true }
      );

      const finalPath =
        path.join(
          geometryFolder,
          req.file.originalname
        );

      fs.copyFileSync(
        req.file.path,
        finalPath
      );

      fs.unlinkSync(
        req.file.path
      );

      const geometryId =
        idCounter.next("geometry");

      const geometry =
        new GeometryInfo(
          geometryId,
          req.file.originalname,
          finalPath
        );

      geometryManager.addGeometry(
        geometry
      );

      geometry.write();

      console.log(
        `[Geometry] Loaded ${req.file.originalname} (id=${geometryId})`
      );

      res.json({
        success: true,
        geometryId,
        geometryName:
          req.file.originalname
      });
    } catch (err: any) {
      console.error(err);

      res.status(500).json({
        error: err.message
      });
    }
  }
);

router.delete("/:id", (req, res) => {
  const id = Number(
    req.params.id
  );

  const deleted =
    geometryManager.deleteGeometry(
      id
    );

  if (!deleted) {
    return res.status(404).json({
      error: "Geometry not found"
    });
  }

  const simulationPath =
    path.join(
      __dirname,
      "../../simulation.json"
    );

  if (
    fs.existsSync(
      simulationPath
    )
  ) {
    const data = JSON.parse(
      fs.readFileSync(
        simulationPath,
        "utf-8"
      )
    );

    if (
      Array.isArray(
        data.geometry
      )
    ) {
      data.geometry =
        data.geometry.filter(
          (g: any) =>
            g.id !== id
        );

      fs.writeFileSync(
        simulationPath,
        JSON.stringify(
          data,
          null,
          2
        )
      );
    }
  }

  res.json({
    success: true
  });
});

export default router;