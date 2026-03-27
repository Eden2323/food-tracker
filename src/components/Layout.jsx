import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <main className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </main>
      <Navbar />
    </div>
  )
}
