"use client";

import React, { useState, useEffect, useRef } from "react";

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

function AnimatedCounter({ end, suffix, className }: { end: number; suffix: string; className?: string }) {
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
    <div ref={ref} className={className}>
      {count.toLocaleString()}{suffix}
    </div>
  );
}
import Link from "next/link";
import HeroSection from "@/components/HeroSection";
import {
  Globe,
  Shield,
  Users,
  TrendingUp,
  ArrowRight,
  Ship,
  Eye,
  Gem,
  Award,
  CheckCircle,
  Compass,
  Mail,
  Clock,
} from "lucide-react";

export default function AboutUs() {
  // Timeline Active Step
  const [activeTimeline, setActiveTimeline] = useState(0);
  const timelineSteps = [
    { year: "2012", title: "Founded", desc: "Seatown Container Line was established in Chennai, India with 2 local vessel arrangements." },
    { year: "2016", title: "Corridor Growth", desc: "Acquired first dry container fleet inventory and established the UAE corridor." },
    { year: "2020", title: "Global Expansion", desc: "Incorporated NVOCC operations in Singapore, Malaysia, and ports across China." },
    { year: "2024", title: "Digital Operations", desc: "Implemented integrated container tracking and consolidated project cargo services." },
    { year: "2026", title: "Future Vision", desc: "Targeting carbon-offset logistics and expanding regional feeder logistics routes." },
  ];

  // Rotating Compass
  const [compassAngle, setCompassAngle] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setCompassAngle((p) => (p + 90) % 360), 4000);
    return () => clearInterval(timer);
  }, []);

  const stats = [
    { icon: Globe, num: 50, suffix: "+", label: "Countries Connected" },
    { icon: Ship, num: 10000, suffix: "+", label: "Shipments Handled" },
    { icon: Users, num: 100, suffix: "+", label: "Business Partners" },
    { icon: Clock, num: 24, suffix: "/7", label: "Customer Support" },
  ];

  const features = [
    { icon: Globe, label: "Global Network" },
    { icon: Shield, label: "Reliable Operations" },
    { icon: Users, label: "Customer Focused" },
    { icon: TrendingUp, label: "Proven Expertise" },
  ];

  return (
    <div className="w-full flex flex-col">

      {/* ═══════════════════════════════════════════════════
          HERO — FULL VIEW BANNER
      ═══════════════════════════════════════════════════ */}
      <HeroSection 
        badge="Who We Are"
        title="About Seatown Container Line"
        subtitle="Charting Safe Ocean Shipping Routes Worldwide"
        bgImage="/aboutus.png"
      />

      {/* ═══════════════════════════════════════════════════
          ABOUT CONTENT & STATS
      ═══════════════════════════════════════════════════ */}
      <section className="pt-8 pb-20 md:py-20 bg-white relative overflow-hidden">
        {/* Crane & Container Stack Watermark */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <svg viewBox="0 0 1000 600" className="absolute w-full h-full opacity-[0.03] mix-blend-multiply" xmlns="http://www.w3.org/2000/svg" fill="#0B1F3A">
            {/* Crane Tower */}
            <rect x="480" y="50" width="40" height="400" rx="8"/>
            {/* Crane Boom horizontal */}
            <rect x="200" y="50" width="600" height="28" rx="8"/>
            {/* Counter-jib */}
            <rect x="480" y="50" width="180" height="20" rx="6"/>
            {/* Crane trolley */}
            <rect x="340" y="74" width="40" height="25" rx="5"/>
            {/* Crane cable */}
            <rect x="355" y="98" width="8" height="120" rx="2"/>
            {/* Crane hook box */}
            <rect x="335" y="215" width="48" height="35" rx="5"/>
            {/* Container being lifted */}
            <rect x="295" y="248" width="130" height="70" rx="6"/>
            <rect x="295" y="248" width="130" height="5"/>
            <rect x="358" y="248" width="5" height="70"/>
            {/* Ground containers stack */}
            <rect x="60" y="430" width="160" height="80" rx="5"/>
            <rect x="60" y="350" width="160" height="80" rx="5"/>
            <rect x="60" y="270" width="160" height="80" rx="5"/>
            <rect x="228" y="430" width="160" height="80" rx="5"/>
            <rect x="228" y="350" width="160" height="80" rx="5"/>
            <rect x="700" y="430" width="160" height="80" rx="5"/>
            <rect x="700" y="350" width="160" height="80" rx="5"/>
            <rect x="868" y="430" width="130" height="80" rx="5"/>
            {/* Ground line */}
            <rect x="0" y="508" width="1000" height="18" rx="4"/>
            {/* Crane legs */}
            <rect x="460" y="440" width="20" height="68" rx="4"/>
            <rect x="520" y="440" width="20" height="68" rx="4"/>
          </svg>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left: Text Content */}
            <div className="lg:col-span-7">
              <h2 className="text-3xl font-black text-primary mb-6">Our Story</h2>
              <div className="w-12 h-[3px] bg-accent rounded-full mb-8" />
              
              <p className="text-gray-600 text-base md:text-[17px] leading-relaxed mb-5 text-justify">
                <strong className="text-primary font-black">SEATOWN CONTAINER LINE</strong> is one of the fastest-growing shipping and logistics companies, specializing in NVOCC, freight forwarding, air cargo, container trading, customs brokerage, and transportation services across India. Established in 2025, our head office is in Chennai, with planned branches in Mundra, Nhava Sheva, and Tuticorin, as well as ICD locations across India.
              </p>
              <p className="text-gray-600 text-base md:text-[17px] leading-relaxed mb-5 text-justify">
                Since our inception, we have rapidly expanded and are now a regular container carrier serving the Middle East, Far East, Indian Subcontinent (ISC), Southeast Asia, Red Sea Ports, Africa, Russia, Europe, the USA, and the UK.
              </p>
              <p className="text-gray-600 text-base md:text-[17px] leading-relaxed mb-5 text-justify">
                We are committed to creating value for our clients through innovative partnerships and cutting-edge technology. Our motto, &quot;Customer Satisfaction,&quot; drives our dedicated team to provide reliable, efficient, and cost-effective services. Our professionally trained staff ensures quality shipping solutions at all times.
              </p>
              <p className="text-gray-600 text-base md:text-[17px] leading-relaxed mb-10 text-justify">
                At SEATOWN CONTAINER LINE, we continue to explore, expand, and grow in the cargo transportation and logistics industry by delivering high-quality services. Our goal is to make global trade seamless and accessible for our clients through our shipping and logistics expertise.
              </p>

              {/* Inline Feature Pills */}
              <div className="flex flex-wrap gap-x-6 gap-y-4">
                {features.map((feat, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="p-2 bg-secondary/10 rounded-lg">
                      <feat.icon className="w-5 h-5 text-secondary" />
                    </div>
                    <span className="text-base md:text-[17px] font-bold text-primary">{feat.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Stats Grid */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
                {stats.map((stat, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center justify-center gap-4 bg-[#2165ae] text-white rounded-3xl p-8 md:p-10 shadow-xl border border-white/10 text-center hover:scale-[1.02] transition-transform duration-300"
                  >
                    <div className="p-3 bg-secondary/20 border border-secondary/20 rounded-2xl">
                      <stat.icon className="w-8 h-8 text-secondary" />
                    </div>
                    <div>
                      <AnimatedCounter end={stat.num} suffix={stat.suffix} className="text-4xl md:text-5xl font-black leading-none text-white mb-3" />
                      <div className="text-xs md:text-sm font-bold uppercase text-gray-400 tracking-wider">{stat.label}</div>
                    </div>
                  </div>
                ))}
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          MISSION / VISION / VALUES / PROMISE — 4 CARDS
      ═══════════════════════════════════════════════════ */}
      <section className="py-14 bg-gray-50 border-t border-gray-100 relative overflow-hidden">
        {/* Cargo Truck Watermark */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <svg viewBox="0 0 1200 350" className="absolute w-full h-full opacity-[0.025] mix-blend-multiply" xmlns="http://www.w3.org/2000/svg" fill="#0B1F3A">
            {/* Truck cabin */}
            <rect x="80" y="160" width="180" height="120" rx="14"/>
            <rect x="95" y="175" width="120" height="60" rx="8" fill="white"/>
            {/* Cab window */}
            <rect x="100" y="180" width="110" height="50" rx="6" fill="white" opacity="0.3"/>
            {/* Trailer */}
            <rect x="258" y="130" width="850" height="150" rx="10"/>
            {/* Trailer door details */}
            <rect x="870" y="140" width="8" height="130" rx="3" fill="white" opacity="0.15"/>
            <rect x="880" y="155" width="210" height="100" rx="6" fill="white" opacity="0.08"/>
            {/* Undercarriage */}
            <rect x="80" y="278" width="1028" height="18" rx="4"/>
            {/* Wheels */}
            <circle cx="175" cy="295" r="42" fill="#0B1F3A"/>
            <circle cx="175" cy="295" r="22" fill="white" opacity="0.15"/>
            <circle cx="430" cy="295" r="42"/>
            <circle cx="430" cy="295" r="22" fill="white" opacity="0.15"/>
            <circle cx="560" cy="295" r="42"/>
            <circle cx="560" cy="295" r="22" fill="white" opacity="0.15"/>
            <circle cx="900" cy="295" r="42"/>
            <circle cx="900" cy="295" r="22" fill="white" opacity="0.15"/>
            <circle cx="1020" cy="295" r="42"/>
            <circle cx="1020" cy="295" r="22" fill="white" opacity="0.15"/>
            {/* Road */}
            <rect x="0" y="335" width="1200" height="15" rx="4" opacity="0.4"/>
          </svg>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">

            {/* Mission */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition-all duration-300 group">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-secondary/10 border border-secondary/15 rounded-xl">
                  <Ship className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="text-xl md:text-2xl font-black text-primary">Our Mission</h3>
              </div>
              <div className="w-10 h-[3px] bg-accent rounded-full mb-4" />
              <p className="text-gray-600 text-base md:text-[17px] leading-relaxed font-medium text-justify">
                &quot;To provide reliable, efficient, and sustainable shipping solutions that connect businesses and communities worldwide. We are committed to delivering excellence through innovation, safety, and environmental responsibility while ensuring customer satisfaction and operational efficiency.&quot;
              </p>
            </div>

            {/* Vision */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition-all duration-300 group">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-secondary/10 border border-secondary/15 rounded-xl">
                  <Eye className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="text-xl md:text-2xl font-black text-primary">Our Vision</h3>
              </div>
              <div className="w-10 h-[3px] bg-accent rounded-full mb-4" />
              <p className="text-gray-600 text-base md:text-[17px] leading-relaxed font-medium text-justify">
                &quot;To be the world&apos;s leading shipping company, pioneering eco-friendly logistics, enhancing global trade, and redefining maritime transportation with cutting-edge technology and exceptional service.&quot;
              </p>
            </div>

            {/* What We Do */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition-all duration-300 group">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-secondary/10 border border-secondary/15 rounded-xl">
                  <Globe className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="text-xl md:text-2xl font-black text-primary">What We Do</h3>
              </div>
              <div className="w-10 h-[3px] bg-accent rounded-full mb-4" />
              <ul className="space-y-3 text-gray-600 text-base md:text-[17px] leading-relaxed font-medium mb-4">
                <li><strong className="text-primary font-bold">Get Set Go</strong> &ndash; Swift shipping solutions.</li>
                <li><strong className="text-primary font-bold">Consider It Done</strong> &ndash; Customized multimodal transport.</li>
                <li><strong className="text-primary font-bold">Professionally Yours</strong> &ndash; Top-tier global network.</li>
              </ul>
              <p className="text-gray-500  text-justify text-sm md:text-base font-semibold leading-relaxed border-t border-gray-100 pt-4">
                With in-depth industry knowledge and a strong network, we deliver exceptional service.
              </p>
            </div>

            {/* Core Values */}
            <div className="bg-white border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-secondary/10 border border-secondary/15 rounded-xl">
                  <Gem className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="text-xl md:text-2xl font-black text-primary">Our Core Values</h3>
              </div>
              <div className="w-10 h-[3px] bg-accent rounded-full mb-4" />
              <ul className="space-y-4 text-gray-600 text-base md:text-[17px] leading-relaxed font-medium">
                <li><strong className="text-primary font-bold block mb-1 text-justify">Be Safe, Not Sorry</strong> Safety is our top priority. Prevention is better than regret.</li>
                <li><strong className="text-primary font-bold block mb-1 text-justify">Customers Always in Mind</strong> We listen, learn, and anticipate needs because their success is ours.</li>
              </ul>
            </div>

          </div>
        </div>
      </section>


    </div>
  );
}
