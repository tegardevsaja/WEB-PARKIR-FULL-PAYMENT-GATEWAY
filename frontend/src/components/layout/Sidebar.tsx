"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import {
  LayoutDashboard,
  Car,
  Users,
  Building2,
  ParkingSquare,
  DollarSign,
  FileText,
  LogOut,
  Settings,
  BarChart3,
  ArrowRightLeft,
  Menu,
  X,
  UserCog,
  CreditCard,
} from "lucide-react";
import { useState } from "react";

interface MenuItem {
  label: string;
  href: string;
  icon: any;
  roles: string[];
}

const menuItems: MenuItem[] = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
    roles: ["admin"],
  },
  {
    label: "Dashboard",
    href: "/petugas/dashboard",
    icon: LayoutDashboard,
    roles: ["petugas"],
  },
  {
    label: "Dashboard",
    href: "/owner/dashboard",
    icon: LayoutDashboard,
    roles: ["owner"],
  },
  {
    label: "Manajemen Petugas",
    href: "/owner/users",
    icon: Users,
    roles: ["owner"],
  },
  {
    label: "Kasir",
    href: "/petugas/kasir",
    icon: Car,
    roles: ["petugas"],
  },
  {
    label: "History Pembayaran",
    href: "/admin/payments",
    icon: CreditCard,
    roles: ["admin", "owner", "petugas"],
  },
  {
    label: "Manajemen User",
    href: "/admin/users",
    icon: Users,
    roles: ["admin"],
  },
  {
    label: "Manajemen Cabang",
    href: "/admin/branches",
    icon: Building2,
    roles: ["admin"],
  },
  {
    label: "Area Parkir",
    href: "/admin/areas",
    icon: ParkingSquare,
    roles: ["admin"],
  },
  {
    label: "Tarif Parkir",
    href: "/admin/rates",
    icon: DollarSign,
    roles: ["admin"],
  },
  {
    label: "Laporan",
    href: "/owner/reports",
    icon: FileText,
    roles: ["owner", "admin"],
  },
  {
    label: "Statistik",
    href: "/owner/statistics",
    icon: BarChart3,
    roles: ["owner", "admin"],
  },
  {
    label: "Log Aktivitas",
    href: "/admin/logs",
    icon: Settings,
    roles: ["admin"],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, setDummyUser, logout } = useAuthStore();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const filteredMenu = menuItems.filter((item) =>
    item.roles.includes(user?.role || "")
  );

  const handleRoleSwitch = (role: "admin" | "petugas" | "owner") => {
    setDummyUser(role);
    setIsMobileOpen(false);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      // Redirect to login page
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout error:", error);
      // Force redirect even if API call fails
      window.location.href = "/login";
    }
  };

  const SidebarContent = () => (
    <>
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center shadow-sm">
            <Car className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-900">Wheelzie</h1>
            <p className="text-xs text-gray-400">Parking System</p>
          </div>
        </div>

        {/* Role Switcher - Untuk Development */}
        <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-center gap-1.5 mb-1.5">
            <UserCog className="w-3.5 h-3.5 text-amber-700" />
            <p className="text-xs font-medium text-amber-700">Dev Mode</p>
          </div>
          <div className="flex gap-1.5">
            <button
              onClick={() => handleRoleSwitch("admin")}
              className={cn(
                "flex-1 px-2 py-1 text-xs rounded transition-colors font-medium",
                user?.role === "admin"
                  ? "bg-rose-500 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              )}
            >
              Admin
            </button>
            <button
              onClick={() => handleRoleSwitch("petugas")}
              className={cn(
                "flex-1 px-2 py-1 text-xs rounded transition-colors font-medium",
                user?.role === "petugas"
                  ? "bg-rose-500 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              )}
            >
              Petugas
            </button>
            <button
              onClick={() => handleRoleSwitch("owner")}
              className={cn(
                "flex-1 px-2 py-1 text-xs rounded transition-colors font-medium",
                user?.role === "owner"
                  ? "bg-rose-500 text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              )}
            >
              Owner
            </button>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {filteredMenu.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm group",
                isActive
                  ? "bg-rose-50 text-rose-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <Icon className={cn(
                "w-5 h-5 transition-colors",
                isActive ? "text-rose-500" : "text-gray-400 group-hover:text-gray-600"
              )} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-gray-100">
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all text-sm font-medium group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoggingOut ? (
            <>
              <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
              <span>Logging out...</span>
            </>
          ) : (
            <>
              <LogOut className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors" />
              <span>Logout</span>
            </>
          )}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
      >
        {isMobileOpen ? (
          <X className="w-6 h-6 text-gray-900" />
        ) : (
          <Menu className="w-6 h-6 text-gray-900" />
        )}
      </button>

      {/* Mobile Sidebar */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      <aside
        className={cn(
          "lg:hidden fixed top-0 left-0 z-40 w-64 bg-white min-h-screen flex flex-col transition-transform duration-300",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent />
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-gray-100 h-screen flex-col fixed left-0 top-0 shadow-sm">
        <SidebarContent />
      </aside>
    </>
  );
}
