import { supabase } from './supabase'

/**
 * Fetch all recipes, each with its ingredients array attached.
 * @returns {Promise<Array>}
 */
export async function getRecipes() {
  const { data: recipes, error: recipesError } = await supabase
    .from('recipes')
    .select('*')
    .order('name', { ascending: true })

  if (recipesError) throw new Error(`Failed to fetch recipes: ${recipesError.message}`)
  if (!recipes.length) return []

  const recipeIds = recipes.map((r) => r.id)

  const { data: ingredients, error: ingredientsError } = await supabase
    .from('recipe_ingredients')
    .select('*')
    .in('recipe_id', recipeIds)

  if (ingredientsError) throw new Error(`Failed to fetch recipe ingredients: ${ingredientsError.message}`)

  // Group ingredients by recipe_id and attach
  const ingredientsByRecipe = ingredients.reduce((acc, ingredient) => {
    if (!acc[ingredient.recipe_id]) acc[ingredient.recipe_id] = []
    acc[ingredient.recipe_id].push(ingredient)
    return acc
  }, {})

  return recipes.map((recipe) => ({
    ...recipe,
    ingredients: ingredientsByRecipe[recipe.id] ?? [],
  }))
}

/**
 * Insert a recipe and its ingredients. Returns the created recipe (without ingredients).
 * @param {Object} recipe   - Fields matching the recipes schema (name, description, instructions).
 * @param {Array}  ingredients - Array of ingredient objects (name, quantity, unit).
 * @returns {Promise<Object>}
 */
export async function addRecipe(recipe, ingredients = []) {
  const { data: createdRecipe, error: recipeError } = await supabase
    .from('recipes')
    .insert(recipe)
    .select()
    .single()

  if (recipeError) throw new Error(`Failed to create recipe: ${recipeError.message}`)

  if (ingredients.length > 0) {
    const rows = ingredients.map((ing) => ({
      ...ing,
      recipe_id: createdRecipe.id,
    }))

    const { error: ingredientsError } = await supabase
      .from('recipe_ingredients')
      .insert(rows)

    if (ingredientsError) {
      throw new Error(`Recipe created but failed to insert ingredients: ${ingredientsError.message}`)
    }
  }

  return createdRecipe
}

/**
 * Delete a recipe by id. Cascades to recipe_ingredients automatically.
 * @param {string} id - UUID of the recipe to delete.
 * @returns {Promise<void>}
 */
export async function deleteRecipe(id) {
  const { error } = await supabase
    .from('recipes')
    .delete()
    .eq('id', id)

  if (error) throw new Error(`Failed to delete recipe ${id}: ${error.message}`)
}

/**
 * Return all recipes ranked by how well the current pantry covers their ingredients.
 *
 * Match criteria for an ingredient:
 *   - A pantry item exists whose name CONTAINS the ingredient name (case-insensitive)
 *   - AND that pantry item has quantity > 0
 *
 * Each recipe in the returned array gains:
 *   - matchPercent       {number}  0–100
 *   - missingIngredients {Array}   ingredient objects not matched
 *
 * @param {Array} pantryItems - Array of pantry item objects (from getPantryItems).
 * @returns {Promise<Array>}
 */
export async function getMatchingRecipes(pantryItems) {
  const recipes = await getRecipes()

  const scored = recipes.map((recipe) => {
    const { ingredients } = recipe
    const total = ingredients.length

    if (total === 0) {
      return { ...recipe, matchPercent: 100, missingIngredients: [] }
    }

    const missingIngredients = []
    let matchCount = 0

    for (const ingredient of ingredients) {
      const ingredientNameLower = ingredient.name.toLowerCase()

      const matched = pantryItems.some(
        (pantryItem) =>
          pantryItem.name.toLowerCase().includes(ingredientNameLower) &&
          pantryItem.quantity > 0
      )

      if (matched) {
        matchCount++
      } else {
        missingIngredients.push(ingredient)
      }
    }

    const matchPercent = (matchCount / total) * 100

    return { ...recipe, matchPercent, missingIngredients }
  })

  // Sort highest match % first
  scored.sort((a, b) => b.matchPercent - a.matchPercent)

  return scored
}
