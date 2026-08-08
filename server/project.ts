import express from 'express';

import { userArray } from './user/user.js';
import { UserInfo } from "./user/user.js";
import { findUserInfoByUserId, findByUserId } from './user/user.js';

class ProjectInfo {
  private _name: string;
  private _owner: UserInfo;
  private _createdAt: Date;
  
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
  }
}

class ProjectByUser {
  private _owner: UserInfo;
  private _projects: ProjectInfo[] = [];
  
  get owner(): UserInfo {
    return this._owner;
  }

  constructor(owner: UserInfo) {
    this._owner = owner;
  }

  public addProject(projectName: string): ProjectInfo {
    let project = this._projects.find(proj => proj.name === projectName);
    if (!project) {
      project = new ProjectInfo(projectName, this._owner);
      this._projects.push(project);
    }
    return project;
  }
}

export const projectArray = {
  projectsByUser: [] as ProjectByUser[]
}

const router = express.Router();

router.post('/create', (req, res) => {
  const userId = req.userId;
  const name = req.body.name as string;

  let user = findByUserId(userId, projectArray.projectsByUser);

  if (!user) {
    const userInfo = findUserInfoByUserId(userId);
    if (!userInfo) {
      return res.status(404).json({
        success: false,
        error: `User ${userId} not found or not active`
      });
    }
    projectArray.projectsByUser.push(new ProjectByUser(userInfo));
    projectArray.projectsByUser[-1].addProject(name);
    console.log(`Creating a new project space and project for the user ${userId}`);
  } else {
    user.addProject(name);
    console.log(`Creating a new project for the user ${userId} in existing space`);
  }

  res.status(200).json({ success: true, message: `Project ${name} created for user ${userId}` });
});

export default router;
