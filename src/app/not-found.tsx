import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
      <Header />
      <main className="flex-1 py-24 flex items-center justify-center">
        <Container size="sm">
          <div className="text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-[#FEF3F0] text-[#FF6857] flex items-center justify-center mx-auto">
              <Compass className="h-8 w-8" />
            </div>
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[#FF6857]">
                Error 404
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                This Trail Has Ended
              </h1>
              <p className="text-sm text-zinc-500 max-w-sm mx-auto">
                The wellness remedy, soothing balm, or pure oil you are looking for has been moved or updated.
              </p>
            </div>
            <div className="pt-2 flex justify-center gap-4">
              <Link href="/">
                <Button size="lg">Return to Storefront</Button>
              </Link>
              <Link href="/products/category/soothing-balms">
                <Button variant="outline" size="lg">Browse Soothing Balms</Button>
              </Link>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
