# Diya Jose: Portfolio

A static portfolio site that Diya edits by clicking on the page in Chrome. It's hosted for free on Cloudflare Pages.

- **Stack:** Next.js 16 (static export), TypeScript, Tailwind CSS 4, TinaCMS 3 (visual editing)
- **Hosting:** Cloudflare Pages (free)
- **Editing:** `https://<site>/admin` → sign in to Tina Cloud (free plan) → click anything on the page → Save
- **Content:** JSON files in `content/`. Every save is a Git commit, so any change can be undone.

Anything left empty is not shown. That covers sections (Experience and Contact for now), the résumé button, the photo, project links, tech tags, and each education detail.

---

## Run locally

```powershell
npm install
npm run dev
```

- Site: http://localhost:3000
- Editor (local mode, saves to files on disk): http://localhost:3000/admin/index.html

Other commands:

| Command | What it does |
|---|---|
| `npm test` | Unit tests (visibility rules, validation, formatting) |
| `npm run build:local` | Full production build from local files, with no Tina Cloud account needed. Output goes to `out/`. |
| `npm run build` | Production build against Tina Cloud (what Cloudflare runs) |

> **Windows note:** `scripts/patch-tina-windows.mjs` runs after `npm install`. It works around a Tina CLI bug that breaks when the project path contains a space, such as `Git Up`. It does nothing on macOS or Linux.

---

## Deploy (one-time, about 30 minutes)

The client owns every account. Add yourself as a collaborator where needed.

1. **GitHub:** The client creates a free account, then creates a repository (e.g. `portfolio`). Push this project to it. A **private** repo is fine.
2. **Tina Cloud:** At [app.tina.io](https://app.tina.io), the client signs in with GitHub. Create a project from the repo, and set **Site URL** to the Cloudflare address from step 3.
   - Copy the **Client ID**.
   - Create a **read-only token** and copy it.
3. **Cloudflare Pages:** Go to [dash.cloudflare.com](https://dash.cloudflare.com), then Workers & Pages → Create → Pages → Connect to Git → pick the repo.
   - Framework preset: *None*
   - Build command: `npm run build`
   - Output directory: `out`
   - Environment variables:
     - `NEXT_PUBLIC_TINA_CLIENT_ID` = Client ID
     - `TINA_TOKEN` = read-only token (mark it **Encrypt**)
     - `NEXT_PUBLIC_SITE_URL` = `https://<project>.pages.dev`
     - `NODE_VERSION` = `22`
4. Open `https://<project>.pages.dev/admin`, sign in, make a small edit and save. The change is live in about 1–2 minutes.

### Contact form (when Diya is ready)
1. Go to [web3forms.com](https://web3forms.com) and enter Diya's email. The access key arrives by email.
2. In the editor, open **Profile and contact**. Paste the key into **Contact form key**, then add email/LinkedIn/GitHub. Save.
3. The Contact section and nav link appear automatically.

---

## Security

| Area | How it's handled |
|---|---|
| Public site | Pure static files. No server, database, or login on the public site. |
| Editor sign-in | Tina Cloud handles authentication. Only users invited to the Tina project can edit. |
| Saving | Tina Cloud commits through its GitHub app, scoped to this one repo |
| Secrets | `TINA_TOKEN` is read-only and lives only in Cloudflare's encrypted env vars. `.env*` files are git-ignored. |
| Headers | `public/_headers`: strict CSP, HSTS, nosniff, frame protection, referrer and permissions policies. `/admin` is `noindex` and uncached. |
| Content | Links must be `https://`, and images/PDFs must come from `/uploads/`. Unsafe values are dropped at render (`lib/visibility.ts`) even if someone edits the JSON directly. |
| Uploads | The editor accepts only JPG, PNG, WebP, AVIF and PDF |
| Contact form | Input validation, length limits, honeypot, 15s timeout. Web3Forms filters spam server-side. |

**Account checklist (please do these):**
- [ ] Turn on 2FA for GitHub and Cloudflare
- [ ] In Tina Cloud, keep the user list to Diya (and you, if needed)
- [ ] GitHub repo: Settings → Branches → protect `main` from force-pushes and deletion
- [ ] Never paste the `TINA_TOKEN` anywhere except Cloudflare's env var settings

---

## Project layout

```
app/                 page + layout (metadata, fonts)
components/          Portfolio (live-editing wrapper), ContactForm, Icon
components/sections/ Header, Hero, About, Skills, Projects, Experience, Education, Contact, Footer
content/             all editable content (JSON)
lib/visibility.ts    "hide when empty" + URL/media sanitizing rules
lib/validate.ts      contact form validation
tina/config.ts       editor schema: fields, validation, allowed uploads
public/_headers      Cloudflare security headers
public/uploads/      images and résumé uploaded through the editor
tests/               unit tests
```
