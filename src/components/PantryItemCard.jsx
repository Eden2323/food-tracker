import { Pencil, Trash2, ShoppingBasket } from 'lucide-react'
import ExpiryBadge from './ExpiryBadge'

const locationStyles = {
  fridge: 'bg-blue-900 text-blue-300',
  pantry: 'bg-green-900 text-green-300',
  freezer: 'bg-purple-900 text-purple-300',
}

export default function PantryItemCard({ item, onEdit, onDelete }) {
  const locStyle = locationStyles[item.location] ?? 'bg-gray-700 text-gray-300'
  const locLabel = item.location
    ? item.location.charAt(0).toUpperCase() + item.location.slice(1)
    : 'Unknown'

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 p-3 mb-3 flex items-center gap-3 w-full">
      {/* Image or icon placeholder */}
      <div className="flex-shrink-0">
        {item.image_url ? (
          <img
            src={item.image_url}
            alt={item.name}
            className="w-12 h-12 rounded-lg object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-lg bg-gray-700 flex items-center justify-center">
            <ShoppingBasket size={22} className="text-gray-400" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-white font-semibold text-sm leading-snug truncate">
          {item.name}
        </p>
        {item.brand && (
          <p className="text-gray-400 text-xs truncate">{item.brand}</p>
        )}
        <p className="text-gray-300 text-xs mt-0.5">
          {item.quantity} {item.unit}
        </p>
        <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full ${locStyle}`}
          >
            {locLabel}
          </span>
          <ExpiryBadge date={item.expiry_date} />
        </div>
      </div>

      {/* Actions */}
      <div className="flex-shrink-0 flex flex-col gap-1">
        <button
          onClick={() => onEdit(item)}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center text-gray-400 hover:text-indigo-400 transition-colors rounded-lg"
          aria-label={`Edit ${item.name}`}
        >
          <Pencil size={18} />
        </button>
        <button
          onClick={() => onDelete(item.id)}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center text-gray-400 hover:text-red-400 transition-colors rounded-lg"
          aria-label={`Delete ${item.name}`}
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  )
}
