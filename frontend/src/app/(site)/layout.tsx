import type { Metadata } from "next";
import { Playfair_Display, Space_Grotesk } from "next/font/google";
import "../../globals.css"
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LoadingScreen from "@/components/LoadingScreen";
import ScrollProgress from "@/components/ScrollProgress";
import TimezoneTicker from "@/components/TimezoneTicker";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-Playfair_Display",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "Seatown Container Line | Global Ocean Logistics Experience",
  description: "Experience premium international shipping, maritime container logistics, NVOCC cargo networks, and modern real-time ocean trade connectivity.",
  icons: {
    icon: "/favicon.png",
  },
};

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${spaceGrotesk.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-primary font-sans antialiased overflow-x-hidden pt-[30px]">
        {/* Global Premium Effects */}
        <TimezoneTicker />
        <LoadingScreen />
        <ScrollProgress />

        {/* Global Navigation Header */}
        <Header />

        {/* Page Content Layout */}
        <main className="flex-grow flex flex-col">
          {children}
        </main>

        {/* Global Footer */}
        <Footer />
      </body>
    </html>
  );
}