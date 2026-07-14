import { Response } from "express";
import pool from "../config/db";
import { AuthenticatedRequest } from "../middleware/auth";

// Get all contact inquiries
export const getContacts = async (req: AuthenticatedRequest, res: Response) => {
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
      conditions.push(`(name ILIKE $${idx} OR email ILIKE $${idx} OR message ILIKE $${idx})`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const countResult = await pool.query(`SELECT COUNT(*) FROM contact_inquiries ${whereClause}`, params);
    const count = parseInt(countResult.rows[0].count, 10);

    const dataParams = [...params, limitNum, offset];
    const contactsResult = await pool.query(
      `SELECT * FROM contact_inquiries ${whereClause}
       ORDER BY created_at DESC
       LIMIT $${dataParams.length - 1} OFFSET $${dataParams.length}`,
      dataParams
    );

    return res.status(200).json({
      success: true,
      contacts: contactsResult.rows,
      pagination: {
        total: count || 0,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil((count || 0) / limitNum),
      },
    });
  } catch (err) {
    console.error("getContacts error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// Update inquiry (status and/or reply notes)
export const updateContact = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, reply_notes } = req.body;

    const currentResult = await pool.query(`SELECT * FROM contact_inquiries WHERE id = $1 LIMIT 1`, [id]);
    const currentInquiry = currentResult.rows[0];

    if (!currentInquiry) {
      return res.status(404).json({
        success: false,
        message: "Contact inquiry not found.",
      });
    }

    const updates: any = {};
    if (status !== undefined) {
      if (!["Open", "In Progress", "Resolved", "Archived"].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status. Must be 'Open', 'In Progress', 'Resolved', or 'Archived'.",
        });
      }
      updates.status = status;
    }
    if (reply_notes !== undefined) updates.reply_notes = reply_notes;
    updates.updated_at = new Date().toISOString();

    const keys = Object.keys(updates);
    const setClauses = keys.map((k, i) => `${k} = $${i + 1}`);
    const values = keys.map(k => updates[k]);
    values.push(id);

    const updateResult = await pool.query(
      `UPDATE contact_inquiries SET ${setClauses.join(", ")} WHERE id = $${values.length} RETURNING *`,
      values
    );
    const updatedInquiry = updateResult.rows[0];

    // Log action in audit logs
    await pool.query(
      `INSERT INTO audit_logs (user_id, username, action, details, ip_address)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        req.user?.id || null,
        req.user?.username || "System",
        "CONTACT_UPDATE",
        `Updated contact inquiry from "${updatedInquiry.name}". Status: ${updatedInquiry.status}`,
        req.ip,
      ]
    );

    return res.status(200).json({
      success: true,
      message: "Contact inquiry updated successfully.",
      contact: updatedInquiry,
    });
  } catch (err) {
    console.error("updateContact error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// Delete inquiry
export const deleteContact = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`SELECT name FROM contact_inquiries WHERE id = $1 LIMIT 1`, [id]);
    const inquiryToDelete = result.rows[0];

    if (!inquiryToDelete) {
      return res.status(404).json({
        success: false,
        message: "Contact inquiry not found.",
      });
    }

    await pool.query(`DELETE FROM contact_inquiries WHERE id = $1`, [id]);

    // Log action in audit logs
    await pool.query(
      `INSERT INTO audit_logs (user_id, username, action, details, ip_address)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        req.user?.id || null,
        req.user?.username || "System",
        "CONTACT_DELETE",
        `Deleted contact inquiry from: "${inquiryToDelete.name}"`,
        req.ip,
      ]
    );

    return res.status(200).json({
      success: true,
      message: "Contact inquiry deleted successfully.",
    });
  } catch (err) {
    console.error("deleteContact error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};