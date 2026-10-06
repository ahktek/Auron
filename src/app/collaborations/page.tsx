import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default function CollaborationsPage() {
  const collabs = [
    {
      title: "Cure-Care x Møller Studio Copenhagen",
      subtitle: "Nordic Architectural Travel Capsule",
      desc: "A limited 500-unit release exploring monochromatic matte hardware and sand-washed ripstop canvas inspired by Danish maritime light.",
      image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Cure-Care x Field Ceramics Portland",
      subtitle: "Tactile Ceramic Button Hardware Series",
      desc: "Hand-thrown and kiln-fired stoneware buttons integrated into our classic leather folios.",
      image: "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=800&q=80",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] dark:bg-zinc-950">
      <Header />
      <main className="flex-1 py-16">
        <Container>
          <div className="max-w-3xl mb-16 space-y-3">
            <Badge variant="accent">Artist & Studio Residencies</Badge>
            <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Design Collaborations
            </h1>
            <p className="text-base text-zinc-600 dark:text-zinc-400">
              We collaborate with ceramicists, typographers, architects, and industrial creators who push the boundaries of functional beauty.
            </p>
          </div>

          <div className="space-y-16">
            {collabs.map((c, i) => (
              <div key={i} className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-zinc-100 shadow-sm">
                  <Image src={c.image} alt={c.title} fill sizes="600px" className="object-cover" />
                </div>
                <div className="space-y-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#FC5A43]">
                    Capsule Archive
                  </span>
                  <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{c.title}</h2>
                  <p className="text-base text-zinc-600 dark:text-zinc-400 leading-relaxed">{c.desc}</p>
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
