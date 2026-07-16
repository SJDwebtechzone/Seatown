"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, Smartphone } from "lucide-react";

export default function Footer() {

  return (
    <footer className="bg-white text-primary pt-8 pb-8 relative overflow-hidden border-t-4 border-accent select-none">
      {/* Decorative background grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]" 
        style={{ 
          backgroundImage: "radial-gradient(#000000 1px, transparent 1px)", 
          backgroundSize: "20px 20px" 
        }} 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12 justify-between">
          {/* Company Brief */}
          <div>
            <div className="flex items-center w-full max-w-[320px]">
              <Image 
                src="/logo.png" 
                alt="Seatown Container Line Logo" 
                width={400} 
                height={140} 
                className="h-16 md:h-20 w-auto object-contain" 
              />
            </div>
            <p className="text-justify text-gray-600 text-base font-semibold leading-relaxed mb-6">
              Empowering global trade routes since 2012. Providing premium maritime logistics, NVOCC cargo shipping, and end-to-end container tracking solutions.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="https://www.instagram.com/seatownlines?igsh=ZXNuMjR6OGxjczZ0" className="p-2.5 bg-accent/10 hover:bg-accent text-accent hover:text-white rounded-full transition-all" aria-label="Instagram">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              <a href="#" className="p-2.5 bg-accent/10 hover:bg-accent text-accent hover:text-white rounded-full transition-all" aria-label="Facebook">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
              </a>
              <a href="#" className="p-2.5 bg-accent/10 hover:bg-accent text-accent hover:text-white rounded-full transition-all" aria-label="X (Twitter)">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"/></svg>
              </a>
              <a href="#" className="p-2.5 bg-accent/10 hover:bg-accent text-accent hover:text-white rounded-full transition-all" aria-label="YouTube">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              <a href="#" className="p-2.5 bg-accent/10 hover:bg-accent text-accent hover:text-white rounded-full transition-all" aria-label="Telegram">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.892-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
              </a>
              <a href="https://www.linkedin.com/in/james-l-47099b41b/?skipRedirect=true" className="p-2.5 bg-accent/10 hover:bg-accent text-accent hover:text-white rounded-full transition-all" aria-label="LinkedIn">
  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.114 20.452H3.558V9h3.556v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
</a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col md:text-left md:justify-self-center">
            <div className="w-fit text-left md:text-left">
              <h4 className="text-sm font-bold uppercase tracking-wider text-accent mb-4">
                Explore Links
              </h4>
              <ul className="space-y-2.5 text-base font-semibold">
                <li>
                  <Link href="/" className="text-gray-600 hover:text-primary transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="text-gray-600 hover:text-primary transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="text-gray-600 hover:text-primary transition-colors">
                    Services
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-gray-600 hover:text-primary transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-gray-600 hover:text-primary transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-accent mb-4">
              Primary Office
            </h4>
            <ul className="space-y-3.5 text-base font-semibold text-gray-600">
              <li className="flex items-start gap-3">
                <MapPin className="w-4.5 h-4.5 text-secondary shrink-0 mt-0.5" />
                {/* <span className="text-justify leading-relaxed">
                  <strong className="text-primary text-justify">SEATOWN CONTAINER LINE PVT LTD </strong><br />
                   */}
                   {/* <span className="text-justify leading-relaxed">
  <strong className="text-justify">
    <span className="text-[#2264AD]">SEA</span>
    <span className="text-[#8D6920]">TOWN</span> CONTAINER LINE PVT LTD
  </strong><br />
                  New No.89 (Old No.45), Marine Tower,<br />
                  4th Floor Room No-8, Thambu Chetty Street,<br />
                  Chennai – 600 001
                </span> */}
                <span className="text-justify leading-relaxed">
  <strong className="text-justify">
    <span className="text-[#2264AD]">SEA</span>
    <span className="text-[#8D6920]">TOWN</span> CONTAINER LINE PVT LTD
  </strong><br />
  <span className="text-[#2264AD]">New No.89 (Old No.45), Marine Tower,</span><br />
  <span className="text-[#8D6920]">4th Floor Room No-8, Thambu Chetty Street,</span><br />
  <span className="text-[#2264AD]">Chennai – 600 001</span>
</span>
              </li>
              <li className="flex flex-col gap-2.5">
                <a href="tel:+919384622560" className="flex items-center gap-3 hover:text-primary transition-colors"><Smartphone className="w-4.5 h-4.5 text-accent shrink-0" /> +91 93846 22560</a>
                <a href="tel:+919840456693" className="flex items-center gap-3 hover:text-primary transition-colors"><Smartphone className="w-4.5 h-4.5 text-accent shrink-0" /> +91 98404 56693</a>
                <a href="tel:04446463747" className="flex items-center gap-3 hover:text-primary transition-colors"><Phone className="w-4 h-4 text-accent shrink-0 ml-0.5" /> 044- 4646 3747</a>
              </li>
              <li className="flex items-center gap-3 pt-1">
                <Mail className="w-4.5 h-4.5 text-accent shrink-0" />
                <a href="mailto:James@seatown.in" className="hover:text-primary transition-colors">James@seatown.in</a>
              </li>
            </ul>
          </div>

          
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 pt-8 flex justify-center items-center text-center">
          <p className="text-base font-semibold text-gray-500">
            &copy; 2026 All rights reserved | by{" "}
            <a
              href="https://devspectra.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-primary transition-colors font-bold"
            >
              DevSpectra
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
