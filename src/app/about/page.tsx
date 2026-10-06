import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { BRAND } from "@/lib/constants/brand";
import { Compass, Feather, ShieldCheck } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] dark:bg-zinc-950">
      <Header />
      <main className="flex-1 py-16 lg:py-24">
        <Container>
          <div className="max-w-3xl mx-auto space-y-12">
            <div className="space-y-4 text-center">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C25E34]">
                Our Story & Origins
              </span>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                Considered Carry for Modern Movement
              </h1>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 font-editorial italic">
                Founded in 2021 between Portland and Copenhagen to strip away the bulky excess of traditional carry goods.
              </p>
            </div>

            <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden shadow-lg bg-zinc-900">
              <Image
                src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1600&q=85"
                alt="AUREN Studio Craftsmanship"
                fill
                priority
                className="object-cover"
              />
            </div>

            <div className="prose prose-zinc dark:prose-invert max-w-none text-base leading-relaxed space-y-6">
              <p>
                We spend our lives in transit. Between home, morning subway commutes, international terminals, and creative workshops, the physical tools we carry dictate our state of mind. When your pockets bulge with thick bifolds or your shoulder bag sags with disordered cables, everyday movement feels heavy.
              </p>
              <h2>The Philosophy of Flatness & Flow</h2>
              <p>
                At {BRAND.name}, we approach carry design like architecture. We study the ergonomics of human hands, the acoustic feedback of neodymium magnetic snaps, and the cellular tension of vegetable-tanned leather. Every seam exists for a structural reason; every unnecessary rivet is excised.
              </p>
              <blockquote>
                &ldquo;Simplicity is not a lack of features. Simplicity is the pinnacle of engineering, where every detail feels so natural that you forget it was designed.&rdquo;
              </blockquote>
              <p>
                We partner exclusively with gold-rated tanneries that treat and recycle 100% of their wash water, and weave our weather-resistant fabrics from recycled ocean-bound plastic bottles.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-zinc-200 dark:border-zinc-800">
              <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2">
                <Compass className="h-5 w-5 text-[#C25E34]" />
                <h3 className="font-bold text-sm">Architectural Lines</h3>
                <p className="text-xs text-zinc-500">Sculpted silhouettes that rest naturally against the body.</p>
              </div>
              <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2">
                <Feather className="h-5 w-5 text-[#C25E34]" />
                <h3 className="font-bold text-sm">Certified Tannery</h3>
                <p className="text-xs text-zinc-500">Gold-rated environmental standards with zero toxic runoff.</p>
              </div>
              <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 space-y-2">
                <ShieldCheck className="h-5 w-5 text-[#C25E34]" />
                <h3 className="font-bold text-sm">10-Year Pledge</h3>
                <p className="text-xs text-zinc-500">Modular parts intended to be repaired for life, never dumped.</p>
              </div>
            </div>

            <div className="text-center pt-8">
              <Link href="/products/category/bags-luggage">
                <Button size="lg">Explore the Carry Collection</Button>
              </Link>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
