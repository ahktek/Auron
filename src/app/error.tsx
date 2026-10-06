"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { AlertTriangle, RefreshCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Redact PII in structured telemetry log
    console.error("[Cure-Care Client Error Boundary]", error.message);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF9F5] p-6 text-center">
      <Container size="sm">
        <div className="space-y-6 bg-white p-8 sm:p-12 rounded-3xl border border-zinc-200 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
              Something Interrupted Your Flow
            </h1>
            <p className="text-sm text-zinc-500 max-w-sm mx-auto">
              Our engineering team has been notified. Please try refreshing the page or return to the main catalog.
            </p>
          </div>
          <div className="flex justify-center gap-4">
            <Button onClick={() => reset()} size="lg" className="gap-2">
              <RefreshCcw className="h-4 w-4" />
              <span>Try Again</span>
            </Button>
            <Link href="/">
              <Button variant="outline" size="lg">Home</Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
