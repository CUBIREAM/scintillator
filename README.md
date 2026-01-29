![](https://assets.cubiream.com/scintillator/scintillator-banner.png)

# scintillator

> Scintillator - Visual Regression Testing tool

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/CUBIREAM/scintillator)

## Structure

```
scintillator/
│
├─ src/                    # SPA (React + TypeScript)
│  ├─ components/
│  │  └─ pages/            # Page components (home, about, diffs...)
│  ├─ assets/              # Static icons & assets
│  └─ styles/              # Global styles (SCSS)
│
├─ worker/                 # BFF (Cloudflare Workers)
│  └─ index.ts             # API endpoints & R2 interaction
│
└─ public/                 # Static assets (favicon, OGP...)
```

## Commands

```bash
pnpm dev        # start development server
pnpm build      # build for production
pnpm fix        # lint and format code
pnpm deploy     # build and deploy to Cloudflare
pnpm cf-typegen # generate types for Cloudflare bindings
```

## Stack

React • TypeScript • Vite • wouter • SCSS Modules • Cloudflare Workers • Cloudflare R2
