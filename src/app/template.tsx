"use client";

import React, { Suspense } from "react";
import { RouteProgressBar } from "@/components/layout/RouteProgressBar";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Suspense fallback={null}>
        <RouteProgressBar />
      </Suspense>
      <div className="animate-page-enter flex-1 flex flex-col w-full">
        {children}
      </div>
    </>
  );
}
