"use client";

import React, { useState, createContext, useContext } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  MessageSquare,
  Globe,
  Image as ImageIcon,
  Mail,
  Settings,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Bell,
  User as UserIcon,
  ShieldAlert,
  Loader2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import SeatownLogo from "@/components/SeatownLogo";

// Toast Context Types
export type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logout, hasRole } = useAuth();
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  
  // Toast State
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: ToastType = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
        <p className="text-gray-500 font-bold uppercase tracking-wider text-xs">
          Loading Seatown Portal...
        </p>
      </div>
    );
  }

  if (!user) {
    return null; // Redirected by middleware
  }

  // Navigation Items with Role Restrictions
  const navItems = [
    {
      name: "User Management",
      path: "/dashboard/users",
      icon: Users,
      roles: ["Super Admin"],
    },
    {
      name: "Blog CMS",
      path: "/dashboard/blog",
      icon: BookOpen,
      roles: ["Super Admin", "Administrator", "Editor"],
    },
    {
      name: "Review Moderation",
      path: "/dashboard/reviews",
      icon: MessageSquare,
      roles: ["Super Admin", "Administrator", "Editor", "Moderator"],
    },
  ];

  const allowedNavItems = navItems.filter((item) => hasRole(item.roles));

  // Generate breadcrumbs from path
  const getBreadcrumbs = () => {
    const paths = pathname.split("/").filter(Boolean);
    return paths.map((path, index) => {
      const url = `/${paths.slice(0, index + 1).join("/")}`;
      const isLast = index === paths.length - 1;
      const label = path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, " ");

      return { label, url, isLast };
    });
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <ToastContext.Provider value={{ showToast }}>
      <div className="min-h-screen bg-gray-50 flex relative overflow-hidden">
        {/* TOAST NOTIFICATION CONTAINER */}
        <div className="fixed top-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`pointer-events-auto p-4 rounded-2xl shadow-xl border flex items-start gap-3 animate-slide-in transition-all duration-300 ${
                toast.type === "success"
                  ? "bg-green-50 border-green-100 text-green-800"
                  : toast.type === "error"
                  ? "bg-red-50 border-red-100 text-red-800"
                  : toast.type === "warning"
                  ? "bg-yellow-50 border-yellow-100 text-yellow-800"
                  : "bg-blue-50 border-blue-100 text-blue-800"
              }`}
            >
              {toast.type === "success" && <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />}
              {toast.type === "error" && <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />}
              {toast.type === "warning" && <ShieldAlert className="w-5 h-5 text-yellow-600 shrink-0" />}
              {toast.type === "info" && <UserIcon className="w-5 h-5 text-blue-600 shrink-0" />}
              <div className="text-sm font-semibold leading-relaxed">{toast.message}</div>
            </div>
          ))}
        </div>

        {/* SIDEBAR - DESKTOP */}
        <aside
          className={`hidden md:flex flex-col bg-[#0B1F3A] text-white transition-all duration-300 ease-in-out border-r border-[#152e4f] shrink-0 relative z-30 ${
            sidebarCollapsed ? "w-20" : "w-64"
          }`}
        >
          {/* Logo Section */}
          <div className="h-20 flex items-center px-6 border-b border-[#152e4f] overflow-hidden justify-between">
            {!sidebarCollapsed ? (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shrink-0">
                  <span className="font-black text-white text-lg">S</span>
                </div>
                <div className="leading-none text-left">
                  <p className="text-accent uppercase tracking-widest text-[10px] font-black">
                    Seatown
                  </p>
                  <p className="text-xs font-black text-white">Admin Panel</p>
                </div>
              </div>
            ) : (
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center mx-auto shrink-0">
                <span className="font-black text-white text-lg">S</span>
              </div>
            )}
          </div>

          {/* Nav Links */}
          <nav className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto">
            {allowedNavItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                item.path === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(item.path);

              return (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-200 group ${
                    isActive
                      ? "bg-accent text-white shadow-lg shadow-accent/15"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                  title={sidebarCollapsed ? item.name : undefined}
                >
                  <Icon
                    className={`w-5 h-5 shrink-0 ${
                      isActive ? "text-white" : "text-gray-400 group-hover:text-white"
                    }`}
                  />
                  {!sidebarCollapsed && <span>{item.name}</span>}
                </Link>
              );
            })}
          </nav>

          {/* FIX: persistent Sign Out button on the desktop sidebar —
              previously the only way to log out on desktop was to click
              the profile chip in the topbar and find it inside a dropdown.
              This mirrors the pattern already used in the mobile drawer. */}
          <div className="px-4 py-4 border-t border-[#152e4f]">
            <button
              onClick={logout}
              title={sidebarCollapsed ? "Sign Out" : undefined}
              className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-bold uppercase tracking-wider text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all cursor-pointer"
            >
              <LogOut className="w-5 h-5 shrink-0" />
              {!sidebarCollapsed && <span>Sign Out</span>}
            </button>
          </div>

          {/* Collapse Button */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="absolute bottom-6 -right-3.5 w-7 h-7 rounded-full bg-accent hover:brightness-110 text-white flex items-center justify-center shadow-lg border border-[#0b1f3a] cursor-pointer"
          >
            {sidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </aside>

        {/* MOBILE DRAWER SIDEBAR */}
        <div
          className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 md:hidden ${
            mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setMobileMenuOpen(false)}
        >
          <aside
            className={`w-64 max-w-xs h-full bg-[#0B1F3A] flex flex-col text-white transition-transform duration-300 ease-in-out ${
              mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-20 flex items-center justify-between px-6 border-b border-[#152e4f]">
              <div className="flex items-center gap-2 text-left">
                <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                  <span className="font-black text-white text-lg">S</span>
                </div>
                <div className="leading-none">
                  <p className="text-accent uppercase tracking-widest text-[10px] font-black">
                    Seatown
                  </p>
                  <p className="text-xs font-black text-white">Admin Panel</p>
                </div>
              </div>
              <button onClick={() => setMobileMenuOpen(false)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <nav className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto text-left">
              {allowedNavItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.path === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname.startsWith(item.path);

                return (
                  <Link
                    key={item.name}
                    href={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-200 ${
                      isActive ? "bg-accent text-white shadow-lg" : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="p-6 border-t border-[#152e4f] text-left">
              <button
                onClick={logout}
                className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-bold uppercase tracking-wider text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all cursor-pointer"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
            </div>
          </aside>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
          {/* TOPBAR */}
          <header className="h-20 bg-white border-b border-gray-200 flex items-center px-6 justify-between sticky top-0 z-20 shrink-0">
            <div className="flex items-center gap-4">
              {/* Mobile Menu Trigger */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden text-gray-500 hover:text-primary cursor-pointer"
              >
                <Menu size={24} />
              </button>

              {/* Breadcrumbs */}
              <nav className="hidden sm:flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-gray-400">
                <Link href="/dashboard" className="hover:text-primary">
                  Portal
                </Link>
                {breadcrumbs.map((crumb, index) => (
                  <React.Fragment key={crumb.url}>
                    <span>/</span>
                    {crumb.isLast ? (
                      <span className="text-primary font-black">{crumb.label}</span>
                    ) : (
                      <Link href={crumb.url} className="hover:text-primary">
                        {crumb.label}
                      </Link>
                    )}
                  </React.Fragment>
                ))}
              </nav>
            </div>

            {/* Topbar Actions */}
            <div className="flex items-center gap-4 relative">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => {
                    setNotificationsOpen(!notificationsOpen);
                    setProfileDropdownOpen(false);
                  }}
                  className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-primary relative cursor-pointer"
                >
                  <Bell size={20} />
                  <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-accent animate-pulse" />
                </button>

                {/* Notifications Dropdown */}
                {notificationsOpen && (
                  <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-gray-200 py-3 z-50 text-left animate-fade-in">
                    <div className="px-5 py-2.5 border-b border-gray-100 flex justify-between items-center">
                      <h3 className="font-extrabold text-xs uppercase tracking-wider text-primary">
                        Recent Notifications
                      </h3>
                      <span className="text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded-full font-black">
                        New
                      </span>
                    </div>
                    <div className="max-h-64 overflow-y-auto divide-y divide-gray-50">
                      <div className="px-5 py-3 hover:bg-gray-50">
                        <p className="text-xs text-gray-800 font-semibold leading-relaxed">
                          New customer review submitted by <strong>Marcus Thorne</strong>.
                        </p>
                        <span className="text-[10px] text-gray-400">5 mins ago</span>
                      </div>
                      <div className="px-5 py-3 hover:bg-gray-50">
                        <p className="text-xs text-gray-800 font-semibold leading-relaxed">
                          Blog post <strong>"Navigating Ocean Congestion"</strong> was published.
                        </p>
                        <span className="text-[10px] text-gray-400">2 hours ago</span>
                      </div>
                      <div className="px-5 py-3 hover:bg-gray-50">
                        <p className="text-xs text-gray-800 font-semibold leading-relaxed">
                          User account created for <strong>Sarah Al-Mansoori</strong>.
                        </p>
                        <span className="text-[10px] text-gray-400">1 day ago</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* User Profile */}
              <div className="relative">
                <button
                  onClick={() => {
                    setProfileDropdownOpen(!profileDropdownOpen);
                    setNotificationsOpen(false);
                  }}
                  className="flex items-center gap-3 hover:bg-gray-50 pl-3 pr-2.5 py-1.5 rounded-xl border border-transparent hover:border-gray-200 transition-all cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center font-black text-sm">
                    {user.fullname.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div className="hidden sm:block text-left leading-tight">
                    <p className="text-xs font-black text-primary">{user.fullname}</p>
                    <p className="text-[10px] font-bold text-accent uppercase tracking-wider">
                      {user.role}
                    </p>
                  </div>
                </button>

                {/* Profile Dropdown */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-gray-200 py-3 z-50 text-left animate-fade-in">
                    <div className="px-5 py-3 border-b border-gray-100">
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                        Signed In As
                      </p>
                      <h4 className="font-extrabold text-sm text-primary mt-0.5">
                        {user.fullname}
                      </h4>
                      <p className="text-xs text-gray-500 font-semibold">{user.username}</p>
                    </div>

                    <div className="px-2 py-1.5 border-b border-gray-100">
                      <div className="px-3 py-2 text-xs text-gray-400 font-bold uppercase tracking-wider flex items-center gap-2">
                        <span>Role Permissions</span>
                      </div>
                      <div className="px-3 py-1.5 flex items-center gap-2">
                        <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-md font-extrabold">
                          {user.role}
                        </span>
                      </div>
                    </div>

                    <div className="p-2">
                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
                      >
                        <LogOut size={16} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* CONTENT PANEL */}
          <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-gray-50">
            {children}
          </main>
        </div>
      </div>
    </ToastContext.Provider>
  );
}
