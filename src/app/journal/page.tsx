import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Clock, ArrowRight, Rss } from "lucide-react";

export const JOURNAL_POSTS = [
  {
    slug: "the-geometry-of-minimalist-carry",
    title: "The Geometry of Minimalist Carry: Stripping Back the Noise",
    subtitle: "How architectural volume studies informed our newest backpack silhouette.",
    excerpt: "When designing the Apex Transit series, our industrial design team eliminated every zipper pull and seam that didn't serve a specific physiological movement.",
    categoryName: "Design & Craft",
    authorName: "Marcus Vance",
    readingTimeMinutes: 5,
    date: "October 2026",
    coverImage: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "inside-the-tannery-gold-rated-leather",
    title: "Inside the Tannery: Why Gold-Rated Leather Matters",
    subtitle: "A deep dive into closed-loop water treatment and vegetable tanning in Tuscany.",
    excerpt: "Leather has carried human stories for millennia. We explore how modern environmental standards ensure ethical, zero-waste craftsmanship.",
    categoryName: "Materials",
    authorName: "Elena Rostova",
    readingTimeMinutes: 7,
    date: "September 2026",
    coverImage: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "one-bag-travel-7-days-in-copenhagen",
    title: "One-Bag Travel: 7 Days in Copenhagen with Just 28 Liters",
    subtitle: "Mastering the art of traveling carry-on only without sacrificing style or comfort.",
    excerpt: "How to assemble a multi-weather capsule wardrobe and pack with military-grade efficiency using compression organizers.",
    categoryName: "Field Notes",
    authorName: "Soren Møller",
    readingTimeMinutes: 6,
    date: "August 2026",
    coverImage: "https://images.unsplash.com/photo-1513622470522-26c3c8a854bc?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "the-pocket-purge-slimming-down-your-edc",
    title: "The Pocket Purge: How to Slim Down Your Daily Carry",
    subtitle: "A practical guide to shedding unnecessary loyalty cards, bulk coins, and loose keys.",
    excerpt: "The psychological relief of stepping out the door with perfectly flat pockets and nothing jingling in your stride.",
    categoryName: "Guides",
    authorName: "Marcus Vance",
    readingTimeMinutes: 3,
    date: "July 2026",
    coverImage: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=1200&q=80",
  },
];

export default function JournalPage() {
  const featuredPost = JOURNAL_POSTS[0];
  const otherPosts = JOURNAL_POSTS.slice(1);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] dark:bg-zinc-950">
      <Header />
      <main className="flex-1 py-12 lg:py-16">
        <Container>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4 pb-6 border-b border-zinc-200 dark:border-zinc-800">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#C25E34]">
                Editorial & Essays
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mt-1">
                The AUREN Journal
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/journal/feed.xml"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 hover:text-[#C25E34] transition-colors"
                title="RSS Feed"
              >
                <Rss className="h-3.5 w-3.5" />
                <span>RSS Feed</span>
              </Link>
            </div>
          </div>

          {/* Featured Hero Post */}
          <Link
            href={`/journal/${featuredPost.slug}`}
            className="group block rounded-3xl overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-xl transition-all duration-300 mb-16"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 relative aspect-[16/10] w-full bg-zinc-900 overflow-hidden">
                <Image
                  src={featuredPost.coverImage}
                  alt={featuredPost.title}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="lg:col-span-5 p-8 lg:p-12 space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="accent">{featuredPost.categoryName}</Badge>
                  <span className="text-xs text-zinc-400 flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {featuredPost.readingTimeMinutes} min read
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-[#C25E34] transition-colors leading-snug">
                  {featuredPost.title}
                </h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-800 text-xs text-zinc-500">
                  <span>By {featuredPost.authorName}</span>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Read Essay <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {/* Grid of Other Posts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {otherPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/journal/${post.slug}`}
                className="group flex flex-col bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-xs hover:shadow-lg transition-all"
              >
                <div className="relative aspect-[16/10] w-full bg-zinc-100 overflow-hidden">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    sizes="400px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge variant="neutral" size="sm">
                      {post.categoryName}
                    </Badge>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 group-hover:text-[#C25E34] transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-xs text-zinc-500 line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-zinc-400 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                    <span>{post.date}</span>
                    <span>{post.readingTimeMinutes} min</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  );
}
