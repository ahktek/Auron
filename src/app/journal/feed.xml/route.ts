import { NextResponse } from "next/server";
import { JOURNAL_POSTS } from "../page";
import { BRAND } from "@/lib/constants/brand";

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const itemsXml = JOURNAL_POSTS.map(
    (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${siteUrl}/journal/${post.slug}</link>
      <guid>${siteUrl}/journal/${post.slug}</guid>
      <description><![CDATA[${post.excerpt}]]></description>
      <author>${BRAND.contact.email} (${post.authorName})</author>
      <category>${post.categoryName}</category>
    </item>`
  ).join("\n");

  const rssFeed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${BRAND.name} Journal</title>
    <link>${siteUrl}/journal</link>
    <description>${BRAND.description}</description>
    <language>en-us</language>
    <atom:link href="${siteUrl}/journal/feed.xml" rel="self" type="application/rss+xml"/>
    ${itemsXml}
  </channel>
</rss>`;

  return new NextResponse(rssFeed, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
