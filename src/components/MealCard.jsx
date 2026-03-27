import { useState } from 'react'
import { ChevronDown, ChevronUp, Trash2, Plus } from 'lucide-react'

export default function MealCard({ recipe, onDelete, onAddToShoppingList }) {
  const [expanded, setExpanded] = useState(false)

  const { name, description, instructions, matchPercent, missingIngredients = [] } = recipe

  let badgeClass = ''
  let badgeLabel = ''
  if (matchPercent >= 100) {
    badgeClass = 'bg-green-900 text-green-300'
    badgeLabel = 'Can make now'
  } else if (matchPercent >= 50) {
    badgeClass = 'bg-amber-900 text-amber-300'
    badgeLabel = `${Math.round(matchPercent)}% match`
  } else {
    badgeClass = 'bg-red-900 text-red-300'
    badgeLabel = `${Math.round(matchPercent)}% match`
  }

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 p-4 mb-4">
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-base leading-tight">{name}</h3>
          {description && (
            <p className="text-gray-400 text-sm mt-1">{description}</p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${badgeClass}`}>
            {badgeLabel}
          </span>
          <button
            onClick={() => onDelete(recipe.id)}
            className="text-gray-500 hover:text-red-400 transition-colors p-1 min-h-[36px] min-w-[36px] flex items-center justify-center"
            aria-label="Delete recipe"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Missing ingredients */}
      {missingIngredients.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-700">
          <p className="text-gray-400 text-xs font-medium uppercase tracking-wide mb-2">
            Missing:
          </p>
          <div className="flex flex-col gap-1.5">
            {missingIngredients.map((ing) => (
              <div key={ing.id ?? ing.name} className="flex items-center justify-between gap-2">
                <span className="text-gray-300 text-sm">
                  {ing.name}
                  {ing.quantity ? ` — ${ing.quantity}${ing.unit ? ` ${ing.unit}` : ''}` : ''}
                </span>
                <button
                  onClick={() => onAddToShoppingList(ing.name)}
                  className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 text-xs font-medium transition-colors min-h-[32px] px-2"
                >
                  <Plus size={13} />
                  Shopping list
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions toggle */}
      {instructions && (
        <div className="mt-3 pt-3 border-t border-gray-700">
          <button
            onClick={() => setExpanded((v) => !v)}
            className="flex items-center gap-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors min-h-[36px]"
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            {expanded ? 'Hide instructions' : 'Show instructions'}
          </button>
          {expanded && (
            <p className="mt-3 text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">
              {instructions}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
