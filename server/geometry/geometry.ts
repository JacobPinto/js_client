import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { idCounter } from "../idCounter.js";
import jsonWriter from "../base/jsonWriter.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();
const upload = multer({ dest: "uploads/" });

const SIMULATION_PATH = path.join(__dirname, "../../simulation.json");

class GeometryInfo {
  private _id: number;
  private _name: string;
  private _outputFilePath: string;
  private _createdAt: Date;
  private _geometryFilePath: string;

  constructor(
    id: number,
    name: string,
    filePath: string
  ) {
    this._id = id;
    this._name = name;
    this._outputFilePath = path.join("clientInput", this._name);    
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

  toJSON() {
    return {
      id: this._id,
      load_file: `./${this.name}`
    };
  }

  write() {
    jsonWriter.postMessage({ type: "arrayMerge", arrayKey: "geometry", idField: "id",
                            id: this._id, data: this.toJSON(), filePath: this._outputFilePath });
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