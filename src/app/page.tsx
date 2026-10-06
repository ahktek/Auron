import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HomeClient } from "@/components/home/HomeClient";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FAF9F5] dark:bg-zinc-950">
      <Header />
      <main className="flex-1">
        <HomeClient />
      </main>
      <Footer />
    </div>
  );
}
