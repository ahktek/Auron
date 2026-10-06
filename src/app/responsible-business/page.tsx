import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Sparkles, TreePine, Award, ShieldCheck, Heart } from "lucide-react";

export default function ResponsibleBusinessPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] dark:bg-zinc-950">
      <Header />
      <main className="flex-1 py-16 lg:py-24">
        <Container>
          <div className="max-w-3xl mx-auto space-y-12">
            <div className="text-center space-y-4">
              <Badge variant="accent">Verified Impact</Badge>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                Certified B Corporation
              </h1>
              <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400">
                Using business as a force for good. We measure our success not just in sales, but in our balance sheet with the planet and society.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3">
                <TreePine className="h-6 w-6 text-[#FC5A43]" />
                <h3 className="font-bold text-lg">100% Carbon Neutral</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  Every order’s freight emissions from our workshops to your doorstep are calculated and fully offset via verified reforestation projects.
                </p>
              </div>

              <div className="p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-3">
                <ShieldCheck className="h-6 w-6 text-[#FC5A43]" />
                <h3 className="font-bold text-lg">Ethical Production Audits</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">
                  Our fabrication partners undergo independent SMETA audits guaranteeing living wages, safe facilities, and humane working hours.
                </p>
              </div>
            </div>

            <div className="p-8 rounded-2xl bg-zinc-900 text-white space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#FC5A43]">
                1% For The Planet
              </span>
              <h2 className="text-2xl font-bold">Giving Back to Wild Landscapes</h2>
              <p className="text-sm text-zinc-400 leading-relaxed">
                We contribute 1% of our annual gross revenue to grassroots wilderness conservation programs across the Pacific Northwest and Scandinavian coastal reserves.
              </p>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
