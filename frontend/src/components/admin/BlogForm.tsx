"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Quote,
  Link as LinkIcon,
  Image as ImageIcon,
  List,
  Eye,
  Edit,
  Loader2,
  FileText,
  Calendar,
  Globe,
  X,
  UploadCloud,
} from "lucide-react";

// Simple Regex-based Markdown to HTML parser
const parseMarkdown = (markdown: string): string => {
  let html = markdown;

  // Escaping HTML entities to prevent XSS in preview
  html = html
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3 class="text-base font-black text-primary mt-4 mb-2">$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2 class="text-lg font-black text-primary mt-5 mb-2.5">$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1 class="text-xl font-black text-primary mt-6 mb-3">$1</h1>');

  // Blockquotes
  html = html.replace(/^\> (.*$)/gim, '<blockquote class="border-l-4 border-accent bg-gray-50 pl-4 py-2 my-4 italic text-gray-600">$1</blockquote>');

  // Bold & Italic
  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");

  // Images
  html = html.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="rounded-2xl max-w-full my-6 border border-gray-100 shadow-sm" />');

  // Links
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" class="text-accent hover:underline font-bold">$1</a>');

  // Lists
  html = html.replace(/^\s*\-\s*(.*$)/gim, '<li class="list-disc ml-6 my-1 font-semibold text-gray-600">$1</li>');
  html = html.replace(/^\s*\*\s*(.*$)/gim, '<li class="list-disc ml-6 my-1 font-semibold text-gray-600">$1</li>');
  
  // Line breaks
  html = html.replace(/\n/g, "<br />");

  return html;
};

interface BlogFormProps {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  loading: boolean;
}

// FIX: same normalization used everywhere else on the site — a bare
// relative path (no leading slash, no protocol) resolves against the
// current page's URL instead of the site root, breaking the image.
function normalizeImagePath(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith("/") || path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  return `/${path}`;
}

export default function BlogForm({ initialData, onSubmit, loading }: BlogFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [category, setCategory] = useState(initialData?.category || "Shipping");
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [featuredImage, setFeaturedImage] = useState(initialData?.featured_image || "");
  const [status, setStatus] = useState(initialData?.status || "Draft");
  const [publishedAt, setPublishedAt] = useState(
    initialData?.published_at
      ? new Date(initialData.published_at).toISOString().slice(0, 16)
      : ""
  );
  const [featured, setFeatured] = useState(initialData?.featured || false);
  const [seoTitle, setSeoTitle] = useState(initialData?.seo_title || "");
  const [seoDescription, setSeoDescription] = useState(initialData?.seo_description || "");
  const [tagsInput, setTagsInput] = useState(
    initialData?.tags ? initialData.tags.join(", ") : ""
  );

  // Editor Mode: "write" or "preview"
  const [editorMode, setEditorMode] = useState<"write" | "preview">("write");
  
  // Media Modal State
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [mediaItems, setMediaItems] = useState<any[]>([]);
  const [mediaLoading, setMediaLoading] = useState(false);

  // FIX: upload state — nothing like this existed before, there was no way
  // to actually upload a new file, only pick from an already-populated list
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-generate slug from title
  useEffect(() => {
    if (!initialData && title) {
      const generated = title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");
      setSlug(generated);
    }
  }, [title, initialData]);

  // Load media files for the modal
  const fetchMedia = async () => {
    setMediaLoading(true);
    try {
      const res = await fetch("/api/proxy/media");
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setMediaItems(data.media);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setMediaLoading(false);
    }
  };

  const openMediaModal = () => {
    fetchMedia();
    setMediaModalOpen(true);
  };

  const handleSelectMedia = (url: string) => {
    setFeaturedImage(normalizeImagePath(url) || url);
    setMediaModalOpen(false);
  };

  // FIX: actual upload handler. Posts the file to the media endpoint as
  // multipart/form-data, then refreshes the library list and auto-selects
  // the newly uploaded image so the user doesn't have to hunt for it.
  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setUploadError("Please select an image file.");
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      // NOTE: field name assumed as "file" — confirm this matches what
      // your backend's media upload endpoint expects. If it expects a
      // different field name (e.g. "image", "media"), change it here.
      formData.append("file", file);

      const res = await fetch("/api/proxy/media", {
        method: "POST",
        body: formData,
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        setUploadError(data.message || "Upload failed. Please try again.");
        return;
      }

      // Refresh the library so the new file shows up in the grid
      await fetchMedia();

      // Auto-select the newly uploaded image if the backend returns it
      const uploadedUrl = data.media?.url || data.url;
      if (uploadedUrl) {
        setFeaturedImage(normalizeImagePath(uploadedUrl) || uploadedUrl);
        setMediaModalOpen(false);
      }
    } catch (err) {
      console.error(err);
      setUploadError("Server error while uploading. Please try again.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const insertMarkdown = (syntax: string) => {
    const textarea = document.getElementById("content-textarea") as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);

    let replacement = "";
    if (syntax === "bold") replacement = `**${selected || "bold text"}**`;
    else if (syntax === "italic") replacement = `*${selected || "italic text"}*`;
    else if (syntax === "h1") replacement = `# ${selected || "Heading 1"}`;
    else if (syntax === "h2") replacement = `## ${selected || "Heading 2"}`;
    else if (syntax === "quote") replacement = `> ${selected || "Blockquote"}`;
    else if (syntax === "link") replacement = `[${selected || "link text"}](https://example.com)`;
    else if (syntax === "list") replacement = `- ${selected || "list item"}`;
    else if (syntax === "image") replacement = `![${selected || "image description"}](https://example.com/image.png)`;

    const newContent = text.substring(0, start) + replacement + text.substring(end);
    setContent(newContent);

    // Refocus & set selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + replacement.length, start + replacement.length);
    }, 50);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tags = tagsInput
      .split(",")
      .map((t: string) => t.trim())
      .filter(Boolean);

    onSubmit({
      title,
      slug,
      category,
      excerpt,
      content,
      featured_image: featuredImage,
      status,
      published_at: status === "Scheduled" ? new Date(publishedAt).toISOString() : null,
      featured,
      seo_title: seoTitle || title,
      seo_description: seoDescription || excerpt,
      tags,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 text-left max-w-5xl">
      {/* Save Button Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-wrap items-center justify-between gap-4 top-20 z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/5 text-primary flex items-center justify-center">
            <FileText size={18} />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-primary uppercase tracking-wide">
              {initialData ? "Edit Article" : "Compose New Article"}
            </h3>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              {status === "Published" ? "Published" : status === "Scheduled" ? "Scheduled" : "Draft Mode"}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => router.push("/dashboard/blog")}
            className="h-10 px-4 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="h-10 px-6 bg-accent hover:brightness-110 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg shadow-accent/15 cursor-pointer"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : "Save Article"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Article Body (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title and Slug */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1.5">
                Article Title
              </label>
              <input
                type="text"
                required
                placeholder="Enter a descriptive shipping or logistics title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full h-12 px-4 bg-gray-50 rounded-xl border border-gray-200 focus:border-accent outline-none text-sm font-extrabold text-primary"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1.5">
                URL Slug
              </label>
              <input
                type="text"
                required
                placeholder="slug-url-format"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full h-11 px-4 bg-gray-50 rounded-xl border border-gray-200 focus:border-accent outline-none text-xs font-semibold text-gray-500 font-mono"
              />
            </div>
          </div>

          {/* Split-Screen Markdown Editor */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-[550px]">
            {/* Editor Toolbar */}
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => insertMarkdown("bold")} className="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-lg cursor-pointer" title="Bold">
                  <Bold size={16} />
                </button>
                <button type="button" onClick={() => insertMarkdown("italic")} className="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-lg cursor-pointer" title="Italic">
                  <Italic size={16} />
                </button>
                <button type="button" onClick={() => insertMarkdown("h1")} className="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-lg cursor-pointer" title="Header 1">
                  <Heading1 size={16} />
                </button>
                <button type="button" onClick={() => insertMarkdown("h2")} className="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-lg cursor-pointer" title="Header 2">
                  <Heading2 size={16} />
                </button>
                <button type="button" onClick={() => insertMarkdown("quote")} className="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-lg cursor-pointer" title="Blockquote">
                  <Quote size={16} />
                </button>
                <button type="button" onClick={() => insertMarkdown("link")} className="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-lg cursor-pointer" title="Insert Link">
                  <LinkIcon size={16} />
                </button>
                <button type="button" onClick={() => insertMarkdown("list")} className="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-lg cursor-pointer" title="Bullet List">
                  <List size={16} />
                </button>
                <button type="button" onClick={() => insertMarkdown("image")} className="p-2 text-gray-500 hover:text-primary hover:bg-gray-100 rounded-lg cursor-pointer" title="Insert Image Link">
                  <ImageIcon size={16} />
                </button>
              </div>

              {/* Write vs Preview Toggle */}
              <div className="flex bg-gray-200/60 p-0.5 rounded-lg">
                <button
                  type="button"
                  onClick={() => setEditorMode("write")}
                  className={`px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors ${
                    editorMode === "write" ? "bg-white text-primary shadow-xs" : "text-gray-500"
                  }`}
                >
                  <Edit size={12} /> Write
                </button>
                <button
                  type="button"
                  onClick={() => setEditorMode("preview")}
                  className={`px-3 py-1.5 rounded-md text-[10px] font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors ${
                    editorMode === "preview" ? "bg-white text-primary shadow-xs" : "text-gray-500"
                  }`}
                >
                  <Eye size={12} /> Preview
                </button>
              </div>
            </div>

            {/* Editor Body */}
            <div className="flex-1 flex overflow-hidden bg-white">
              {editorMode === "write" ? (
                <textarea
                  id="content-textarea"
                  required
                  placeholder="Draft your article in Markdown..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full h-full p-6 outline-none text-xs font-semibold font-sans leading-relaxed text-gray-700 resize-none"
                />
              ) : (
                <div
                  className="w-full h-full p-6 overflow-y-auto prose max-w-none text-xs font-semibold leading-relaxed text-left text-gray-700"
                  dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}
                />
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Settings & SEO Metadata (1 col) */}
        <div className="space-y-6">
          {/* Publication settings */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-primary pb-2.5 border-b border-gray-100">
              Publication Settings
            </h3>
            
            {/* Category */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-11 px-4 bg-gray-50 rounded-xl border border-gray-200 focus:border-accent outline-none text-xs font-semibold"
              >
                <option value="Shipping">Shipping</option>
                <option value="Logistics">Logistics</option>
                <option value="Freight">Freight</option>
                <option value="Industry News">Industry News</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1.5">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full h-11 px-4 bg-gray-50 rounded-xl border border-gray-200 focus:border-accent outline-none text-xs font-semibold"
              >
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
                <option value="Scheduled">Scheduled</option>
              </select>
            </div>

            {/* Scheduled Publish Date */}
            {status === "Scheduled" && (
              <div className="animate-fade-in">
                <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1.5 flex items-center gap-1">
                  <Calendar size={12} className="text-accent" /> Date & Time to Publish
                </label>
                <input
                  type="datetime-local"
                  required={status === "Scheduled"}
                  value={publishedAt}
                  onChange={(e) => setPublishedAt(e.target.value)}
                  className="w-full h-11 px-4 bg-gray-50 rounded-xl border border-gray-200 focus:border-accent outline-none text-xs font-semibold text-gray-600"
                />
              </div>
            )}

            {/* Featured Post Toggle */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 mt-2">
              <div>
                <p className="text-xs font-extrabold text-primary">Featured Post</p>
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">
                  Pin to top of blog page
                </p>
              </div>
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 text-accent accent-accent rounded border-gray-300 focus:ring-accent"
              />
            </div>
          </div>

          {/* Featured Image */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-primary pb-2.5 border-b border-gray-100 flex items-center justify-between">
              <span>Featured Image</span>
              <button
                type="button"
                onClick={openMediaModal}
                className="text-[9px] font-black text-accent hover:text-accent-hover uppercase tracking-wider cursor-pointer"
              >
                Media Library
              </button>
            </h3>

            {featuredImage ? (
              <div className="space-y-3">
                <img
                  src={featuredImage}
                  alt="Featured preview"
                  className="w-full h-36 object-cover rounded-xl border border-gray-100 shadow-xs"
                />
                <div className="relative">
                  <input
                    type="text"
                    value={featuredImage}
                    onChange={(e) => setFeaturedImage(e.target.value)}
                    className="w-full h-10 px-3 pr-16 bg-gray-50 rounded-lg border border-gray-200 text-[10px] font-semibold font-mono text-gray-400 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setFeaturedImage("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-[9px] font-black text-red-500 hover:text-red-700 uppercase tracking-wider cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={openMediaModal}
                className="h-32 border-2 border-dashed border-gray-200 hover:border-accent hover:bg-gray-50/50 rounded-xl flex flex-col items-center justify-center text-gray-400 cursor-pointer transition-all"
              >
                <ImageIcon className="w-8 h-8 mb-2 text-gray-300" />
                <span className="text-[10px] font-black uppercase tracking-wider">
                  Select Featured Image
                </span>
              </div>
            )}
          </div>

          {/* SEO Metadata */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-primary pb-2.5 border-b border-gray-100 flex items-center gap-1">
              <Globe size={14} className="text-accent" /> SEO Metadata
            </h3>
            
            {/* Meta Title */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1.5">
                SEO Title
              </label>
              <input
                type="text"
                placeholder={title || "Custom SEO Title..."}
                value={seoTitle}
                onChange={(e) => setSeoTitle(e.target.value)}
                className="w-full h-11 px-4 bg-gray-50 rounded-xl border border-gray-200 focus:border-accent outline-none text-xs font-semibold"
              />
            </div>

            {/* Meta Description */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1.5">
                SEO Description
              </label>
              <textarea
                rows={3}
                placeholder={excerpt || "Custom SEO Description..."}
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 focus:border-accent outline-none text-xs font-semibold resize-none"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1.5">
                Tags (comma separated)
              </label>
              <input
                type="text"
                placeholder="shipping, logistics, feebler-routes"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full h-11 px-4 bg-gray-50 rounded-xl border border-gray-200 focus:border-accent outline-none text-xs font-semibold"
              />
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-gray-400 mb-1.5">
                Article Excerpt
              </label>
              <textarea
                rows={3}
                required
                placeholder="Summarize the article for card previews..."
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 focus:border-accent outline-none text-xs font-semibold resize-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Media Selector Modal */}
      {mediaModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl border border-gray-100 p-6 text-left relative flex flex-col h-[80vh]">
            <button
              onClick={() => setMediaModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-primary cursor-pointer"
            >
              <X size={20} />
            </button>
            
            <h2 className="text-xl font-black text-[#0B1F3A] mb-4">Select Image from Media Library</h2>

            {/* FIX: actual upload control — this entire block did not exist
                before. Without it there was no way to add a new image; the
                modal could only ever show files that already existed. */}
            <div className="mb-5">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-full h-24 border-2 border-dashed border-accent/40 hover:border-accent hover:bg-accent/5 rounded-xl flex flex-col items-center justify-center gap-2 text-accent transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span className="text-[10px] font-black uppercase tracking-wider">
                      Uploading...
                    </span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-6 h-6" />
                    <span className="text-[10px] font-black uppercase tracking-wider">
                      Click to Upload New Image
                    </span>
                  </>
                )}
              </button>
              {uploadError && (
                <p className="mt-2 text-[10px] font-bold text-red-500">{uploadError}</p>
              )}
            </div>
            
            {mediaLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Retrieving media assets...
                </p>
              </div>
            ) : mediaItems.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-gray-400 text-center text-xs font-semibold px-8">
                No media uploaded yet. Use the upload button above to add your first image.
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-4 gap-4 p-1">
                {mediaItems
                  .filter((item) => item.mimeType.startsWith("image/"))
                  .map((item) => {
                    const thumbSrc = normalizeImagePath(item.url);
                    return (
                      <div
                        key={item.name}
                        onClick={() => handleSelectMedia(item.url)}
                        className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden cursor-pointer group hover:border-accent hover:shadow-md transition-all flex flex-col"
                      >
                        <div className="h-28 bg-white border-b border-gray-100 overflow-hidden relative">
                          {thumbSrc && (
                            <img
                              src={thumbSrc}
                              alt={item.originalName || item.name}
                              className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                            />
                          )}
                        </div>
                        <div className="p-2.5 truncate text-left">
                          <p className="text-[10px] font-extrabold text-primary truncate">
                            {item.name}
                          </p>
                          <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">
                            {(item.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      )}
    </form>
  );
}
