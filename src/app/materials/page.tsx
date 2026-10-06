import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Sparkles, Shield, Droplets, Recycle } from "lucide-react";

export default function MaterialsPage() {
  const materials = [
    {
      title: "Gold-Rated Environmental Leather",
      origin: "Tuscany & Southern Germany",
      desc: "Our leather is exclusively sourced from tanneries awarded the Gold Medal by the Leather Working Group (LWG) — the highest global benchmark for closed-loop wastewater recycling and chemical restraint.",
      image: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "100% Recycled Ripstop & Ballistic Weaves",
      origin: "Certified Global Recycled Standard (GRS)",
      desc: "Recovered post-consumer polyethylene water bottles are mechanically chipped, melted, and spun into ultra-high tensile 420D to 1680D ballistic threads with PFC-free water-repellent coatings.",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "YKK AquaGuard & Neodymium Hardware",
      origin: "Kurobe, Japan & Precision German Magnetics",
      desc: "Polyurethane laminated zipper tapes repel sudden downpours, while custom-tuned neodymium magnetic clasps provide acoustic satisfaction and instant one-handed closure.",
      image: "https://images.unsplash.com/photo-1546938576-6e6a64f317cc?auto=format&fit=crop&w=800&q=80",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] dark:bg-zinc-950">
      <Header />
      <main className="flex-1 py-16 lg:py-24">
        <Container>
          <div className="max-w-3xl mb-16 space-y-3">
            <Badge variant="accent">Craft & Materiality</Badge>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Responsible Materials
            </h1>
            <p className="text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
              We believe true luxury lies in longevity, environmental traceability, and materials that develop personal character with age.
            </p>
          </div>

          <div className="space-y-16">
            {materials.map((m, idx) => (
              <div
                key={idx}
                className={`grid grid-cols-1 lg:grid-cols-12 gap-10 items-center ${
                  idx % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                <div className={`lg:col-span-6 ${idx % 2 === 1 ? "lg:order-2" : ""}`}>
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-100 shadow-md">
                    <Image src={m.image} alt={m.title} fill sizes="600px" className="object-cover" />
                  </div>
                </div>

                <div className={`lg:col-span-6 space-y-4 ${idx % 2 === 1 ? "lg:order-1" : ""}`}>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#C25E34]">
                    {m.origin}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                    {m.title}
                  </h2>
                  <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {m.desc}
                  </p>
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
