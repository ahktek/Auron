import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] dark:bg-zinc-950">
      <Header />
      <main className="flex-1 py-16">
        <Container size="md">
          <div className="space-y-6 prose prose-zinc dark:prose-invert max-w-none text-sm leading-relaxed">
            <h1>Cookie Policy</h1>
            <p className="text-xs text-zinc-400">Last updated: October 2026</p>
            <p>
              We believe in minimal tracking. Cookies on AUREN are partitioned into strictly necessary cookies (such as your shopping cart and customer authentication tokens) and optional performance cookies.
            </p>
            <h2>Cookie Categories</h2>
            <ul>
              <li><strong>Essential Cookies:</strong> Used for keeping items in your bag and maintaining secure login sessions.</li>
              <li><strong>Preference Cookies:</strong> Remembers your preferred display currency (USD, EUR, GBP, AUD, BDT).</li>
              <li><strong>Analytics Cookies:</strong> Consent-gated telemetry to measure page speeds and broken link prevention.</li>
            </ul>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
