import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ScanLine,
  ShoppingBasket,
  ShoppingCart,
  Loader2,
  LayoutDashboard,
} from 'lucide-react'
import { getPantryItems } from '../lib/pantry'
import { getMatchingRecipes } from '../lib/recipes'
import { getShoppingList } from '../lib/shopping'

function daysUntil(dateStr) {
  if (!dateStr) return null
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(dateStr)
  target.setHours(0, 0, 0, 0)
  return Math.round((target - today) / (1000 * 60 * 60 * 24))
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pantryItems, setPantryItems] = useState([])
  const [recipes, setRecipes] = useState([])
  const [shoppingList, setShoppingList] = useState([])

  useEffect(() => {
    async function fetchAll() {
      try {
        const items = await getPantryItems()
        const [matched, shopping] = await Promise.all([
          getMatchingRecipes(items),
          getShoppingList(),
        ])
        setPantryItems(items)
        setRecipes(matched)
        setShoppingList(shopping)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  // Computed stats
  const totalItems = pantryItems.length
  const expiringItems = pantryItems
    .filter((item) => {
      const days = daysUntil(item.expiry_date)
      return days !== null && days >= 0 && days <= 7
    })
    .sort((a, b) => daysUntil(a.expiry_date) - daysUntil(b.expiry_date))

  const canCookCount = recipes.filter((r) => r.matchPercent >= 100).length

  const lowStockItems = pantryItems
    .filter((item) => item.quantity <= 1)
    .sort((a, b) => a.name.localeCompare(b.name))

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <Loader2 size={36} className="text-indigo-400 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex items-center gap-3">
        <LayoutDashboard size={22} className="text-indigo-400" />
        <h1 className="text-xl font-bold">Dashboard</h1>
      </div>

      <div className="p-4 space-y-6">
        {error && (
          <div className="bg-red-900/30 border border-red-800 rounded-xl p-4 text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* Stat row */}
        <div className="flex gap-3">
          {/* Items */}
          <div className="bg-gray-800 rounded-xl p-3 flex-1 text-center border border-gray-700">
            <p className="text-2xl font-bold text-indigo-400">{totalItems}</p>
            <p className="text-xs text-gray-400 mt-1">Items</p>
          </div>

          {/* Expiring */}
          <div className="bg-gray-800 rounded-xl p-3 flex-1 text-center border border-gray-700">
            <p className={`text-2xl font-bold ${expiringItems.length > 0 ? 'text-amber-400' : 'text-gray-500'}`}>
              {expiringItems.length}
            </p>
            <p className="text-xs text-gray-400 mt-1">Expiring</p>
          </div>

          {/* Can Cook */}
          <div className="bg-gray-800 rounded-xl p-3 flex-1 text-center border border-gray-700">
            <p className={`text-2xl font-bold ${canCookCount > 0 ? 'text-green-400' : 'text-gray-500'}`}>
              {canCookCount}
            </p>
            <p className="text-xs text-gray-400 mt-1">Can Cook</p>
          </div>
        </div>

        {/* Expiring Soon */}
        <section>
          <h2 className="text-white font-semibold mb-3">Expiring Soon</h2>
          <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            {expiringItems.length === 0 ? (
              <p className="text-gray-500 text-sm p-4">No items expiring soon</p>
            ) : (
              expiringItems.slice(0, 5).map((item) => {
                const days = daysUntil(item.expiry_date)
                const daysColor =
                  days <= 2 ? 'text-red-400' : 'text-amber-400'
                const daysLabel =
                  days === 0
                    ? 'Today'
                    : days === 1
                    ? '1 day'
                    : `${days} days`

                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-3 px-4 py-3 border-b border-gray-700 last:border-0"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-white text-sm font-medium truncate">{item.name}</span>
                      {item.location && (
                        <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full shrink-0">
                          {item.location}
                        </span>
                      )}
                    </div>
                    <span className={`text-xs font-semibold shrink-0 ${daysColor}`}>
                      {daysLabel}
                    </span>
                  </div>
                )
              })
            )}
          </div>
        </section>

        {/* Low Stock */}
        <section>
          <h2 className="text-white font-semibold mb-3">Low Stock</h2>
          <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
            {lowStockItems.length === 0 ? (
              <p className="text-gray-500 text-sm p-4">Nothing running low</p>
            ) : (
              lowStockItems.slice(0, 5).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 px-4 py-3 border-b border-gray-700 last:border-0"
                >
                  <span className="text-white text-sm font-medium truncate">{item.name}</span>
                  <span className="text-gray-400 text-sm shrink-0">
                    {item.quantity} {item.unit ?? ''}
                  </span>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <h2 className="text-white font-semibold mb-3">Quick Actions</h2>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate('/scan')}
              className="bg-gray-800 border border-gray-700 rounded-xl p-4 flex items-center gap-3 w-full text-left hover:bg-gray-700 transition-colors min-h-[56px]"
            >
              <ScanLine size={22} className="text-indigo-400 shrink-0" />
              <div>
                <p className="text-white font-medium text-sm">Scan Item</p>
                <p className="text-gray-400 text-xs">Add items via barcode</p>
              </div>
            </button>

            <button
              onClick={() => navigate('/pantry')}
              className="bg-gray-800 border border-gray-700 rounded-xl p-4 flex items-center gap-3 w-full text-left hover:bg-gray-700 transition-colors min-h-[56px]"
            >
              <ShoppingBasket size={22} className="text-indigo-400 shrink-0" />
              <div>
                <p className="text-white font-medium text-sm">View Pantry</p>
                <p className="text-gray-400 text-xs">{totalItems} items stored</p>
              </div>
            </button>

            <button
              onClick={() => navigate('/shopping')}
              className="bg-gray-800 border border-gray-700 rounded-xl p-4 flex items-center gap-3 w-full text-left hover:bg-gray-700 transition-colors min-h-[56px]"
            >
              <ShoppingCart size={22} className="text-indigo-400 shrink-0" />
              <div>
                <p className="text-white font-medium text-sm">Shopping List</p>
                <p className="text-gray-400 text-xs">
                  {shoppingList.filter((i) => !i.checked).length} items remaining
                </p>
              </div>
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}
