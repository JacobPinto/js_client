// server/types.d.ts
declare global {
  namespace Express {
    interface Request {
      userId?: string;  // Now TypeScript knows about this property
    }
  }
}

export {};