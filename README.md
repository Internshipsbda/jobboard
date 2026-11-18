# Bermuda Internship Board — Internship Insights Co.

Static site deployed on Netlify (project `jobboard-internshipinsightsco`, site id 6fa05803-9af6-4f40-83ba-b0837a4b0aa4), live at https://jobboard.internshipinsightsco.com. Netlify runs `node scripts/build.mjs` on every push: it copies the site into `dist/` and generates a page per listing (`/internships/<id>/`, with Google for Jobs markup on open listings), `sitemap.xml` and `robots.txt`. Only edit the source files, never `dist/`.

- `data/jobs.json` — every listing. Add, edit or remove entries here.
- `data/rejected.json` — items the owner has turned down (closed review PRs or removed listings). The daily search never suggests these again.
- `index.html`, `styles.css`, `app.js` — the board, styled with the Internship Insights Co. design system. Each listing opens a shareable detail view at `#job/<id>`; logos come from each employer's site icon (`domain` field), falling back to a monogram.
- `embed.js` — embeddable listings for the Squarespace site. Paste into a Code Block:
  `<div id="iic-jobboard" data-post-url="/opportunities"></div><script src="https://jobboard.internshipinsightsco.com/embed.js" defer></script>`
  It reads `data/jobs.json` live, so the embed updates whenever the board does.
- `post.html` / `thanks.html` — the free "Post an internship" form for employers (Netlify Forms, form name `post-internship`). Submissions are reviewed in the daily pull request before going live.

Listings are researched daily. **Verification rule (owner's):** a listing whose source is Bernews, The Royal Gazette, LinkedIn, or the employer's own website counts as verified and is published straight to `main`. Anything from another source (job aggregators, guides, employer form submissions) goes into a pull request for the owner to review; merging publishes it. **Exception: iAgora is never used** — nothing found only on iAgora is published or proposed, not even in a review PR.

Fields per listing: `id`, `title`, `company`, `field`, `location`, `season`, `status` (`open` | `upcoming` | `closed`), `opens` / `deadline` (YYYY-MM-DD or null), `dateNote`, `eligibility`, `paid`, `summary` (own words, never copied), `domain` (employer website for the logo, or null), `url` (original posting), `source`, `added`, and optional `expected` (true when the programme recurs every year but nothing is confirmed for 2027 yet — the card shows an "Expected 2027 · dates TBC" badge instead of "Opening soon"; remove the flag once the 2027 posting or announcement appears and update the link to it).
**Dead links (owner's rule):** if a listing's link returns a 404 / page not found, treat the job as not existing: never post it, and remove it from the board (add it to `data/removed.json`).
**Closed listings:** `status` can also be `closed`. Closed listings, and any listing whose deadline has passed, move to a **"Closed: watch for next year"** section at the bottom of the board (and the embed), so students can see what to look out for next cycle. When a posting closes, set `status` to `closed` and update `dateNote` rather than deleting it. Delete it (and add it to `data/removed.json`) only if the owner asks or the link is dead. When the next round opens, switch it back to `open`/`upcoming` with the new dates and link. `upcoming` listings flip to open on their `opens` date.
