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
- **Instagram grid:** by default it shows tasteful placeholder tiles that link to the profile. To show real posts, drop square images into `assets/img/ig/` and fill in the `IG_POSTS` array in `main.js` (section 5).
- **Hero background:** currently `assets/img/harp-thanksgiving.jpg`. To swap it, replace that file (or change the URL in `styles.css`, selector `.hero__bg`). See "Assets still needed" below.

---

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

1. **High-res hero background** — the hero currently reuses `harp-thanksgiving.jpg` (a real photo, but a portrait shot used as a stand-in). A **wide, high-resolution church / conservatory image** would look better full-screen. Replace the file or update `.hero__bg` in `styles.css`.
2. **5–6 audio recordings** → `assets/audio/` (see "Editing" above). Prefer ones that start quickly and show range (a lively arrangement, the shortened Amen, *Stranger on the Shore*, etc.). Confirm they're cleared to publish.
3. **Instagram** — optional real post grid (images + post links), otherwise the placeholder tiles link straight to [@celestia__music](https://www.instagram.com/celestia__music/).
4. **Toby Zeal testimonial** — the real quote to replace the placeholder card.

---

## Notes

- **No pricing and no contact form anywhere** — deliberate. All "Get in touch" buttons open a pre-filled email to `joya@celestiamusic.com`.
- Copy is migrated **verbatim** from the old site. A copy refresh is a planned fast-follow (Phase 2), along with a feature video (a reserved slot already exists in the "Watch" section).
- Fonts load from Google Fonts with a system-font fallback, so the site still renders if fonts are blocked.
