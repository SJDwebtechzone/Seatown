import { Response } from "express";
import { randomUUID } from "crypto";
import fs from "fs";
import path from "path";
import pool from "../config/db";
import { AuthenticatedRequest } from "../middleware/auth";

const MEDIA_UPLOAD_DIR = path.join(__dirname, "..", "..", "uploads", "media");

if (!fs.existsSync(MEDIA_UPLOAD_DIR)) {
  fs.mkdirSync(MEDIA_UPLOAD_DIR, { recursive: true });
}

const getMimeType = (filename: string): string => {
  const ext = filename.split(".").pop()?.toLowerCase();
  const map: Record<string, string> = {
    jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png",
    gif: "image/gif", webp: "image/webp", pdf: "application/pdf",
    svg: "image/svg+xml",
  };
  return map[ext || ""] || "application/octet-stream";
};

// List all media files
export const getMedia = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const files = fs.readdirSync(MEDIA_UPLOAD_DIR);

    const media = files
      .map((filename) => {
        const filePath = path.join(MEDIA_UPLOAD_DIR, filename);
        const stats = fs.statSync(filePath);
        return {
          name: filename,
          id: filename,
          size: stats.size,
          mimeType: getMimeType(filename),
          createdAt: stats.birthtime,
          url: `uploads/media/${filename}`,
        };
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 100);

    return res.status(200).json({
      success: true,
      media,
    });
  } catch (err) {
    console.error("getMedia error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// Upload media file
export const uploadMedia = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded.",
      });
    }

    const extension = req.file.originalname.split(".").pop();
    const filename = `${randomUUID()}.${extension}`;
    const filePath = path.join(MEDIA_UPLOAD_DIR, filename);

    fs.writeFileSync(filePath, req.file.buffer);

    const url = `uploads/media/${filename}`;

    // Log action in audit logs
    await pool.query(
      `INSERT INTO audit_logs (user_id, username, action, details, ip_address)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        req.user?.id || null,
        req.user?.username || "System",
        "MEDIA_UPLOAD",
        `Uploaded media file: ${filename} (${req.file.originalname})`,
        req.ip,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "File uploaded successfully.",
      file: {
        name: filename,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        url,
      },
    });
  } catch (err) {
    console.error("uploadMedia error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// Delete media file
export const deleteMedia = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name } = req.params;

    if (!name || typeof name !== "string") {
      return res.status(400).json({ success: false, message: "File name is required." });
    }

    const filePath = path.join(MEDIA_UPLOAD_DIR, name);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: "Media file not found.",
      });
    }

    fs.unlinkSync(filePath);

    // Log action in audit logs
    await pool.query(
      `INSERT INTO audit_logs (user_id, username, action, details, ip_address)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        req.user?.id || null,
        req.user?.username || "System",
        "MEDIA_DELETE",
        `Deleted media file: ${name}`,
        req.ip,
      ]
    );

    return res.status(200).json({
      success: true,
      message: "Media file deleted successfully.",
    });
  } catch (err) {
    console.error("deleteMedia error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};