import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { BRAND } from "@/lib/constants/brand";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] dark:bg-zinc-950">
      <Header />
      <main className="flex-1 py-16">
        <Container size="md">
          <div className="space-y-6 prose prose-zinc dark:prose-invert max-w-none text-sm leading-relaxed">
            <h1>Terms of Service</h1>
            <p className="text-xs text-zinc-400">Last updated: October 2026</p>
            <p>
              Welcome to {BRAND.legalName} (&ldquo;{BRAND.name}&rdquo;). By accessing our website or purchasing carry goods from our digital storefront, you agree to comply with the terms and conditions outlined below.
            </p>
            <h2>1. Storefront Purchases & Price Authority</h2>
            <p>
              All prices displayed on {BRAND.name} are subject to change without notice. The server-validated checkout price at the time of order placement represents the final transactional authority.
            </p>
            <h2>2. 10-Year Craftsmanship Guarantee</h2>
            <p>
              Our 10-year warranty applies to the original purchaser against defects in materials and craftsmanship. It does not cover cosmetic wear, intentional abuse, or unauthorized modifications.
            </p>
            <h2>3. Governing Law</h2>
            <p>
              These Terms and any separate agreements whereby we provide you products shall be governed by and construed in accordance with the laws of the State of Oregon, United States.
            </p>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
