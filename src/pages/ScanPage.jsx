import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ScanLine, AlertCircle } from 'lucide-react'
import BarcodeScanner from '../components/BarcodeScanner'
import AddItemModal from '../components/AddItemModal'

export default function ScanPage() {
  const navigate = useNavigate()
  const [scanning, setScanning] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [notFoundMsg, setNotFoundMsg] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [prefill, setPrefill] = useState(null)

  async function handleScan(barcode) {
    setScanning(false)
    setLoading(true)
    setError(null)
    setNotFoundMsg(null)

    try {
      const res = await fetch(
        `https://world.openfoodfacts.org/api/v2/product/${barcode}.json`
      )
      const json = await res.json()

      if (json.status === 1 && json.product) {
        const product = json.product
        setPrefill({
          name: product.product_name || '',
          brand: product.brands || '',
          category: product.categories_tags?.[0]?.replace('en:', '') || '',
          image_url: product.image_front_url || '',
          barcode,
        })
      } else {
        setPrefill({ barcode })
        setNotFoundMsg('Product not found — fill in details manually')
      }
    } catch {
      setError('Network error — check your connection and try again.')
      setPrefill({ barcode })
    } finally {
      setLoading(false)
      setModalOpen(true)
    }
  }

  function handleCancel() {
    navigate('/pantry')
  }

  function handleModalClose() {
    setModalOpen(false)
    setScanning(true)
    setPrefill(null)
    setNotFoundMsg(null)
    setError(null)
  }

  function handleSaved() {
    navigate('/pantry')
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex items-center gap-3">
        <ScanLine size={22} className="text-indigo-400" />
        <h1 className="text-xl font-bold">Scan Barcode</h1>
      </div>

      <div className="p-4">
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-400">Looking up product…</p>
          </div>
        )}

        {!loading && scanning && (
          <BarcodeScanner onScan={handleScan} onCancel={handleCancel} />
        )}

        {!loading && !scanning && !modalOpen && (
          <div className="flex flex-col items-center gap-4 py-12 text-center">
            {error && (
              <div className="flex items-start gap-2 bg-red-900/30 border border-red-800 rounded-xl p-4 max-w-sm w-full text-left">
                <AlertCircle size={18} className="text-red-400 mt-0.5 shrink-0" />
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}
            {notFoundMsg && (
              <div className="bg-amber-900/30 border border-amber-700 rounded-xl p-4 max-w-sm w-full text-left">
                <p className="text-amber-300 text-sm">{notFoundMsg}</p>
              </div>
            )}
            <button
              onClick={() => {
                setScanning(true)
                setError(null)
                setNotFoundMsg(null)
              }}
              className="min-h-[44px] px-6 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-colors"
            >
              Scan Again
            </button>
          </div>
        )}
      </div>

      <AddItemModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        onSaved={handleSaved}
        prefill={prefill}
      />
    </div>
  )
}
