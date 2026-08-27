# Capital Tours — Deploy & Run

This repository contains the Capital Tours frontend (Vite + React + Tailwind).

Quick local commands

Install dependencies:

```bash
npm ci
```

Run dev server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

Deploy to Vercel

The site is deployed on Vercel (project `capital-tours`). Every push to `main` triggers a production deploy via the GitHub Actions workflow `.github/workflows/deploy-vercel.yml`, which requires the `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID` repository secrets.

You can also deploy manually with the Vercel CLI:

```bash
vercel --prod
```
