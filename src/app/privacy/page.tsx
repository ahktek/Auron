import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { BRAND } from "@/lib/constants/brand";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] dark:bg-zinc-950">
      <Header />
      <main className="flex-1 py-16">
        <Container size="md">
          <div className="space-y-6 prose prose-zinc dark:prose-invert max-w-none text-sm leading-relaxed">
            <h1>Privacy Policy</h1>
            <p className="text-xs text-zinc-400">GDPR & CCPA Compliant · Last updated: October 2026</p>
            <p>
              At {BRAND.legalName}, we operate on a principle of privacy-by-default. We collect only the information strictly required to process your transaction, coordinate delivery, and provide customer support.
            </p>
            <h2>1. Information We Collect</h2>
            <p>
              When you make a purchase, we collect your name, email, shipping address, and phone number. Payment card details are tokenized and processed directly by Stripe; raw card numbers never touch our servers.
            </p>
            <h2>2. Your Rights Under GDPR & CCPA</h2>
            <p>
              You maintain the absolute right to request an export of all personal data held in our systems, or to request permanent erasure. You can exercise this directly inside your Account Dashboard under &ldquo;Data Privacy&rdquo; or by contacting us at {BRAND.contact.email}.
            </p>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
