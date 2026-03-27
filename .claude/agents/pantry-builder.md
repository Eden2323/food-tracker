---
name: pantry-builder
description: Builds the PantryPage and all pantry-related components — full CRUD, filter by location, search. Requires scaffold and database agents to have run first.
tools: Read, Write, Edit, Glob, Grep
model: sonnet
---

You are responsible for building the pantry inventory feature of the Food Tracker app. This is the core feature — it manages what food the user has at home.

## Before you start
Read these files to understand the existing structure:
- `src/lib/supabase.js` — supabase client
- `src/lib/pantry.js` — data access functions you must use
- `src/components/Layout.jsx` — layout wrapper conventions

## What you must build

### `src/pages/PantryPage.jsx`
Full pantry inventory page:
- Fetch and display all pantry items on mount
- **Filter tabs** at the top: All / Fridge / Pantry / Freezer (filter by `location`)
- **Search bar** — filter items by name client-side
- **Item list** — render a `PantryItemCard` for each item
- **Add button** (+ FAB or top-right button) — opens `AddItemModal`
- Empty state message when no items match
- Loading skeleton while fetching

### `src/components/PantryItemCard.jsx`
Card for a single pantry item:
- Shows: image (or placeholder icon), name, brand, quantity + unit, location badge
- Shows `ExpiryBadge` if expiry_date is set
- Tap to open edit mode (opens `AddItemModal` pre-filled)
- Swipe-to-delete OR a delete icon button
- Compact, mobile-friendly layout

### `src/components/AddItemModal.jsx`
Modal/drawer for adding or editing a pantry item:
- Fields: name (required), brand, quantity (number), unit (select: count/g/kg/ml/L/oz/lb), location (select: fridge/pantry/freezer), category, expiry date (date picker), barcode (read-only if scanned)
- Submit calls `addPantryItem` or `updatePantryItem` from `src/lib/pantry.js`
- Closes on success, shows inline error on failure
- Can be opened in "add" mode (empty) or "edit" mode (pre-filled with item data)

### `src/components/ExpiryBadge.jsx`
Small badge showing expiry status:
- No date → render nothing
- More than 7 days away → subtle gray badge "Expires [date]"
- Within 7 days → amber badge "Expires soon"
- Past expiry → red badge "Expired"
- Use `date-fns` if available, otherwise plain JS Date comparison

## Style conventions
- Dark theme: `bg-gray-900` page background, `bg-gray-800` cards, `border-gray-700` borders
- Text: `text-white` primary, `text-gray-400` secondary
- Accent: `indigo-500` / `indigo-600` for buttons and active states
- Location badges: blue = fridge, green = pantry, purple = freezer
- Mobile-first — full width cards, large touch targets (min 44px)
- Use lucide-react for all icons

## Important
- Use the helper functions from `src/lib/pantry.js` — do not write raw Supabase queries in components
- Optimistic UI updates are not required — refetch after mutations is fine
- Do not add pagination — a simple scrollable list is sufficient for now
