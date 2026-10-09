import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Wrench, CheckCircle2, RotateCcw } from "lucide-react";

export default function RepairsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] dark:bg-zinc-950">
      <Header />
      <main className="flex-1 py-16">
        <Container size="md">
          <div className="space-y-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF6857]">Circular Program</span>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mt-1">
                Cure-Care Workshop Repair Service
              </h1>
            </div>

            <p className="text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Before discarding any carry item, let our studio artisans restore it. Our Portland repair workshop specializes in replacing zipper pullers, re-stitching edge paint, and servicing modular magnetic buckles.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2">
                <span className="text-xs font-bold text-[#FF6857]">Step 1</span>
                <h4 className="font-bold text-sm">Diagnosis & Quote</h4>
                <p className="text-xs text-zinc-500">Send photos to repairs@curecare.com for an inspection estimate.</p>
              </div>
              <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2">
                <span className="text-xs font-bold text-[#FF6857]">Step 2</span>
                <h4 className="font-bold text-sm">Studio Servicing</h4>
                <p className="text-xs text-zinc-500">Handled by patternmakers using original certified materials.</p>
              </div>
              <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2">
                <span className="text-xs font-bold text-[#FF6857]">Step 3</span>
                <h4 className="font-bold text-sm">Dispatched Back</h4>
                <p className="text-xs text-zinc-500">Returned freshly conditioned and ready for another decade of transit.</p>
              </div>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
