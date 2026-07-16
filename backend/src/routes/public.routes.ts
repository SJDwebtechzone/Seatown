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
import { Resend } from "resend";
import pool from "../config/db";
import { upload } from "../middleware/upload";
import { createReview } from "../controllers/review.controller";

const router = express.Router();

// FIX: switched from Gmail SMTP (Nodemailer) to Resend. Render blocks
// outbound SMTP traffic on its free tier (common on cloud hosts, to
// prevent spam abuse), which caused every email attempt to hang and then
// fail with ETIMEDOUT on the connection stage — never even reaching
// Gmail. Resend sends over regular HTTPS (port 443), which is never
// blocked, so this works reliably in production.
//
// Add this to your backend .env / Render environment variables:
//   RESEND_API_KEY=re_your_key_here
//
// NOTE: while using Resend's shared test domain (onboarding@resend.dev),
// you can only send TO the email address you signed up with on Resend.
// To send to any recipient, verify your own domain in the Resend
// dashboard and change the "from" address below to use it.
const resend = new Resend(process.env.RESEND_API_KEY);

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

    // Send an email notification after the inquiry is saved. Wrapped in
    // its own try/catch so an email failure never breaks the actual form
    // submission — the inquiry is already safely in the database by this
    // point regardless of what happens here.
    try {
      const { data, error } = await resend.emails.send({
        // Using Resend's shared test domain for now — see NOTE above
        // about verifying your own domain to send to any recipient.
        from: "Seatown Website <onboarding@resend.dev>",
        to: process.env.EMAIL_TO as string,
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

      if (error) {
        console.error("Resend email error:", error);
      } else {
        console.log("Email sent via Resend:", data);
      }
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