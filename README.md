# Bermuda Internship Board — Internship Insights Co.

Static site deployed on Netlify (`internshipinsights-jobs`). No build step.

- `data/jobs.json` — every listing. Add, edit or remove entries here.
- `index.html`, `styles.css`, `app.js` — the page, styled with the Internship Insights Co. design system.

Listings are researched daily; each day's new finds arrive as a pull request for review. Merging publishes them.

Fields per listing: `id`, `title`, `company`, `field`, `location`, `season`, `status` (`open` | `upcoming`), `opens` / `deadline` (YYYY-MM-DD or null), `dateNote`, `eligibility`, `paid`, `summary` (own words, never copied), `url` (original posting), `source`, `added`.
Listings whose deadline has passed hide themselves automatically; `upcoming` listings flip to open on their `opens` date.
