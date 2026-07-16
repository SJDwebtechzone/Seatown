"use client";

import React, { useState, useEffect } from "react";
import HeroSection from "@/components/HeroSection";
import { Mail, Phone, MapPin, Send, CheckCircle, Loader2, Smartphone } from "lucide-react";

export default function Contact() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "NVOCC",
    message: "",
  });

  // Check query string for get quote
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("quote") === "1") {
        setFormData(prev => ({ ...prev, message: "Requesting immediate freight rate inquiry." }));
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/public/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setFormSubmitted(true);
        setFormData({ name: "", email: "", phone: "", service: "NVOCC", message: "" });
        setTimeout(() => setFormSubmitted(false), 5000);
      } else {
        setSubmitError(data.message || "Submission failed. Please try again.");
      }
    } catch {
      setSubmitError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full flex flex-col bg-white">
      {/* HERO: Image Banner */}
      <HeroSection 
        badge="Connect"
        title="Contact Seatown Ports"
        subtitle="Get instant assistance for cargo booking slots, container sales, or custom clearance tracking."
        bgImage="/banners/contact.png"
      />

      {/* CONTACT INFO CARDS & FORM */}
      <section className="pt-8 pb-20 md:py-20 relative overflow-hidden">
        {/* Ship & Compass Watermark */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <svg viewBox="0 0 1000 700" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] max-w-4xl opacity-[0.025] mix-blend-multiply" xmlns="http://www.w3.org/2000/svg" fill="#0B1F3A">
            {/* Compass circle */}
            <circle cx="500" cy="350" r="280" fill="none" stroke="#0B1F3A" strokeWidth="18"/>
            <circle cx="500" cy="350" r="240" fill="none" stroke="#0B1F3A" strokeWidth="6"/>
            {/* Compass rose - N S E W points */}
            <path d="M500 90 L520 310 L500 340 L480 310 Z"/>
            <path d="M500 610 L520 390 L500 360 L480 390 Z"/>
            <path d="M760 350 L540 330 L510 350 L540 370 Z"/>
            <path d="M240 350 L460 330 L490 350 L460 370 Z"/>
            {/* Compass diagonal points */}
            <path d="M695 155 L530 330 L510 310 Z" opacity="0.5"/>
            <path d="M695 545 L530 370 L510 390 Z" opacity="0.5"/>
            <path d="M305 155 L470 330 L490 310 Z" opacity="0.5"/>
            <path d="M305 545 L470 370 L490 390 Z" opacity="0.5"/>
            {/* Center circle */}
            <circle cx="500" cy="350" r="28"/>
          </svg>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-0">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Column: Info Cards & Interactive Pins */}
            <div className="lg:col-span-5 flex flex-col gap-6 text-left">
              <h2 className="text-2xl font-black text-primary mb-2">Corporate Headquarters</h2>
              
              {/* Card 1: India */}
              <div className="bg-white border border-gray-200/80 p-8 rounded-3xl flex flex-col items-start gap-6 hover:border-secondary hover:shadow-xl transition-all duration-300 group">
                <div className="flex items-center gap-4 w-full border-b border-gray-100 pb-4 relative z-0">
                  <div className="p-4 bg-secondary/10 text-secondary rounded-2xl group-hover:bg-secondary group-hover:text-white transition-colors duration-300">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-primary">Chennai Head Office</h3>
                    <span className="text-accent text-[10px] font-black uppercase tracking-widest">Global Operations Center</span>
                  </div>
                </div>
                
                <div className="w-full flex flex-col gap-5 relative z-0">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Registered Address</p>
            <p className="text-base font-semibold leading-relaxed text-justify">
  <strong className="text-justify">
    <span className="text-[#2264AD]">SEA</span>
    <span className="text-[#8D6920]">TOWN</span> CONTAINER LINE PVT LTD
  </strong><br/>
  <span className="text-[#2264AD]">New No.89 (Old No.45), Marine Tower,</span><br/>
  <span className="text-[#8D6920]">4th Floor Room No-8, Thambu Chetty Street,</span><br/>
  <span className="text-[#2264AD]">Chennai – 600 001</span>
</p>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-2">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Contact Numbers</p>
                      <div className="flex flex-col gap-1.5">
                        <a href="tel:+919384622560" className="flex items-center gap-2 text-base font-bold text-gray-700 hover:text-primary transition-colors"><Smartphone size={14} className="text-accent" /> +91 93846 22560</a>
                        <a href="tel:+919840456693" className="flex items-center gap-2 text-base font-bold text-gray-700 hover:text-primary transition-colors"><Smartphone size={14} className="text-accent" /> +91 98404 56693</a>
                        <a href="tel:04446463747" className="flex items-center gap-2 text-base font-bold text-gray-700 hover:text-primary transition-colors"><Phone size={14} className="text-accent" /> 044- 4646 3747</a>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Email Desk</p>
                      <a href="mailto:James@seatown.in" className="flex items-center gap-2 text-base font-bold text-gray-700 hover:text-primary transition-colors break-all"><Mail size={14} className="text-accent" /> James@seatown.in</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Inquiry Form (Glassmorphism) */}
            <div className="lg:col-span-7 relative z-0">
              <div className="glass-panel p-8 rounded-3xl border border-gray-200/80 shadow-lg text-left">
                <h2 className="text-2xl font-black text-primary mb-2">Inquiry Form</h2>
                <p className="text-gray-500 text-sm font-semibold mb-6">
                  Submit cargo requirements to receive immediate scheduling solutions.
                </p>

                {formSubmitted ? (
                  <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center flex flex-col items-center justify-center py-12">
                    <CheckCircle className="w-12 h-12 text-green-600 mb-3 animate-bounce" />
                    <h3 className="text-base font-extrabold text-green-800">Message Transmitted</h3>
                    <p className="text-green-700 text-sm font-semibold mt-1">Our dispatch team will connect with booking confirmations shortly.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-extrabold uppercase tracking-wider text-gray-500 mb-1.5">Name</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-primary focus:outline-none focus:border-secondary transition-colors"
                          placeholder="Jane Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-extrabold uppercase tracking-wider text-gray-500 mb-1.5">Email</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-primary focus:outline-none focus:border-secondary transition-colors"
                          placeholder="jane@company.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-extrabold uppercase tracking-wider text-gray-500 mb-1.5">Phone</label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-primary focus:outline-none focus:border-secondary transition-colors"
                          placeholder="+91 98765 43210"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-extrabold uppercase tracking-wider text-gray-500 mb-1.5">Interested Service</label>
                        <select
                          value={formData.service}
                          onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                          className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-primary focus:outline-none focus:border-secondary transition-colors"
                        >
                          <option value="NVOCC">NVOCC Shipping</option>
                          <option value="Freight">Freight Forwarding</option>
                          <option value="Air">Air Freight</option>
                          <option value="Customs">Customs Clearance</option>
                          <option value="Project">Project Cargo</option>
                          <option value="Trading">Container Trading</option>
                          <option value="Transportation">Transportation</option>
                          <option value="agency">Linear Agency</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-extrabold uppercase tracking-wider text-gray-500 mb-1.5">Inquiry Details</label>
                      <textarea
                        required
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-primary focus:outline-none focus:border-secondary transition-colors resize-none"
                        placeholder="State origin port, destination port, cargo volume, or container fleet sales requests..."
                      />
                    </div>

                    {submitError && (
                      <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-700 font-semibold">
                        {submitError}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-secondary hover:bg-secondary-hover disabled:opacity-70 text-white py-3 rounded-xl font-bold uppercase tracking-wider text-xs shadow-md transition-colors flex items-center justify-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Transmitting...
                        </>
                      ) : (
                        <>
                          Transmit Message
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>

                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* OFFICE LOCATION MAP */}
      <section className="py-16 bg-zinc-50 border-t border-gray-100 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-black text-primary mb-8">Visit Our Headquarters</h2>
          
          <div className="relative w-full h-[400px] md:h-[500px] bg-gray-200 rounded-3xl overflow-hidden flex items-center justify-center shadow-lg border border-gray-200/80">
            <iframe
              src="https://maps.google.com/maps?q=New+No.89,+Marine+Tower,+Thambu+Chetty+Street,+Chennai+600001&t=&z=16&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
            ></iframe>
          </div>
        </div>
      </section>

    </div>
  );
}
