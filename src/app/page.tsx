import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HomeClient } from "@/components/home/HomeClient";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)] text-[var(--foreground)]">
      <Header />
      <main className="flex-1">
        <HomeClient />
      </main>
      <Footer />
    </div>
  );
}
