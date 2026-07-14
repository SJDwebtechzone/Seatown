// import express from "express";
// import { supabase } from "../config/db";
// import { upload } from "../middleware/upload";
// import { createReview } from "../controllers/review.controller";

// const router = express.Router();

// // 1. Get published blog posts
// router.get("/blogs", async (req, res) => {
//   try {
//     const { category, limit = "10" } = req.query;
//     const limitNum = parseInt(limit as string, 10);

//     let query = supabase
//       .from("blog")
//       .select("*")
//       .eq("status", "Published");

//     if (category && category !== "All") {
//       query = query.eq("category", category);
//     }

//     const { data: blogs, error } = await query
//       .order("published_at", { ascending: false })
//       .limit(limitNum);

//     if (error) {
//       return res.status(500).json({ success: false, error });
//     }

//     return res.status(200).json({ success: true, blogs });
//   } catch (err) {
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// });

// // 2. Get single published blog post by slug
// router.get("/blogs/:slug", async (req, res) => {
//   try {
//     const { slug } = req.params;

//     const { data: blog, error } = await supabase
//       .from("blog")
//       .select("*")
//       .eq("slug", slug)
//       .eq("status", "Published")
//       .maybeSingle();

//     if (error) {
//       return res.status(500).json({ success: false, error });
//     }

//     if (!blog) {
//       return res.status(404).json({ success: false, message: "Blog post not found" });
//     }

//     return res.status(200).json({ success: true, blog });
//   } catch (err) {
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// });

// // 3. Get approved reviews
// router.get("/reviews", async (req, res) => {
//   try {
//     const { data: reviews, error } = await supabase
//       .from("review")
//       .select("*")
//       .eq("status", "Approved")
//       .order("created_at", { ascending: false });

//     if (error) {
//       return res.status(500).json({ success: false, error });
//     }

//     return res.status(200).json({ success: true, reviews });
//   } catch (err) {
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// });

// // 3b. Submit a new review (public, handled by createReview controller with photo upload)
// router.post("/reviews", upload.single("photo"), createReview);

// // 4. Get all website content CMS keys
// router.get("/content", async (req, res) => {
//   try {
//     const { data, error } = await supabase
//       .from("website_content")
//       .select("*");

//     if (error) {
//       return res.status(500).json({ success: false, error });
//     }

//     // Convert list to key-value object
//     const content: Record<string, any> = {};
//     data?.forEach((item) => {
//       content[item.key] = item.value;
//     });

//     return res.status(200).json({ success: true, content });
//   } catch (err) {
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// });

// // 5. Submit contact inquiry
// router.post("/contacts", async (req, res) => {
//   try {
//     const { name, email, phone, service, message } = req.body;

//     if (!name || !email || !message) {
//       return res.status(400).json({
//         success: false,
//         message: "Name, email, and message are required.",
//       });
//     }

//     const { data: inquiry, error } = await supabase
//       .from("contact_inquiries")
//       .insert({
//         name,
//         email,
//         phone,
//         service: service || "General",
//         message,
//         status: "Open",
//       })
//       .select("*")
//       .single();

//     if (error) {
//       return res.status(500).json({ success: false, error });
//     }

//     return res.status(201).json({
//       success: true,
//       message: "Your inquiry has been submitted successfully.",
//       inquiry,
//     });
//   } catch (err) {
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// });

// export default router;


 import express from "express";
import nodemailer from "nodemailer";
import pool from "../config/db";
import { upload } from "../middleware/upload";
import { createReview } from "../controllers/review.controller";

const router = express.Router();

// FIX: Nodemailer transporter for sending contact-form notification emails.
// Uses a Gmail App Password (not your real Gmail password) via env vars.
// Add these to your backend .env file:
//   EMAIL_USER=youraddress@gmail.com
//   EMAIL_PASS=your16characterapppassword
//   EMAIL_TO=james@seatown.in
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 1. Get published blog posts
router.get("/blogs", async (req, res) => {
  try {
    const { category, limit = "10" } = req.query;
    const limitNum = parseInt(limit as string, 10);

    let queryText = `SELECT * FROM blog WHERE status = 'Published'`;
    const params: any[] = [];

    if (category && category !== "All") {
      params.push(category);
      queryText += ` AND category = $${params.length}`;
    }

    params.push(limitNum);
    queryText += ` ORDER BY published_at DESC LIMIT $${params.length}`;

    const result = await pool.query(queryText, params);

    return res.status(200).json({ success: true, blogs: result.rows });
  } catch (err) {
    console.error("GET /blogs error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// 2. Get single published blog post by slug
router.get("/blogs/:slug", async (req, res) => {
  try {
    const { slug } = req.params;

    const result = await pool.query(
      `SELECT * FROM blog WHERE slug = $1 AND status = 'Published' LIMIT 1`,
      [slug]
    );

    const blog = result.rows[0];

    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog post not found" });
    }

    return res.status(200).json({ success: true, blog });
  } catch (err) {
    console.error("GET /blogs/:slug error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// 3. Get approved reviews
router.get("/reviews", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM review WHERE status = 'Approved' ORDER BY created_at DESC`
    );

    return res.status(200).json({ success: true, reviews: result.rows });
  } catch (err) {
    console.error("GET /reviews error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// 3b. Submit a new review (public, handled by createReview controller with photo upload)
router.post("/reviews", upload.single("photo"), createReview);

// 4. Get all website content CMS keys
router.get("/content", async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM website_content`);

    // Convert list to key-value object
    const content: Record<string, any> = {};
    result.rows.forEach((item) => {
      content[item.key] = item.value;
    });

    return res.status(200).json({ success: true, content });
  } catch (err) {
    console.error("GET /content error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// 5. Submit contact inquiry
router.post("/contacts", async (req, res) => {
  try {
    const { name, email, phone, service, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and message are required.",
      });
    }

    const result = await pool.query(
      `INSERT INTO contact_inquiries (name, email, phone, service, message, status)
       VALUES ($1, $2, $3, $4, $5, 'Open')
       RETURNING *`,
      [name, email, phone || null, service || "General", message]
    );

    // FIX: send an email notification after the inquiry is saved.
    // Wrapped in its own try/catch so an email failure (bad credentials,
    // Gmail rate limit, network blip) never breaks the actual form
    // submission — the inquiry is already safely in the database by
    // this point regardless of what happens here.
    try {
      await transporter.sendMail({
        from: `"Seatown Website" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_TO,
        replyTo: email,
        subject: `New Inquiry: ${service || "General"} — ${name}`,
        html: `
          <h3>New Contact Form Submission</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
          <p><strong>Service:</strong> ${service || "General"}</p>
          <p><strong>Message:</strong><br/>${message}</p>
        `,
      });
    } catch (emailErr) {
      console.error("Failed to send contact notification email:", emailErr);
      // Intentionally not returning an error response here — the
      // inquiry itself was saved successfully above.
    }

    return res.status(201).json({
      success: true,
      message: "Your inquiry has been submitted successfully.",
      inquiry: result.rows[0],
    });
  } catch (err) {
    console.error("POST /contacts error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;