import { Request, Response } from "express";
import { randomUUID } from "crypto";
import fs from "fs";
import path from "path";
import pool from "../config/db";
import { AuthenticatedRequest } from "../middleware/auth";

const REVIEW_UPLOAD_DIR = path.join(__dirname, "..", "..", "uploads", "reviews");

// Ensure the upload directory exists
if (!fs.existsSync(REVIEW_UPLOAD_DIR)) {
  fs.mkdirSync(REVIEW_UPLOAD_DIR, { recursive: true });
}

// Public submission of review (multipart form upload)
export const createReview = async (req: Request, res: Response) => {
  try {
    const { fullname, role, review } = req.body;

    if (!fullname || !role || !review) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    let imageUrl: string | null = null;

    if (req.file) {
      const extension = req.file.originalname.split(".").pop();
      const filename = `${randomUUID()}.${extension}`;
      const filePath = path.join(REVIEW_UPLOAD_DIR, filename);

      fs.writeFileSync(filePath, req.file.buffer);

      // Relative path stored in DB, served via express.static in app.ts
      imageUrl = `uploads/reviews/${filename}`;
    }

    await pool.query(
      `INSERT INTO review (fullname, role, review, image_url, status)
       VALUES ($1, $2, $3, $4, 'Pending')`,
      [fullname, role, review, imageUrl]
    );

    return res.status(201).json({
      success: true,
      message: "Review submitted successfully and is pending moderation.",
    });

  } catch (err) {
    console.error("createReview error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// Admin list reviews (requires JWT & moderation role)
export const getReviews = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { status, search, page = "1", limit = "10" } = req.query;
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const offset = (pageNum - 1) * limitNum;

    const conditions: string[] = [];
    const params: any[] = [];

    if (status) {
      params.push(status);
      conditions.push(`status = $${params.length}`);
    }
    if (search) {
      params.push(`%${search}%`);
      const idx = params.length;
      conditions.push(`(fullname ILIKE $${idx} OR review ILIKE $${idx})`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const countResult = await pool.query(`SELECT COUNT(*) FROM review ${whereClause}`, params);
    const count = parseInt(countResult.rows[0].count, 10);

    const dataParams = [...params, limitNum, offset];
    const reviewsResult = await pool.query(
      `SELECT * FROM review ${whereClause}
       ORDER BY created_at DESC
       LIMIT $${dataParams.length - 1} OFFSET $${dataParams.length}`,
      dataParams
    );

    return res.status(200).json({
      success: true,
      reviews: reviewsResult.rows,
      pagination: {
        total: count || 0,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil((count || 0) / limitNum),
      },
    });
  } catch (err) {
    console.error("getReviews error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// Fetch reviews from dashboard to homepage
export const getApprovedReviews = async (
  req: Request,
  res: Response
) => {
  try {
    const result = await pool.query(
      `SELECT * FROM review WHERE status = 'Approved' ORDER BY created_at DESC`
    );

    return res.json({
      success: true,
      reviews: result.rows,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Admin update review (requires JWT & moderation role)
export const updateReview = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { fullname, role, review, status, image_url } = req.body;

    const currentResult = await pool.query(`SELECT * FROM review WHERE id = $1 LIMIT 1`, [id]);
    const currentReview = currentResult.rows[0];

    if (!currentReview) {
      return res.status(404).json({
        success: false,
        message: "Review not found.",
      });
    }

    const updates: any = {};
    if (fullname !== undefined) updates.fullname = fullname;
    if (role !== undefined) updates.role = role;
    if (review !== undefined) updates.review = review;
    if (status !== undefined) updates.status = status;
    if (image_url !== undefined) updates.image_url = image_url;

    const keys = Object.keys(updates);
    if (keys.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No fields to update.",
      });
    }

    const setClauses = keys.map((k, i) => `${k} = $${i + 1}`);
    const values = keys.map(k => updates[k]);
    values.push(id);

    const updateResult = await pool.query(
      `UPDATE review SET ${setClauses.join(", ")} WHERE id = $${values.length} RETURNING *`,
      values
    );
    const updatedReview = updateResult.rows[0];

    // Log action in audit logs
    await pool.query(
      `INSERT INTO audit_logs (user_id, username, action, details, ip_address)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        req.user?.id || null,
        req.user?.username || "System",
        "REVIEW_UPDATE",
        `Updated review for "${updatedReview.fullname}". Status: ${updatedReview.status}`,
        req.ip,
      ]
    );

    return res.status(200).json({
      success: true,
      message: "Review updated successfully.",
      review: updatedReview,
    });
  } catch (err) {
    console.error("updateReview error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// Admin delete review (requires JWT & moderation role)
export const deleteReview = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`SELECT fullname FROM review WHERE id = $1 LIMIT 1`, [id]);
    const reviewToDelete = result.rows[0];

    if (!reviewToDelete) {
      return res.status(404).json({
        success: false,
        message: "Review not found.",
      });
    }

    await pool.query(`DELETE FROM review WHERE id = $1`, [id]);

    // Log action in audit logs
    await pool.query(
      `INSERT INTO audit_logs (user_id, username, action, details, ip_address)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        req.user?.id || null,
        req.user?.username || "System",
        "REVIEW_DELETE",
        `Deleted review submitted by: "${reviewToDelete.fullname}"`,
        req.ip,
      ]
    );

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully.",
    });
  } catch (err) {
    console.error("deleteReview error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// Admin bulk actions (requires JWT & moderation role)
export const bulkAction = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { ids, action } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: "An array of review IDs is required.",
      });
    }

    if (!["Approve", "Reject", "Delete", "Spam"].includes(action)) {
      return res.status(400).json({
        success: false,
        message: "Invalid action. Must be 'Approve', 'Reject', 'Delete', or 'Spam'.",
      });
    }

    if (action === "Delete") {
      await pool.query(`DELETE FROM review WHERE id = ANY($1::uuid[])`, [ids]);

      await pool.query(
        `INSERT INTO audit_logs (user_id, username, action, details, ip_address)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          req.user?.id || null,
          req.user?.username || "System",
          "REVIEW_BULK_DELETE",
          `Bulk deleted ${ids.length} reviews.`,
          req.ip,
        ]
      );

      return res.status(200).json({
        success: true,
        message: `Successfully deleted ${ids.length} reviews.`,
      });
    } else {
      const targetStatus = action === "Approve" ? "Approved" : (action === "Reject" ? "Rejected" : "Spam");

      await pool.query(
        `UPDATE review SET status = $1 WHERE id = ANY($2::uuid[])`,
        [targetStatus, ids]
      );

      await pool.query(
        `INSERT INTO audit_logs (user_id, username, action, details, ip_address)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          req.user?.id || null,
          req.user?.username || "System",
          `REVIEW_BULK_${action.toUpperCase()}`,
          `Bulk updated ${ids.length} reviews to status: ${targetStatus}`,
          req.ip,
        ]
      );

      return res.status(200).json({
        success: true,
        message: `Successfully updated ${ids.length} reviews to status: ${targetStatus}.`,
      });
    }
  } catch (err) {
    console.error("bulkAction error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};