import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, X, Loader2 } from 'lucide-react'
import { addRecipe } from '../lib/recipes'

const emptyIngredient = () => ({ name: '', quantity: '', unit: '' })

const inputClass =
  'w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 placeholder-gray-400'
const labelClass = 'block text-sm text-gray-400 mb-1'

export default function NewRecipePage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [instructions, setInstructions] = useState('')
  const [ingredients, setIngredients] = useState([emptyIngredient()])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  function updateIngredient(index, field, value) {
    setIngredients((prev) =>
      prev.map((ing, i) => (i === index ? { ...ing, [field]: value } : ing))
    )
  }

  function addIngredientRow() {
    setIngredients((prev) => [...prev, emptyIngredient()])
  }

  function removeIngredientRow(index) {
    setIngredients((prev) => prev.filter((_, i) => i !== index))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    if (!name.trim()) {
      setError('Recipe name is required.')
      return
    }

    const validIngredients = ingredients
      .filter((ing) => ing.name.trim())
      .map((ing) => ({
        name: ing.name.trim(),
        quantity: ing.quantity ? Number(ing.quantity) : null,
        unit: ing.unit.trim() || null,
      }))

    setLoading(true)
    try {
      await addRecipe(
        {
          name: name.trim(),
          description: description.trim() || null,
          instructions: instructions.trim() || null,
        },
        validIngredients
      )
      navigate('/meals')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-400 hover:text-white transition-colors p-1 min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Go back"
        >
          <ArrowLeft size={22} />
        </button>
        <h1 className="text-xl font-bold">New Recipe</h1>
      </div>

      <form onSubmit={handleSubmit} className="p-4 space-y-5 max-w-lg mx-auto pb-10">
        {/* Name */}
        <div>
          <label className={labelClass}>Name *</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Pasta Arrabbiata"
            className={inputClass}
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className={labelClass}>Description</label>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Short description (optional)"
            className={inputClass}
          />
        </div>

        {/* Instructions */}
        <div>
          <label className={labelClass}>Instructions</label>
          <textarea
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="Step-by-step instructions (optional)"
            rows={5}
            className={`${inputClass} resize-none`}
          />
        </div>

        {/* Ingredients */}
        <div>
          <label className={labelClass}>Ingredients</label>
          <div className="space-y-2">
            {ingredients.map((ing, index) => (
              <div key={index} className="flex gap-2 items-center">
                <input
                  value={ing.name}
                  onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                  placeholder="Ingredient"
                  className={`${inputClass} flex-[3]`}
                />
                <input
                  type="number"
                  value={ing.quantity}
                  onChange={(e) => updateIngredient(index, 'quantity', e.target.value)}
                  placeholder="Qty"
                  min="0"
                  step="any"
                  className={`${inputClass} flex-[1] min-w-0`}
                />
                <input
                  value={ing.unit}
                  onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                  placeholder="Unit"
                  className={`${inputClass} flex-[1] min-w-0`}
                />
                {ingredients.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeIngredientRow(index)}
                    className="text-gray-500 hover:text-red-400 transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center shrink-0"
                    aria-label="Remove ingredient"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addIngredientRow}
            className="mt-3 flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors min-h-[44px]"
          >
            <Plus size={16} />
            Add ingredient
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-900/30 border border-red-800 rounded-xl p-3 text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* Submit */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 min-h-[44px] bg-gray-700 hover:bg-gray-600 text-white rounded-xl text-sm font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 min-h-[44px] bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? 'Saving…' : 'Save Recipe'}
          </button>
        </div>
      </form>
    </div>
  )
}
