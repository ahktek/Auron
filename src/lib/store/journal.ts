export interface JournalPost {
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  categoryName: string;
  authorName: string;
  readingTimeMinutes: number;
  date: string;
  coverImage: string;
}

export const JOURNAL_POSTS: JournalPost[] = [
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
