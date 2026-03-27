import express from "express";
import multer from "multer";
import fs from "fs";

const router = express.Router();

// 📦 store uploaded files
const upload = multer({ dest: "uploads/" });

/* =========================
   Upload File Endpoint
========================= */
router.post("/upload", upload.single("file"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.path;

    // read file
    const raw = fs.readFileSync(filePath, "utf-8");

    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      return res.status(400).json({ error: "Invalid JSON file" });
    }

    console.log("[Server] File received:", data);

    // return parsed data
    res.json({
      message: "File processed successfully",
      ...data
    });

  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

export default router;