"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ClipboardList, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Activities", icon: ClipboardList, href: "/activities" },
  { label: "Profile", icon: User, href: "/profile" },
];

export function BottomNav() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Effect 1: Set mounted status once to handle hydration correctly.
  // Splitting this into its own effect with an empty dependency array
  // prevents "cascading render" warnings during navigation.
  useEffect(() => {
    setMounted(true);
  }, []);

  // Effect 2: Synchronize authentication state with localStorage.
  // This runs on mount and whenever the pathname changes to ensure the nav
  // responds to login/logout events.
  useEffect(() => {
    const checkAuth = () => {
      if (typeof window === "undefined") return;

      const token = localStorage.getItem("token");
      const hasToken = !!token;

      // Update state only if it actually changed to avoid unnecessary renders
      setIsAuthenticated((prev) => (prev === hasToken ? prev : hasToken));
    };

    checkAuth();

    // Handle authentication changes from other tabs/windows
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, [pathname]);

  // Prevent hydration mismatch: don't render on server or during first client pass
  if (!mounted) {
    return null;
  }

  // Logic: Hide bottom nav if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // Logic: Hide bottom nav on landing, auth, and offline pages
  const hideOnPaths = ["/", "/login", "/register", "/~offline"];
  if (hideOnPaths.includes(pathname)) {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t bg-background px-4 pb-safe shadow-[0_-1px_3px_0_rgba(0,0,0,0.05)]">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1 transition-all duration-200",
              isActive
                ? "text-primary scale-110"
                : "text-muted-foreground hover:text-primary",
            )}
          >
            <Icon className={cn("h-5 w-5", isActive && "fill-current")} />
            <span className="text-[10px] font-semibold">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
