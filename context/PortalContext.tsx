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
  loginUser: (user: AuthUser) => void;
  logout: () => Promise<void>;
  resetPortalState: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
}

const PortalContext = createContext<PortalState | null>(null);

export function PortalProvider({ children }: { children: React.ReactNode }) {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  // Check server HTTP-only session cookie on mount
  const refreshSession = useCallback(async (): Promise<boolean> => {
    try {
      const res = await fetch("/api/auth/session", { credentials: "same-origin" });
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          setAuthUser({
            id: data.user.teamId,
            email: data.user.email,
            role: data.user.role,
            teamName: data.user.teamName,
          });
          setIsHydrated(true);
          return true;
        }
      }
    } catch {
      /* ignore */
    }
    setAuthUser(null);
    setIsHydrated(true);
    return false;
  }, []);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  const loginUser = useCallback((user: AuthUser) => {
    setAuthUser(user);
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "same-origin" });
    } catch {
      /* ignore */
    }
    setAuthUser(null);
    window.location.href = "/login";
  }, []);

  return (
    <PortalContext.Provider
      value={{
        isAuthenticated: !!authUser,
        authUser,
        isHydrated,
        loginUser,
        logout,
        resetPortalState: logout,
        refreshSession,
      }}
    >
      {children}
    </PortalContext.Provider>
  );
}

export function usePortal() {
  const ctx = useContext(PortalContext);
  if (!ctx) throw new Error("usePortal must be used within PortalProvider");
  return ctx;
}