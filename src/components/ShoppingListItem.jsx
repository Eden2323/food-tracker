import { Trash2, Check } from 'lucide-react'

export default function ShoppingListItem({ item, onToggle, onDelete }) {
  const { id, name, quantity, unit, category, checked } = item

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 border-b border-gray-700 last:border-0 transition-opacity ${
        checked ? 'opacity-60' : 'opacity-100'
      }`}
      style={{ minHeight: '52px' }}
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggle(id, checked)}
        className={`shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors min-h-[44px] min-w-[44px] -ml-2 ${
          checked
            ? 'border-indigo-500 bg-indigo-600'
            : 'border-gray-500 bg-transparent hover:border-indigo-400'
        }`}
        aria-label={checked ? 'Uncheck item' : 'Check item'}
      >
        {checked && <Check size={14} className="text-white" strokeWidth={3} />}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <span
          className={`text-sm font-medium block truncate ${
            checked ? 'line-through text-gray-500' : 'text-white'
          }`}
        >
          {name}
        </span>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          {(quantity || unit) && (
            <span className="text-xs text-gray-400">
              {quantity ?? ''}{unit ? ` ${unit}` : ''}
            </span>
          )}
          {category && (
            <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">
              {category}
            </span>
          )}
        </div>
      </div>

      {/* Delete */}
      <button
        onClick={() => onDelete(id)}
        className="shrink-0 text-gray-500 hover:text-red-400 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center -mr-2"
        aria-label="Delete item"
      >
        <Trash2 size={16} />
      </button>
    </div>
  )
}
