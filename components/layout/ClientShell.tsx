"use client";
import React, { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { usePortal } from "@/context/PortalContext";
import PortalLayout from "@/components/layout/PortalLayout";

const PUBLIC_ROUTES = ["/login"];
const PROTECTED_ROUTES = ["/dashboard", "/team", "/payment", "/spoc", "/project", "/results"];

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, authUser, isHydrated } = usePortal();

  const isPublicRoute = PUBLIC_ROUTES.some((r) => pathname.startsWith(r));
  const isProtectedRoute = PROTECTED_ROUTES.some((r) => pathname.startsWith(r));

  useEffect(() => {
    if (!isHydrated) return;
    if (isProtectedRoute) {
      if (!isAuthenticated) { router.replace("/login"); return; }
      if (authUser?.role !== "TEAM_LEADER") { router.replace("/login?denied=1"); return; }
    }
    if (pathname === "/login" && isAuthenticated && authUser?.role === "TEAM_LEADER") {
      router.replace("/dashboard");
    }
  }, [isHydrated, isAuthenticated, authUser, pathname, isProtectedRoute, router]);

  if (isPublicRoute) return <>{children}</>;

  if (isProtectedRoute && (!isAuthenticated || authUser?.role !== "TEAM_LEADER")) {
    return (
      <div style={{ minHeight:"100vh", background:"#0B0B0B", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:"1.5rem" }}>
        <div className="vv-spinner" style={{ borderTopColor:"var(--pink)" }} />
        <p style={{ fontFamily:"var(--font-heading)", fontSize:"0.95rem", color:"var(--pink)", letterSpacing:"3px", textTransform:"uppercase" }}>
          REDIRECTING TO LOGIN...
        </p>
      </div>
    );
  }

  return <PortalLayout>{children}</PortalLayout>;
}