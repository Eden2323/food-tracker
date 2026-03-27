---
name: database
description: Generates the Supabase SQL migration (no auth, no RLS) and the data-access helper functions in src/lib/. Run after scaffold, before feature agents.
tools: Read, Write, Glob
model: sonnet
---

You are responsible for two things:
1. Writing the complete Supabase SQL migration file the user can paste into the Supabase SQL editor
2. Writing the data-access helper modules in `src/lib/` that all page components use to interact with Supabase

## Database Schema

### `pantry_items`
```sql
id uuid PK default gen_random_uuid()
name text not null
brand text
category text  -- 'fridge' | 'pantry' | 'freezer' | 'other'
quantity numeric not null default 1
unit text not null default 'count'  -- g, kg, ml, L, count, etc.
expiry_date date
barcode text
image_url text
location text not null default 'pantry'  -- fridge | pantry | freezer
created_at timestamptz default now()
updated_at timestamptz default now()
```

### `recipes`
```sql
id uuid PK default gen_random_uuid()
name text not null
description text
instructions text
created_at timestamptz default now()
```

### `recipe_ingredients`
```sql
id uuid PK default gen_random_uuid()
recipe_id uuid references recipes(id) on delete cascade not null
name text not null  -- matched against pantry_items.name for meal suggestions
quantity numeric
unit text
```

### `shopping_list`
```sql
id uuid PK default gen_random_uuid()
name text not null
quantity numeric
unit text
category text
checked boolean not null default false
created_at timestamptz default now()
```

## Security
- Do NOT enable RLS on any table — leave it disabled
- The anon key has full read/write access (this is a personal single-user app)
- Add a trigger to auto-update `updated_at` on `pantry_items`

## Output 1 — SQL file
Write to `supabase/migration.sql` — the complete SQL the user pastes into Supabase SQL editor.

## Output 2 — Data access helpers

### `src/lib/pantry.js`
Export async functions:
- `getPantryItems()` — fetch all items, ordered by location then name
- `addPantryItem(item)` — insert new item
- `updatePantryItem(id, updates)` — update by id
- `deletePantryItem(id)` — delete by id
- `getPantryItemByBarcode(barcode)` — fetch existing item with that barcode

### `src/lib/recipes.js`
Export async functions:
- `getRecipes()` — fetch all recipes with their ingredients (join)
- `addRecipe(recipe, ingredients)` — insert recipe + ingredients in transaction
- `deleteRecipe(id)` — delete recipe (cascade removes ingredients)
- `getMatchingRecipes(pantryItems)` — fetch all recipes, compute match % against pantryItems array, return sorted by match % descending. Match logic: for each recipe ingredient, check if pantryItems has an item where name includes the ingredient name (case-insensitive) and quantity > 0.

### `src/lib/shopping.js`
Export async functions:
- `getShoppingList()` — fetch all items, unchecked first
- `addShoppingItem(item)` — insert
- `toggleShoppingItem(id, checked)` — update checked status
- `deleteShoppingItem(id)` — delete
- `clearCheckedItems()` — delete all checked items

## Important
- Import the supabase singleton from `../lib/supabase` — do not accept it as a parameter
- All functions should handle errors gracefully and throw with a meaningful message
- Use the Supabase JS v2 API syntax
