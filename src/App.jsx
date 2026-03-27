import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import DashboardPage from './pages/DashboardPage'
import PantryPage from './pages/PantryPage'
import ScanPage from './pages/ScanPage'
import ShoppingPage from './pages/ShoppingPage'
import MealsPage from './pages/MealsPage'
import NewRecipePage from './pages/NewRecipePage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/pantry" element={<PantryPage />} />
          <Route path="/scan" element={<ScanPage />} />
          <Route path="/shopping" element={<ShoppingPage />} />
          <Route path="/meals" element={<MealsPage />} />
          <Route path="/meals/new" element={<NewRecipePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
