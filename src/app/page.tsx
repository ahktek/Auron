export const dynamic = "force-dynamic";
export const revalidate = 0;

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HomeClient } from "@/components/home/HomeClient";
import { getStoredProducts } from "@/lib/store/productStore";

export default function Home() {
  const products = getStoredProducts();

  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)] text-[var(--foreground)]">
      <Header />
      <main className="flex-1">
        <HomeClient initialProducts={products} />
      </main>
      <Footer />
    </div>
  );
}
