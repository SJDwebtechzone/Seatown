"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, Send } from "lucide-react";

const services = [
  { name: "NVOCC", path: "/services#nvocc" },
  { name: "Freight Forwarding", path: "/services#freight-forwarding" },
  { name: "Air Freight", path: "/services#air-freight" },
  { name: "Customs Clearance", path: "/services#customs-clearance" },
  { name: "Project Cargo", path: "/services#project-cargo" },
  { name: "Container Trading", path: "/services#container-trading" },
  { name: "Transportation", path: "/services#transportation" },
  { name: "Linear Agency", path: "/services#linear-agency" },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setServicesDropdownOpen(false);
  }, [pathname]);

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header
      className={`fixed top-[30px] inset-x-0 z-40 bg-white transition-all duration-300 ${
        scrolled
          ? "py-2 shadow-md border-b border-gray-100"
          : "py-3 shadow-sm border-b border-gray-50"
      }`}
    >
      <div className="h-16 md:h-20 flex items-center">
      <div className="w-full px-6 lg:px-12">
        <div className="flex items-center justify-between w-full gap-9">
          {/* Logo — FIX: nudged slightly left on mobile via negative margin,
              desktop (md+) unaffected */}
          <Link href="/" className="flex items-center group shrink-0 -ml-2 sm:-ml-1 md:ml-0">
            <Image 
              src="/logo.png" 
              alt="Seatown Logo" 
              width={400} 
              height={120} 
              className="h-14 md:h-16 w-auto object-contain" 
              priority 
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-9 flex-1 justify-center">
            <Link
              href="/"
              className={`text-[17px] font-bold uppercase tracking-wider relative transition-colors ${
                isActive("/") ? "text-primary" : "text-gray-500 hover:text-primary"
              }`}
            >
              Home
              {isActive("/") && (
                <span className="absolute left-0 right-0 -bottom-2 h-[2.5px] bg-accent rounded-full animate-pulse" />
              )}
            </Link>

            <Link
              href="/about"
              className={`text-[17px] font-bold uppercase tracking-wider relative transition-colors ${
                isActive("/about") ? "text-primary" : "text-gray-500 hover:text-primary"
              }`}
            >
              About Us
              {isActive("/about") && (
                <span className="absolute left-0 right-0 -bottom-2 h-[2.5px] bg-accent rounded-full" />
              )}
            </Link>

            {/* Services Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setServicesDropdownOpen(true)}
              onMouseLeave={() => setServicesDropdownOpen(false)}
            >
              <Link
                href="/services"
                className={`text-[17px] font-bold uppercase tracking-wider relative transition-colors flex items-center gap-1 ${
                  isActive("/services") ? "text-primary" : "text-gray-500 hover:text-primary"
                }`}
              >
                Services
                <ChevronDown className="w-3.5 h-3.5 transition-transform duration-300" style={{ transform: servicesDropdownOpen ? 'rotate(180deg)' : 'rotate(0)' }} />
                {isActive("/services") && (
                  <span className="absolute left-0 right-0 -bottom-2 h-[2.5px] bg-accent rounded-full" />
                )}
              </Link>

              {/* Dropdown Menu */}
              <div
                className={`absolute left-0 top-full w-60 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 transition-all duration-300 origin-top-left ${
                  servicesDropdownOpen
                    ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                    : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                }`}
              >
                {services.map((service) => (
                  <Link
                    key={service.name}
                    href={service.path}
                    className="block px-5 py-2.5 text-sm font-bold text-gray-600 hover:text-primary hover:bg-gray-50 transition-colors"
                  >
                    {service.name}
                  </Link>
                ))}
              </div>
            </div>

            <Link
              href="/blog"
              className={`text-[17px] font-bold uppercase tracking-wider relative transition-colors ${
                isActive("/blog") ? "text-primary" : "text-gray-500 hover:text-primary"
              }`}
            >
              Blogs
              {isActive("/blog") && (
                <span className="absolute left-0 right-0 -bottom-2 h-[2.5px] bg-accent rounded-full" />
              )}
            </Link>

            <Link
              href="/contact"
              className={`text-[17px] font-bold uppercase tracking-wider relative transition-colors ${
                isActive("/contact") ? "text-primary" : "text-gray-500 hover:text-primary"
              }`}
            >
              Contact
              {isActive("/contact") && (
                <span className="absolute left-0 right-0 -bottom-2 h-[2.5px] bg-accent rounded-full" />
              )}
            </Link>
          </nav>

          {/* Quick CTA Actions */}
          <div className="hidden md:flex items-center">
            {/* Premium Gold Get Quote CTA */}
            <Link
              href="/contact?quote=1"
              className="text-[15px] font-black uppercase tracking-widest bg-accent text-white pl-6 pr-5 py-3 rounded-full hover:brightness-110 shadow-lg transition-all flex items-center gap-2 group"
            >
              Get Quote
              <Send className="w-3.5 h-3.5 rotate-45 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-primary hover:text-accent rounded-xl transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-x-0 top-[94px] bottom-0 z-30 bg-white border-t border-gray-100 md:hidden transition-transform duration-300 ease-in-out  ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 flex flex-col gap-6 h-full overflow-y-auto">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`text-lg font-bold uppercase tracking-wider ${isActive("/") ? "text-accent" : "text-primary"}`}
          >
            Home
          </Link>
          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className={`text-lg font-bold uppercase tracking-wider ${isActive("/about") ? "text-accent" : "text-primary"}`}
          >
            About Us
          </Link>
          <div className="flex flex-col gap-2">
            <Link
              href="/services"
              onClick={() => setMobileMenuOpen(false)}
              className={`text-lg font-bold uppercase tracking-wider ${isActive("/services") ? "text-accent" : "text-primary"}`}
            >
              Services
            </Link>
            <div className="pl-4 border-l border-gray-200 flex flex-col gap-3.5 mt-2">
              {services.map((service) => (
                <Link
                  key={service.name}
                  href={service.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-[15px] font-semibold text-gray-500 hover:text-primary"
                >
                  {service.name}
                </Link>
              ))}
            </div>
          </div>
          <Link
            href="/blog"
            onClick={() => setMobileMenuOpen(false)}
            className={`text-lg font-bold uppercase tracking-wider ${isActive("/blog") ? "text-accent" : "text-primary"}`}
          >
            Blogs
          </Link>
          <Link
            href="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className={`text-lg font-bold uppercase tracking-wider ${isActive("/contact") ? "text-accent" : "text-primary"}`}
          >
            Contact
          </Link>

          <div className="mt-8 border-t border-gray-100 pt-6">
            <Link
              href="/contact?quote=1"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center block bg-accent text-white py-3.5 rounded-full font-bold uppercase tracking-wider text-sm shadow-lg hover:brightness-110 transition-all"
            >
              Get Quote
            </Link>
          </div>
        </div>
      </div>
      </div>
    </header>
  );
}
