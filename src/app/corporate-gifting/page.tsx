import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default function CorporateGiftingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] dark:bg-zinc-950">
      <Header />
      <main className="flex-1 py-16">
        <Container size="md">
          <div className="bg-white dark:bg-zinc-900 p-8 sm:p-12 rounded-3xl border border-zinc-200 dark:border-zinc-800 space-y-6">
            <Badge variant="accent">Executive & Studio Gifting</Badge>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Corporate & Bespoke Gifting
            </h1>
            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Reward your teams and clients with gifts they will carry every single day. From blind-debossed leather tech folios to custom-monogrammed slim wallets.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 space-y-1">
                <h4 className="font-bold text-xs">Custom Debossing</h4>
                <p className="text-xs text-zinc-500">Subtle tone-on-tone corporate logo blind stamp.</p>
              </div>
              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 space-y-1">
                <h4 className="font-bold text-xs">Tiered Volume Pricing</h4>
                <p className="text-xs text-zinc-500">Volume tiers available starting at 20 units.</p>
              </div>
            </div>
            <a href="mailto:corporate@curecare.com?subject=Corporate Gifting Inquiry">
              <Button size="lg">Request Gifting Lookbook</Button>
            </a>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
