
import express from "express";

import {UserInfo} from "../user/user.js";

// Single class to hold geometry information for 1 geometry
class GeometryInfo {
  private _name: string;
  //private _sizeInBytes: number;
  //private _format: string;
  private _createdAt: Date;
  private _owner: UserInfo;
  private _pathToUserGeometryFolder: string;

  get owner(): UserInfo {
    return this._owner;
  }

  constructor(name: string, owner: UserInfo) {
    this._name = name;
    this._owner = owner;
    this._createdAt = new Date();
    this._pathToUserGeometryFolder = `${this._owner.pathToUserFolder}/geometry`;
  }
}

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

  public addGeometry(geometryName: string): GeometryInfo {
    const newGeometry = new GeometryInfo(geometryName, this._owner);
    this._geometries.push(newGeometry);
    return newGeometry;
  }
};

export const geometryArray = {
  geometryByUser: [] as GeometryByUser[]
}

const router = express.Router();

router.post('/upload', (req, res) => {
  const userId = req.userId;

  // Handle file upload logic here

  res.status(200).json({ success: true, message: `File uploaded for user ${userId}` });
});

export default router;
