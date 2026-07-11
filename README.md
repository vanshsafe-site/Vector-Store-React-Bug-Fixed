# Vector Store — React + Supabase

This is your storefront rebuilt in React (Vite) on top of the **same Supabase backend**
you already have (same `products`, `orders`, `product-images` bucket, and Auth).
No backend changes needed.

## 1. Yes — you need a React environment, but it's already scaffolded here

You don't need to run `npm create vite`. This folder *is* the environment — you just need
Node.js installed locally to run it:

```bash
cd vector-store-react
npm install
```

## 2. Connect it to your Supabase project

Copy the example env file and fill in your project's anon key (same values that were
hardcoded in `supabase.js` before):

```bash
cp .env.example .env
```

`.env`:
```
VITE_SUPABASE_URL=https://cuzgjevdoybvpadtsrsg.supabase.co
VITE_SUPABASE_ANON_KEY=<your anon key>
```

`.env` is gitignored — don't commit it. `src/lib/supabaseClient.js` reads these two
variables via `import.meta.env`.

## 3. Run it

```bash
npm run dev
```

Opens at `http://localhost:5173`.

## 4. Build for production

```bash
npm run build
```

Outputs static files to `dist/` — deploy that folder anywhere (Vercel, Netlify, Cloudflare
Pages, or Supabase Storage/hosting). Vercel/Netlify: just point them at this repo, they'll
auto-detect Vite, and you set the two `VITE_...` env vars in their dashboard.

## Admin access

There's no visible link to the admin panel from the storefront (same as the original
site). Go directly to:

```
http://localhost:5173/admin/login
```

After logging in you're redirected to `/admin/dashboard`. That route, plus
`/admin/products` and `/admin/orders`, are wrapped in `ProtectedRoute` and will bounce
you back to `/admin/login` if there's no active Supabase session.

## Project structure

```
src/
  lib/
    supabaseClient.js     # Supabase client (from env vars)
  context/
    CartContext.jsx       # Cart state (replaces localStorage-driven app.js cart logic)
    AuthContext.jsx        # Admin session state (replaces protectAdminPages())
  components/
    Header.jsx             # Storefront nav
    AdminHeader.jsx         # Admin nav + logout
    ProductCard.jsx
    StatusBadge.jsx
    ProtectedRoute.jsx      # Redirects to /admin/login if no session
  pages/
    Home.jsx                # index.html
    Cart.jsx                # cart.html
    Checkout.jsx             # checkout.html
    OrderSuccess.jsx         # order-success.html
    admin/
      AdminLogin.jsx         # admin-login.html
      AdminDashboard.jsx     # admin-dashboard.html
      AdminProducts.jsx      # admin-products.html
      AdminOrders.jsx        # admin-orders.html
  App.jsx                  # Routes
  main.jsx                 # Entry point
  index.css                # Your original style.css, unchanged (+ 1 small addition)
```

## What changed vs. what didn't

**Didn't change (kept as-is):**
- Your Supabase schema — `products`, `orders`, `product-images` bucket, `auth`.
- Your CSS entirely — `style.css` was dropped in as `index.css` verbatim.
- All business logic: cart math, order placement shape, image upload flow, status
  update flow, low-stock threshold (<10), dashboard stat calculations.

**Changed (mechanically, due to the framework swap):**
- `localStorage` cart reads/writes → `CartContext` (still persists to `localStorage`
  under the hood, so nothing breaks for existing users mid-cart).
- `supabaseClient.auth.getSession()` polling on every admin page → `AuthContext` +
  `ProtectedRoute`, checked once and reactively.
- Global `window.onclick="..."` handlers → React `onClick` props.
- Manual `innerHTML` string building → JSX.
- `beautify.js` progressive enhancements (counter animation, status badge icons,
  reveal-on-scroll, category tags) were **not ported** — most of what it did
  (status icons, category tags) is now handled directly in `StatusBadge.jsx` and
  `ProductCard.jsx`. The scroll-reveal/counter-animation flourishes were dropped;
  say the word if you want them back as a small custom hook.

## Not ported (tell me if you want these)
- Mobile-specific `data-label` injection for the orders table — the CSS classes are
  still there (`.orders-table`), I just didn't wire up the JS stamping; can add if
  your mobile CSS depends on it.
- Route-based page titles / meta tags (currently all pages share one `<title>`).
