# Longevity Maxxer

A focused, evidence-graded marketing and education site for a healthspan product.
It turns the noisy longevity space into a small set of high-leverage fundamentals,
and it is built to be safe by design.

## What this is

- A fast, dependency-free static website (plain HTML, CSS, and vanilla JS).
- Iterated entirely through GitHub commits. Push to `main` and it deploys.
- Hosted on Azure Static Web Apps (Free tier).

## Safety and privacy by design

This site is intentionally built so that safety is structural, not a promise:

- **Zero-PHI architecture.** Fully static, no backend, no accounts, no health-data
  forms. There is nothing to breach because no health information is ever received.
- **On-device tools.** The interactive self-check computes in the browser and stores
  or transmits nothing.
- **Evidence tiers.** Health claims are labeled Strong, Moderate, or Emerging.
- **Coach, not clinician.** Content educates and routes to licensed care. It does not
  diagnose, prescribe, dose, or treat.
- **Clear scope.** Persistent "not medical advice" language plus an emergency note.

See `/safety.html`, `/privacy.html`, and `/terms.html` for the full posture.

## Project structure

```
.
├── index.html                 Landing page
├── personas.html              The six personas
├── safety.html                Safety, scope, and FAQ
├── privacy.html               Privacy notice
├── terms.html                 Terms of use
├── css/styles.css             Design system
├── js/main.js                 Content data + interactions + self-check
├── assets/favicon.svg         Logo mark
├── staticwebapp.config.json   Security headers + routing
└── .github/workflows/         Azure Static Web Apps deploy
```

## Editing content

Most copy lives in data arrays at the top of `js/main.js` (pillars, personas,
evidence, how-it-works, safety commitments, FAQ). Edit the data, commit, and push.
Longer-form legal and safety pages are plain HTML.

## Local preview

Serve the folder with any static server, for example:

```
npx http-server . -p 4173
```

Then open http://localhost:4173.

## Deployment

Pushes to `main` trigger the GitHub Actions workflow in
`.github/workflows/azure-static-web-apps.yml`, which uploads the static files to
Azure Static Web Apps. The deploy token is stored as the repository secret
`AZURE_STATIC_WEB_APPS_API_TOKEN`.

## Disclaimer

Longevity Maxxer provides general wellness and educational information only. It does
not diagnose, treat, cure, or prevent any disease and is not a substitute for
professional medical care.
