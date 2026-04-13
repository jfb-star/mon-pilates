"use client";

import { SessionProvider } from "next-auth/react";
import { ErrorBoundary } from "./ErrorBoundary";
import type { ReactNode } from "react";

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <SessionProvider>{children}</SessionProvider>
    </ErrorBoundary>
  );
}
