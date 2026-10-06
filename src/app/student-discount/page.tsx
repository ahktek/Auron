import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default function StudentDiscountPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] dark:bg-zinc-950">
      <Header />
      <main className="flex-1 py-16">
        <Container size="md">
          <div className="bg-white dark:bg-zinc-900 p-8 sm:p-12 rounded-3xl border border-zinc-200 dark:border-zinc-800 space-y-6 text-center">
            <Badge variant="accent">Education Program</Badge>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              15% Student & Educator Discount
            </h1>
            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-lg mx-auto leading-relaxed">
              We empower students and academics with durable carry gear built to survive collegiate lecture halls, studios, and daily library study sessions.
            </p>
            <div className="p-6 rounded-2xl bg-[#FAF9F5] dark:bg-zinc-800 max-w-md mx-auto space-y-3 text-left text-xs">
              <p className="font-semibold text-zinc-800 dark:text-zinc-200">How to claim your 15% discount code:</p>
              <ol className="list-decimal list-inside space-y-1.5 text-zinc-600 dark:text-zinc-400">
                <li>Email your valid student ID or .edu email address to support@aurencarry.com</li>
                <li>Receive your unique single-use 15% coupon within 4 hours</li>
                <li>Apply at checkout on any bag, wallet, or tech folio</li>
              </ol>
            </div>
            <a href="mailto:support@aurencarry.com?subject=Student Discount Verification">
              <Button size="lg">Verify Academic Status</Button>
            </a>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
