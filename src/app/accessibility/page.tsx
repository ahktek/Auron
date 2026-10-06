import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";

export default function AccessibilityStatementPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] dark:bg-zinc-950">
      <Header />
      <main className="flex-1 py-16">
        <Container size="md">
          <div className="space-y-6 prose prose-zinc dark:prose-invert max-w-none text-sm leading-relaxed">
            <h1>Web Accessibility Statement</h1>
            <p className="text-xs text-zinc-400">WCAG 2.2 AA Conformance Commitment</p>
            <p>
              Cure-Care is committed to digital inclusion and ensuring that our website is usable for all individuals, including people with motor, cognitive, visual, and auditory disabilities.
            </p>
            <h2>Measures We Implement:</h2>
            <ul>
              <li>Semantic HTML5 landmarks (nav, main, header, footer) for screen reader clarity.</li>
              <li>Visible high-contrast focus indicators for complete keyboard-only navigation.</li>
              <li>Descriptive alternative text tags on all product imagery and media assets.</li>
              <li>Respect for <code>prefers-reduced-motion</code> system settings across all transitions and carousels.</li>
              <li>Text and interactive element contrast ratios exceeding WCAG 2.2 AA standards (minimum 4.5:1).</li>
            </ul>
            <p>
              If you experience any accessibility barrier while browsing our storefront, please contact us at <strong>accessibility@curecare.com</strong>.
            </p>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
