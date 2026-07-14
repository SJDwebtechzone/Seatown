"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Star, Quote, Anchor, Ship, Globe, ChevronRight, ChevronLeft } from "lucide-react";
import Image from "next/image";

const servicesList = [
  "Ocean Freight Forwarding",
  "Air Freight Logistics",
  "Customs Brokerage",
  "NVOCC Operations",
  "Project Cargo Handling",
  "Warehousing & Distribution",
  "Supply Chain Management",
  "Door-to-Door Delivery"
];

interface Testimonial {
  id: string;
  name: string;
  company: string;
  rating: number;
  text: string;
  image: string | null;
  country?: string;
}

export default function TestimonialSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Kept for potential future use (currently unused in render, commented out below where it was before)
  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loadingTestimonials, setLoadingTestimonials] = useState(true);
  const active = testimonials[activeIndex];

  // FIX #6: Math.random() differs between server render and client hydration,
  // causing a hydration mismatch. Only render the randomized particles after
  // mount, once we're guaranteed to be running client-side.
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [reviewForm, setReviewForm] = useState({
    fullname: "",
    role: "",
    review: "",
    photo: null as File | null,
  });

  // Auto-rotate testimonials
  useEffect(() => {
    if (testimonials.length === 0) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  // Load testimonials from API
  useEffect(() => {
    const loadTestimonials = async () => {
      try {
        // FIX #1: added leading slash so this resolves from site root,
        // not relative to the current page path
        const res = await fetch("/api/proxy/review?approved=true");

        if (!res.ok) {
          console.error("Failed to load testimonials:", res.status);
          return;
        }

        const data = await res.json();

        if (data.success && Array.isArray(data.reviews)) {
          const formatted: Testimonial[] = data.reviews.map((item: any) => {
            // FIX #7: backend sometimes stores image_url as a bare relative
            // path (e.g. "uploads/reviews/x.jpg") with no leading slash and
            // no protocol, which crashes next/image's URL parsing. Normalize
            // it here as a safety net regardless of what the backend sends.
            let image: string | null = item.image_url || null;
            if (image && !image.startsWith("/") && !image.startsWith("http://") && !image.startsWith("https://")) {
              image = `/${image}`;
            }

            return {
              id: item.id,
              name: item.fullname,
              company: item.role,
              rating: 5,
              text: item.review,
              image,
              country: item.country || "",
            };
          });
          setTestimonials(formatted);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingTestimonials(false);
      }
    };

    loadTestimonials();
  }, []);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleReviewSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("fullname", reviewForm.fullname);
      formData.append("role", reviewForm.role);
      formData.append("review", reviewForm.review);

      if (reviewForm.photo) {
        formData.append("photo", reviewForm.photo);
      }

      const response = await fetch("/api/proxy/review", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        alert(result.message || "Failed to submit review.");
        return;
      }

      // Success
      setSubmitted(true);

      setTimeout(() => {
        setSubmitted(false);
        setShowReviewForm(false);

        setReviewForm({
          fullname: "",
          role: "",
          review: "",
          photo: null,
        });
      }, 1800);
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative w-full overflow-hidden bg-gradient-to-br from-white via-slate-50 to-zinc-100 py-24 lg:py-32"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg')] bg-no-repeat bg-center bg-cover opacity-[0.03] mix-blend-multiply"></div>

        <div className="absolute inset-0 overflow-hidden">
          {isMounted &&
            [...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 bg-blue-500 rounded-full blur-[1px]"
                initial={{
                  x: `${Math.random() * 100}vw`,
                  y: `${Math.random() * 100}vh`,
                  opacity: Math.random() * 0.3 + 0.1
                }}
                animate={{
                  y: [null, Math.random() * -200 - 100],
                  opacity: [null, 0.8, 0],
                }}
                transition={{
                  duration: Math.random() * 10 + 10,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            ))}
        </div>

        <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <motion.path
            d="M 100 800 Q 400 400 800 600 T 1500 200"
            fill="transparent"
            stroke="rgba(0, 102, 204, 0.1)"
            strokeWidth="2"
            strokeDasharray="10 10"
            initial={{ strokeDashoffset: 0 }}
            animate={{ strokeDashoffset: 100 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />
          <motion.path
            d="M 0 300 Q 500 100 1000 500 T 2000 400"
            fill="transparent"
            stroke="rgba(0, 102, 204, 0.05)"
            strokeWidth="1.5"
            strokeDasharray="5 15"
            initial={{ strokeDashoffset: 100 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          />
        </svg>
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        {/* Header Area */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16 md:mb-24 flex flex-col items-start"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="w-10 h-[1px] bg-secondary"></span>
            <span className="text-secondary text-sm md:text-base font-black tracking-[0.2em] uppercase">
              Client Success Stories
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-primary mb-6 leading-tight max-w-3xl">
            Trusted By Global <span className="text-accent">Shipping Partners</span>
          </h2>
          <p className="text-gray-500 text-lg md:text-xl max-w-2xl font-semibold">
            Real experiences from importers, exporters, freight partners, and industrial clients worldwide.
          </p>
        </motion.div>

        {/* FIX #2: loading / empty / content states now share the same layout wrapper,
            so the Write Review button is ALWAYS reachable, even with 0 testimonials.
            FIX #5: switched from items-center to items-stretch so both columns
            match height, and removed absolute positioning that was breaking layout. */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-stretch">
          {/* Left Side: Stats Card (always shown) */}
          <motion.div className="lg:col-span-5 relative flex">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-400/10 blur-[100px] rounded-full pointer-events-none"></div>

            <div className="relative rounded-3xl border border-gray-200 bg-white/60 backdrop-blur-2xl p-8 md:p-12 shadow-xl shadow-gray-200/50 overflow-hidden group w-full flex flex-col">
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity duration-700">
                <Globe size={180} strokeWidth={0.5} className="text-secondary animate-spin-slow" style={{ animationDuration: '40s' }} />
              </div>

              <div className="grid grid-cols-2 gap-8 relative z-10">
                <div className="space-y-2">
                  <div className="text-4xl md:text-5xl font-black text-primary">98<span className="text-secondary">%</span></div>
                  <div className="text-sm md:text-base text-gray-500 font-bold">Customer Retention</div>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl md:text-5xl font-black text-primary">10<span className="text-secondary">k+</span></div>
                  <div className="text-sm md:text-base text-gray-500 font-bold">Shipments Managed</div>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl md:text-5xl font-black text-primary">50<span className="text-secondary">+</span></div>
                  <div className="text-sm md:text-base text-gray-500 font-bold">Countries Served</div>
                </div>
                <div className="space-y-2">
                  <div className="text-4xl md:text-5xl font-black text-primary flex items-end">
                    4.9<span className="text-xl text-gray-400 mb-1 ml-1">/5</span>
                  </div>
                  <div className="text-sm md:text-base text-gray-500 font-bold">Client Satisfaction</div>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center border border-secondary/20">
                    <Ship className="text-secondary" size={24} />
                  </div>
                  <div>
                    <div className="text-primary font-bold">Premium Maritime Logistics</div>
                    <div className="text-secondary text-sm font-semibold">Award Winning Service 2026</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side: Testimonial Showcase / Empty / Loading state */}
          <div className="lg:col-span-7 relative min-h-[400px] flex flex-col">
            {loadingTestimonials ? (
              <div className="flex-1 flex items-center justify-center rounded-3xl border border-gray-200 bg-white/60 backdrop-blur-xl">
                <p className="text-gray-500 font-semibold text-lg">Loading testimonials...</p>
              </div>
            ) : testimonials.length === 0 || !active ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-6 text-center rounded-3xl border border-gray-200 bg-white/60 backdrop-blur-xl p-8">
                <p className="text-gray-500 font-semibold text-lg">
                  No testimonials yet. Be the first to share your experience!
                </p>
              </div>
            ) : (
              <>
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, x: 50, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -50, scale: 0.95 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="flex-1"
                  >
                    <div className="h-full group relative rounded-3xl border border-gray-200 bg-white/80 backdrop-blur-xl p-8 md:p-12 shadow-xl shadow-gray-200/50 hover:border-secondary/30 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 flex flex-col justify-between">
                      <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute -top-6 -right-6 lg:-right-8 lg:-top-8 w-20 h-20 rounded-2xl bg-accent flex items-center justify-center shadow-xl rotate-12 group-hover:rotate-6 transition-transform duration-500"
                      >
                        <Quote className="text-white" size={32} fill="currentColor" />
                      </motion.div>

                      <div>
                        <div className="flex gap-1 mb-8">
                          {[...Array(active?.rating ?? 0)].map((_, i) => (
                            <Star key={i} size={20} className="text-amber-400" fill="currentColor" />
                          ))}
                        </div>

                        <p className="text-lg md:text-xl lg:text-2xl font-bold text-primary/90 leading-relaxed mb-6 italic line-clamp-4 sm:line-clamp-5">
                          &ldquo;{active?.text}&rdquo;
                        </p>
                      </div>

                      <div className="flex items-center gap-6 mt-auto">
                        {/* FIX #4: guard against empty/null image src, which would
                            otherwise crash next/image at runtime */}
                        {active?.image ? (
                          <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200 group-hover:border-secondary transition-colors duration-500">
                            <Image
                              src={active.image}
                              alt={active?.name || "Reviewer"}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-16 rounded-full border-2 border-gray-200 bg-gray-100 flex items-center justify-center text-gray-400 font-bold text-xl">
                            {active?.name?.[0]?.toUpperCase() ?? "?"}
                          </div>
                        )}
                        <div>
                          <div className="text-primary font-black text-lg">{active?.name}</div>
                          <div className="text-gray-500 font-semibold flex items-center gap-2">
                            {active?.company}
                            {active?.country && (
                              <>
                                <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                                {active.country}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Controls */}
                <div className="flex gap-3 mt-4 justify-end">
                  <button
                    onClick={handlePrev}
                    className="w-12 h-12 rounded-full border border-gray-200 bg-white shadow-md flex items-center justify-center text-primary hover:bg-secondary hover:text-white hover:border-secondary transition-all duration-300"
                    aria-label="Previous testimonial"
                  >
                    <ChevronLeft size={24} />
                  </button>
                  <button
                    onClick={handleNext}
                    className="w-12 h-12 rounded-full border border-gray-200 bg-white shadow-md flex items-center justify-center text-primary hover:bg-secondary hover:text-white hover:border-secondary transition-all duration-300"
                    aria-label="Next testimonial"
                  >
                    <ChevronRight size={24} />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Write Review button — FIX #5: normal document flow, centered below
            both cards, no absolute positioning so it can't drift or overlap
            other page elements */}
        <div className="flex justify-center mt-12">
          <button
            onClick={() => setShowReviewForm(true)}
            className="px-6 py-3 rounded-xl bg-accent text-white font-bold shadow-lg hover:scale-105 hover:bg-primary transition-all duration-300"
          >
            Write Review
          </button>
        </div>
      </div>

      {/* Bottom Logo Strip */}
      <div className="mt-20 border-t border-gray-200 pt-10 pb-10 relative z-10 bg-white/50 backdrop-blur-sm overflow-hidden">
        <div className="container mx-auto px-6">
          <div
            className="w-full overflow-hidden flex relative"
            style={{
              WebkitMaskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
              maskImage: "linear-gradient(to right, transparent, black 10%, black 90%, transparent)"
            }}
          >
            <div className="animate-marquee flex min-w-max">
              <div className="flex gap-16 md:gap-24 items-center pr-16 md:pr-24">
                {servicesList.map((service, index) => (
                  <div key={index} className="text-black font-extrabold text-xl md:text-2xl whitespace-nowrap opacity-80 hover:opacity-100 hover:text-accent transition-all duration-300 flex items-center gap-3">
                    <Anchor size={24} className="text-black" />
                    {service}
                  </div>
                ))}
              </div>
              <div className="flex gap-16 md:gap-24 items-center pr-16 md:pr-24" aria-hidden="true">
                {servicesList.map((service, index) => (
                  <div key={`dup-${index}`} className="text-black font-extrabold text-xl md:text-2xl whitespace-nowrap opacity-80 hover:opacity-100 hover:text-accent transition-all duration-300 flex items-center gap-3">
                    <Anchor size={24} className="text-black" />
                    {service}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Write Review Modal — FIX #2: moved OUTSIDE the testimonials-content
          conditional so it works no matter how many testimonials exist */}
      <AnimatePresence>
        {showReviewForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100]"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl w-[95%] max-w-xl p-8 shadow-2xl relative"
            >
              <button
                onClick={() => setShowReviewForm(false)}
                className="absolute top-5 right-5 text-gray-500 hover:text-black text-xl"
              >
                ✕
              </button>

              <h3 className="text-3xl font-black text-primary mb-6">
                Write a Review
              </h3>

              {submitted ? (
                <div className="text-center py-12">
                  <div className="text-green-600 text-2xl font-bold">
                    Review submitted successfully!
                  </div>
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-5">
                  <input
                    type="text"
                    placeholder="Full Name"
                    required
                    value={reviewForm.fullname}
                    onChange={(e) =>
                      setReviewForm({
                        ...reviewForm,
                        fullname: e.target.value,
                      })
                    }
                    className="w-full border rounded-xl p-3 outline-none focus:border-accent"
                  />

                  <input
                    type="text"
                    placeholder="Role / Title"
                    required
                    value={reviewForm.role}
                    onChange={(e) =>
                      setReviewForm({
                        ...reviewForm,
                        role: e.target.value,
                      })
                    }
                    className="w-full border rounded-xl p-3 outline-none focus:border-accent"
                  />

                  <textarea
                    placeholder="Your Review"
                    required
                    rows={5}
                    value={reviewForm.review}
                    onChange={(e) =>
                      setReviewForm({
                        ...reviewForm,
                        review: e.target.value,
                      })
                    }
                    className="w-full border rounded-xl p-3 resize-none outline-none focus:border-accent"
                  />

                  <div>
                    <label className="font-semibold block mb-2">
                      Profile Photo
                    </label>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        setReviewForm({
                          ...reviewForm,
                          photo: e.target.files?.[0] || null,
                        })
                      }
                      className="w-full"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-accent text-white py-3 rounded-xl font-bold hover:bg-primary transition"
                  >
                    Submit Review
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
