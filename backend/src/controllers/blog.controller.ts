import { Response } from "express";
import pool from "../config/db";
import { AuthenticatedRequest } from "../middleware/auth";

// Helper to generate slug from title
const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

// Helper to calculate reading time
const calculateReadingTime = (content: string): string => {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
};

// Get all blogs (Admin view: can see draft, scheduled, published)
export const getBlogs = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { search, category, status, page = "1", limit = "10" } = req.query;
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const offset = (pageNum - 1) * limitNum;

    const conditions: string[] = [];
    const params: any[] = [];

    if (category) {
      params.push(category);
      conditions.push(`category = $${params.length}`);
    }
    if (status) {
      params.push(status);
      conditions.push(`status = $${params.length}`);
    }
    if (search) {
      params.push(`%${search}%`);
      const idx = params.length;
      conditions.push(`(title ILIKE $${idx} OR excerpt ILIKE $${idx})`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const countResult = await pool.query(`SELECT COUNT(*) FROM blog ${whereClause}`, params);
    const count = parseInt(countResult.rows[0].count, 10);

    const dataParams = [...params, limitNum, offset];
    const blogsResult = await pool.query(
      `SELECT * FROM blog ${whereClause}
       ORDER BY created_at DESC
       LIMIT $${dataParams.length - 1} OFFSET $${dataParams.length}`,
      dataParams
    );

    return res.status(200).json({
      success: true,
      blogs: blogsResult.rows,
      pagination: {
        total: count || 0,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil((count || 0) / limitNum),
      },
    });
  } catch (err) {
    console.error("getBlogs error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// Get single blog post
export const getBlogById = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`SELECT * FROM blog WHERE id = $1 LIMIT 1`, [id]);
    const blog = result.rows[0];

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found.",
      });
    }

    return res.status(200).json({
      success: true,
      blog,
    });
  } catch (err) {
    console.error("getBlogById error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// Create blog post
export const createBlog = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      title,
      category,
      excerpt,
      content,
      featured_image,
      status = "Draft",
      published_at,
      featured = false,
      seo_title,
      seo_description,
      tags = [],
    } = req.body;

    if (!title || !category || !excerpt || !content) {
      return res.status(400).json({
        success: false,
        message: "Title, category, excerpt, and content are required.",
      });
    }

    const slug = req.body.slug ? generateSlug(req.body.slug) : generateSlug(title);

    // Check if slug is unique
    const existingResult = await pool.query(`SELECT id FROM blog WHERE slug = $1 LIMIT 1`, [slug]);
    if (existingResult.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "A blog post with this title or slug already exists.",
      });
    }

    const reading_time = calculateReadingTime(content);
    const author = req.user?.fullname || "Seatown Admin";
    const author_avatar = req.user?.fullname ? req.user.fullname.split(" ").map(n => n[0]).join("") : "SA";

    const publishedDate = status === "Published" ? new Date().toISOString() : (status === "Scheduled" ? published_at : null);

    const insertResult = await pool.query(
      `INSERT INTO blog (
        title, slug, category, excerpt, content, featured_image,
        author, author_avatar, status, published_at, reading_time,
        featured, seo_title, seo_description, tags
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
      RETURNING *`,
      [
        title, slug, category, excerpt, content, featured_image || null,
        author, author_avatar, status, publishedDate, reading_time,
        featured, seo_title || title, seo_description || excerpt, tags,
      ]
    );
    const newBlog = insertResult.rows[0];

    // Log action in audit logs
    await pool.query(
      `INSERT INTO audit_logs (user_id, username, action, details, ip_address)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        req.user?.id || null,
        req.user?.username || "System",
        "BLOG_CREATE",
        `Created blog post: "${title}" in status ${status}`,
        req.ip,
      ]
    );

    return res.status(201).json({
      success: true,
      message: "Blog post created successfully.",
      blog: newBlog,
    });
  } catch (err) {
    console.error("createBlog error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// Update blog post
export const updateBlog = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const {
      title,
      slug: customSlug,
      category,
      excerpt,
      content,
      featured_image,
      status,
      published_at,
      featured,
      seo_title,
      seo_description,
      tags,
    } = req.body;

    // Get current blog to verify
    const currentResult = await pool.query(`SELECT * FROM blog WHERE id = $1 LIMIT 1`, [id]);
    const currentBlog = currentResult.rows[0];

    if (!currentBlog) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found.",
      });
    }

    const updates: any = {};
    if (title !== undefined) updates.title = title;
    if (category !== undefined) updates.category = category;
    if (excerpt !== undefined) updates.excerpt = excerpt;
    if (content !== undefined) {
      updates.content = content;
      updates.reading_time = calculateReadingTime(content);
    }
    if (featured_image !== undefined) updates.featured_image = featured_image;
    if (featured !== undefined) updates.featured = featured;
    if (seo_title !== undefined) updates.seo_title = seo_title;
    if (seo_description !== undefined) updates.seo_description = seo_description;
    if (tags !== undefined) updates.tags = tags;

    // Handle slug update
    if (customSlug !== undefined && customSlug !== currentBlog.slug) {
      updates.slug = generateSlug(customSlug);
    } else if (title !== undefined && title !== currentBlog.title && !customSlug) {
      updates.slug = generateSlug(title);
    }

    // Check slug uniqueness if changed
    if (updates.slug && updates.slug !== currentBlog.slug) {
      const existingResult = await pool.query(
        `SELECT id FROM blog WHERE slug = $1 LIMIT 1`,
        [updates.slug]
      );
      if (existingResult.rows.length > 0) {
        return res.status(400).json({
          success: false,
          message: "A blog post with this title or slug already exists.",
        });
      }
    }

    // Handle status changes
    if (status !== undefined && status !== currentBlog.status) {
      updates.status = status;
      if (status === "Published") {
        updates.published_at = new Date().toISOString();
      } else if (status === "Scheduled") {
        updates.published_at = published_at;
      } else {
        updates.published_at = null;
      }
    } else if (status === "Scheduled" && published_at !== undefined) {
      updates.published_at = published_at;
    }

    updates.updated_at = new Date().toISOString();

    // Build dynamic SET clause
    const keys = Object.keys(updates);
    const setClauses = keys.map((k, i) => `${k} = $${i + 1}`);
    const values = keys.map(k => updates[k]);
    values.push(id);

    const updateResult = await pool.query(
      `UPDATE blog SET ${setClauses.join(", ")} WHERE id = $${values.length} RETURNING *`,
      values
    );
    const updatedBlog = updateResult.rows[0];

    // Log action in audit logs
    await pool.query(
      `INSERT INTO audit_logs (user_id, username, action, details, ip_address)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        req.user?.id || null,
        req.user?.username || "System",
        "BLOG_UPDATE",
        `Updated blog post: "${updatedBlog.title}"`,
        req.ip,
      ]
    );

    return res.status(200).json({
      success: true,
      message: "Blog post updated successfully.",
      blog: updatedBlog,
    });
  } catch (err) {
    console.error("updateBlog error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// Delete blog post
export const deleteBlog = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query(`SELECT title FROM blog WHERE id = $1 LIMIT 1`, [id]);
    const blogToDelete = result.rows[0];

    if (!blogToDelete) {
      return res.status(404).json({
        success: false,
        message: "Blog post not found.",
      });
    }

    await pool.query(`DELETE FROM blog WHERE id = $1`, [id]);

    // Log action in audit logs
    await pool.query(
      `INSERT INTO audit_logs (user_id, username, action, details, ip_address)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        req.user?.id || null,
        req.user?.username || "System",
        "BLOG_DELETE",
        `Deleted blog post: "${blogToDelete.title}"`,
        req.ip,
      ]
    );

    return res.status(200).json({
      success: true,
      message: "Blog post deleted successfully.",
    });
  } catch (err) {
    console.error("deleteBlog error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

// Get single published blog for public view
export const getPublicBlogBySlug = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const { slug } = req.params;

    const result = await pool.query(
      `SELECT * FROM blog WHERE slug = $1 AND status = 'Published' LIMIT 1`,
      [slug]
    );
    const blog = result.rows[0];

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found.",
      });
    }

    return res.status(200).json({
      success: true,
      blog,
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};