# Celestia Music — website

Static marketing site for **Celestia Music** (Joya Logan) — bespoke music for weddings, funerals and thanksgiving services. Replaces the old Webflow site. Pure hand-written **HTML + CSS + vanilla JS**, no framework and **no build step**. Hosted free on **GitHub Pages**; domain **celestiamusic.com** stays at GoDaddy.

---

## What's in here

```
index.html            The whole site — one scrolling page
styles.css            All styling
main.js               Mobile nav, scroll effects, audio players, Instagram grid
CNAME                 celestiamusic.com  (tells GitHub Pages the custom domain)
.nojekyll             Empty file — stops GitHub trying to run Jekyll
assets/
  img/                Photography, logo, headshot (real images from the old site)
  audio/              Demo recordings go here (currently empty — see below)
  img/ig/             (optional) Instagram post images if you add a real grid
README.md             This file
```

## Run it locally

It's a static site, so just open `index.html` in a browser. Or, for a proper local server (recommended, so audio and paths behave):

```bash
# from this folder — pick whichever you have
python3 -m http.server 8080
# then visit http://localhost:8080
```

---

## Editing the content (no code experience needed)

- **Text / quotes / testimonials:** all live directly in `index.html`. Search for the words you want to change and edit them.
- **Add the Toby Zeal testimonial:** in `index.html` find the block commented `PLACEHOLDER: new testimonial from Toby Zeal` and replace the placeholder quote with the real one (and delete the `--placeholder` class / `<figcaption>` line).
- **Audio recordings (the "Listen" section):**
  1. Drop your MP3s into `assets/audio/` (e.g. `track-1.mp3`).
  2. Open `main.js`, find the `TRACKS` array near the top of section 4.
  3. For each track set a real `title`, point `src` at your file, and change `placeholder: true` → `placeholder: false`.
  4. Add or remove lines to change how many players show.
- **Instagram grid:** shows a live feed when configured, otherwise tasteful placeholder tiles that link to the profile. See **"Instagram (live feed)"** below to make it live.
- **Hero background:** currently `assets/img/harp-thanksgiving.jpg`. To swap it, replace that file (or change the URL in `styles.css`, selector `.hero__bg`). See "Assets still needed" below.

---

## Instagram (live feed)

You wanted the Instagram section to **pull live from the account so the site stays fresh**. On a static site there are two good ways to do that — pick one:

### Option A — a hosted widget (easiest, what the old site did)
A widget service connects to your Instagram once and gives you a small embed snippet that shows a live, auto-refreshing feed.
- **Elfsight** — this is what the *current* site already uses, so you may still have the account. Free tier has a monthly view limit + a small badge.
- **LightWidget** or **Behold** — free, lighter, cleaner; good modern alternatives.
- **To wire it in:** sign in at the provider, connect **@celestia__music**, copy the embed code, then in `index.html` delete the `<div id="ig-grid">…</div>` line in the Instagram section and paste the embed in its place. Send me the snippet and I'll do it for you.
- **Note:** most widgets (and Option B) need the Instagram account to be a **Business or Creator** account (free to switch in the Instagram app: Settings → Account type). Personal accounts are more limited.

### Option B — self-owned, no third-party script (free, fully in your repo)
A scheduled **GitHub Action** (`.github/workflows/instagram-feed.yml`) fetches your latest posts once a day using Instagram's official API and writes `assets/ig.json`; the page reads that file and renders the grid. No third-party script runs on the page, so it stays fast and private.
- **One-time setup:** create a Meta developer app, connect the Instagram (Business/Creator) account, generate a **long-lived access token**, then add it as a repo secret named **`IG_TOKEN`** (Settings → Secrets and variables → Actions). Optionally add `IG_USER_ID`.
- The Action then runs daily (and on demand). Until `IG_TOKEN` is set it simply does nothing, so it's safe to leave in place.
- **Trade-off:** the long-lived token expires roughly every 60 days and needs refreshing — more control, a little more upkeep. Happy to walk you through the Meta setup.

Either way, until it's configured the section shows placeholder tiles that link straight to the profile, so it always looks intentional. **My recommendation:** if you want it live with the least fuss, Option A with LightWidget or your existing Elfsight; if you'd rather own it end-to-end with no third-party script, Option B.

## Deploy to GitHub Pages

### 1. Put the code on GitHub
```bash
git init
git add -A
git commit -m "Celestia Music static site"
git branch -M main
```
Create a new **empty** repository on github.com (e.g. `celestia-music-site`), then:
```bash
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

### 2. Turn on GitHub Pages
On GitHub: **Settings → Pages**
- **Source:** *Deploy from a branch*
- **Branch:** `main`, folder `/ (root)` → **Save**

After a minute the site publishes. Because `CNAME` is in the repo, Pages picks up `celestiamusic.com` automatically (Settings → Pages will show the custom domain).

### 3. Point the domain (DNS at GoDaddy)
The domain **stays at GoDaddy** — we're only removing Webflow, not the domain. In GoDaddy: **My Products → celestiamusic.com → DNS**.

First **remove the old Webflow DNS records** (the A records / CNAME Webflow told you to add), then add GitHub's:

**Apex domain `celestiamusic.com` — four A records** (Type `A`, Name `@`):
```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```
*(optional, for IPv6 — four AAAA records, Name `@`):*
```
2606:50c0:8000::153
2606:50c0:8001::153
2606:50c0:8002::153
2606:50c0:8003::153
```

**`www` subdomain — one CNAME** (Type `CNAME`, Name `www`):
```
<your-username>.github.io
```
(Value is your GitHub Pages host, e.g. `joyalogan.github.io` — note the trailing behaviour GoDaddy expects; no `https://`, no path.)

DNS can take from a few minutes up to ~an hour to propagate.

### 4. Enforce HTTPS
Back on GitHub **Settings → Pages**, once the custom domain shows a green tick, tick **Enforce HTTPS**. (The certificate can take a little while to be issued after DNS resolves — if the box is greyed out, check again later.)

### 5. Cancel Webflow
Once `https://celestiamusic.com` loads this site correctly, you can cancel the Webflow subscription. **Keep the GoDaddy domain registration.**

---

## Assets still needed (placeholders in place)

These are clearly marked in the build and ready to drop in:

1. **High-res hero background** — the hero uses `harp-thanksgiving-hero.jpg`, a sharpened 2560px enhancement of the original photo (the original is kept as `harp-thanksgiving.jpg`). It looks good, but a genuinely **wide, high-resolution church / conservatory image** would be even better full-screen. Send one and I'll swap it in (or update `.hero__bg` in `styles.css`).
2. **5–6 audio recordings** → `assets/audio/` (see "Editing" above). Prefer ones that start quickly and show range (a lively arrangement, the shortened Amen, *Stranger on the Shore*, etc.). Confirm they're cleared to publish.
3. **Instagram (live feed)** — pick Option A or B in the "Instagram (live feed)" section above and send me the embed snippet, or the `IG_TOKEN`. The account likely needs to be a **Business/Creator** account. Until then, placeholder tiles link to [@celestia__music](https://www.instagram.com/celestia__music/).
4. **Toby Zeal testimonial** — the real quote to replace the placeholder card.

---

## Notes

- **No pricing and no contact form anywhere** — deliberate. All "Get in touch" buttons open a pre-filled email to `joya@celestiamusic.com`.
- Copy is migrated **verbatim** from the old site. A copy refresh is a planned fast-follow (Phase 2), along with a feature video (a reserved slot already exists in the "Watch" section).
- Fonts load from Google Fonts with a system-font fallback, so the site still renders if fonts are blocked.
