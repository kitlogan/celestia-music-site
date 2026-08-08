#!/usr/bin/env node
/**
 * Fetch recent Instagram posts and write assets/ig.json for the website grid.
 *
 * Runs in GitHub Actions (.github/workflows/instagram-feed.yml) on a schedule,
 * so the site's Instagram section refreshes itself. No third-party runtime
 * script on the page — this just produces a small JSON file the page reads.
 *
 * Requires (set as GitHub repo secrets):
 *   IG_TOKEN    – a long-lived Instagram access token (Instagram Graph API)
 *   IG_USER_ID  – (optional) the IG user id; defaults to "me" for the token
 *   IG_LIMIT    – (optional) how many posts to fetch (default 12)
 *
 * If IG_TOKEN is absent the script exits 0 without changing anything, so the
 * workflow is harmless until you've configured it.
 */
import { writeFile, mkdir } from "node:fs/promises";

const TOKEN = process.env.IG_TOKEN;
const USER = process.env.IG_USER_ID || "me";
const LIMIT = process.env.IG_LIMIT || "12";
const OUT = "assets/ig.json";

if (!TOKEN) {
  console.log("IG_TOKEN not set — skipping Instagram fetch (nothing to do yet).");
  process.exit(0);
}

const fields = "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp";
const url =
  `https://graph.instagram.com/${USER}/media` +
  `?fields=${fields}&limit=${LIMIT}&access_token=${TOKEN}`;

try {
  const res = await fetch(url);
  const body = await res.json();
  if (!res.ok) {
    console.error("Instagram API error:", JSON.stringify(body));
    process.exit(1);
  }
  // Keep only the fields the site needs; strip the access token from anything.
  const posts = (body.data || []).map((p) => ({
    id: p.id,
    media_type: p.media_type,
    media_url: p.media_url,
    thumbnail_url: p.thumbnail_url,
    permalink: p.permalink,
    caption: (p.caption || "").slice(0, 200),
    timestamp: p.timestamp,
  }));

  await mkdir("assets", { recursive: true });
  await writeFile(OUT, JSON.stringify(posts, null, 2) + "\n");
  console.log(`Wrote ${posts.length} posts to ${OUT}`);
} catch (err) {
  console.error("Failed to fetch Instagram feed:", err.message);
  process.exit(1);
}
