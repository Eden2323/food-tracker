# HANDOFF — food tracker

Baseline plan ported from local Claude memory on 2026-09-21. Verify against the code before relying on a detail.


## Tech Stack
- React 19 + Vite 8
- Tailwind CSS v4 (`@tailwindcss/vite` plugin — NOT PostCSS)
- Supabase (PostgreSQL, no auth, no RLS — open access via anon key)
- React Router v7
- lucide-react icons
- Dark theme by default (no light mode toggle)
- Vercel hosting + GitHub auto-deploy (vercel.json SPA rewrite rule)

## Project Structure Conventions
- Pages in `src/pages/`, shared components in `src/components/`
- Supabase client in `src/lib/supabase.js`
- No auth — app is open access, no login required
- RLS disabled on all tables — anon key has full read/write access

## Database Schema

### `pantry_items`
- id (uuid PK), name (text), brand (text nullable)
- category (text), quantity (numeric), unit (text)
- expiry_date (date nullable), barcode (text nullable), image_url (text nullable)
- location (text: fridge/pantry/freezer), created_at, updated_at

### `recipes`
- id (uuid PK), name (text)
- description (text nullable), instructions (text nullable), created_at

### `recipe_ingredients`
- id (uuid PK), recipe_id (uuid → recipes), name (text), quantity (numeric nullable), unit (text nullable)

### `shopping_list`
- id (uuid PK), name (text)
- quantity (numeric nullable), unit (text nullable), category (text nullable)
- checked (boolean default false), created_at

## Pages
| Route | Page | Purpose |
|---|---|---|
| `/` | DashboardPage | Overview: counts, expiring soon, quick add |
| `/pantry` | PantryPage | Full inventory — filter by location/category, search |
| `/scan` | ScanPage | Camera barcode scanner → auto-fill product info |
| `/shopping` | ShoppingPage | Shopping list with check-off |
| `/meals` | MealsPage | Recipes + what you can make now |
| `/meals/new` | NewRecipePage | Add a custom recipe with ingredients |

## Component Tree
```
src/
├── lib/supabase.js
├── pages/
│   ├── DashboardPage.jsx
│   ├── PantryPage.jsx
│   ├── ScanPage.jsx
│   ├── ShoppingPage.jsx
│   ├── MealsPage.jsx
│   └── NewRecipePage.jsx
└── components/
    ├── Layout.jsx
    ├── Navbar.jsx
    ├── PantryItemCard.jsx
    ├── AddItemModal.jsx
    ├── BarcodeScanner.jsx
    ├── ExpiryBadge.jsx
    ├── MealCard.jsx
    └── ShoppingListItem.jsx
```

## Barcode Scanning Flow
1. User opens `/scan` → camera via `html5-qrcode` library
2. Scan captures barcode string
3. Query Open Food Facts API: `https://world.openfoodfacts.org/api/v2/product/{barcode}`
4. Pre-fills name, brand, category, image into Add to Pantry form
5. User sets quantity, unit, location, expiry → saved to `pantry_items`

## Meal Suggestions Logic
- User defines recipes with ingredient lists (`recipe_ingredients`)
- On `/meals`: fetch all recipes + current pantry items
- Match ingredients by name against pantry items with quantity > 0
- Sort by match percentage — 100% matches shown first
- Missing ingredients can be added to shopping list in one click

## Dashboard Widgets
- Pantry count by location (fridge/pantry/freezer)
- Expiring soon (within 7 days = amber, past expiry = red)
- Low stock (quantity ≤ 1)
- Meals you can make now (100% matched recipe count)
- Quick scan button → `/scan`

## Build Phases

### Phase 1 — Baseline (build first)
- Project scaffold (no auth — open access)
- Pantry CRUD (manual add/edit/delete)
- Barcode scan → Open Food Facts lookup
- Meal matching from user-defined recipes
- Shopping list

### Phase 2 — Future Features
- Push notifications for expiring items
- Auto-add to shopping list when item runs out
- Shared pantry (household members)
- Recipe import from URL
- AI meal suggestions (Claude API)
- Nutritional info display from Open Food Facts data

## Why:
User wants a mobile-friendly food tracking app with barcode scanning and meal suggestions as the core baseline, then iteratively add features on top.

## Deployment
- GitHub: https://github.com/Eden2323/food-tracker
- Vercel: https://food-tracker-iota-green.vercel.app/
- Auto-deploys on every push to main

## How to apply:
Reference this when building any part of the app to ensure consistency with the planned schema, routing, and component structure. Always check which phase a feature belongs to before implementing.
