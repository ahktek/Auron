import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ArrowRight, MapPin, Briefcase } from "lucide-react";

export default function CareersPage() {
  const jobs = [
    { title: "Senior Soft Goods Industrial Designer", team: "Product & Craft", location: "Portland, OR (Hybrid)", type: "Full-Time" },
    { title: "Senior Full-Stack Web Engineer", team: "Digital Experience", location: "Remote (Global)", type: "Full-Time" },
    { title: "Sustainable Materials & Supply Chain Lead", team: "Operations", location: "Copenhagen, Denmark", type: "Full-Time" },
    { title: "Customer Experience & Concierge Specialist", team: "Customer Care", location: "Remote (US/EU)", type: "Full-Time" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] dark:bg-zinc-950">
      <Header />
      <main className="flex-1 py-16">
        <Container>
          <div className="max-w-3xl mb-12 space-y-4">
            <Badge variant="accent">Join Our Team</Badge>
            <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              Careers at AUREN
            </h1>
            <p className="text-base text-zinc-600 dark:text-zinc-400">
              We are an intentional team of industrial designers, patternmakers, and software engineers who value calm focus, rigorous craft, and lasting impact.
            </p>
          </div>

          <div className="space-y-4 max-w-4xl">
            {jobs.map((job, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#C25E34] transition-colors"
              >
                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#C25E34]">
                    {job.team}
                  </span>
                  <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                    {job.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-zinc-500 pt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {job.location}
                    </span>
                    <span>·</span>
                    <span>{job.type}</span>
                  </div>
                </div>

                <a href="mailto:careers@aurencarry.com?subject=Application for Role">
                  <Button variant="outline" size="sm" className="gap-1">
                    <span>Apply Now</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </a>
              </div>
            ))}
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
