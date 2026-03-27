import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { addPantryItem, updatePantryItem } from '../lib/pantry'

const UNITS = ['count', 'g', 'kg', 'ml', 'L', 'oz', 'lb']
const LOCATIONS = ['pantry', 'fridge', 'freezer']

const emptyForm = {
  name: '',
  brand: '',
  quantity: 1,
  unit: 'count',
  location: 'pantry',
  category: '',
  expiry_date: '',
  barcode: '',
}

function formFromItem(item) {
  return {
    name: item.name ?? '',
    brand: item.brand ?? '',
    quantity: item.quantity ?? 1,
    unit: item.unit ?? 'count',
    location: item.location ?? 'pantry',
    category: item.category ?? '',
    expiry_date: item.expiry_date ?? '',
    barcode: item.barcode ?? '',
  }
}

export default function AddItemModal({ isOpen, onClose, onSaved, item, prefill }) {
  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const isEditing = Boolean(item)
  // Track whether barcode came from a scan (prefill) so it stays read-only
  const barcodeLocked = Boolean(prefill?.barcode && !item)

  // Populate form whenever the modal opens or its driving data changes
  useEffect(() => {
    if (!isOpen) return
    setError(null)
    if (item) {
      setForm(formFromItem(item))
    } else if (prefill) {
      setForm({
        ...emptyForm,
        name: prefill.name ?? '',
        brand: prefill.brand ?? '',
        barcode: prefill.barcode ?? '',
        image_url: prefill.image_url ?? '',
      })
    } else {
      setForm(emptyForm)
    }
  }, [isOpen, item, prefill])

  if (!isOpen) return null

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    if (!form.name.trim()) {
      setError('Item name is required.')
      return
    }

    const payload = {
      name: form.name.trim(),
      brand: form.brand.trim() || null,
      quantity: Number(form.quantity) || 1,
      unit: form.unit,
      location: form.location,
      category: form.category.trim() || null,
      expiry_date: form.expiry_date || null,
      barcode: form.barcode.trim() || null,
    }

    // Carry over image_url from prefill when adding
    if (!isEditing && prefill?.image_url) {
      payload.image_url = prefill.image_url
    }

    setLoading(true)
    try {
      if (isEditing) {
        await updatePantryItem(item.id, payload)
      } else {
        await addPantryItem(payload)
      }
      onSaved()
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) onClose()
  }

  const inputClass =
    'w-full bg-gray-700 border border-gray-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 placeholder-gray-400'
  const labelClass = 'block text-sm text-gray-400 mb-1'

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 pb-16 sm:pb-0"
      onClick={handleBackdropClick}
    >
      <div className="w-full sm:max-w-lg bg-gray-800 rounded-t-2xl sm:rounded-2xl border border-gray-700 max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-white font-semibold text-lg">
            {isEditing ? 'Edit Item' : 'Add Item'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-lg"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Name */}
          <div>
            <label className={labelClass}>Name *</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Oat Milk"
              className={inputClass}
              required
            />
          </div>

          {/* Brand */}
          <div>
            <label className={labelClass}>Brand</label>
            <input
              name="brand"
              value={form.brand}
              onChange={handleChange}
              placeholder="e.g. Oatly"
              className={inputClass}
            />
          </div>

          {/* Quantity + Unit */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className={labelClass}>Quantity</label>
              <input
                name="quantity"
                type="number"
                min="0"
                step="any"
                value={form.quantity}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div className="flex-1">
              <label className={labelClass}>Unit</label>
              <select
                name="unit"
                value={form.unit}
                onChange={handleChange}
                className={inputClass}
              >
                {UNITS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className={labelClass}>Location</label>
            <select
              name="location"
              value={form.location}
              onChange={handleChange}
              className={inputClass}
            >
              {LOCATIONS.map((l) => (
                <option key={l} value={l}>
                  {l.charAt(0).toUpperCase() + l.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div>
            <label className={labelClass}>Category</label>
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="e.g. Dairy, Snacks"
              className={inputClass}
            />
          </div>

          {/* Expiry Date */}
          <div>
            <label className={labelClass}>Expiry Date</label>
            <input
              name="expiry_date"
              type="date"
              value={form.expiry_date}
              onChange={handleChange}
              className={inputClass}
            />
          </div>

          {/* Barcode */}
          <div>
            <label className={labelClass}>Barcode</label>
            <input
              name="barcode"
              value={form.barcode}
              onChange={handleChange}
              placeholder="e.g. 1234567890"
              className={inputClass}
              readOnly={barcodeLocked}
              style={barcodeLocked ? { opacity: 0.6, cursor: 'not-allowed' } : undefined}
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-400 text-sm bg-red-900/30 border border-red-800 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 min-h-[44px] bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 min-h-[44px] bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-sm font-semibold transition-colors"
            >
              {loading ? 'Saving…' : isEditing ? 'Save Changes' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
