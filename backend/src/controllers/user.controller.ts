import { Response } from "express";
import bcrypt from "bcryptjs";
import pool from "../config/db";
import { AuthenticatedRequest } from "../middleware/auth";

// Get all users (Super Admin only)
export const getUsers = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { search, role, status, page = "1", limit = "10" } = req.query;
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const offset = (pageNum - 1) * limitNum;

    const conditions: string[] = [];
    const params: any[] = [];

    if (role) {
      params.push(role);
      conditions.push(`role = $${params.length}`);
    }
    if (status) {
      params.push(status);
      conditions.push(`status = $${params.length}`);
    }
    if (search) {
      params.push(`%${search}%`);
      const idx = params.length;
      conditions.push(`(username ILIKE $${idx} OR fullname ILIKE $${idx})`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    // Total count for pagination
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM users ${whereClause}`,
      params
    );
    const count = parseInt(countResult.rows[0].count, 10);

    // Paginated results
    const dataParams = [...params, limitNum, offset];
    const usersResult = await pool.query(
      `SELECT id, username, fullname, role, status, last_login, created_at
       FROM users ${whereClause}
       ORDER BY created_at DESC
       LIMIT $${dataParams.length - 1} OFFSET $${dataParams.length}`,
      dataParams
    );

    return res.status(200).json({
      success: true,
      users: usersResult.rows,
      pagination: {
        total: count || 0,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil((count || 0) / limitNum),
      },
    });
  } catch (err) {
    console.error("getUsers error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// Create user (Super Admin only)
export const createUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { username, password, fullname, role } = req.body;

    if (!username || !password || !fullname || !role) {
      return res.status(400).json({
        success: false,
        message: "All fields are required (username, password, fullname, role).",
      });
    }

    // Check if user already exists
    const existingResult = await pool.query(
      `SELECT id FROM users WHERE username = $1 LIMIT 1`,
      [username]
    );

    if (existingResult.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Username is already taken.",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Insert user
    const insertResult = await pool.query(
      `INSERT INTO users (username, password_hash, fullname, role, status)
       VALUES ($1, $2, $3, $4, 'Active')
       RETURNING id, username, fullname, role, status, created_at`,
      [username, password_hash, fullname, role]
    );
    const newUser = insertResult.rows[0];

    // Log in audit logs
    await pool.query(
      `INSERT INTO audit_logs (user_id, username, action, details, ip_address)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        req.user?.id || null,
        req.user?.username || "System",
        "USER_CREATE",
        `Created user ${username} with role ${role}`,
        req.ip,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "User created successfully.",
      user: newUser,
    });
  } catch (err) {
    console.error("createUser error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// Update user details (Super Admin only)
export const updateUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { fullname, role } = req.body;

    if (!fullname || !role) {
      return res.status(400).json({
        success: false,
        message: "Fullname and role are required.",
      });
    }

    // Update user
    const updateResult = await pool.query(
      `UPDATE users SET fullname = $1, role = $2
       WHERE id = $3
       RETURNING id, username, fullname, role, status`,
      [fullname, role, id]
    );
    const updatedUser = updateResult.rows[0];

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Log in audit logs
    await pool.query(
      `INSERT INTO audit_logs (user_id, username, action, details, ip_address)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        req.user?.id || null,
        req.user?.username || "System",
        "USER_UPDATE",
        `Updated user ${updatedUser.username}. Role: ${role}, Name: ${fullname}`,
        req.ip,
      ]
    );

    return res.status(200).json({
      success: true,
      message: "User updated successfully.",
      user: updatedUser,
    });
  } catch (err) {
    console.error("updateUser error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// Update user status (Suspend/Activate) - (Super Admin only)
export const updateStatus = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (status !== "Active" && status !== "Suspended") {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be 'Active' or 'Suspended'.",
      });
    }

    if (id === req.user?.id) {
      return res.status(400).json({
        success: false,
        message: "You cannot suspend your own account.",
      });
    }

    // Update status
    const updateResult = await pool.query(
      `UPDATE users SET status = $1
       WHERE id = $2
       RETURNING id, username, status`,
      [status, id]
    );
    const updatedUser = updateResult.rows[0];

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Log in audit logs
    await pool.query(
      `INSERT INTO audit_logs (user_id, username, action, details, ip_address)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        req.user?.id || null,
        req.user?.username || "System",
        status === "Suspended" ? "USER_SUSPEND" : "USER_ACTIVATE",
        `${status === "Suspended" ? "Suspended" : "Activated"} user ${updatedUser.username}`,
        req.ip,
      ]
    );

    return res.status(200).json({
      success: true,
      message: `User status updated to ${status} successfully.`,
      user: updatedUser,
    });
  } catch (err) {
    console.error("updateStatus error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// Reset password (Super Admin only)
export const resetPassword = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    if (!password || password.length < 4) {
      return res.status(400).json({
        success: false,
        message: "Password is required and must be at least 4 characters.",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Update password
    const updateResult = await pool.query(
      `UPDATE users SET password_hash = $1
       WHERE id = $2
       RETURNING id, username`,
      [password_hash, id]
    );
    const updatedUser = updateResult.rows[0];

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Log in audit logs
    await pool.query(
      `INSERT INTO audit_logs (user_id, username, action, details, ip_address)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        req.user?.id || null,
        req.user?.username || "System",
        "USER_PASSWORD_RESET",
        `Reset password for user ${updatedUser.username}`,
        req.ip,
      ]
    );

    return res.status(200).json({
      success: true,
      message: `Password for ${updatedUser.username} has been reset successfully.`,
    });
  } catch (err) {
    console.error("resetPassword error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// Delete user (Super Admin only)
export const deleteUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (id === req.user?.id) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own account.",
      });
    }

    // Get username before delete for audit logging
    const userResult = await pool.query(
      `SELECT username FROM users WHERE id = $1 LIMIT 1`,
      [id]
    );
    const userToDelete = userResult.rows[0];

    if (!userToDelete) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Delete user
    await pool.query(`DELETE FROM users WHERE id = $1`, [id]);

    // Log in audit logs
    await pool.query(
      `INSERT INTO audit_logs (user_id, username, action, details, ip_address)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        req.user?.id || null,
        req.user?.username || "System",
        "USER_DELETE",
        `Deleted user account: ${userToDelete.username}`,
        req.ip,
      ]
    );

    return res.status(200).json({
      success: true,
      message: "User deleted successfully.",
    });
  } catch (err) {
    console.error("deleteUser error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};