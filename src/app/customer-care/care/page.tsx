import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";

export default function CleaningCarePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] dark:bg-zinc-950">
      <Header />
      <main className="flex-1 py-16">
        <Container size="md">
          <div className="space-y-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF6857]">Longevity Guide</span>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mt-1">
                Leather & Fabric Care
              </h1>
            </div>

            <div className="prose prose-zinc dark:prose-invert max-w-none text-sm leading-relaxed space-y-6">
              <h2>Vegetable-Tanned Leather Care</h2>
              <p>
                Natural leather is a living material that absorbs the world around it. Avoid direct submersions in water. If your wallet gets wet in rain, gently dab dry with a microfiber cloth and let it air-dry naturally at room temperature away from radiators.
              </p>
              <p>
                Apply a natural beeswax-based conditioning balm once every 6 to 12 months using small circular motions. This restores natural oils, repels moisture, and deepens the natural caramel patina.
              </p>
              <h2>Recycled Technical Ripstop</h2>
              <p>
                To clean dirt or grime from nylon backpacks and slings, use lukewarm water with mild castile soap on a soft cloth. Never machine-wash or tumble-dry bags with internal padding or magnetic hardware.
              </p>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
