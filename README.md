# Farm Financing Solution

Static landing page for **Farm Financing Ontario**, a mortgage agent brand focused on agricultural and rural property financing.

The app uses `logo.png` from the repository root for Farm Financing Ontario branding and `pineapple.png` for the Powered by Pineapple brokerage attribution in the footer.

## Tech Stack

- Vite
- React
- TypeScript
- Tailwind CSS
- Cloudflare Worker sample for contact form forwarding

## Local Setup

Install dependencies:

```bash
npm install
```

Create a local environment file:

```bash
cp .env.example .env
```

Set the contact Worker URL in `.env`:

```bash
VITE_CONTACT_WORKER_URL=http://localhost:8787
VITE_TURNSTILE_SITE_KEY=0x4AAAAA-your-public-turnstile-site-key
```

Start the landing page:

```bash
npm run dev
```

## Build and Preview

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Contact Form Flow

The React form posts JSON to:

```bash
VITE_CONTACT_WORKER_URL
```

The payload includes the visible form fields plus:

- `source`: `farm-financing-ontario-website`
- `formName`: `Farm Financing Solution Lead Form`
- `submittedAt`: ISO timestamp
- `formStartedAt`: ISO timestamp used by the Worker for timing checks
- `turnstileToken`: Cloudflare Turnstile token verified by the Worker
- `companyWebsite`: hidden honeypot field that should stay empty

There is no mock submission fallback. If `VITE_CONTACT_WORKER_URL` is missing, the form shows a configuration error.

## Spam Protection

The form is designed so the Cashly CRM webhook is never exposed in frontend code.

Protection layers:

- Cloudflare Turnstile widget in the React form
- Mandatory server-side Turnstile token validation in the Worker
- Hidden honeypot field
- Stale form submission timing check
- Server-side field validation and max-length limits
- Optional Cloudflare KV rate limiting by visitor IP
- Optional `ALLOWED_ORIGIN` allowlist for browser requests

Public frontend variables:

```bash
VITE_CONTACT_WORKER_URL=https://your-contact-form-worker.your-subdomain.workers.dev
VITE_TURNSTILE_SITE_KEY=0x4AAAAA-your-public-turnstile-site-key
```

Private Worker secrets:

```bash
CASHLY_WEBHOOK_URL=https://cashly.example.com/webhooks/your-webhook-id
TURNSTILE_SECRET_KEY=your-private-turnstile-secret-key
```

## Cloudflare Worker

The sample Worker lives at:

```bash
worker/contact-form-worker.ts
```

It accepts `POST` requests, handles CORS, validates required fields, verifies Turnstile, applies optional rate limiting, and forwards the submission to Cashly CRM using:

```bash
CASHLY_WEBHOOK_URL
```

For local Worker development, copy the example variables:

```bash
cp worker/.dev.vars.example worker/.dev.vars
```

Then set real values:

```bash
CASHLY_WEBHOOK_URL=https://cashly.example.com/webhooks/your-webhook-id
TURNSTILE_SECRET_KEY=your-private-turnstile-secret-key
ALLOWED_ORIGIN=http://localhost:5173
```

For a deployed Worker, use the production site origins:

```bash
ALLOWED_ORIGIN=https://farmfinancingontario.ca,https://www.farmfinancingontario.ca,https://farmfinancingontario.github.io
```

Run the Worker locally with Wrangler:

```bash
npx wrangler dev worker/contact-form-worker.ts
```

Deploy the Worker:

```bash
npx wrangler deploy worker/contact-form-worker.ts --name farm-financing-contact-form
```

The Worker config lives at:

```bash
worker/wrangler.jsonc
```

It includes the non-secret `ALLOWED_ORIGIN` setting. Keep private values in Cloudflare secrets, not in this file.

Set the production Cashly webhook as a secret:

```bash
npx wrangler secret put CASHLY_WEBHOOK_URL
```

Set the production Turnstile secret as a secret:

```bash
npx wrangler secret put TURNSTILE_SECRET_KEY
```

Set the allowed website origin as a plain Worker variable in your Cloudflare dashboard or Wrangler configuration:

```bash
ALLOWED_ORIGIN=https://farmfinancingontario.ca,https://www.farmfinancingontario.ca
```

Optional KV rate limiting:

```bash
npx wrangler kv namespace create RATE_LIMIT_KV
npx wrangler kv namespace create RATE_LIMIT_KV --preview
```

Use `worker/wrangler.toml.example` as a reference if you later add KV namespace bindings. Keep account-specific config files out of the public repo if they contain private or client-specific values.

After deployment, update the frontend environment variable:

```bash
VITE_CONTACT_WORKER_URL=https://farm-financing-contact-form.your-subdomain.workers.dev
```

## Frontend Deployment

This project can be deployed to Cloudflare Pages, Netlify, Vercel, or any static host.

Use:

- Build command: `npm run build`
- Output directory: `dist`
- Required environment variable: `VITE_CONTACT_WORKER_URL`

## GitHub Pages

The repository includes `.github/workflows/deploy-pages.yml`, which builds the Vite app and deploys `dist` to GitHub Pages whenever changes are pushed to `main`.

In the GitHub repository settings, configure Pages to use **GitHub Actions** as the build and deployment source.

Add the production contact Worker URL as a repository variable before rebuilding:

```bash
VITE_CONTACT_WORKER_URL=https://your-contact-form-worker.your-subdomain.workers.dev
VITE_TURNSTILE_SITE_KEY=0x4AAAAA-your-public-turnstile-site-key
```

## GoDaddy DNS for `farmfinancingontario.ca`

GitHub Pages is configured for the custom domain `farmfinancingontario.ca`.

In GoDaddy DNS, add these records for the apex domain:

```text
Type  Name  Value
A     @     185.199.108.153
A     @     185.199.109.153
A     @     185.199.110.153
A     @     185.199.111.153
```

Optional IPv6 records:

```text
Type  Name  Value
AAAA  @     2606:50c0:8000::153
AAAA  @     2606:50c0:8001::153
AAAA  @     2606:50c0:8002::153
AAAA  @     2606:50c0:8003::153
```

Add the `www` redirect/support record:

```text
Type   Name  Value
CNAME  www   farmfinancingontario.github.io
```

Remove conflicting parked-domain, forwarding, or wildcard records for `@`, `www`, or `*` before testing. DNS changes can take time to propagate.

## Notes

- Do not hardcode the Cashly CRM webhook URL in frontend code.
- Use production origins for `ALLOWED_ORIGIN` to restrict browser submissions.
- Do not commit `CASHLY_WEBHOOK_URL` or `TURNSTILE_SECRET_KEY`.
- The page title is `Farm Financing Solution`.
- The displayed business name is `Farm Financing Ontario`.
