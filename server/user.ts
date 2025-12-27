import { createUID, createFolder, deleteFolder } from "./utils.js";

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

  constructor(name:string, email:string)
  {
    this._userId = createUID();
    this._userName = name;
    this._userEmail = email;
  }

  // Create a folder for the user if it does not exist
  createUserFolder(): string {
    const path = `./data/run/${this._userId}`;
    return createFolder(path);
  }

  // Delete the folder for the user if it exists
  deleteUserFolder(): string {
    const path = `./data/run/${this._userId}`;
    return deleteFolder(path);
  }

  initUser(): string {
    return this.createUserFolder();
  }

  deleteUser(): string {
    return this.deleteUserFolder();
  }
}



/*
export function loadExistingUserInfo(userInfo: UserInfo[]): void
{
  
}*/
