import { Response } from "express";
import pool from "../config/db";
import { AuthenticatedRequest } from "../middleware/auth";

// Get aggregate stats for dashboard cards
export const getStats = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Run counts in parallel
    const [
      totalUsersResult,
      activeAdminsResult,
      publishedBlogsResult,
      draftBlogsResult,
      pendingReviewsResult,
      approvedReviewsResult,
      totalContactsResult,
      openContactsResult,
    ] = await Promise.all([
      pool.query(`SELECT COUNT(*) FROM users`),
      pool.query(
        `SELECT COUNT(*) FROM users WHERE status = 'Active' AND role = ANY($1::text[])`,
        [["Super Admin", "Administrator"]]
      ),
      pool.query(`SELECT COUNT(*) FROM blog WHERE status = 'Published'`),
      pool.query(`SELECT COUNT(*) FROM blog WHERE status = 'Draft'`),
      pool.query(`SELECT COUNT(*) FROM review WHERE status = 'Pending'`),
      pool.query(`SELECT COUNT(*) FROM review WHERE status = 'Approved'`),
      pool.query(`SELECT COUNT(*) FROM contact_inquiries`),
      pool.query(`SELECT COUNT(*) FROM contact_inquiries WHERE status = 'Open'`),
    ]);

    const totalUsers = parseInt(totalUsersResult.rows[0].count, 10);
    const activeAdmins = parseInt(activeAdminsResult.rows[0].count, 10);
    const publishedBlogs = parseInt(publishedBlogsResult.rows[0].count, 10);
    const draftBlogs = parseInt(draftBlogsResult.rows[0].count, 10);
    const pendingReviews = parseInt(pendingReviewsResult.rows[0].count, 10);
    const approvedReviews = parseInt(approvedReviewsResult.rows[0].count, 10);
    const totalContacts = parseInt(totalContactsResult.rows[0].count, 10);
    const openContacts = parseInt(openContactsResult.rows[0].count, 10);

    // Return stats (website visitors are simulated since we don't have a tracking script)
    return res.status(200).json({
      success: true,
      stats: {
        totalUsers: totalUsers || 0,
        activeAdmins: activeAdmins || 0,
        publishedBlogs: publishedBlogs || 0,
        draftBlogs: draftBlogs || 0,
        pendingReviews: pendingReviews || 0,
        approvedReviews: approvedReviews || 0,
        totalContacts: totalContacts || 0,
        openContacts: openContacts || 0,
        websiteVisitors: 14250,
        totalPageViews: 45890,
      },
    });
  } catch (err) {
    console.error("getStats error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// Get chart data & recent activity widgets
export const getDashboardData = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // 1. Fetch recent records for widgets
    const [
      recentReviewsResult,
      recentUsersResult,
      recentBlogsResult,
      recentLoginsResult,
      recentContactsResult,
    ] = await Promise.all([
      pool.query(`SELECT * FROM review ORDER BY created_at DESC LIMIT 5`),
      pool.query(
        `SELECT id, username, fullname, role, status, created_at
         FROM users ORDER BY created_at DESC LIMIT 5`
      ),
      pool.query(
        `SELECT id, title, category, author, status, created_at
         FROM blog ORDER BY created_at DESC LIMIT 5`
      ),
      pool.query(
        `SELECT * FROM audit_logs WHERE action = 'LOGIN_SUCCESS'
         ORDER BY created_at DESC LIMIT 5`
      ),
      pool.query(`SELECT * FROM contact_inquiries ORDER BY created_at DESC LIMIT 5`),
    ]);

    const recentReviews = recentReviewsResult.rows;
    const recentUsers = recentUsersResult.rows;
    const recentBlogs = recentBlogsResult.rows;
    const recentLogins = recentLoginsResult.rows;
    const recentContacts = recentContactsResult.rows;

    // 2. Compile simulated analytics charts data (custom-designed for Seatown)
    const monthlyUsers = [
      { month: "Jan", count: 4 },
      { month: "Feb", count: 7 },
      { month: "Mar", count: 12 },
      { month: "Apr", count: 18 },
      { month: "May", count: 24 },
      { month: "Jun", count: 32 },
    ];

    const monthlyReviews = [
      { month: "Jan", approved: 15, pending: 2 },
      { month: "Feb", approved: 22, pending: 4 },
      { month: "Mar", approved: 35, pending: 7 },
      { month: "Apr", approved: 48, pending: 5 },
      { month: "May", approved: 72, pending: 11 },
      { month: "Jun", approved: 94, pending: 12 },
    ];

    const websiteTraffic = [
      { day: "Mon", visitors: 320, pageViews: 980 },
      { day: "Tue", visitors: 410, pageViews: 1240 },
      { day: "Wed", visitors: 380, pageViews: 1150 },
      { day: "Thu", visitors: 450, pageViews: 1400 },
      { day: "Fri", visitors: 490, pageViews: 1620 },
      { day: "Sat", visitors: 280, pageViews: 850 },
      { day: "Sun", visitors: 210, pageViews: 620 },
    ];

    const blogGrowth = [
      { month: "Jan", total: 0 },
      { month: "Feb", total: 2 },
      { month: "Mar", total: 3 },
      { month: "Apr", total: 5 },
      { month: "May", total: 5 },
      { month: "Jun", total: 6 },
    ];

    const visitorAnalytics = {
      devices: [
        { name: "Desktop", percentage: 68 },
        { name: "Mobile", percentage: 25 },
        { name: "Tablet", percentage: 7 },
      ],
      browsers: [
        { name: "Chrome", percentage: 55 },
        { name: "Safari", percentage: 22 },
        { name: "Firefox", percentage: 12 },
        { name: "Edge", percentage: 11 },
      ],
      countries: [
        { name: "India", count: 5200 },
        { name: "Singapore", count: 3400 },
        { name: "United Kingdom", count: 2100 },
        { name: "United Arab Emirates", count: 1800 },
        { name: "United States", count: 1750 },
      ],
      sources: [
        { name: "Direct", percentage: 40 },
        { name: "Organic Search", percentage: 35 },
        { name: "Referrals", percentage: 15 },
        { name: "Social Media", percentage: 10 },
      ],
    };

    return res.status(200).json({
      success: true,
      widgets: {
        recentReviews: recentReviews || [],
        recentUsers: recentUsers || [],
        recentBlogs: recentBlogs || [],
        recentLogins: recentLogins || [],
        recentContacts: recentContacts || [],
      },
      charts: {
        monthlyUsers,
        monthlyReviews,
        websiteTraffic,
        blogGrowth,
        visitorAnalytics,
      },
    });
  } catch (err) {
    console.error("getDashboardData error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// Get audit logs (Super Admin and Administrator only)
export const getAuditLogs = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { page = "1", limit = "20" } = req.query;
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const offset = (pageNum - 1) * limitNum;

    const countResult = await pool.query(`SELECT COUNT(*) FROM audit_logs`);
    const count = parseInt(countResult.rows[0].count, 10);

    const logsResult = await pool.query(
      `SELECT * FROM audit_logs ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
      [limitNum, offset]
    );

    return res.status(200).json({
      success: true,
      logs: logsResult.rows,
      pagination: {
        total: count || 0,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil((count || 0) / limitNum),
      },
    });
  } catch (err) {
    console.error("getAuditLogs error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};