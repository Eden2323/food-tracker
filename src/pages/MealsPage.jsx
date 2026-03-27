import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, UtensilsCrossed, Loader2 } from 'lucide-react'
import { getPantryItems } from '../lib/pantry'
import { getMatchingRecipes, deleteRecipe } from '../lib/recipes'
import { addShoppingItem } from '../lib/shopping'
import MealCard from '../components/MealCard'

export default function MealsPage() {
  const navigate = useNavigate()
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function fetchRecipes() {
    try {
      setError(null)
      const pantryItems = await getPantryItems()
      const matched = await getMatchingRecipes(pantryItems)
      setRecipes(matched)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRecipes()
  }, [])

  async function handleDelete(id) {
    try {
      await deleteRecipe(id)
      await fetchRecipes()
    } catch (err) {
      alert(err.message)
    }
  }

  async function handleAddToShoppingList(name) {
    try {
      await addShoppingItem({ name })
    } catch (err) {
      alert(err.message)
    }
  }

  const canMake = recipes.filter((r) => r.matchPercent >= 100)
  const almostThere = recipes.filter((r) => r.matchPercent < 100)

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <UtensilsCrossed size={22} className="text-indigo-400" />
          <h1 className="text-xl font-bold">Meals & Recipes</h1>
        </div>
        <button
          onClick={() => navigate('/meals/new')}
          className="flex items-center gap-2 min-h-[44px] px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition-colors"
        >
          <Plus size={18} />
          Add Recipe
        </button>
      </div>

      <div className="p-4">
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="text-indigo-400 animate-spin" />
          </div>
        )}

        {error && (
          <div className="bg-red-900/30 border border-red-800 rounded-xl p-4 text-red-300 text-sm">
            {error}
          </div>
        )}

        {!loading && !error && recipes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
            <UtensilsCrossed size={48} className="text-gray-600" />
            <div>
              <p className="text-white font-medium text-lg">No recipes yet</p>
              <p className="text-gray-400 text-sm mt-1">Add your first recipe to get started</p>
            </div>
            <button
              onClick={() => navigate('/meals/new')}
              className="flex items-center gap-2 min-h-[44px] px-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-colors"
            >
              <Plus size={18} />
              Add Recipe
            </button>
          </div>
        )}

        {!loading && !error && recipes.length > 0 && (
          <>
            {canMake.length > 0 && (
              <section className="mb-6">
                <h2 className="text-green-400 font-semibold text-sm uppercase tracking-wide mb-3">
                  Can make now
                </h2>
                {canMake.map((recipe) => (
                  <MealCard
                    key={recipe.id}
                    recipe={recipe}
                    onDelete={handleDelete}
                    onAddToShoppingList={handleAddToShoppingList}
                  />
                ))}
              </section>
            )}

            {almostThere.length > 0 && (
              <section>
                <h2 className="text-amber-400 font-semibold text-sm uppercase tracking-wide mb-3">
                  Almost there
                </h2>
                {almostThere.map((recipe) => (
                  <MealCard
                    key={recipe.id}
                    recipe={recipe}
                    onDelete={handleDelete}
                    onAddToShoppingList={handleAddToShoppingList}
                  />
                ))}
              </section>
            )}
          </>
        )}
      </div>

      {/* FAB for mobile */}
      {!loading && recipes.length > 0 && (
        <button
          onClick={() => navigate('/meals/new')}
          className="fixed bottom-20 right-4 w-14 h-14 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full shadow-lg flex items-center justify-center transition-colors z-40"
          aria-label="Add recipe"
        >
          <Plus size={24} />
        </button>
      )}
    </div>
  )
}
