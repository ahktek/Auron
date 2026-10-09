import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Truck, RefreshCw, Globe, Clock } from "lucide-react";

export default function ShippingCarePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] dark:bg-zinc-950">
      <Header />
      <main className="flex-1 py-16">
        <Container size="md">
          <div className="space-y-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF6857]">Customer Care</span>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mt-1">
                Shipping & Delivery
              </h1>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2">
                <Truck className="h-6 w-6 text-[#FF6857]" />
                <h3 className="font-bold text-base">Carbon-Neutral Freight</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Complimentary worldwide standard delivery on all orders over $100. Dispatched within 24 business hours from Portland, Oregon or Copenhagen, Denmark.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2">
                <RefreshCw className="h-6 w-6 text-[#FF6857]" />
                <h3 className="font-bold text-base">30-Day Global Trial</h3>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Test your carry gear in your daily routine. If it doesn’t transform your transit, return it within 30 days for a full refund.
                </p>
              </div>
            </div>

            <div className="prose prose-zinc dark:prose-invert max-w-none text-sm leading-relaxed space-y-4">
              <h2>Delivery Timeframes</h2>
              <ul>
                <li><strong>United States & Canada:</strong> 2–4 business days via carbon-neutral ground. Priority Air: 1–2 business days.</li>
                <li><strong>Europe & UK:</strong> 2–4 business days from our Copenhagen distribution facility.</li>
                <li><strong>Asia & Australia:</strong> 3–6 business days via DHL Express worldwide.</li>
              </ul>
              <h2>Duties & Taxes</h2>
              <p>
                All customs duties and local taxes are prepaid and calculated transparently at checkout. No surprise courier bills at your doorstep.
              </p>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
