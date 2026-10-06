import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Clock, ArrowRight, Rss } from "lucide-react";
import { JOURNAL_POSTS } from "@/lib/store/journal";

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
