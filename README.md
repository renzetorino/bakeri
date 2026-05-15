# Bake RI

An artisan bakery web application built with Next.js. Customers can browse freshly baked products, manage a shopping cart, and authenticate via a secure login/signup flow.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Auth | Better Auth |
| Database | PostgreSQL + Drizzle ORM |
| API | tRPC + TanStack Query |
| Forms | React Hook Form + Zod |
| State | Zustand (persisted) |
| Icons | Lucide React |

---

## Local Setup

### Prerequisites

- Node.js 18+
- pnpm (`npm install -g pnpm`)
- A running PostgreSQL instance

### 1. Clone the repository

```bash
git clone <repo-url>
cd bake-ri
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
DATABASE_URL="postgresql://<user>:<password>@localhost:5432/bake-ri"
NEXT_PUBLIC_BETTER_AUTH_URL="http://localhost:3000"
BETTER_AUTH_SECRET="your-secret-key"
```

### 4. Set up the database

```bash
# Generate migration files from the schema
pnpm db:generate

# Run migrations
pnpm db:migrate

# Push schema to database (alternative to migrate)
pnpm db:push

# (Optional) Seed the admin user
pnpm db:seed
```

> You can run all three database steps at once with `pnpm db:all`.

### 5. Start the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Available Scripts

| Script | Description |
|---|---|
| `pnpm dev` | Start the dev server |
| `pnpm build` | Build for production |
| `pnpm start` | Start the production server |
| `pnpm lint` | Run ESLint |
| `pnpm db:generate` | Generate Drizzle migration files |
| `pnpm db:migrate` | Run pending migrations |
| `pnpm db:push` | Push schema directly to the database |
| `pnpm db:studio` | Open Drizzle Studio (DB GUI) |
| `pnpm db:seed` | Seed the database with an admin user |

---

## Project Structure

```
bake-ri/
├── app/                        # Next.js App Router pages & layouts
│   ├── layout.tsx              # Root layout (Navbar, Providers)
│   ├── page.tsx                # Home page entry
│   ├── auth/
│   │   ├── layout.tsx          # Auth layout wrapper
│   │   ├── login/page.tsx      # Login page
│   │   └── signup/page.tsx     # Sign up page
│   ├── products/
│   │   └── page.tsx            # All products listing page
│   ├── orders/
│   │   └── cart/page.tsx       # Shopping cart page
│   └── api/
│       ├── auth/[...all]/      # Better Auth catch-all handler
│       └── trpc/[trpc]/        # tRPC HTTP handler
│
├── components/
│   ├── pages/                  # Full-page components (one per route)
│   │   ├── home/index.tsx      # Home page (hero + featured products)
│   │   ├── login/index.tsx     # Login form
│   │   ├── signup/index.tsx    # Sign up form
│   │   ├── products/index.tsx  # Products listing with category filters
│   │   └── orders/cart/        # Cart with quantity controls & summary
│   ├── ui/                     # Reusable UI primitives
│   │   ├── button.tsx          # Button with CVA variants
│   │   ├── input.tsx           # Input / Textarea component
│   │   ├── label.tsx           # Form label
│   │   ├── dropdown-menu.tsx   # Radix-based dropdown menu
│   │   └── navbar.tsx          # Sticky scroll-aware navbar with cart badge
│   └── providers.tsx           # TanStack Query + tRPC client providers
│
├── lib/
│   ├── auth/
│   │   ├── config.ts           # Better Auth server configuration
│   │   ├── client.ts           # Better Auth React client
│   │   └── utils-server.ts     # Server-side auth helpers
│   ├── constants/
│   │   └── product.ts          # Static product catalogue (30 items) + types
│   ├── db/
│   │   ├── index.ts            # Drizzle database connection
│   │   └── schema/             # Drizzle table schemas
│   ├── hooks/
│   │   └── use-auth-session.ts # useSession convenience hook
│   ├── trpc/
│   │   ├── client.tsx          # tRPC client setup
│   │   ├── server.tsx          # tRPC server-side caller
│   │   └── query-client.tsx    # TanStack QueryClient factory
│   └── utils.ts                # cn() Tailwind class merge utility
│
├── server/
│   ├── trpc.ts                 # tRPC initialisation & middleware
│   ├── context.ts              # tRPC request context
│   └── routers/
│       ├── index.ts            # Root app router
│       └── users.ts            # Users router (getByEmail, getListOfUsers)
│
├── stores/
│   └── order-store.ts          # Zustand cart store (persisted to localStorage)
│
├── seeders/
│   ├── index.ts                # Seeder entry point
│   └── seed-admin-user.ts      # Creates the default admin account
│
├── drizzle.config.ts           # Drizzle Kit configuration
└── next.config.ts              # Next.js configuration
```

---

## Pages Summary

| Route | Description |
|---|---|
| `/` | Landing page with a hero section and featured products |
| `/products` | Full product catalogue with category filter tabs |
| `/orders/cart` | Shopping cart — update quantities, remove items, view order summary |
| `/auth/login` | Email + password login with React Hook Form validation |
| `/auth/signup` | New user registration with password strength validation |

---

## Key Features

- **Sticky Navbar** — transparent over the hero, switches to white with a shadow on scroll; includes a cart badge counter
- **Cart Dropdown** — quick cart preview (up to 5 items) accessible from the navbar; links to the full cart page
- **Cart Page** — full item management with `+` / `−` quantity controls, remove, clear all, and an order summary
- **Category Filters** — product listing page is filterable by Breads, Pastries, Cakes, and Cookies
- **Persistent Cart** — cart state is saved to `localStorage` via Zustand `persist` middleware
- **Authentication** — Better Auth handles sessions, cookies, and route protection
