"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Ship,
  Globe,
  Clock,
  Users,
  Compass,
  ArrowRight,
  Anchor,
  Plane,
  FileCheck,
  Cpu,
  Truck,
  Box,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  MapPin,
  ExternalLink,
  Check,
} from "lucide-react";
import OceanWaveDivider from "@/components/OceanWaveDivider";
import { motion, AnimatePresence } from "framer-motion";
import TestimonialSection from "@/components/TestimonialSection";

// Custom Hook to trigger animation when scrolled into view
function useIntersectionObserver() {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return [ref, isIntersecting] as const;
}

function AnimatedCounter({ end, suffix }: { end: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const [ref, isIntersecting] = useIntersectionObserver();

  useEffect(() => {
    if (isIntersecting) {
      let startTime: number;
      const duration = 2000; // 2 seconds

      const animate = (time: number) => {
        if (!startTime) startTime = time;
        const progress = Math.min((time - startTime) / duration, 1);
        
        // easeOutQuart
        const easeOut = 1 - Math.pow(1 - progress, 4);
        setCount(Math.floor(easeOut * end));

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setCount(end);
        }
      };
      
      requestAnimationFrame(animate);
    }
  }, [isIntersecting, end]);

  return (
    <div ref={ref} className="text-primary font-black text-sm md:text-base leading-none">
      {count.toLocaleString()}{suffix}
    </div>
  );
}

const CONTAINER_OPTIONS = [
  {
    id: "dry",
    title: "Dry Containers - 20’ & 40’",
    desc: "Dry containers are available in standard sizes of 10, 20, and 40 feet. They are designed for transporting general cargo and are the most commonly used type of shipping container worldwide. View a visual size comparison to better understand the dimensions of this popular container type.",
    img: "/dry_containers.png"
  },
  {
    id: "opentop",
    title: "Open Top Containers - 20’ & 40’",
    desc: "Open Top containers have a fully removable or convertible roof, allowing easy access to cargo from the top. They are primarily used for transporting over-height or bulky items that cannot be loaded through standard doors.",
    img: "/open_top_containers.png"
  },
  {
    id: "flatrack",
    title: "Flat Rack Containers - 20’ & 40’",
    desc: "Flat Rack containers feature collapsible sides, making them ideal for transporting heavy loads, oversized cargo, construction equipment, building materials, and large machinery.",
    img: "/flat_rack_containers.png"
  },
  {
    id: "reefer",
    title: "Refrigerated ISO Containers (Reefer Containers) – 20’ & 40’",
    desc: "Refrigerated ISO containers, commonly known as reefer containers, are designed to regulate temperature and preserve temperature-sensitive goods such as fresh produce, seafood, and pharmaceuticals. Please note that in the case of temperature-sensitive shipments, spoilage is typically only covered if it results from a mechanical failure of the container sustained over an extended period.",
    img: "/refrigerated_iso_containers.png"
  },
  {
    id: "tank",
    title: "Tank Containers – 20’",
    desc: "Tank containers are specifically designed for the transportation of liquid materials and are widely used across the shipping industry. They are typically constructed from strong, anti-corrosive materials such as stainless steel, ensuring durability, longevity, and protection of the cargo during transit.",
    img: "/tank_ontainers.png"
  }
];

const SERVICES = [
  {
    id: "01",
    title: "NVOCC Operations",
    desc: "Operating our own fleet and global network to provide reliable and cost-effective shipping solutions.",
    img: "/services/NVOCCO.png",
    icon: Anchor,
    link: "/services#nvocc",
    features: [
      "Fleet of standard & specialized containers",
      "Global port network coverage",
      "Reliable carrier partnerships"
    ]
  },
  {
    id: "02",
    title: "Freight Forwarding",
    desc: "Comprehensive door-to-door freight solutions across sea, air, rail, and land with global reach.",
    img: "/services/Freight_Forwarding.png",
    icon: Globe,
    link: "/services#freight-forwarding",
    features: [
      "End-to-end door-to-door delivery",
      "Multi-modal transportation routes",
      "Real-time consignment updates"
    ]
  },
  {
    id: "03",
    title: "Air Freight Logistics",
    desc: "Fast, secure and reliable air freight services for time-sensitive cargo across the world.",
    img: "/services/Air_Freight_Forwarding.png",
    icon: Plane,
    link: "/services#air-freight",
    features: [
      "Time-sensitive cargo prioritizing",
      "Priority booking with major airlines",
      "Global airport network clearance"
    ]
  },
  {
    id: "04",
    title: "Customs Brokerage",
    desc: "Expert handling of documentation, compliance, and clearance to ensure smooth cargo movement.",
    img: "/services/Customs_Brokerage.png",
    icon: FileCheck,
    link: "/services#customs-clearance",
    features: [
      "Authorized customs filing & compliance",
      "Rapid document processing",
      "Duty tariff consulting & guidance"
    ]
  },
  {
    id: "05",
    title: "Project Cargo Handling",
    desc: "Specialized solutions for heavy-lift, oversized, and complex project cargo with precision and care.",
    img: "/services/DC_Project_Cargo_Handling.png",
    icon: Cpu,
    link: "/services#project-cargo",
    features: [
      "Specialized heavy-lift container transport",
      "Route feasibility surveys",
      "Dedicated on-site loading supervision"
    ]
  },
  {
    id: "06",
    title: "Container Trading",
    desc: "Sales, purchase, leasing & rental of all types of containers to meet your business needs.",
    img: "/services/Container_Trading.png",
    icon: Box,
    link: "/services#container-trading",
    features: [
      "Standard dry & specialized container sales",
      "Lease and rental options",
      "Certified cargo-worthy containers"
    ]
  },
  {
    id: "07",
    title: "Transportation Services",
    desc: "Reliable trucking and haulage services ensuring safe and on-time delivery to any destination.",
    img: "/services/Transportation_Services.png",
    icon: Truck,
    link: "/services#transportation",
    features: [
      "Dedicated truck fleet & trailers",
      "Safe domestic cargo haulage",
      "GPS-tracked transport status"
    ]
  },
  {
    id: "08",
    title: "Liner Agency",
    desc: "Representing principal carriers and managing shipping lines with robust local agency services.",
    img: "/services/Liner Agency.png",
    icon: Ship,
    link: "/services#liner-agency",
    features: [
      "Professional principal carrier representation",
      "Local marketing and slot sales",
      "Vessel husbandry and operations support"
    ]
  }
];

function TechParticlesBackground() {
  const [particles, setParticles] = React.useState<{ id: number; x: number; y: number; size: number; color: string; duration: number }[]>([]);

  React.useEffect(() => {
    const colors = ["bg-primary/10", "bg-accent/15", "bg-blue-400/10", "bg-amber-400/10"];
    const generated = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 8 + 4, // 4px to 12px
      color: colors[Math.floor(Math.random() * colors.length)],
      duration: Math.random() * 20 + 20, // 20s to 40s
    }));
    setParticles(generated);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Soft Ambient Orbs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-accent/5 rounded-full blur-[100px]" />
      <div className="absolute top-1/2 left-1/3 w-80 h-80 bg-blue-300/5 rounded-full blur-[80px]" />

      {/* Floating Particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className={`absolute rounded-full ${p.color}`}
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
          }}
          animate={{
            y: [0, -40, 40, 0],
            x: [0, 30, -30, 0],
            opacity: [0.2, 0.7, 0.4, 0.2],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
}

export default function Home() {
  // Hero Stats Counter — auto-increments on page load
  const [heroStats, setHeroStats] = useState({ countries: 0, shipments: 0, partners: 0 });
  const [heroStarted, setHeroStarted] = useState(false);

  useEffect(() => {
    if (heroStarted) return;
    setHeroStarted(true);
    const duration = 2200;
    const steps = 60;
    const stepTime = duration / steps;
    let step = 0;

    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3); // cubic ease-out

    const timer = setInterval(() => {
      step++;
      const progress = easeOut(step / steps);
      setHeroStats({
        countries: Math.floor(50 * progress),
        shipments: Math.floor(10000 * progress),
        partners: Math.floor(100 * progress),
      });
      if (step >= steps) {
        clearInterval(timer);
        setHeroStats({ countries: 50, shipments: 10000, partners: 100 });
      }
    }, stepTime);

    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  // Selected Interactive 3D Container Model
  const [selectedContainer, setSelectedContainer] = useState("dry");

  // Selected Interactive Service
  const [selectedService, setSelectedService] = useState("01");

  // Auto-change container type
  useEffect(() => {
    const timer = setInterval(() => {
      setSelectedContainer((prev) => {
        const currentIndex = CONTAINER_OPTIONS.findIndex(c => c.id === prev);
        const nextIndex = (currentIndex + 1) % CONTAINER_OPTIONS.length;
        return CONTAINER_OPTIONS[nextIndex].id;
      });
    }, 5000);
    return () => clearInterval(timer);
  }, [selectedContainer]);

  return (
    <div className="w-full flex flex-col">
      {/* SECTION 1 - HERO BANNER */}
      {/* SECTION 1 - HERO BANNER & STATS BAR */}
    {/* SECTION 1 - HERO BANNER & STATS BAR */}
      {/* SECTION 1 - HERO BANNER & STATS BAR */}
    {/* SECTION 1 - HERO BANNER & STATS BAR */}
   {/* SECTION 1 - HERO BANNER & STATS BAR */}
      
      {/* ── MOBILE / TABLET HERO (below lg) ── */}
 <section className="lg:hidden relative bg-white pt-28 pb-10 overflow-hidden text-primary">
        {/* Subtle grid overlay */}
        <div className="absolute inset-0 pointer-events-none z-0" 
             style={{ 
               backgroundImage: "radial-gradient(rgba(193, 147, 63, 0.15) 1px, transparent 1px)", 
               backgroundSize: "32px 32px" 
             }} 
        />

        <div className="max-w-xl mx-auto px-4 sm:px-6 relative z-10">
          {/* Ship image showcase — comes first now */}
          <div className="relative w-full h-[220px] sm:h-[280px] rounded-3xl overflow-hidden shadow-xl mb-8">
            <Image
              src="/banners/home.png"
              alt="Seatown container ship"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* NEXT GEN LABEL */}
          <div className="flex items-center gap-2 mb-4">
            <span className="w-6 h-[2px] bg-[#C1933F]" />
            <span className="font-display text-accent text-[11px] font-black tracking-[0.15em] uppercase">
              NEXT GEN MARITIME LOGISTICS
            </span>
          </div>

          {/* HEADING */}
          <h1 className="font-display text-[28px] sm:text-[34px] font-black leading-[1.15] mb-4 tracking-tight text-primary">
            Connecting Global Trade <span className="text-primary">Across</span>{" "}
            {/* <span className="text-[#C1933F]">Oceans & Borders</span> */}
            <span className="text-primary">Oceans & Borders</span>
          </h1>

          <p className="font-display text-gray-600 font-semibold text-sm mb-6 leading-relaxed">
            Seatown Container Line links major global markets with certified container shipping services, custom clearance networks, and premium cargo care.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <Link
              href="/contact?quote=1"
              className="bg-[#C1933F] hover:brightness-110 text-white pl-8 pr-6 py-3.5 rounded-full font-bold uppercase tracking-widest text-[11px] shadow-lg transition-all flex items-center justify-center gap-2 group w-full"
            >
              Get Quote
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/services"
              className="bg-white border border-primary hover:bg-gray-50 text-primary pl-8 pr-6 py-3.5 rounded-full font-bold uppercase tracking-widest text-[11px] transition-all flex items-center justify-center gap-2 shadow-sm w-full"
            >
              Explore Services
              <Ship className="w-4 h-4 text-primary" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── DESKTOP HERO (lg and up) ── */}
      <section 
        className="hidden lg:flex relative min-h-[96vh] flex-col justify-between bg-white pt-32 pb-0 overflow-hidden text-primary"
        style={{
          backgroundImage: "linear-gradient(to right, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.6) 35%, rgba(255,255,255,0) 60%), url('/banners/home.png')",
          backgroundSize: "cover",
          backgroundPosition: "center right",
          backgroundRepeat: "no-repeat"
        }}
      >
        {/* Subtle grid layout overlay */}
        <div className="absolute inset-0 pointer-events-none z-0" 
             style={{ 
               backgroundImage: "radial-gradient(rgba(193, 147, 63, 0.15) 1px, transparent 1px)", 
               backgroundSize: "32px 32px" 
             }} 
        />

        {/* Hero Content Area */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full flex-grow flex items-center mt-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 w-full">
            <div className="lg:col-span-8 flex flex-col items-start text-left max-w-xl md:max-w-2xl">
              {/* NEXT GEN LABEL */}
              <div className="flex items-center gap-3 mb-6">
                <span className="w-8 h-[2px] bg-[#C1933F]" />
                <span className="font-display text-accent text-sm md:text-base font-black tracking-[0.2em] uppercase">
                  NEXT GEN MARITIME LOGISTICS
                </span>
              </div>

              {/* HEADING (matching mock layout) */}
              <h1 className="font-display text-[38px] sm:text-[48px] lg:text-[58px] font-black leading-[1.08] mb-6 tracking-tight text-primary">
                Connecting Global <br />
                Trade <span className="text-primary">Across</span> <br />
                <span className="text-primary">Oceans & Borders</span>
              </h1>

              <p className="font-display text-justify text-gray-600 font-semibold text-sm sm:text-base mb-8 leading-relaxed max-w-lg">
                Seatown Container Line links major global markets with certified container shipping services, custom clearance networks, and premium cargo care.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/contact?quote=1"
                  className="bg-[#C1933F] hover:brightness-110 text-white pl-8 pr-6 py-3.5 rounded-full font-bold uppercase tracking-widest text-[11px] shadow-lg transition-all flex items-center gap-2 group"
                >
                  Get Quote
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link
                  href="/services"
                  className="bg-white border border-primary hover:bg-gray-50 text-primary pl-8 pr-6 py-3.5 rounded-full font-bold uppercase tracking-widest text-[11px] transition-all flex items-center gap-2 shadow-sm"
                >
                  Explore Services
                  <Ship className="w-4 h-4 text-primary" />
                </Link>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* SECTION 3 - PREMIUM SPLIT-SCREEN ABOUT */}
      <section className="w-full flex flex-col lg:flex-row">

        {/* ── LEFT PANEL: White Map Area ── */}
        <div className="lg:w-1/2 relative bg-white flex flex-col justify-between overflow-hidden p-8 md:p-10 min-h-[520px]">
          {/* Container Ship Watermark */}
          <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg')] bg-no-repeat bg-center bg-cover opacity-[0.03] mix-blend-multiply pointer-events-none z-0"></div>

          {/* Deep gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50/90 to-gray-100/70 pointer-events-none" />
          {/* Subtle grid dots */}
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(rgba(193,147,63,0.15) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

          {/* Top content */}
          <div className="relative z-10">
            <span className="text-accent text-sm md:text-base font-black uppercase tracking-[0.22em] mb-4 flex items-center gap-2">
              <span className="font-display w-8 h-[2px] bg-accent" />
              Global Trade Connections
            </span>
           <h2 className="font-display text-3xl md:text-4xl font-black text-primary leading-tight mb-3">
  Strong Routes.<br />
  Stronger <span className="text-accent">Partnerships.</span>
</h2>
            <p className="text-justify text-gray-600 text-sm font-semibold leading-relaxed max-w-xs">
              Connecting Chennai to key global ports with speed, reliability &amp; trust.
            </p>
          </div>

          {/* Ship icon top-right */}
          <div className="absolute top-8 right-8 z-10 p-3 bg-accent/20 border border-accent/30 rounded-2xl backdrop-blur-sm">
            <Ship className="w-6 h-6 text-accent" />
          </div>

          {/* Global Network Video */}
          <div className="relative z-10 flex-grow flex items-center justify-center my-6 rounded-2xl overflow-hidden shadow-xl border border-gray-100/50">
            <video 
              src="/v1.mov" 
              autoPlay 
              loop 
              muted 
              playsInline 
              className="w-full h-full object-cover"
            />
          </div>

        </div>

        {/* ── RIGHT PANEL: White About Content ── */}
        
        <div className="lg:w-1/2 bg-white flex flex-col justify-center px-8 md:px-12 lg:px-14 py-12">
            <div className="absolute inset-0 pointer-events-none z-0">
    <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg')] bg-no-repeat bg-center bg-cover opacity-[0.03] mix-blend-multiply" />
  </div>
          <span className="text-accent text-sm md:text-base font-black uppercase tracking-[0.22em] mb-4 flex items-center gap-2">
            <span className="font-display w-8 h-[2px] bg-accent" />
            About Seatown Preview
          </span>
          
          <h2 className="font-display text-3xl md:text-4xl font-black text-primary leading-tight mb-3">
            Your Trusted Logistics Partner<br />
            Across <span className="text-accent">The Globe</span>
          </h2>

          <div className="w-10 h-[3px] bg-accent rounded-full mb-6" />

          <p className="text-justify text-gray-600 text-base leading-relaxed mb-3">
            Seatown Container Line Pvt Ltd is a leading NVOCC and integrated logistics provider, delivering tailored shipping solutions that connect businesses to global markets.
          </p>
          <p className=" text-justify text-gray-600 text-base leading-relaxed mb-8">
            With a commitment to reliability, transparency, and operational excellence, we ensure your cargo reaches every destination—safely and on time.
          </p>

          {/* 4 Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {[
              { icon: ShieldCheck, title: 'Reliable Operations', desc: 'Consistent schedules and dependable service you can trust.' },
              { icon: Globe, title: 'Global Network', desc: 'Strong connectivity across major ports worldwide.' },
              { icon: Box, title: 'Diverse Solutions', desc: 'From general cargo to project shipments, we handle it all.' },
              { icon: Users, title: 'Customer Focused', desc: 'Personalized support and 24/7 assistance at every step.' },
            ].map((feat, i) => (
              <div key={i} className="font-display text-justify bg-gray-50 border border-gray-100 rounded-2xl p-5 md:p-6 flex flex-col gap-3 hover:border-accent/30 hover:shadow-sm transition-all duration-300">
                <div className="p-2.5 bg-accent/10 rounded-xl w-fit">
                  <feat.icon className="w-5 h-5 text-accent" />
                </div>
                <div className="font-black text-sm md:text-base text-primary leading-tight">{feat.title}</div>
                <p className="text-gray-600 text-sm md:text-base font-semibold leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/about"
              className="font-display flex items-center gap-2 w-fit bg-accent hover:brightness-110 text-white pl-8 pr-6 py-3.5 rounded-full font-bold uppercase tracking-widest text-[11px] shadow-lg transition-all group"
            >
              Discover More About Us
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
        
      </section>
      {/* Stats Bar */}
          <div className=" font-display relative z-10 grid grid-cols-4 gap-2 bg-white border border-gray-100 rounded-2xl px-3 py-4 shadow-sm mt-4">
            {[
              { icon: Globe, end: 50, suffix: '+', label: 'Countries Connected' },
              { icon: Ship, end: 10000, suffix: '+', label: 'Shipments Handled' },
              { icon: Users, end: 100, suffix: '+', label: 'Global Business Partners' },
              { icon: Clock, end: 24, suffix: '/7', label: 'Customer Support' },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-1.5">
                <div className="p-2 bg-accent/10 border border-accent/10 rounded-xl">
                  <stat.icon className="w-6 h-6 text-accent" />
                </div>
                <AnimatedCounter end={stat.end} suffix={stat.suffix} />
                <div className="text-gray-500 text-[12px] font-bold uppercase leading-tight">{stat.label}</div>
              </div>
            ))}
          </div>

      {/* SECTION 4 - SERVICES SHOWCASE */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Cargo Plane Watermark */}
        <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/e0/Airplane_silhouette.svg')] bg-no-repeat bg-center bg-[length:55%] opacity-[0.025] mix-blend-multiply pointer-events-none z-0"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Mockup Styled Header */}
          <div className="flex justify-center items-center gap-2 mb-2">
            <span className="w-6 h-[1.5px] bg-accent" />
            <span className=" font-display text-accent text-sm md:text-base font-black uppercase tracking-[0.2em]">
              OUR SERVICES
            </span>
            <span className="w-6 h-[1.5px] bg-accent" />
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-black text-primary leading-tight mb-3">
            Integrated Global <span className="text-accent">Logistics Solutions</span>
          </h2>
          <p className="font-display text-gray-500 text-sm font-semibold max-w-xl mx-auto mb-16 leading-relaxed">
            End-to-end logistics solutions designed to move your business forward. <br />
            Reliable. Efficient. Global.
          </p>

          {/* INTERACTIVE SERVICES SHOWCASE */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start text-left">

            {/* Tabs: horizontal scroll on mobile, vertical list on desktop */}
            <div className="lg:col-span-5 flex lg:flex-col gap-3 overflow-x-auto lg:overflow-x-visible -mx-4 px-4 lg:mx-0 lg:px-0 pb-2 lg:pb-0 w-auto lg:w-full scrollbar-none snap-x snap-mandatory">
              {SERVICES.map((svc) => {
                const IconComponent = svc.icon;
                const isActive = selectedService === svc.id;
                return (
                  <button
                    key={svc.id}
                    onClick={() => setSelectedService(svc.id)}
                    aria-pressed={isActive}
                    className={`flex items-center gap-3 lg:gap-4 p-3 lg:p-5 rounded-2xl border text-left transition-all duration-300 w-[78%] sm:w-72 lg:w-full shrink-0 snap-center cursor-pointer ${
                      isActive
                        ? "bg-white border-accent shadow-md lg:translate-x-1 border-l-4 border-l-accent"
                        : "bg-gray-50/50 border-gray-100 hover:bg-gray-50 hover:border-gray-200"
                    }`}
                  >
                    <div className={`p-2.5 lg:p-3 rounded-xl shrink-0 transition-colors ${
                      isActive ? "bg-accent/10 text-accent" : "bg-gray-200/50 text-gray-500"
                    }`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="flex-grow min-w-0">
                      <span className={`font-display block text-[11px]  font-bold tracking-wider ${isActive ? "text-accent" : "text-gray-400"}`}>
                        SERVICE {svc.id}
                      </span>
                      <h3 className={`font-display font-black text-sm lg:text-base leading-tight mt-0.5 truncate ${isActive ? "text-primary" : "text-gray-700"}`}>
                        {svc.title}
                      </h3>
                    </div>
                    <ArrowRight className={`font-display w-4 h-4 shrink-0 transition-transform duration-300 ${
                      isActive ? "text-accent translate-x-1" : "text-gray-300"
                    }`} />
                  </button>
                );
              })}
            </div>

            {/* Active Service Detail Card */}
            <div className="lg:col-span-7 w-full h-full">
              <AnimatePresence mode="wait">
                {SERVICES.filter((svc) => svc.id === selectedService).map((svc) => {
                  const IconComponent = svc.icon;
                  return (
                    <motion.div
                      key={svc.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -15 }}
                      transition={{ duration: 0.35, ease: "easeOut" }}
                      className="font-display bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-md flex flex-col h-full"
                    >
                      {/* Image */}
                      <div className="font-display h-56 sm:h-64 lg:h-72 w-full relative overflow-hidden bg-gray-50 group">
                        <Image
                          src={svc.img}
                          alt={svc.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                          priority
                        />
                        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 bg-accent text-white border-2 border-white/20 rounded-2xl p-3 sm:p-3.5 shadow-lg z-10 flex items-center justify-center">
                          <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-85" />
                        <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 bg-white/10 backdrop-blur-md border border-white/15 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full">
                          <span className="font-display text-white  text-[10px] sm:text-xs font-black tracking-widest">
                            SEATOWN LOGISTICS
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5 sm:p-8 flex flex-col flex-grow justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-accent font-mono text-xs font-black tracking-widest">
                              SERVICE {svc.id}
                            </span>
                            <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                            <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
                              Tailored Solutions
                            </span>
                          </div>
                          <h3 className="font-display text-3xl md:text-4xl font-black text-primary leading-tight mb-3">
                            {svc.title}
                          </h3>
                          <p className="font-display text-gray-600 text-sm sm:text-base leading-relaxed mb-6 font-medium">
                            {svc.desc}
                          </p>

                          <div className="border-t border-gray-100 pt-5 sm:pt-6 mb-6 sm:mb-8">
                            <h4 className="text-primary font-bold text-xs uppercase tracking-wider mb-4">
                              Key Capabilities
                            </h4>
                            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {svc.features.map((feat, idx) => (
                                <li key={idx} className="flex items-start gap-2.5 text-sm font-semibold text-gray-600">
                                  <div className="p-0.5 bg-accent/15 rounded-md mt-0.5 shrink-0">
                                    <Check className="w-3.5 h-3.5 text-accent stroke-[3px]" />
                                  </div>
                                  <span>{feat}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="flex justify-end pt-2 border-t border-gray-50 mt-auto">
                          <Link
                            href={svc.link}
                            className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-white px-5 sm:px-6 py-3 rounded-full font-bold uppercase tracking-wider text-[11px] transition-all shadow-md group"
                          >
                            Explore Detailed Specifications
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 5 - CONTAINER TYPES */}
      <section className="py-20 bg-zinc-50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-flex items-center justify-center gap-2 text-accent text-sm md:text-base font-black uppercase tracking-[0.25em]">
              <span className="w-8 h-[2px] bg-accent" />
              Asset Options
              <span className="w-8 h-[2px] bg-accent" />
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-black text-primary leading-tight mb-3">
              Interactive Container Fleet Specifications
            </h2>
            <p className="text-gray-500 text-sm font-semibold mt-1">
              Hover or tap on a container model to preview its structural characteristics.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Buttons list */}
            {/* Left Pane: Options */}
            <div className="lg:col-span-4 flex flex-col gap-3">
              {CONTAINER_OPTIONS.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedContainer(type.id)}
                  className={`font-display text-left px-6 py-4 rounded-full border transition-all duration-300 flex items-center justify-between group shadow-sm ${
                    selectedContainer === type.id
                      ? "bg-accent text-white border-accent shadow-md scale-[1.02]"
                      : "bg-white text-primary hover:bg-gray-50 border-gray-200 hover:border-accent/50"
                  }`}
                >
                  <div className="font-display text-justify font-bold text-[13px] tracking-wide uppercase">{type.title.split(' - ')[0].split(' (')[0]}</div>
                  <ChevronRight className={`font-display w-4 h-4 transition-transform ${selectedContainer === type.id ? 'translate-x-1 text-white' : 'text-gray-400 group-hover:translate-x-1 group-hover:text-accent'}`} />
                </button>
              ))}
            </div>

            {/* Right Pane: Display */}
            <div className="lg:col-span-8 flex flex-col bg-white border border-accent p-6 md:p-8 rounded-[2rem] h-[500px] sm:h-[480px] md:h-[450px] lg:h-[420px] relative overflow-hidden shadow-sm">
              {(() => {
                const active = CONTAINER_OPTIONS.find(c => c.id === selectedContainer) || CONTAINER_OPTIONS[0];
                return (
                  <AnimatePresence mode="wait">
                    <motion.div 
                      key={active.id} 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col h-full"
                    >
                      <div className="flex-1 flex items-center justify-center mb-6 relative w-full h-[180px]">
                        <Image src={active.img} alt={active.title} fill className="object-contain drop-shadow-xl" />
                      </div>
                      <div className="mt-auto border-t border-gray-100 pt-6">
                        <h3 className="font-display text-xl md:text-2xl font-black text-primary mb-2 md:mb-3 truncate">{active.title}</h3>
                        <p className="text-justify text-gray-600 text-base leading-relaxed font-medium line-clamp-4">{active.desc}</p>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                );
              })()}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6 - WHY CHOOSE US */}
      <section className="py-20 bg-white border-t border-gray-100 relative overflow-hidden">
        <TechParticlesBackground />
        {/* ── Detailed Port Scene Watermark ── */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          {/* Faint dot-grid texture layer */}
          <div className="absolute inset-0 opacity-[0.04]"
               style={{ backgroundImage: "radial-gradient(#0B1F3A 1px, transparent 1px)", backgroundSize: "36px 36px" }} />
          <svg viewBox="0 0 1400 520" className="absolute w-full h-full opacity-[0.055] mix-blend-multiply" xmlns="http://www.w3.org/2000/svg" fill="#0B1F3A">

            {/* ═══ OCEAN / WATER ═══ */}
            <path d="M0 370 Q120 350 240 370 T480 362 T720 370 T960 362 T1200 370 T1400 362 L1400 400 L0 400 Z" opacity="0.45"/>
            <path d="M0 392 Q175 374 350 392 T700 384 T1050 392 T1400 384 L1400 420 L0 420 Z" opacity="0.25"/>
            <line x1="0" y1="438" x2="1400" y2="438" stroke="#0B1F3A" strokeWidth="3" strokeDasharray="30 18" opacity="0.3"/>

            {/* ═══ MAIN CONTAINER SHIP HULL ═══ */}
            <path d="M120 345 L145 292 L985 292 L1015 315 L1025 345 Z"/>
            <rect x="120" y="332" width="905" height="16" rx="3" opacity="0.5"/>
            <rect x="158" y="257" width="824" height="38" rx="6"/>

            {/* Bridge / Superstructure */}
            <rect x="682" y="178" width="182" height="82" rx="7"/>
            <rect x="698" y="190" width="22" height="14" rx="3" fill="white" opacity="0.18"/>
            <rect x="729" y="190" width="22" height="14" rx="3" fill="white" opacity="0.18"/>
            <rect x="760" y="190" width="22" height="14" rx="3" fill="white" opacity="0.18"/>
            <rect x="791" y="190" width="22" height="14" rx="3" fill="white" opacity="0.18"/>
            <rect x="822" y="190" width="22" height="14" rx="3" fill="white" opacity="0.18"/>
            {/* Funnel */}
            <rect x="824" y="148" width="32" height="34" rx="4"/>
            <rect x="818" y="137" width="44" height="14" rx="3"/>
            {/* Smoke puffs */}
            <circle cx="840" cy="122" r="13" opacity="0.18"/>
            <circle cx="857" cy="108" r="9" opacity="0.12"/>
            <circle cx="870" cy="97" r="7" opacity="0.08"/>
            {/* Mast + cross-arm */}
            <rect x="752" y="132" width="8" height="50" rx="2"/>
            <rect x="720" y="142" width="72" height="6" rx="2"/>
            <circle cx="722" cy="142" r="5"/>
            <circle cx="790" cy="142" r="5"/>

            {/* ── Container rows (3 rows) ── */}
            <rect x="172" y="222" width="50" height="36" rx="3"/>
            <rect x="226" y="222" width="50" height="36" rx="3" opacity="0.7"/>
            <rect x="280" y="222" width="50" height="36" rx="3"/>
            <rect x="334" y="222" width="50" height="36" rx="3" opacity="0.7"/>
            <rect x="388" y="222" width="50" height="36" rx="3"/>
            <rect x="442" y="222" width="50" height="36" rx="3" opacity="0.7"/>
            <rect x="496" y="222" width="50" height="36" rx="3"/>
            <rect x="550" y="222" width="50" height="36" rx="3" opacity="0.7"/>
            <rect x="604" y="222" width="50" height="36" rx="3"/>
            <rect x="658" y="222" width="50" height="36" rx="3" opacity="0.7"/>
            <rect x="172" y="184" width="50" height="36" rx="3" opacity="0.85"/>
            <rect x="226" y="184" width="50" height="36" rx="3" opacity="0.6"/>
            <rect x="280" y="184" width="50" height="36" rx="3" opacity="0.85"/>
            <rect x="334" y="184" width="50" height="36" rx="3" opacity="0.6"/>
            <rect x="388" y="184" width="50" height="36" rx="3" opacity="0.85"/>
            <rect x="442" y="184" width="50" height="36" rx="3" opacity="0.6"/>
            <rect x="496" y="184" width="50" height="36" rx="3" opacity="0.85"/>
            <rect x="550" y="184" width="50" height="36" rx="3" opacity="0.6"/>
            <rect x="604" y="184" width="50" height="36" rx="3" opacity="0.85"/>
            <rect x="172" y="147" width="50" height="36" rx="3" opacity="0.7"/>
            <rect x="226" y="147" width="50" height="36" rx="3" opacity="0.5"/>
            <rect x="280" y="147" width="50" height="36" rx="3" opacity="0.7"/>
            <rect x="334" y="147" width="50" height="36" rx="3" opacity="0.5"/>
            <rect x="388" y="147" width="50" height="36" rx="3" opacity="0.7"/>
            <rect x="442" y="147" width="50" height="36" rx="3" opacity="0.5"/>
            <rect x="496" y="147" width="50" height="36" rx="3" opacity="0.7"/>
            {/* Container divider lines */}
            <line x1="222" y1="147" x2="222" y2="258" stroke="white" strokeWidth="1.5" opacity="0.12"/>
            <line x1="276" y1="147" x2="276" y2="258" stroke="white" strokeWidth="1.5" opacity="0.12"/>
            <line x1="330" y1="147" x2="330" y2="258" stroke="white" strokeWidth="1.5" opacity="0.12"/>
            <line x1="384" y1="147" x2="384" y2="258" stroke="white" strokeWidth="1.5" opacity="0.12"/>
            <line x1="438" y1="147" x2="438" y2="258" stroke="white" strokeWidth="1.5" opacity="0.12"/>
            <line x1="492" y1="147" x2="492" y2="258" stroke="white" strokeWidth="1.5" opacity="0.12"/>
            <line x1="546" y1="184" x2="546" y2="258" stroke="white" strokeWidth="1.5" opacity="0.12"/>
            <line x1="600" y1="184" x2="600" y2="258" stroke="white" strokeWidth="1.5" opacity="0.12"/>
            <line x1="654" y1="222" x2="654" y2="258" stroke="white" strokeWidth="1.5" opacity="0.12"/>
            <line x1="172" y1="220" x2="712" y2="220" stroke="white" strokeWidth="1.5" opacity="0.1"/>
            <line x1="172" y1="184" x2="658" y2="184" stroke="white" strokeWidth="1.5" opacity="0.1"/>

            {/* ═══ PORT GANTRY CRANE ═══ */}
            <rect x="1082" y="298" width="20" height="122" rx="4"/>
            <rect x="1162" y="298" width="20" height="122" rx="4"/>
            <rect x="1062" y="292" width="140" height="16" rx="5"/>
            <rect x="1114" y="102" width="36" height="196" rx="6"/>
            <rect x="982" y="102" width="282" height="22" rx="6"/>
            <rect x="1150" y="102" width="114" height="16" rx="5" opacity="0.7"/>
            <rect x="1242" y="88" width="44" height="36" rx="5"/>
            <rect x="1046" y="120" width="38" height="20" rx="4"/>
            <line x1="1065" y1="138" x2="1065" y2="210" stroke="#0B1F3A" strokeWidth="5"/>
            <rect x="1030" y="208" width="72" height="12" rx="4"/>
            <rect x="1022" y="218" width="88" height="52" rx="5"/>
            <line x1="1066" y1="218" x2="1066" y2="270" stroke="white" strokeWidth="1.5" opacity="0.15"/>

            {/* ═══ TUGBOAT ═══ */}
            <path d="M38 358 L52 322 L212 322 L220 342 L222 358 Z"/>
            <rect x="66" y="297" width="92" height="28" rx="5"/>
            <rect x="112" y="277" width="28" height="22" rx="3"/>
            <circle cx="42" cy="347" r="10" opacity="0.6"/>
            <circle cx="220" cy="347" r="10" opacity="0.6"/>
            <rect x="73" y="302" width="16" height="11" rx="2" fill="white" opacity="0.2"/>
            <rect x="98" y="302" width="16" height="11" rx="2" fill="white" opacity="0.2"/>

            {/* ═══ LIGHTHOUSE ═══ */}
            <rect x="1318" y="202" width="40" height="178" rx="6"/>
            <rect x="1308" y="190" width="60" height="18" rx="4"/>
            <polygon points="1338,164 1364,190 1312,190"/>
            <rect x="1318" y="242" width="40" height="22" fill="white" opacity="0.18"/>
            <rect x="1318" y="292" width="40" height="22" fill="white" opacity="0.18"/>
            <rect x="1318" y="342" width="40" height="22" fill="white" opacity="0.18"/>
            <rect x="1298" y="378" width="80" height="16" rx="4"/>
            <path d="M1338 188 L1240 262 L1240 280 L1338 196 Z" opacity="0.08"/>
            <path d="M1338 188 L1400 258 L1400 276 L1338 200 Z" opacity="0.08"/>

            {/* ═══ BOLLARDS ═══ */}
            <rect x="102" y="362" width="14" height="20" rx="4"/>
            <rect x="142" y="362" width="14" height="20" rx="4"/>
            <rect x="962" y="362" width="14" height="20" rx="4"/>
            <rect x="1002" y="362" width="14" height="20" rx="4"/>

            {/* ═══ SEAGULLS ═══ */}
            <path d="M302 82 Q313 74 324 82" stroke="#0B1F3A" strokeWidth="4" fill="none"/>
            <path d="M334 68 Q346 60 358 68" stroke="#0B1F3A" strokeWidth="4" fill="none"/>
            <path d="M504 56 Q518 47 532 56" stroke="#0B1F3A" strokeWidth="4" fill="none"/>
            <path d="M560 44 Q572 36 584 44" stroke="#0B1F3A" strokeWidth="3.5" fill="none" opacity="0.7"/>

          </svg>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="inline-flex items-center justify-center gap-2 text-accent text-sm md:text-base font-black uppercase tracking-[0.25em]">
            <span className=" font-display w-8 h-[2px] bg-accent" />
            Corporate Trust
            <span className=" font-display w-8 h-[2px] bg-accent" />
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-black text-primary leading-tight mb-3">    Why Select
            <Image
              src="/logo.png"
              alt="Seatown"
              width={3012}
              height={1220}
              className="h-16 md:h-18 w-auto object-contain inline-block -mt-1"
              priority
            />
            For Ocean Logistics
          </h2>

          <div className="font-display grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
            {[
              { title: "Global Reach", desc: "Access to 50+ countries via direct cargo shipping contracts.", icon: Globe },
              { title: "Secure Cargo", desc: "Comprehensive monitoring and ISO container seal protocols.", icon: ShieldCheck },
              { title: "Fast Delivery", desc: "Optimized route dispatching and minimal transshipment delays.", icon: TrendingUp },
              { title: "Professional Team", desc: "Maritime veterans, customs specialists, and 24/7 client dispatchers.", icon: Users },
              { title: "Competitive Pricing", desc: "Transparent, optimized contracts suited for SME and Enterprise.", icon: Anchor },
              { title: "Real-Time Support", desc: "Direct customer service coordinates with global agent networks.", icon: Clock },
            ].map((feature, idx) => (
              <div key={idx} className="font-display glass-card p-6 rounded-2xl flex items-start gap-4 text-left group">
                <div className="p-3 bg-accent/5 text-accent rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-5.5 h-5.5 text-accent" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-primary mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-base font-semibold leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION — COUNTRIES WE ARE SERVING */}
      <section className="py-20 bg-white relative overflow-hidden border-t border-gray-100">
        {/* Anchor / Port Watermark */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <svg viewBox="0 0 800 800" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] max-w-3xl opacity-[0.03] mix-blend-multiply" xmlns="http://www.w3.org/2000/svg" fill="#0B1F3A">
            {/* Anchor */}
            <circle cx="400" cy="160" r="55" fill="none" stroke="#0B1F3A" strokeWidth="38"/>
            <circle cx="400" cy="160" r="18"/>
            <rect x="376" y="160" width="48" height="440" rx="18"/>
            <path d="M400 600 Q260 580 200 500" stroke="#0B1F3A" strokeWidth="38" fill="none" strokeLinecap="round"/>
            <path d="M400 600 Q540 580 600 500" stroke="#0B1F3A" strokeWidth="38" fill="none" strokeLinecap="round"/>
            <circle cx="200" cy="500" r="28"/>
            <circle cx="600" cy="500" r="28"/>
            <rect x="310" y="105" width="180" height="38" rx="16"/>
          </svg>
        </div>
        {/* Subtle grid dots background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40"
          style={{ backgroundImage: "radial-gradient(rgba(0,0,0,0.05) 1px, transparent 1px)", backgroundSize: "28px 28px" }}
        />
        {/* Gradient fade edges */}
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        {/* Header */}
        <div className="text-center mb-12 relative z-10 px-4">
          <span className="inline-flex items-center gap-2 text-accent text-sm md:text-base font-black uppercase tracking-[0.25em] mb-4">
            <span className=" font-display w-8 h-[2px] bg-accent" />
            Global Presence
            <span className=" font-display w-8 h-[2px] bg-accent" />
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-black text-primary leading-tight mb-3">
            Serving <span className="text-accent">50+ Countries</span> Worldwide
          </h2>
          <p className="font-display text-gray-500 text-base font-semibold max-w-xl mx-auto">
            Connecting The World with Reliable Logistics Solutions
          </p>
        </div>

        {/* ROW 1 — scrolls LEFT */}
        {(() => {
          const row1 = [
            { code: "in", name: "India" },
            { code: "my", name: "Malaysia" },
            { code: "vn", name: "Vietnam" },
            { code: "sg", name: "Singapore" },
            { code: "th", name: "Thailand" },
            { code: "ru", name: "Russia" },
            { code: "us", name: "United States" },
            { code: "sa", name: "Saudi Arabia" },
            { code: "om", name: "Oman" },
            { code: "qa", name: "Qatar" },
            { code: "bh", name: "Bahrain" },
            { code: "kw", name: "Kuwait" },
            { code: "de", name: "Germany" },
            { code: "fr", name: "France" },
            { code: "nl", name: "Netherlands" },
            { code: "it", name: "Italy" },
            { code: "es", name: "Spain" },
            { code: "tr", name: "Turkey" },
            { code: "pl", name: "Poland" },
            { code: "se", name: "Sweden" },
            { code: "no", name: "Norway" },
            { code: "dk", name: "Denmark" },
            { code: "pt", name: "Portugal" },
            { code: "gr", name: "Greece" },
            { code: "jo", name: "Jordan" },
            { code: "ma", name: "Morocco" },
            { code: "ar", name: "Argentina" },
            { code: "cl", name: "Chile" },
          ];
          const items = [...row1, ...row1, ...row1, ...row1];
          return (
            <div className="overflow-hidden mb-4 relative z-0">
              <div className=" font-display animate-marquee" style={{ display: "flex", gap: "16px" }}>
                {items.map((c, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 bg-accent/5 border border-accent/30 shadow-sm hover:border-accent hover:bg-accent/10 rounded-2xl px-5 py-3 shrink-0 transition-all duration-300 group cursor-default"
                  >
                    <div className="font-display w-11 h-8 rounded-md overflow-hidden border border-gray-200 shadow-sm shrink-0">
                      <Image
                        src={`https://flagcdn.com/w80/${c.code}.png`}
                        alt={c.name}
                        width={36}
                        height={24}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <span className="text-accent text-[11px] font-bold uppercase tracking-wider whitespace-nowrap transition-colors">
                      {c.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* ROW 2 — scrolls RIGHT (reverse) */}
        {(() => {
          const row2 = [
            { code: "gb", name: "United Kingdom" },
            { code: "lk", name: "Sri Lanka" },
            { code: "ae", name: "UAE" },
            { code: "bd", name: "Bangladesh" },
            { code: "id", name: "Indonesia" },
            { code: "hk", name: "Hong Kong" },
            { code: "cn", name: "China" },
            { code: "jp", name: "Japan" },
            { code: "kr", name: "South Korea" },
            { code: "za", name: "South Africa" },
            { code: "eg", name: "Egypt" },
            { code: "ke", name: "Kenya" },
            { code: "tz", name: "Tanzania" },
            { code: "ng", name: "Nigeria" },
            { code: "gh", name: "Ghana" },
            { code: "br", name: "Brazil" },
            { code: "mx", name: "Mexico" },
            { code: "ca", name: "Canada" },
            { code: "au", name: "Australia" },
            { code: "nz", name: "New Zealand" },
            { code: "ph", name: "Philippines" },
            { code: "kh", name: "Cambodia" },
            { code: "mm", name: "Myanmar" },
            { code: "tw", name: "Taiwan" },
            { code: "pk", name: "Pakistan" },
            { code: "np", name: "Nepal" },
            { code: "ch", name: "Switzerland" },
            { code: "be", name: "Belgium" },
          ];
          const items = [...row2, ...row2, ...row2, ...row2];
          return (
            <div className="overflow-hidden relative z-0">
              <div className="font-display animate-marquee-reverse" style={{ display: "flex", gap: "16px" }}>
                {items.map((c, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 bg-accent/5 border border-accent/30 shadow-sm hover:border-accent hover:bg-accent/10 rounded-2xl px-5 py-3 shrink-0 transition-all duration-300 group cursor-default"
                  >
                    <div className="w-11 h-8 rounded-md overflow-hidden border border-gray-200 shadow-sm shrink-0">
                      <Image
                        src={`https://flagcdn.com/w80/${c.code}.png`}
                        alt={c.name}
                        width={36}
                        height={24}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <span className=" font-display text-accent text-[11px] font-bold uppercase tracking-wider whitespace-nowrap transition-colors">
                      {c.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* Bottom stat strip */}
        <div className="text-center mt-10 relative z-10">
          <span className="inline-flex items-center gap-2 text-gray-500 text-[11px] font-bold uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            Active operations across 50+ nations
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          </span>
        </div>
      </section>

      {/* SECTION 8 - TESTIMONIALS */}
      <TestimonialSection />


    </div>
  );
}
