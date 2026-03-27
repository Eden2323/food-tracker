export default function ExpiryBadge({ date }) {
  if (!date) return null

  const now = new Date()
  // Normalise both to midnight local time for day-level comparison
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const expiry = new Date(date + 'T00:00:00') // treat ISO date as local midnight

  const pillBase = 'text-xs font-medium px-2 py-0.5 rounded-full'

  if (expiry < today) {
    return (
      <span className={`${pillBase} bg-red-900 text-red-300`}>Expired</span>
    )
  }

  const msPerDay = 1000 * 60 * 60 * 24
  const daysUntil = Math.floor((expiry - today) / msPerDay)

  if (daysUntil <= 7) {
    return (
      <span className={`${pillBase} bg-amber-900 text-amber-300`}>
        Expires soon
      </span>
    )
  }

  // Format: "12 Apr"
  const formatted = expiry.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
  })

  return (
    <span className={`${pillBase} bg-gray-700 text-gray-300`}>
      Expires {formatted}
    </span>
  )
}
