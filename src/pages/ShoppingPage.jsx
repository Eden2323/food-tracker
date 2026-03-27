import { useEffect, useState } from 'react'
import { ShoppingCart, Plus, Loader2, Trash2 } from 'lucide-react'
import {
  getShoppingList,
  addShoppingItem,
  toggleShoppingItem,
  deleteShoppingItem,
  clearCheckedItems,
} from '../lib/shopping'
import ShoppingListItem from '../components/ShoppingListItem'

export default function ShoppingPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quickAdd, setQuickAdd] = useState('')
  const [adding, setAdding] = useState(false)

  async function fetchList() {
    try {
      setError(null)
      const data = await getShoppingList()
      setItems(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchList()
  }, [])

  async function handleQuickAdd(e) {
    e.preventDefault()
    const trimmed = quickAdd.trim()
    if (!trimmed) return

    setAdding(true)
    try {
      await addShoppingItem({ name: trimmed })
      setQuickAdd('')
      await fetchList()
    } catch (err) {
      setError(err.message)
    } finally {
      setAdding(false)
    }
  }

  async function handleToggle(id, currentChecked) {
    try {
      await toggleShoppingItem(id, !currentChecked)
      await fetchList()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleDelete(id) {
    try {
      await deleteShoppingItem(id)
      await fetchList()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleClearChecked() {
    try {
      await clearCheckedItems()
      await fetchList()
    } catch (err) {
      setError(err.message)
    }
  }

  const hasChecked = items.some((item) => item.checked)

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShoppingCart size={22} className="text-indigo-400" />
          <h1 className="text-xl font-bold">Shopping List</h1>
        </div>
        {hasChecked && (
          <button
            onClick={handleClearChecked}
            className="flex items-center gap-1.5 text-sm text-red-400 hover:text-red-300 transition-colors min-h-[44px] px-2"
          >
            <Trash2 size={15} />
            Clear checked
          </button>
        )}
      </div>

      {/* Quick-add bar */}
      <form onSubmit={handleQuickAdd} className="p-4 flex gap-3 border-b border-gray-700">
        <input
          value={quickAdd}
          onChange={(e) => setQuickAdd(e.target.value)}
          placeholder="Add item…"
          className="flex-1 bg-gray-700 border border-gray-600 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 placeholder-gray-400 min-h-[44px]"
        />
        <button
          type="submit"
          disabled={adding || !quickAdd.trim()}
          className="min-h-[44px] px-5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
        >
          {adding ? <Loader2 size={16} className="animate-spin" /> : <Plus size={18} />}
          Add
        </button>
      </form>

      <div>
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={32} className="text-indigo-400 animate-spin" />
          </div>
        )}

        {error && (
          <div className="mx-4 mt-4 bg-red-900/30 border border-red-800 rounded-xl p-4 text-red-300 text-sm">
            {error}
          </div>
        )}

        {!loading && !error && items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
            <ShoppingCart size={48} className="text-gray-600" />
            <p className="text-gray-400">Your shopping list is empty</p>
          </div>
        )}

        {!loading && items.length > 0 && (
          <div className="bg-gray-800 mx-4 mt-4 rounded-xl border border-gray-700 overflow-hidden">
            {items.map((item) => (
              <ShoppingListItem
                key={item.id}
                item={item}
                onToggle={handleToggle}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
