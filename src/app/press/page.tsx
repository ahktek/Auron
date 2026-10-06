import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { BRAND } from "@/lib/constants/brand";
import { Download, ExternalLink } from "lucide-react";

export default function PressPage() {
  const pressClippings = [
    {
      source: "Monocle Magazine",
      quote: "Cure-Care proves that reducing pocket bulk is an architectural triumph rather than a mere lifestyle preference.",
      date: "September 2026",
    },
    {
      source: "Fast Company Design",
      quote: "The Apex Transit Backpack 24L sets a modern gold standard for transcontinental mobile workers.",
      date: "August 2026",
    },
    {
      source: "Gear Patrol",
      quote: "Flawless vegetable-tanned leather and magnetic hardware that delivers the most reassuring click in the game.",
      date: "July 2026",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] dark:bg-zinc-950">
      <Header />
      <main className="flex-1 py-16">
        <Container>
          <div className="max-w-3xl mb-12 space-y-4">
            <Badge variant="neutral">Media & Press</Badge>
            <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Press & Editorial Inquiries
            </h1>
            <p className="text-base text-zinc-600 dark:text-zinc-400">
              For high-resolution photography, sample requests, and executive interview inquiries, contact our media relations desk at{" "}
              <a href={`mailto:${BRAND.contact.press}`} className="text-[#FC5A43] underline">
                {BRAND.contact.press}
              </a>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {pressClippings.map((item, idx) => (
              <div key={idx} className="p-8 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-4 flex flex-col justify-between">
                <blockquote className="text-sm font-editorial italic leading-relaxed text-zinc-700 dark:text-zinc-300">
                  &ldquo;{item.quote}&rdquo;
                </blockquote>
                <div className="border-t border-zinc-100 dark:border-zinc-800 pt-3 flex items-center justify-between text-xs text-zinc-500">
                  <span className="font-bold text-zinc-900 dark:text-zinc-100">{item.source}</span>
                  <span>{item.date}</span>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
