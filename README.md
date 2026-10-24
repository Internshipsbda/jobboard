# Bermuda Internship Board — Internship Insights Co.

Static site deployed on Netlify (`internshipinsights-jobs`). No build step.

- `data/jobs.json` — every listing. Add, edit or remove entries here.
- `data/rejected.json` — items the owner has turned down (closed review PRs or removed listings). The daily search never suggests these again.
- `index.html`, `styles.css`, `app.js` — the board, styled with the Internship Insights Co. design system. Each listing opens a shareable detail view at `#job/<id>`; logos come from each employer's site icon (`domain` field), falling back to a monogram.
- `embed.js` — embeddable listings for the Squarespace site. Paste into a Code Block:
  `<div id="iic-jobboard" data-post-url="/opportunities"></div><script src="https://internshipinsights-jobs.netlify.app/embed.js" defer></script>`
  It reads `data/jobs.json` live, so the embed updates whenever the board does.
- `post.html` / `thanks.html` — the free "Post an internship" form for employers (Netlify Forms, form name `post-internship`). Submissions are reviewed in the daily pull request before going live.

Listings are researched daily. **Verification rule (owner's):** a listing whose source is Bernews, The Royal Gazette, LinkedIn, or the employer's own website counts as verified and is published straight to `main`. Anything from another source (job aggregators, guides, employer form submissions) goes into a pull request for the owner to review; merging publishes it.

Fields per listing: `id`, `title`, `company`, `field`, `location`, `season`, `status` (`open` | `upcoming`), `opens` / `deadline` (YYYY-MM-DD or null), `dateNote`, `eligibility`, `paid`, `summary` (own words, never copied), `domain` (employer website for the logo, or null), `url` (original posting), `source`, `added`.
Listings whose deadline has passed hide themselves automatically; `upcoming` listings flip to open on their `opens` date.
