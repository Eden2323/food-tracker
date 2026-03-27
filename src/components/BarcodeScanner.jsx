import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { Camera, RefreshCw, X } from 'lucide-react'

export default function BarcodeScanner({ onScan, onCancel }) {
  const [error, setError] = useState(null)
  const [starting, setStarting] = useState(true)
  const scannerRef = useRef(null)
  const startedRef = useRef(false)

  useEffect(() => {
    let scanner = null

    async function startScanner() {
      try {
        scanner = new Html5Qrcode('qr-reader')
        scannerRef.current = scanner

        await scanner.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 260, height: 180 },
          },
          (decodedText) => {
            // Success callback
            scanner
              .stop()
              .then(() => {
                onScan(decodedText)
              })
              .catch(() => {
                onScan(decodedText)
              })
          },
          () => {
            // Frame decode error — ignore
          }
        )

        startedRef.current = true
        setStarting(false)
      } catch (err) {
        setStarting(false)
        if (
          err?.message?.toLowerCase().includes('permission') ||
          err?.message?.toLowerCase().includes('denied') ||
          err?.name === 'NotAllowedError'
        ) {
          setError('Camera permission denied. Please allow camera access and try again.')
        } else {
          setError(err?.message || 'Could not start camera. Please try again.')
        }
      }
    }

    startScanner()

    return () => {
      if (scannerRef.current && startedRef.current) {
        scannerRef.current.stop().catch(() => {})
        startedRef.current = false
      }
    }
  }, [])

  async function handleCancel() {
    if (scannerRef.current && startedRef.current) {
      try {
        await scannerRef.current.stop()
        startedRef.current = false
      } catch {
        // ignore
      }
    }
    onCancel()
  }

  async function handleRetry() {
    setError(null)
    setStarting(true)

    // Re-trigger by remounting — easiest approach is to reload
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop()
      } catch {
        // ignore
      }
    }
    startedRef.current = false

    // Small delay then re-start
    setTimeout(async () => {
      try {
        const scanner = new Html5Qrcode('qr-reader')
        scannerRef.current = scanner

        await scanner.start(
          { facingMode: 'environment' },
          { fps: 10, qrbox: { width: 260, height: 180 } },
          (decodedText) => {
            scanner
              .stop()
              .then(() => onScan(decodedText))
              .catch(() => onScan(decodedText))
          },
          () => {}
        )

        startedRef.current = true
        setStarting(false)
      } catch (err) {
        setStarting(false)
        setError(err?.message || 'Could not start camera. Please try again.')
      }
    }, 300)
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 p-8 text-center">
        <div className="bg-red-900/40 border border-red-800 rounded-xl p-6 max-w-sm w-full">
          <Camera size={40} className="text-red-400 mx-auto mb-3" />
          <p className="text-red-300 font-medium mb-1">Camera Error</p>
          <p className="text-gray-400 text-sm">{error}</p>
        </div>
        <div className="flex gap-3 w-full max-w-sm">
          <button
            onClick={handleCancel}
            className="flex-1 min-h-[44px] bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
          >
            <X size={18} />
            Cancel
          </button>
          <button
            onClick={handleRetry}
            className="flex-1 min-h-[44px] bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw size={18} />
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {starting && (
        <div className="flex items-center gap-2 text-gray-400 text-sm py-2">
          <Camera size={18} className="animate-pulse" />
          <span>Starting camera…</span>
        </div>
      )}

      {/* Viewfinder area */}
      <div
        id="qr-reader"
        className="w-full rounded-xl overflow-hidden border-2 border-indigo-600"
        style={{ minHeight: '300px' }}
      />

      <p className="text-gray-400 text-sm text-center">
        Point camera at a barcode to scan
      </p>

      <button
        onClick={handleCancel}
        className="min-h-[44px] w-full max-w-xs bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
      >
        <X size={18} />
        Cancel
      </button>
    </div>
  )
}
