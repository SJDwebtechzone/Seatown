"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import GsapAnimation from "@/components/GsapAnimation";
import HeroSection from '@/components/HeroSection';

export default function Services() {
  

  return (
    <>
      {/* HERO: Cargo Vessel Animation */}
      <HeroSection 
        badge="Schedules & Operations"
        title="Our Services"
        subtitle="End-to-end logistics solutions designed to move your business forward."
        bgImage="/services.png"
      />
      <GsapAnimation targetId="ani-img" />

      {/* SERVICE DETAILS BLOCKS */}
      {/* FIX: scroll-mt-* added to every anchor section below. The header
          is `fixed`, so anchor-jumping to e.g. #nvocc was scrolling the
          section's top edge to the very top of the viewport, right behind
          the fixed header — clipping the heading. scroll-margin-top tells
          the browser to stop short and leave room for the header. */}

      {/* 1. NVOCC */}
      <section id="nvocc" className="scroll-mt-28 md:scroll-mt-32 pt-8 pb-20 md:py-20 border-b border-gray-100 bg-white relative overflow-hidden">
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 text-left relative overflow-hidden">
              {/* Ship Watermark */}
        <div className="absolute inset-0 scale-200 pointer-events-none z-0">
          <svg viewBox="0 0 1200 400" className="absolute right-0 bottom-0 w-3/4 h-3/4 opacity-[0.04] mix-blend-multiply" xmlns="http://www.w3.org/2000/svg" fill="#0B1F3A">
            <rect x="80" y="240" width="1040" height="30" rx="6"/>
            <rect x="120" y="185" width="880" height="60" rx="8"/>
            <rect x="200" y="140" width="600" height="50" rx="6"/>
            <rect x="280" y="100" width="200" height="45" rx="4"/>
            <rect x="300" y="65" width="40" height="38" rx="2"/>
            <rect x="220" y="155" width="50" height="38" rx="3"/>
            <rect x="275" y="155" width="50" height="38" rx="3"/>
            <rect x="330" y="155" width="50" height="38" rx="3"/>
            <rect x="385" y="155" width="50" height="38" rx="3"/>
            <rect x="440" y="155" width="50" height="38" rx="3"/>
            <rect x="495" y="155" width="50" height="38" rx="3"/>
            <rect x="220" y="114" width="50" height="38" rx="3"/>
            <rect x="275" y="114" width="50" height="38" rx="3"/>
            <rect x="330" y="114" width="50" height="38" rx="3"/>
            <path d="M0 275 Q150 258 300 275 T600 268 T900 275 T1200 268 L1200 300 L0 300 Z" opacity="0.5"/>
          </svg>
        </div>
              <span className="text-accent text-xs font-extrabold uppercase tracking-widest">01 / Carrier Operations</span>
              <h2 className="text-2xl md:text-3xl font-black text-primary mt-2 mb-6">NVOCC Services</h2>
              <p className="text-gray-600 text-base leading-relaxed mb-6 text-justify">
                Seatown Container Line acts as a certified Non-Vessel Operating Common Carrier (NVOCC). We maintain slot charter contracts with major shipping lines while operating our own fleet of dry van and special ISO container equipment, guaranteeing priority bookings on busy regional lanes.
                SEATOWN CONTAINER LINE PVT LTD has expanded its operations into Non-Vessel Operating Common Carrier (NVOCC) services to meet the growing trade demands. We provide professional and cost-effective port-to-port and door-to-door deliveries. Our innovative approach ensures customers receive the best value for end-to-end logistics solutions. Our global connections and efficient services help us maintain a strong market presence.
              </p>
              <ul className="space-y-3.5 text-sm font-semibold text-gray-500">
                <li className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 bg-accent rounded-full" /> Slot charter options on mainline carriers
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 bg-accent rounded-full" /> High frequency schedules in Middle East and Southeast Asia
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 bg-accent rounded-full" /> Full Container Load (FCL) bookings
                </li>
              </ul>
            </div>
            
            <div id="ani-img" className="lg:col-span-6 relative h-[320px] rounded-3xl overflow-hidden border border-gray-200/80 shadow-md group">
              <Image
                src="/services/container-ship-sailing.png"
                alt="Container Ship Sailing"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Freight Forwarding */}
      <section id="freight-forwarding" className="scroll-mt-28 md:scroll-mt-32 py-20 border-b border-gray-100 bg-zinc-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 lg:order-2 text-left relative overflow-hidden">
              <span className="text-accent text-xs font-extrabold uppercase tracking-widest">02 / Route Consolidation</span>
              <h2 className="text-2xl md:text-3xl font-black text-primary mt-2 mb-6">Ocean Freight Forwarding</h2>
              <p className="text-gray-600 text-base leading-relaxed mb-6 text-justify">
                Through our trusted network of global logistics partners, we organize multi-modal transport lines spanning water barge, feeder routes, and transshipment terminals to deliver cargo directly from manufacturers to end warehouses.
                SEATOWN CONTAINER LINE PVT LTD offers secure and reliable ocean freight forwarding solutions. Our services cover all cargo types, ensuring cost-effective and customized logistics solutions. We analyze the best transportation routes considering factors such as perishability, hazards, cost, transit time, and security, while also offering real-time tracking for shipments.
              </p>
              <ul className="space-y-3.5 text-sm font-semibold text-gray-500">
                <li className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 bg-accent rounded-full" /> LCL consolidation routes for small consignments
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 bg-accent rounded-full" /> Multimodal barge and rail tracking integration
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 bg-accent rounded-full" /> Door-to-door (DDU/DDP) fulfillment structures
                </li>
              </ul>
            </div>
            
            <div id="ani-img" className="lg:col-span-6 lg:order-1 relative h-[320px] rounded-3xl overflow-hidden border border-gray-200/80 shadow-md group">
              <Image
                src="/services/oceanfreight.avif"
                alt="Ocean Freight Forwarding"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Air Freight */}
      <section id="air-freight" className="scroll-mt-28 md:scroll-mt-32 py-20 border-b border-gray-100 bg-white relative overflow-hidden">
        
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 text-left relative overflow-hidden">
              {/* Cargo Plane Watermark */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <svg viewBox="0 0 1200 400" className="absolute w-full h-full opacity-[0.028] mix-blend-multiply" xmlns="http://www.w3.org/2000/svg" fill="#0B1F3A">
            {/* Plane body */}
            <ellipse cx="600" cy="200" rx="480" ry="55"/>
            {/* Nose cone */}
            <path d="M1075 200 Q1120 200 1150 215 Q1140 200 1150 185 Q1120 200 1075 200 Z"/>
            {/* Tail */}
            <path d="M125 200 Q80 200 50 190 Q60 200 50 210 Q80 200 125 200 Z"/>
            {/* Main wings */}
            <path d="M500 200 Q550 80 680 55 Q720 55 760 70 Q700 120 650 200 Z"/>
            <path d="M500 200 Q550 320 680 345 Q720 345 760 330 Q700 280 650 200 Z"/>
            {/* Tail wings */}
            <path d="M160 200 Q175 145 215 125 Q235 125 245 135 Q220 165 210 200 Z"/>
            <path d="M160 200 Q175 255 215 275 Q235 275 245 265 Q220 235 210 200 Z"/>
            {/* Engine pods */}
            <ellipse cx="620" cy="155" rx="55" ry="18"/>
            <ellipse cx="620" cy="245" rx="55" ry="18"/>
          </svg>
        </div>
              <span className="text-accent text-xs font-extrabold uppercase tracking-widest">03 / Rapid Transit</span>
              <h2 className="text-2xl md:text-3xl font-black text-primary mt-2 mb-6">Air Freight</h2>
              <p className="text-gray-600 text-base leading-relaxed mb-6 text-justify">
                When shipping latency is the critical parameter, our air freight division schedules immediate space allocations on primary international cargo airlines. We organize fast handling for electronics, parts, pharmaceutical, and high-value trade shipments.
                We provide flexible air freight solutions tailored to your business needs. Our service options include:
              </p>
              <ul className="space-y-3.5 text-sm font-semibold text-gray-500">
                <li className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 bg-accent rounded-full" /> Express: 1-2 days for urgent cargo
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 bg-accent rounded-full" /> Standard: 3-5 days for balanced speed and cost
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 bg-accent rounded-full" /> DEconomy: 5-7 days for maximum cost efficiency
                </li>
              </ul>
              <br/>
              <p className="text-gray-600 text-base leading-relaxed mb-6">Additionally, we offer charter services, air-sea combined solutions, and air-truck transport for inland deliveries.</p>
            </div>
            
            <div id="ani-img" className="lg:col-span-6 relative h-[320px] rounded-3xl overflow-hidden border border-gray-200/80 shadow-md group">
              <Image
                src="/services/airfreight.avif"
                alt="Air Freight"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* 4. Customs Clearance */}
      <section id="customs-clearance" className="scroll-mt-28 md:scroll-mt-32 py-20 border-b border-gray-100 bg-zinc-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 lg:order-2 text-left relative overflow-hidden">
              <span className="text-accent text-xs font-extrabold uppercase tracking-widest">04 / Cargo Compliance</span>
              <h2 className="text-2xl md:text-3xl font-black text-primary mt-2 mb-6">Customs Clearance & Brokerage</h2>
              <p className="text-gray-600 text-base leading-relaxed mb-6 text-justify">
                Our expert team provides customs clearance services at all major sea and airports in India. We handle import/export consignments, hazardous goods, perishables, and project cargo under various customs schemes. Our services include document filing, examination, stuffing/de-stuffing, warehousing, and final delivery.
              </p>
            </div>
            
            <div id="ani-img" className="lg:col-span-6 lg:order-1 relative h-[320px] rounded-3xl overflow-hidden border border-gray-200/80 shadow-md group">
              <Image
                src="/services/custombrokerage.jpeg"
                alt="Customs Brokerage"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* 5. Project Cargo */}
      <section id="project-cargo" className="scroll-mt-28 md:scroll-mt-32 py-20 border-b border-gray-100 bg-white relative overflow-hidden">
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 text-left relative overflow-hidden">
              {/* Crane Watermark */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <svg viewBox="0 0 1000 600" className="absolute right-0 bottom-0 w-2/3 h-full opacity-[0.03] mix-blend-multiply" xmlns="http://www.w3.org/2000/svg" fill="#0B1F3A">
            <rect x="480" y="20" width="38" height="420" rx="8"/>
            <rect x="160" y="20" width="640" height="26" rx="8"/>
            <rect x="340" y="44" width="40" height="24" rx="5"/>
            <rect x="355" y="67" width="7" height="130" rx="2"/>
            <rect x="333" y="195" width="50" height="34" rx="5"/>
            <rect x="293" y="228" width="130" height="68" rx="6"/>
            <rect x="358" y="228" width="5" height="68"/>
            <rect x="50" y="440" width="160" height="78" rx="5"/>
            <rect x="50" y="362" width="160" height="78" rx="5"/>
            <rect x="215" y="440" width="160" height="78" rx="5"/>
            <rect x="700" y="440" width="160" height="78" rx="5"/>
            <rect x="0" y="516" width="1000" height="18" rx="4"/>
            <rect x="460" y="430" width="20" height="88" rx="4"/>
            <rect x="520" y="430" width="20" height="88" rx="4"/>
          </svg>
        </div>
              <span className="text-accent text-xs font-extrabold uppercase tracking-widest">05 / Heavy Lift Logistics</span>
              <h2 className="text-2xl md:text-3xl font-black text-primary mt-2 mb-6">Project Cargo</h2>
              <p className="text-gray-600 text-base leading-relaxed mb-6 text-justify">
                We specialize in handling heavy lifts, out-of-gauge cargo, breakbulk, and high-value cargo. Our expertise extends to transporting mining equipment, generators, transformers, and construction equipment. With strong service contracts with major carriers and ship charterers, we offer DDU & DDP services for ODC and project shipments across India. Our long-standing partnerships in the trucking industry ensure competitive pricing for specialized transportation.</p>
            </div>
            
            <div id="ani-img" className="lg:col-span-6 relative h-[320px] rounded-3xl overflow-hidden border border-gray-200/80 shadow-md group">
              <Image
                src="/services/projectcargo.avif"
                alt="Project Cargo Logistics"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* 6. Container Trading */}
      <section id="container-trading" className="scroll-mt-28 md:scroll-mt-32 py-20 border-b border-gray-100 bg-zinc-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 lg:order-2 text-left relative overflow-hidden">
              <span className="text-accent text-xs font-extrabold uppercase tracking-widest">06 / Asset Management</span>
              <h2 className="text-2xl md:text-3xl font-black text-primary mt-2 mb-6">Container Trading & Sales</h2>
              <p className="text-gray-600 text-base leading-relaxed mb-6 text-justify">
                We supply new and used cargo-worthy ISO containers (20', 40' Dry, Reefers, Open Tops) for global trading, storage, or custom structural builds, with direct delivery to site yards.
              </p>
              <ul className="space-y-3.5 text-sm font-semibold text-gray-500">
                <li className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 bg-accent rounded-full" /> General Purpose Containers
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 bg-accent rounded-full" /> High Cube Containers
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 bg-accent rounded-full" /> Open Top Containers
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 bg-accent rounded-full" /> Refrigerated & Insulated Containers
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 bg-accent rounded-full" /> Flat Rack & Bed Containers
                </li>
              </ul>
            </div>
            
            <div id="ani-img" className="lg:col-span-6 lg:order-1 relative h-[320px] rounded-3xl overflow-hidden border border-gray-200/80 shadow-md group">
              <Image
                src="/services/containertrading.jpeg"
                alt="Container Trading & Sales"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* 7. Transportation */}
      <section id="transportation" className="scroll-mt-28 md:scroll-mt-32 py-20 bg-white relative overflow-hidden">
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 text-left relative overflow-hidden">
              {/* Truck Watermark */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <svg viewBox="0 0 1200 350" className="absolute w-full h-3/4 bottom-0 opacity-[0.03] mix-blend-multiply" xmlns="http://www.w3.org/2000/svg" fill="#0B1F3A">
            <rect x="80" y="155" width="180" height="120" rx="14"/>
            <rect x="258" y="125" width="850" height="150" rx="10"/>
            <rect x="80" y="272" width="1028" height="18" rx="4"/>
            <circle cx="175" cy="290" r="42"/>
            <circle cx="175" cy="290" r="20" fill="white" opacity="0.15"/>
            <circle cx="430" cy="290" r="42"/>
            <circle cx="430" cy="290" r="20" fill="white" opacity="0.15"/>
            <circle cx="560" cy="290" r="42"/>
            <circle cx="560" cy="290" r="20" fill="white" opacity="0.15"/>
            <circle cx="900" cy="290" r="42"/>
            <circle cx="900" cy="290" r="20" fill="white" opacity="0.15"/>
            <circle cx="1020" cy="290" r="42"/>
            <circle cx="1020" cy="290" r="20" fill="white" opacity="0.15"/>
            <rect x="0" y="330" width="1200" height="15" rx="4" opacity="0.4"/>
          </svg>
        </div>
              <span className="text-accent text-xs font-extrabold uppercase tracking-widest">07 / Multi-Modal Link</span>
              <h2 className="text-2xl md:text-3xl font-black text-primary mt-2 mb-6">Land Transportation & Haulage</h2>
              <p className="text-gray-600 text-base leading-relaxed mb-6 text-justify">
                Providing seamless container trucking hookups directly from port vessel discharges to inland logistics depots and customer store fronts.
              </p>
              <ul className="space-y-3.5 text-sm font-semibold text-gray-500">
                <li className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 bg-accent rounded-full" /> Empty Container Transport – We specialize in moving empty containers at competitive rates across major ports and ICDs.
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 bg-accent rounded-full" /> Export & Import Containers – Handling 20ft, 40ft, and 45ft containers across all major Indian ports.
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 bg-accent rounded-full" /> Reefer & Tank Containers – Transporting loaded and empty refrigerated or tank containers, including hazardous cargo.
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 bg-accent rounded-full" /> Flat Rack & Platform Containers – Managing in-gauge and out-gauge shipments efficiently.
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 bg-accent rounded-full" /> Project & Bulk Cargo – Custom transportation solutions for large-scale consignments, including industrial goods, chemicals, and fertilizers.
                </li>
                <li className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 bg-accent rounded-full" /> LCL & Consolidation Services – Competitive rates for small package transportation.
                </li>
              </ul>
            </div>
            
            <div id="ani-img" className="lg:col-span-6 relative h-[320px] rounded-3xl overflow-hidden border border-gray-200/80 shadow-md group">
              <Image
                src="/services/land-transport.avif"
                alt="Land Transportation"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* 8. Linear Agency */}
      <section id="linear-agency" className="scroll-mt-28 md:scroll-mt-32 py-20 border-b border-gray-100 bg-zinc-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 lg:order-2 text-left relative overflow-hidden">
              <span className="text-accent text-xs font-extrabold uppercase tracking-widest">08 / Strategic Agency Network</span>
              <h2 className="text-2xl md:text-3xl font-black text-primary mt-2 mb-6">Linear Agency</h2>
              <p className="text-gray-600 text-base leading-relaxed mb-6 text-justify">
                We act as a strategic link between local manufacturers, traders, shippers, and consignees, particularly along India’s west coast (Chennai, Nhava Sheva, Mundra, Tuticorin). Our strong relationships with local authorities, CFS operators, transporters, and terminal services help minimize operational costs for our principals. Our team excels in administration, sales, inventory management, and operations, ensuring satisfaction for all stakeholders.</p>
            </div>
            
            <div id="ani-img" className="lg:col-span-6 lg:order-1 relative h-[320px] rounded-3xl overflow-hidden border border-gray-200/80 shadow-md group">
              <Image
                src="/services/linearagency.png"
                alt="Container Trading & Sales"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

     
    </>
  );
}
