"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export type UserRole = "TEAM_LEADER" | "ADMIN" | "JUDGE" | "CLUB_MEMBER";

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
  teamName: string;
}

interface PortalState {
  isAuthenticated: boolean;
  authUser: AuthUser | null;
  isHydrated: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
  resetPortalState: () => void;
}

const PortalContext = createContext<PortalState | null>(null);
const STORAGE_KEY = "vv_portal_auth";

export function PortalProvider({ children }: { children: React.ReactNode }) {
  // Synchronous client initialization from localStorage to prevent startup hydration lag
  const [authUser, setAuthUser] = useState<AuthUser | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? (JSON.parse(stored) as AuthUser) : null;
    } catch {
      return null;
    }
  });

  const [isHydrated, setIsHydrated] = useState<boolean>(true);

  useEffect(() => {
    if (!isHydrated) setIsHydrated(true);
  }, [isHydrated]);

  const login = useCallback((user: AuthUser) => {
    setAuthUser(user);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(user)); } catch { /* ignore */ }
  }, []);

  const logout = useCallback(() => {
    setAuthUser(null);
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
  }, []);

  return (
    <PortalContext.Provider value={{
      isAuthenticated: !!authUser,
      authUser,
      isHydrated: true,
      login,
      logout,
      resetPortalState: logout,
    }}>
      {children}
    </PortalContext.Provider>
  );
}

export function usePortal() {
  const ctx = useContext(PortalContext);
  if (!ctx) throw new Error("usePortal must be used within PortalProvider");
  return ctx;
}