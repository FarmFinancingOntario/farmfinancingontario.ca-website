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

There is no mock submission fallback. If `VITE_CONTACT_WORKER_URL` is missing, the form shows a configuration error.

## Cloudflare Worker

The sample Worker lives at:

```bash
worker/contact-form-worker.ts
```

It accepts `POST` requests, handles CORS, validates required fields, and forwards the submission to Cashly CRM using:

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
ALLOWED_ORIGIN=http://localhost:5173
```

Run the Worker locally with Wrangler:

```bash
npx wrangler dev worker/contact-form-worker.ts
```

Deploy the Worker:

```bash
npx wrangler deploy worker/contact-form-worker.ts --name farm-financing-contact-form
```

Set the production Cashly webhook as a secret:

```bash
npx wrangler secret put CASHLY_WEBHOOK_URL
```

Set the allowed website origin as a plain Worker variable in your Cloudflare dashboard or Wrangler configuration:

```bash
ALLOWED_ORIGIN=https://your-production-domain.com
```

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
```

## Notes

- Do not hardcode the Cashly CRM webhook URL in frontend code.
- Use production origins for `ALLOWED_ORIGIN` to restrict browser submissions.
- The page title is `Farm Financing Solution`.
- The displayed business name is `Farm Financing Ontario`.
