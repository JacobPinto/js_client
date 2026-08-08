// server/types.d.ts
import { UserInfo } from "./user/user.js";

declare global {
  namespace Express {
    interface Request {
      userId: string;  // Required userId
      user?: UserInfo;  // Optional typed user object
    }
  }
}

export {};