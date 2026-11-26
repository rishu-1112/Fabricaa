# Fabricaa

Fabricaa is a textile catalog with a cart for collecting fabrics and an email-based quote request.

## Run the sample storefront

Install Node.js 22.12 or later. Open a terminal in the Fabricaa folder, then run:

```sh
npm run dev
```

Keep the terminal open and visit the **Local** URL Vite prints on the same computer. Open `/products` to browse the sample fabrics. Sample quote downloads work without MongoDB or email credentials.

## Full-stack local development

Use Node.js 22.12 or later and a running MongoDB instance. From the repository root:

```sh
cp backend/.env.example backend/.env
npm ci --prefix backend
npm ci --prefix frontend
npm --prefix backend run seed:fabric
npm --prefix backend run seed:products
npm --prefix backend run dev
```

In a second terminal:

```sh
npm run dev:live
```

Vite's development server proxies `/api` to port 5000. Fill in `EMAIL_USER` and `EMAIL_PASS` in `backend/.env` for contact and quote requests. Use the Gmail mailbox address and an app password. To enable catalog writes, generate a server-only token with `openssl rand -hex 32`, set `ADMIN_API_TOKEN`, and send it from trusted tools over HTTPS as an `Authorization: Bearer <token>` header. Catalog reads are public.

The seed scripts insert missing entries by name. To clear and reseed a collection, append `-- --reset` to the corresponding command. Resets require a local MongoDB database whose name ends in `_dev` or `_test`.

## Deploy

Run `npm run build` in `frontend` and serve `frontend/dist`. Route `/api` to Express and use an `index.html` fallback for frontend routes. Start Express with `npm start` in `backend`. Set backend variables from `backend/.env.example` in the hosting environment.

For separate frontend and API hosts, set `VITE_API_BASE_URL` to the full API URL including `/api` at build time and set `FRONTEND_ORIGIN` on the backend to the frontend's origin. Configure `TRUST_PROXY_HOPS` only when the backend is behind a known number of trusted proxies and direct access is blocked. The contact and quote forms share a limit of five submissions per IP every 15 minutes per backend instance.

## Checks

```sh
npm --prefix frontend run lint
npm --prefix frontend run build
```

## Sample catalog

The demo includes 12 bundled sample fabrics. In the live catalog, use **Browse sample fabrics** if the catalog is empty or temporarily unavailable. Samples have illustrative prices and stock. A cart containing sample fabrics can download a draft quote, and a cart with only live fabrics can submit an email quote through the configured backend. Saved fabrics and cart items are stored in the current browser.
