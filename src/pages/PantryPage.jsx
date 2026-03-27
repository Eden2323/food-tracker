import { useEffect, useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { getPantryItems, deletePantryItem } from '../lib/pantry'
import PantryItemCard from '../components/PantryItemCard'
import AddItemModal from '../components/AddItemModal'

const TABS = ['All', 'Fridge', 'Pantry', 'Freezer']

export default function PantryPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('All')
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editItem, setEditItem] = useState(null)

  async function fetchItems() {
    setLoading(true)
    try {
      const data = await getPantryItems()
      setItems(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [])

  async function handleDelete(id) {
    try {
      await deletePantryItem(id)
      await fetchItems()
    } catch (err) {
      console.error(err)
    }
  }

  function handleEdit(item) {
    setEditItem(item)
    setModalOpen(true)
  }

  function handleAdd() {
    setEditItem(null)
    setModalOpen(true)
  }

  function handleModalClose() {
    setModalOpen(false)
    setEditItem(null)
  }

  // Client-side filtering
  const filtered = items.filter((item) => {
    const matchesTab =
      activeTab === 'All' || item.location === activeTab.toLowerCase()
    const matchesSearch = item.name
      .toLowerCase()
      .includes(search.toLowerCase())
    return matchesTab && matchesSearch
  })

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Page header */}
      <div className="px-4 pt-6 pb-2">
        <h1 className="text-2xl font-bold text-white">Pantry</h1>
        <p className="text-gray-400 text-sm mt-0.5">Manage your food inventory</p>
      </div>

      {/* Location tabs */}
      <div className="px-4 mt-3 flex gap-2 overflow-x-auto scrollbar-hide">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`min-h-[44px] flex-shrink-0 px-4 rounded-full text-sm font-medium transition-colors ${
              activeTab === tab
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white border border-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search bar */}
      <div className="px-4 mt-3">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
          <input
            type="text"
            placeholder="Search items…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full min-h-[44px] bg-gray-800 border border-gray-700 rounded-xl pl-9 pr-4 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Item list */}
      <div className="px-4 mt-4">
        {loading ? (
          <div className="flex flex-col gap-3">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-800 rounded-xl border border-gray-700 h-20 animate-pulse"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-gray-400 text-base font-medium">No items found</p>
            <p className="text-gray-600 text-sm mt-1">
              {search
                ? 'Try a different search term'
                : 'Tap + to add your first item'}
            </p>
          </div>
        ) : (
          filtered.map((item) => (
            <PantryItemCard
              key={item.id}
              item={item}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      {/* FAB — above bottom navbar */}
      <button
        onClick={handleAdd}
        className="fixed bottom-20 right-4 w-14 h-14 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full shadow-lg flex items-center justify-center transition-colors z-40"
        aria-label="Add item"
      >
        <Plus size={26} />
      </button>

      {/* Add / Edit modal */}
      <AddItemModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        onSaved={fetchItems}
        item={editItem}
        prefill={null}
      />
    </div>
  )
}
