"use client";

import React, { useState, useEffect } from "react";
import { useToast } from "@/app/(admin)/dashboard/layout";
import {
  MessageSquare,
  CheckCircle,
  XCircle,
  Trash2,
  AlertTriangle,
  Search,
  Star,
  Quote,
  Loader2,
  Eye,
  CheckSquare,
  Square,
} from "lucide-react";

interface Review {
  id: string;
  fullname: string;
  role: string;
  review: string;
  image_url: string | null;
  status: "Pending" | "Approved" | "Rejected" | "Spam";
  created_at: string;
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

export default function ReviewModeration() {
  const { showToast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusTab, setStatusTab] = useState<"Pending" | "Approved" | "Rejected" | "Spam">("Pending");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Selection for bulk actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [previewReview, setPreviewReview] = useState<Review | null>(null);
  const [mutationLoading, setMutationLoading] = useState(false);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        status: statusTab,
        search,
        page: page.toString(),
        limit: "10",
      });

      const res = await fetch(`/api/proxy/review/admin?${query.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setReviews(data.reviews);
          setTotalPages(data.pagination.pages);
        }
      } else {
        showToast("Failed to fetch reviews.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Server error fetching reviews.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
    setSelectedIds([]);
    setPreviewReview(null);
  }, [statusTab, search, page]);

  const handleUpdateStatus = async (id: string, nextStatus: string) => {
    try {
      const res = await fetch(`/api/proxy/review/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        showToast(`Review status updated to ${nextStatus}`, "success");
        fetchReviews();
      } else {
        showToast(data.message || "Failed to update review status", "error");
      }
    } catch (err) {
      showToast("Server error updating status", "error");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/proxy/review/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (res.ok && data.success) {
        showToast("Review deleted successfully.", "success");
        fetchReviews();
      } else {
        showToast(data.message || "Failed to delete review", "error");
      }
    } catch (err) {
      showToast("Server error deleting review", "error");
    }
  };

  const handleBulkAction = async (action: "Approve" | "Reject" | "Delete" | "Spam") => {
    if (selectedIds.length === 0) return;
    setMutationLoading(true);
    try {
      const res = await fetch("/api/proxy/review/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selectedIds, action }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        showToast(`Successfully performed bulk action: ${action}`, "success");
        setSelectedIds([]);
        fetchReviews();
      } else {
        showToast(data.message || "Failed to execute bulk action", "error");
      }
    } catch (err) {
      showToast("Server error executing bulk action", "error");
    } finally {
      setMutationLoading(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === reviews.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(reviews.map((r) => r.id));
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-[#0B1F3A]">Review Moderation</h1>
        <p className="text-xs text-gray-500 font-semibold mt-1">
          Approve or reject customer testimonials for display on the public landing page.
        </p>
      </div>

      {/* Tabs Row */}
      <div className="flex border-b border-gray-200 gap-2 overflow-x-auto">
        {(["Pending", "Approved", "Rejected", "Spam"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setStatusTab(tab);
              setPage(1);
            }}
            className={`pb-3 px-4 text-xs font-black uppercase tracking-wider border-b-2 transition-colors cursor-pointer ${
              statusTab === tab
                ? "border-accent text-accent"
                : "border-transparent text-gray-400 hover:text-primary"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Area: Table & Actions (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Controls */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search reviews by name or text..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full h-10 bg-gray-50 hover:bg-gray-100/50 focus:bg-white rounded-xl border border-gray-200 focus:border-accent pl-11 pr-4 outline-none text-xs text-primary font-semibold transition-all"
              />
            </div>

            {/* Bulk Actions */}
            {selectedIds.length > 0 && (
              <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 animate-fade-in">
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 mr-2">
                  {selectedIds.length} selected
                </span>
                {statusTab !== "Approved" && (
                  <button
                    onClick={() => handleBulkAction("Approve")}
                    disabled={mutationLoading}
                    className="h-9 px-3 bg-green-600 hover:bg-green-700 text-white rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle size={12} /> Approve
                  </button>
                )}
                {statusTab !== "Rejected" && (
                  <button
                    onClick={() => handleBulkAction("Reject")}
                    disabled={mutationLoading}
                    className="h-9 px-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                  >
                    <XCircle size={12} /> Reject
                  </button>
                )}
                {statusTab !== "Spam" && (
                  <button
                    onClick={() => handleBulkAction("Spam")}
                    disabled={mutationLoading}
                    className="h-9 px-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                  >
                    <AlertTriangle size={12} /> Spam
                  </button>
                )}
                <button
                  onClick={() => handleBulkAction("Delete")}
                  disabled={mutationLoading}
                  className="h-9 px-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            )}
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Loading testimonials...
                </p>
              </div>
            ) : reviews.length === 0 ? (
              <div className="py-20 text-center text-gray-400">
                No reviews found in this category.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/75 text-[10px] font-black uppercase tracking-wider text-gray-400">
                      <th className="w-12 px-6 py-4">
                        <button onClick={toggleSelectAll} className="text-gray-400 hover:text-primary cursor-pointer">
                          {selectedIds.length === reviews.length ? (
                            <CheckSquare size={16} className="text-accent" />
                          ) : (
                            <Square size={16} />
                          )}
                        </button>
                      </th>
                      <th className="px-6 py-4">Reviewer</th>
                      <th className="px-6 py-4">Review Text</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs font-semibold text-gray-700">
                    {reviews.map((review) => {
                      const imgSrc = normalizeImagePath(review.image_url);
                      return (
                        <tr
                          key={review.id}
                          className={`hover:bg-gray-50/50 transition-colors ${
                            previewReview?.id === review.id ? "bg-accent/5" : ""
                          }`}
                        >
                          <td className="px-6 py-4">
                            <button
                              onClick={() => toggleSelect(review.id)}
                              className="text-gray-400 hover:text-primary cursor-pointer"
                            >
                              {selectedIds.includes(review.id) ? (
                                <CheckSquare size={16} className="text-accent" />
                              ) : (
                                <Square size={16} />
                              )}
                            </button>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                                {imgSrc ? (
                                  <img
                                    src={imgSrc}
                                    alt={review.fullname}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center font-black text-primary bg-primary/5">
                                    {review.fullname.charAt(0)}
                                  </div>
                                )}
                              </div>
                              <div>
                                <p className="font-extrabold text-primary">{review.fullname}</p>
                                <p className="text-gray-400 text-[9px] font-bold uppercase tracking-wider">
                                  {review.role}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 max-w-xs">
                            <p className="line-clamp-2 text-gray-500 font-medium">"{review.review}"</p>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-1">
                              <button
                                onClick={() => setPreviewReview(review)}
                                className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-primary cursor-pointer"
                                title="Preview Testimonial"
                              >
                                <Eye size={14} />
                              </button>
                              {statusTab !== "Approved" && (
                                <button
                                  onClick={() => handleUpdateStatus(review.id, "Approved")}
                                  className="w-8 h-8 rounded-lg hover:bg-green-50 flex items-center justify-center text-gray-400 hover:text-green-600 cursor-pointer"
                                  title="Approve Review"
                                >
                                  <CheckCircle size={14} />
                                </button>
                              )}
                              {statusTab !== "Rejected" && (
                                <button
                                  onClick={() => handleUpdateStatus(review.id, "Rejected")}
                                  className="w-8 h-8 rounded-lg hover:bg-yellow-50 flex items-center justify-center text-gray-400 hover:text-yellow-600 cursor-pointer"
                                  title="Reject Review"
                                >
                                  <XCircle size={14} />
                                </button>
                              )}
                              {statusTab !== "Spam" && (
                                <button
                                  onClick={() => handleUpdateStatus(review.id, "Spam")}
                                  className="w-8 h-8 rounded-lg hover:bg-purple-50 flex items-center justify-center text-gray-400 hover:text-purple-600 cursor-pointer"
                                  title="Mark as Spam"
                                >
                                  <AlertTriangle size={14} />
                                </button>
                              )}
                              <button
                                onClick={() => handleDelete(review.id)}
                                className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center text-gray-400 hover:text-red-600 cursor-pointer"
                                title="Delete Review"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
                <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                  Page {page} of {totalPages}
                </span>
                <div className="flex gap-2">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="px-3.5 py-1.5 bg-white border border-gray-200 text-primary hover:bg-gray-50 disabled:opacity-50 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer"
                  >
                    Prev
                  </button>
                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                    className="px-3.5 py-1.5 bg-white border border-gray-200 text-primary hover:bg-gray-50 disabled:opacity-50 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Area: Exact Website Testimonial Preview (1 col) */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col h-[500px]">
          <h3 className="font-extrabold text-xs uppercase tracking-wider text-primary pb-3 border-b border-gray-100 flex items-center gap-2">
            <Eye size={16} className="text-accent" /> Testimonial Live Preview
          </h3>
          
          <div className="flex-1 flex items-center justify-center bg-gray-50/75 rounded-2xl border border-gray-100 mt-4 p-4">
            {previewReview ? (
              /* EXACT CAROUSEL CARD FROM WEBSITE (TestimonialSection.tsx) */
              <div className="w-full max-w-sm bg-white border border-gray-200 rounded-3xl p-8 relative shadow-xl text-left transform scale-95 transition-all">
                {/* Quote Icon */}
                <div className="absolute top-6 right-8 text-accent/15">
                  <Quote size={56} className="rotate-180 fill-current" />
                </div>

                {/* Rating Stars */}
                <div className="flex gap-1 mb-5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="fill-accent text-accent" />
                  ))}
                </div>

                {/* Testimonial Text */}
                <p className="text-[#0B1F3A]/85 text-xs font-semibold leading-relaxed mb-6 italic min-h-[90px]">
                  "{previewReview.review}"
                </p>

                {/* Reviewer Details */}
                <div className="flex items-center gap-4 border-t border-gray-100 pt-4 mt-auto">
                  <div className="w-11 h-11 rounded-full overflow-hidden bg-primary/10 border border-primary/5 shrink-0">
                    {normalizeImagePath(previewReview.image_url) ? (
                      <img
                        src={normalizeImagePath(previewReview.image_url)!}
                        alt={previewReview.fullname}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-sm text-primary">
                        {previewReview.fullname.split(" ").map((n) => n[0]).join("")}
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-black text-xs text-primary leading-tight">
                      {previewReview.fullname}
                    </h4>
                    <p className="text-[10px] font-bold text-accent uppercase tracking-wider mt-0.5">
                      {previewReview.role}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400 max-w-xs">
                <Eye className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-[10px] font-black uppercase tracking-wider">
                  Select a review row and click the eye icon to preview it exactly as it will appear on the Seatown website.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
