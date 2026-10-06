"use client";

import React, { useState } from "react";
import { BookOpen, Plus, Search, Edit, Trash2, Eye, Rss, Check, Filter } from "lucide-react";
import { JOURNAL_POSTS } from "@/lib/store/journal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";

interface PostItem {
  slug: string;
  title: string;
  categoryName: string;
  authorName: string;
  readingTimeMinutes: number;
  date: string;
  status: "published" | "draft" | "scheduled";
}

export default function AdminJournalPage() {
  const [posts, setPosts] = useState<PostItem[]>(
    JOURNAL_POSTS.map((p, idx) => ({
      slug: p.slug,
      title: p.title,
      categoryName: p.categoryName,
      authorName: p.authorName,
      readingTimeMinutes: p.readingTimeMinutes,
      date: p.date,
      status: idx === 0 ? "published" : idx === 1 ? "published" : "published",
    }))
  );

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [notification, setNotification] = useState("");

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3000);
  };

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.authorName.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === "all" || post.categoryName === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const handleDelete = (slug: string) => {
    setPosts(posts.filter((p) => p.slug !== slug));
    showNotification("Journal post removed.");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-amber-500" />
            Journal & Editorial CMS
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Author and publish brand stories, design breakdowns, and field guides. Feeds automatically into public RSS feed.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/journal/feed.xml" target="_blank">
            <Button size="sm" variant="outline" className="border-zinc-800 text-zinc-300">
              <Rss className="w-3.5 h-3.5 mr-1.5 text-amber-500" />
              Live RSS Feed
            </Button>
          </Link>
          <Button size="sm" variant="primary" onClick={() => showNotification("Modal open: Create new story article")}>
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            New Journal Post
          </Button>
        </div>
      </div>

      {notification && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl flex items-center gap-2">
          <Check className="w-4 h-4" />
          {notification}
        </div>
      )}

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search posts by title or author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-900/60 border border-zinc-800/80 rounded-xl pl-9 pr-4 py-2 text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-300 focus:outline-none focus:border-amber-500"
        >
          <option value="all">All Categories</option>
          <option value="Design & Craft">Design & Craft</option>
          <option value="Materials">Materials</option>
          <option value="Field Notes">Field Notes</option>
          <option value="Sustainability">Sustainability</option>
        </select>
      </div>

      {/* Posts Table */}
      <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl overflow-hidden divide-y divide-zinc-800/80">
        <div className="grid grid-cols-12 px-6 py-3 text-[11px] font-semibold text-zinc-400 uppercase tracking-wider bg-zinc-900">
          <span className="col-span-6">Story Article</span>
          <span className="col-span-2">Category</span>
          <span className="col-span-2">Author & Read Time</span>
          <span className="col-span-1 text-center">Status</span>
          <span className="col-span-1 text-right">Actions</span>
        </div>

        {filteredPosts.map((post) => (
          <div
            key={post.slug}
            className="grid grid-cols-12 px-6 py-4 items-center text-xs hover:bg-zinc-800/30 transition-colors"
          >
            <div className="col-span-6 space-y-1 pr-4">
              <Link
                href={`/journal/${post.slug}`}
                className="font-semibold text-zinc-100 hover:text-amber-400 line-clamp-1 transition-colors"
              >
                {post.title}
              </Link>
              <div className="text-[11px] font-mono text-zinc-500 flex items-center gap-2">
                <span>/journal/{post.slug}</span>
                <span>•</span>
                <span>{post.date}</span>
              </div>
            </div>

            <div className="col-span-2">
              <Badge variant="neutral" size="sm" className="border-zinc-800 text-zinc-300">
                {post.categoryName}
              </Badge>
            </div>

            <div className="col-span-2 text-zinc-400 space-y-0.5">
              <p className="font-medium text-zinc-200">{post.authorName}</p>
              <p className="text-[11px] text-zinc-500">{post.readingTimeMinutes} min read</p>
            </div>

            <div className="col-span-1 text-center">
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {post.status.toUpperCase()}
              </span>
            </div>

            <div className="col-span-1 flex items-center justify-end gap-1.5">
              <Link
                href={`/journal/${post.slug}`}
                className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white"
                title="Preview"
              >
                <Eye className="w-3.5 h-3.5" />
              </Link>
              <button
                onClick={() => showNotification(`Editing post: ${post.title}`)}
                className="p-1.5 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white"
                title="Edit"
              >
                <Edit className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(post.slug)}
                className="p-1.5 hover:bg-red-500/10 rounded-lg text-zinc-400 hover:text-red-400"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
