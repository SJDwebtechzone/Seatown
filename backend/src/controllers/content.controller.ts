import { Response } from "express";
import pool from "../config/db";
import { AuthenticatedRequest } from "../middleware/auth";

// Get content by key
export const getContent = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { key } = req.params;

    const result = await pool.query(
      `SELECT * FROM website_content WHERE key = $1 LIMIT 1`,
      [key]
    );
    const data = result.rows[0];

    if (!data) {
      return res.status(200).json({
        success: true,
        content: null,
      });
    }

    return res.status(200).json({
      success: true,
      content: data.value,
    });
  } catch (err) {
    console.error("getContent error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// Update content by key
export const updateContent = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { key } = req.params;
    const { value } = req.body;

    if (value === undefined) {
      return res.status(400).json({
        success: false,
        message: "Value is required.",
      });
    }

    const upsertResult = await pool.query(
      `INSERT INTO website_content (key, value, updated_at)
       VALUES ($1, $2, $3)
       ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = $3
       RETURNING *`,
      [key, JSON.stringify(value), new Date().toISOString()]
    );
    const data = upsertResult.rows[0];

    // Log action in audit logs
    await pool.query(
      `INSERT INTO audit_logs (user_id, username, action, details, ip_address)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        req.user?.id || null,
        req.user?.username || "System",
        "CONTENT_UPDATE",
        `Updated website content key: "${key}"`,
        req.ip,
      ]
    );

    return res.status(200).json({
      success: true,
      message: `Website content for "${key}" updated successfully.`,
      content: data.value,
    });
  } catch (err) {
    console.error("updateContent error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};