
import express from 'express';
import { createUID, createFolder, deleteFolder } from "../utils.js";

export class ServiceInfo 
{
  // Software params.
  private _softwareName: string;
  private _softwareVersion: string;
  private _schemaVersion: number;

  constructor(name: string, version: string, schemaVer: number) {
    this._softwareName = name;
    this._softwareVersion = version;
    this._schemaVersion = schemaVer;
  }

  public get softwareName(): string {
    return this._softwareName;
  }

  public get softwareVersion(): string {
    return this._softwareVersion;
  }

  public get schemaVersion(): number {
    return this._schemaVersion;
  } 
}

export class UserInfo
{
  private _userId!: string;
  private _userName!: string;
  private _userEmail!: string;
  private _pathToUserFolder!: string;
  private _servicesOpen?: ServiceInfo[];

  public get userId(): string {
    return this._userId;
  }

  public get userName(): string {
    return this._userName;
  }

  public get userEmail(): string {
    return this._userEmail;
  }

  public get pathToUserFolder(): string {
    return this._pathToUserFolder;
  }

  constructor(name:string, email:string)
  {
    this._userId = createUID();
    this._userName = name;
    this._userEmail = email;
    this._pathToUserFolder = `./data/${this._userId}`;
  }

  // Create a folder for the user if it does not exist
  createUserFolder(): string {
    const path = `./data/${this._userId}`;
    return createFolder(path);
  }

  // Delete the folder for the user if it exists
  deleteUserFolder(): string {
    const path = `./data/${this._userId}`;
    return deleteFolder(path);
  }

  initUser(): string {
    return this.createUserFolder();
  }

  deleteUser(): string {
    return this.deleteUserFolder();
  }
}

export const userArray = {
  // Reads from disk all the existing users
  totalValidUsers: [] as UserInfo[],
  // Users currently active in the server session
  currentActiveUsers: [] as UserInfo[]
};

function isExistingCredentials(userInfo: UserInfo): boolean {
  return userArray.totalValidUsers.findIndex(user => user.userName === userInfo.userName &&
                                                     user.userEmail === userInfo.userEmail) !== -1;
}

export function isCurrentUser(userId: string): boolean {
  return userArray.currentActiveUsers.findIndex(user => user.userId === userId) !== -1;
}

export function findUserInfoByUserId(userId: string): UserInfo | undefined {
  return userArray.currentActiveUsers.find(user => user.userId === userId);
}

interface HasOwner {
  owner: UserInfo;
}

/* 
 * Generic function to find an element in an array by matching userId
 * Return type:
 * - element reference if found
 */
export function findByUserInfo<T extends HasOwner>(userInfo: UserInfo, array: T[]): T | undefined {
  return array.find(elem => elem.owner === userInfo);
}

export function findByUserId<T extends HasOwner>(userId: string, array: T[]): T | undefined {
  return array.find(elem => elem.owner.userId === userId);
}

const router = express.Router();

// Setup middleware

// middleware to set views directory for this router
/*router.use((req, res, next) => {
  // Set the views directory to this router's views folder
  req.app.set('views', path.join(__dirname, 'views'));
  next();
});*/

// Create a new user
router.post('/createnew/', (req, res) => {
  const { name, email } = req.body;
  const newUser = new UserInfo(name, email);
  if (isExistingCredentials(newUser)) {
    var initStatus = "these user credentials are already registered";
  } else {
    userArray.currentActiveUsers.push(newUser);
    userArray.totalValidUsers.push(newUser);
    initStatus = newUser.initUser();
  }
  res.status(200).json({ success: true, userID: newUser.userId, message: initStatus });
});


// Delete a user
router.post('/delete/:userId', (req, res) => {
  const userId = req.params.userId;
  const userIndex = userArray.currentActiveUsers.findIndex(user => user.userId === userId);
  if (userIndex !== -1) {
    const userToDelete = userArray.currentActiveUsers[userIndex];
    const deleteStatus = userToDelete.deleteUser();
    userArray.currentActiveUsers.splice(userIndex, 1);
    res.status(200).json({ success: true, message: deleteStatus });
  } else {
    res.status(404).json({ success: false, message: 'User not found' });
  }
});

router.get('/activity/', (req, res) => {
  const showActive = req.query.active === 'true';
  const showTotal = req.query.total === 'true';

  if (showActive) {
    res.send(userArray.currentActiveUsers.length.toString());
  } else if (showTotal) {
    res.send(userArray.totalValidUsers.length.toString());
  } else {
    res.render('activity', {
      activeUsers: userArray.currentActiveUsers.length,
      totalUsers: userArray.totalValidUsers.length
    });
  }
});

export default router;
