"use client";

import React, { useState, useEffect } from "react";
import HeroSection from "@/components/HeroSection";
import Link from "next/link";
import Image from "next/image";
import { Clock, ArrowRight, Loader2 } from "lucide-react";

interface Post {
  id: string | number;
  title: string;
  category: string;
  date: string;
  readTime: string | number;
  author: string;
  excerpt: string;
  avatar: string;
  image: string | null;
  slug?: string;
}

// FIX: same normalization used for review photos and the article page —
// a bare relative path (no leading slash, no protocol) crashes next/image.
function normalizeImagePath(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith("/") || path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  return `/${path}`;
}

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("/api/public/blogs");
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.blogs) && data.blogs.length > 0) {
            // Map API response to Post shape
            const mapped: Post[] = data.blogs.map((b: any) => ({
              id: b.id,
              title: b.title,
              category: b.category || "Industry News",
              date: new Date(b.published_at || b.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }),
              readTime: `${b.reading_time_minutes ?? b.readTime ?? 5} min read`,
              author: b.author_name || b.author || "Seatown Insights",
              excerpt: b.excerpt || b.meta_description || "",
              avatar: (b.author_name || b.author || "S")
                .split(" ")
                .map((n: string) => n[0])
                .join(""),
              // FIX: featured_image was never mapped here at all, so the
              // card had nothing to render even if the backend sent it.
              image: normalizeImagePath(b.featured_image || b.image),
              slug: b.slug,
            }));
            setAllPosts(mapped);
          }
        }
      } catch {
        // silently fall back to static data
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  if (!loading && allPosts.length === 0) {
    return (
      <div className = "flex justify-center items-center h-screen">
        <p className = "text-gray-400 text-lg">No blog posts available</p>
      </div>
    );
  }

  // Build category list dynamically from loaded posts
  const categories = ["All", ...Array.from(new Set(allPosts.map((p) => p.category)))];

  const filteredPosts = selectedCategory === "All"
    ? allPosts
    : allPosts.filter((p) => p.category === selectedCategory);

  return (
    <div className="w-full flex flex-col bg-white">
      <HeroSection 
        badge="Publications"
        title="Seatown Industry Insights & Logistics Blog"
        subtitle="Stay updated with global trade trends, customs brokerage guidelines, and maritime route analyses."
        bgImage="/blog.png"
      />

      {/* BLOG CONTENT SECTION */}
      <section className="py-20 bg-white relative overflow-hidden">
        {/* Globe & Trade Route Watermark */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <svg viewBox="0 0 1000 800" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[75%] max-w-3xl opacity-[0.025] mix-blend-multiply" xmlns="https://upload.wikimedia.org/wikipedia/commons/8/81/Ship.svg" fill="none" stroke="#0B1F3A" strokeWidth="12">
            {/* Globe outer circle */}
            <circle cx="500" cy="400" r="330"/>
            {/* Latitude lines */}
            <ellipse cx="500" cy="400" rx="330" ry="110"/>
            <ellipse cx="500" cy="400" rx="280" ry="90"/>
            <ellipse cx="500" cy="400" rx="165" ry="55"/>
            <ellipse cx="500" cy="250" rx="230" ry="75"/>
            <ellipse cx="500" cy="550" rx="230" ry="75"/>
            {/* Longitude lines */}
            <line x1="500" y1="70" x2="500" y2="730"/>
            <ellipse cx="500" cy="400" rx="165" ry="330"/>
            <ellipse cx="500" cy="400" rx="90" ry="330"/>
            {/* Trade route arc */}
            <path d="M200 320 Q400 180 680 280 Q820 320 870 400" strokeWidth="18" strokeLinecap="round" fill="none"/>
            <circle cx="200" cy="320" r="20" fill="#0B1F3A" stroke="none"/>
            <circle cx="870" cy="400" r="20" fill="#0B1F3A" stroke="none"/>
          </svg>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-0">
          
          {/* Category Filter Bar */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mb-14 relative z-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider border transition-all duration-300 cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-accent text-white border-accent shadow-sm scale-[1.02]"
                    : "bg-gray-50 text-gray-600 border-gray-100 hover:bg-gray-100 hover:border-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Blogs Grid */}
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              No posts available in this category yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <article key={post.id} className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group text-left">
                  {/* FIX: featured image thumbnail — this block did not
                      exist before, so no image ever rendered on any card
                      regardless of what was uploaded on the backend. */}
                  {post.image ? (
                    <div className="relative w-full aspect-[16/9] overflow-hidden bg-gray-50">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                    </div>
                  ) : (
                    <div className="w-full aspect-[16/9] bg-gray-50 flex items-center justify-center text-gray-300 text-xs font-bold uppercase tracking-wider">
                      No Image
                    </div>
                  )}

                  {/* Header Category Stripe */}
                  <div className="p-6 pb-0 flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-accent bg-accent/10 px-3 py-1 rounded-md">
                      {post.category}
                    </span>
                    <div className="flex items-center gap-1.5 text-gray-400 text-xs font-semibold">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{post.readTime}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="font-extrabold text-lg lg:text-xl text-primary mb-3 leading-snug group-hover:text-accent transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-gray-500 text-sm leading-relaxed mb-6 font-medium">
                        {post.excerpt}
                      </p>
                    </div>

                    {/* Footer Author & Date */}
                    <div className="border-t border-gray-100 pt-4 mt-auto flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center border border-primary/5">
                          {post.avatar}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-primary">{"Seatown"}</div>
                          <div className="text-[10px] font-semibold text-gray-400">{post.date}</div>
                        </div>
                      </div>

                      {post.slug ? (
                        <Link
                          href={`/blog/${post.slug}`}
                          className="text-accent hover:text-accent-hover font-bold uppercase tracking-wider text-[10px] flex items-center gap-1 group/link"
                        >
                          Read More <ArrowRight className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
                        </Link>
                      ) : (
                        <span className="text-accent font-bold uppercase tracking-wider text-[10px] flex items-center gap-1">
                          Read More <ArrowRight className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

        </div>
      </section>
    </div>
  );
}
