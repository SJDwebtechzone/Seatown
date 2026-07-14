import { Response } from "express";
import bcrypt from "bcryptjs";
import pool from "../config/db";
import { signToken } from "../utils/jwt";
import { AuthenticatedRequest } from "../middleware/auth";

// Initial setup to create the first Super Admin if no users exist
export const setup = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Check if any user exists
    const countResult = await pool.query(`SELECT COUNT(*) FROM users`);
    const count = parseInt(countResult.rows[0].count, 10);

    if (count > 0) {
      return res.status(400).json({
        success: false,
        message: "Setup has already been completed. Admin users exist.",
      });
    }

    const { username, password, fullname } = req.body;
    if (!username || !password || !fullname) {
      return res.status(400).json({
        success: false,
        message: "Username, password, and fullname are required.",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Insert Super Admin
    const insertResult = await pool.query(
      `INSERT INTO users (username, password_hash, fullname, role, status)
       VALUES ($1, $2, $3, 'Super Admin', 'Active')
       RETURNING id, username, fullname, role, status`,
      [username, password_hash, fullname]
    );
    const data = insertResult.rows[0];

    // Log action in audit logs
    await pool.query(
      `INSERT INTO audit_logs (username, action, details, ip_address)
       VALUES ($1, $2, $3, $4)`,
      [username, "SETUP_COMPLETED", `Super Admin account created: ${username}`, req.ip]
    );

    return res.status(201).json({
      success: true,
      message: "Super Admin account created successfully.",
      user: data,
    });
  } catch (err) {
    console.error("Setup error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// Admin user login
export const login = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required.",
      });
    }

    // Fetch user
    const userResult = await pool.query(
      `SELECT * FROM users WHERE username = $1 LIMIT 1`,
      [username]
    );
    const user = userResult.rows[0];

    if (!user) {
      // Log failed login
      await pool.query(
        `INSERT INTO audit_logs (username, action, details, ip_address)
         VALUES ($1, $2, $3, $4)`,
        [username, "LOGIN_FAILED", "User not found", req.ip]
      );

      return res.status(401).json({
        success: false,
        message: "Invalid username or password.",
      });
    }

    if (user.status === "Suspended") {
      await pool.query(
        `INSERT INTO audit_logs (user_id, username, action, details, ip_address)
         VALUES ($1, $2, $3, $4, $5)`,
        [user.id, username, "LOGIN_FAILED", "Account suspended", req.ip]
      );

      return res.status(403).json({
        success: false,
        message: "Your account has been suspended. Please contact the Super Admin.",
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      // Log failed login
      await pool.query(
        `INSERT INTO audit_logs (user_id, username, action, details, ip_address)
         VALUES ($1, $2, $3, $4, $5)`,
        [user.id, username, "LOGIN_FAILED", "Incorrect password", req.ip]
      );

      return res.status(401).json({
        success: false,
        message: "Invalid username or password.",
      });
    }

    // Update last login
    const now = new Date().toISOString();
    await pool.query(
      `UPDATE users SET last_login = $1 WHERE id = $2`,
      [now, user.id]
    );

    // Generate JWT
    const token = signToken({
      id: user.id,
      username: user.username,
      role: user.role,
      fullname: user.fullname,
    });

    // Log successful login
    await pool.query(
      `INSERT INTO audit_logs (user_id, username, action, details, ip_address)
       VALUES ($1, $2, $3, $4, $5)`,
      [user.id, username, "LOGIN_SUCCESS", `Successful login. Role: ${user.role}`, req.ip]
    );

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: {
        id: user.id,
        username: user.username,
        fullname: user.fullname,
        role: user.role,
        status: user.status,
        last_login: now,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// Get current authenticated user
export const getMe = async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Not authenticated.",
    });
  }

  try {
    const result = await pool.query(
      `SELECT id, username, fullname, role, status, last_login, created_at
       FROM users WHERE id = $1 LIMIT 1`,
      [req.user.id]
    );
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};