import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default function AffiliatePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] dark:bg-zinc-950">
      <Header />
      <main className="flex-1 py-16">
        <Container size="md">
          <div className="bg-white dark:bg-zinc-900 p-8 sm:p-12 rounded-3xl border border-zinc-200 dark:border-zinc-800 space-y-6">
            <Badge variant="accent">Creator Partnership</Badge>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              The Cure-Care Affiliate Program
            </h1>
            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
              We partner with architects, digital nomads, photographers, and writers who share our reverence for minimalist carry. Earn competitive 12% baseline commissions on verified storefront sales.
            </p>
            <div className="p-6 rounded-2xl bg-[#FAF9F5] dark:bg-zinc-800 space-y-3">
              <h3 className="font-bold text-sm">Program Highlights</h3>
              <ul className="text-xs text-zinc-600 dark:text-zinc-300 space-y-2 list-disc list-inside">
                <li>12% commission on all retail conversions</li>
                <li>30-day tracking cookie window</li>
                <li>Complimentary carry gear for verified editorial reviews</li>
                <li>Dedicated affiliate partnership manager</li>
              </ul>
            </div>
            <a href="mailto:affiliates@curecare.com?subject=Affiliate Application">
              <Button size="lg">Apply to Join Program</Button>
            </a>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
