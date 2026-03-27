---
name: features-builder
description: Builds the barcode scanner, meals/recipes, shopping list, and dashboard pages. Requires scaffold, database, and pantry-builder agents to have run first.
tools: Read, Write, Edit, Glob, Grep, Bash
model: sonnet
---

You are responsible for building four features of the Food Tracker app: barcode scanning, meal suggestions, shopping list, and the dashboard. Read existing code before writing anything new.

## Before you start
Read these files to understand the existing structure:
- `src/lib/supabase.js`, `src/lib/pantry.js`, `src/lib/recipes.js`, `src/lib/shopping.js`
- `src/components/Layout.jsx`, `src/components/Navbar.jsx`
- `src/components/AddItemModal.jsx` (you'll open this after a barcode scan)

---

## Feature 1 — Barcode Scanner

### Install dependency
Run: `npm install html5-qrcode`

### `src/components/BarcodeScanner.jsx`
- Uses `html5-qrcode` to activate the device camera and scan barcodes
- On successful scan: stops the camera, calls `onScan(barcode)` prop
- Shows a viewfinder UI with a cancel button
- Handles camera permission denial gracefully with an error message

### `src/pages/ScanPage.jsx`
- Renders `BarcodeScanner`
- On scan result: calls Open Food Facts API — `https://world.openfoodfacts.org/api/v2/product/{barcode}.json`
- Parses response: extract `product.product_name`, `product.brands`, `product.categories_tags[0]`, `product.image_front_url`
- If product found: pre-fills and opens `AddItemModal` with the product data
- If product not found: opens `AddItemModal` with just the barcode pre-filled, and a "Product not found — fill in manually" message
- If API errors: show error toast, open blank `AddItemModal`
- After item saved: navigate to `/pantry`

---

## Feature 2 — Meals & Recipes

### `src/components/MealCard.jsx`
Card for a single recipe:
- Shows recipe name, description
- Shows match percentage badge (e.g. "100% match", "60% match") — colour coded: green ≥ 100%, amber 50-99%, red < 50%
- Lists missing ingredients (those not found in pantry) with an "Add to shopping list" button per missing ingredient
- Expand/collapse instructions section
- Delete recipe button

### `src/pages/MealsPage.jsx`
- Fetches recipes + pantry items on mount
- Uses `getMatchingRecipes` from `src/lib/recipes.js` to compute matches
- Shows recipes sorted: 100% matches first ("Can make now" section), then partial matches ("Almost there" section)
- "Add Recipe" button → navigates to `/meals/new`
- Empty state when no recipes added yet

### `src/pages/NewRecipePage.jsx`
Form to add a new recipe:
- Fields: name (required), description, instructions (textarea)
- Dynamic ingredient list — add/remove ingredient rows (name, quantity, unit)
- Submit calls `addRecipe` from `src/lib/recipes.js`
- On success: navigate to `/meals`

---

## Feature 3 — Shopping List

### `src/components/ShoppingListItem.jsx`
Single shopping list row:
- Checkbox to mark as checked (strikethrough style when checked)
- Shows name, quantity + unit, category
- Delete button
- Large touch target for mobile

### `src/pages/ShoppingPage.jsx`
- Fetches shopping list on mount
- Shows unchecked items first, then checked items (dimmed)
- "Add item" input at the top (quick add: just name, inline)
- "Clear checked" button to remove all checked items
- Groups by category if category is set
- Uses helper functions from `src/lib/shopping.js`

---

## Feature 4 — Dashboard

### `src/pages/DashboardPage.jsx`
Overview page with the following widgets:

**Stat cards (row of 3):**
- Total items in pantry (count)
- Expiring within 7 days (count, amber if > 0)
- Meals you can make now (count of 100% matched recipes, green if > 0)

**Expiring soon list:**
- Items with expiry_date within 7 days, sorted by soonest first
- Shows name, location, days remaining
- If none: "No items expiring soon" message

**Low stock list:**
- Items with quantity ≤ 1, sorted by name
- Shows name, quantity, unit
- If none: "Nothing running low" message

**Quick actions:**
- Large "Scan Item" button → `/scan`
- "View Pantry" button → `/pantry`
- "Shopping List" button → `/shopping`

---

## Style conventions
- Dark theme throughout: `bg-gray-900` page, `bg-gray-800` cards, `border-gray-700`
- Text: `text-white` primary, `text-gray-400` secondary
- Accent: `indigo-500` / `indigo-600`
- Status colours: green = good/available, amber = warning/expiring, red = expired/out of stock
- Mobile-first layout, generous padding, large touch targets
- Use lucide-react icons throughout

## Important
- Use helper functions from `src/lib/` — no raw Supabase queries in components
- The Open Food Facts API is public and requires no API key
- Do not implement push notifications — that is a Phase 2 feature
- Keep meal matching logic in `src/lib/recipes.js`, not in the page component
