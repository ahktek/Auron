import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { JOURNAL_POSTS } from "@/lib/store/journal";
import { ArrowLeft, Clock, Share2 } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function JournalArticlePage({ params }: PageProps) {
  const resolvedParams = await params;
  const post = JOURNAL_POSTS.find((p) => p.slug === resolvedParams.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] dark:bg-zinc-950">
      <Header />
      <main className="flex-1 py-12 lg:py-20">
        <Container size="md">
          <Link
            href="/journal"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-900 mb-8"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Journal</span>
          </Link>

          <article className="space-y-10">
            {/* Header Meta */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Badge variant="accent">{post.categoryName}</Badge>
                <span className="text-xs text-zinc-400 flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {post.readingTimeMinutes} min read
                </span>
                <span className="text-xs text-zinc-400">· {post.date}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 leading-[1.15]">
                {post.title}
              </h1>

              <p className="text-lg text-zinc-600 dark:text-zinc-300 font-editorial italic leading-relaxed">
                {post.subtitle}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500">
                <span>Written by {post.authorName}</span>
                <span className="text-zinc-400">Cure-Care Editorial Studio</span>
              </div>
            </div>

            {/* Hero Cover */}
            <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden bg-zinc-900 shadow-md">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                priority
                className="object-cover"
              />
            </div>

            {/* Article Body */}
            <div className="prose prose-zinc dark:prose-invert max-w-none text-base leading-relaxed space-y-6">
              <p className="text-lg font-medium text-zinc-700 dark:text-zinc-200 leading-relaxed">
                {post.excerpt}
              </p>
              <h2>The Mechanics of Subtraction</h2>
              <p>
                When our design team sits down with a bag prototype, the primary question is rarely &ldquo;what can we add?&rdquo; Instead, we ask &ldquo;what happens if we remove this zipper, this flap, or this external strap?&rdquo;
              </p>
              <p>
                Subtraction is how true functional longevity is achieved. Fewer moving parts mean fewer points of failure. When an object relies on geometry and material tension rather than fragile plastic toggles, it survives thousands of miles of transit without wearing down.
              </p>
              <blockquote>
                &ldquo;A clean workspace and a clean carry bag give your thoughts the room they need to breathe.&rdquo;
              </blockquote>
              <h2>In Search of Timeless Patina</h2>
              <p>
                Unlike synthetic vinyl or PU coatings that flake after two seasons, genuine vegetable-tanned hides absorb the oils from your hands, sunlight, and raindrops. Every scratch softens into a golden amber patina that documents your personal journeys.
              </p>
            </div>
          </article>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
