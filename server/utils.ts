
import fs from "fs";

// Utility to create a unique identifier.
export function createUID(): string {
  return 'usr12345';
}

// Create folder if it does not exist
export function createFolder(path: string): string {
  if (!fs.existsSync(path)) {
    try {
      fs.mkdirSync(path, { recursive: true });
    } catch (err) {
     console.error("Error creating folder: ", path, err);
     return "serverError: Unable to create folder";
    }
  }
  return "serverOK";
}

// Delete folder if it exists
export function deleteFolder(path: string): string {
  if (fs.existsSync(path)) {
    try {
      fs.rmdirSync(path, { recursive: true });
    } catch (err) {
     console.error("Error deleting folder: ", path, err);
     return "serverError: Unable to delete folder";     
    }
  }
  return "serverOK";  
}
