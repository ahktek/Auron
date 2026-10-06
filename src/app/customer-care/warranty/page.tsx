import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { ShieldCheck, Wrench, CheckCircle2 } from "lucide-react";

export default function WarrantyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] dark:bg-zinc-950">
      <Header />
      <main className="flex-1 py-16">
        <Container size="md">
          <div className="space-y-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#FC5A43]">Our Promise</span>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mt-1">
                10-Year Craftsmanship Warranty
              </h1>
            </div>

            <div className="p-8 rounded-2xl bg-zinc-900 text-white space-y-3">
              <ShieldCheck className="h-8 w-8 text-[#FC5A43]" />
              <h2 className="text-xl font-bold">Built to Endure a Decade of Movement</h2>
              <p className="text-sm text-zinc-400 leading-relaxed">
                We design objects intended to stay out of landfills. If your Cure-Care product experiences any manufacturing defect, broken zipper, hardware fracture, or failed stitch within 10 years of purchase, we will repair or replace it free of charge.
              </p>
            </div>

            <div className="prose prose-zinc dark:prose-invert max-w-none text-sm leading-relaxed space-y-4">
              <h2>What Is Covered:</h2>
              <ul>
                <li>Seam failure or torn structural bar-tacks</li>
                <li>Zipper slider or teeth breakage</li>
                <li>Magnetic clasp or buckle hardware fractures</li>
                <li>Leather stitching separation under normal transit conditions</li>
              </ul>
              <h2>How to Submit a Claim:</h2>
              <p>
                Email your original order number and two photos of the affected area to <strong>warranty@curecare.com</strong>. Our repair desk evaluates all claims within 48 hours.
              </p>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
