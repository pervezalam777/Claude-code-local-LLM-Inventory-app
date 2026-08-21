import { Routes, Route } from 'react-router-dom'
import HealthCheck from './components/HealthCheck'
import StyleGuide from './pages/StyleGuide'
import ItemList from './pages/ItemList'
import ItemCreate from './pages/ItemCreate'
import ItemDetail from './pages/ItemDetail'
import { CommonHeader } from './components/CommonHeader'

export default function App() {
  console.log('App component rendered');
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <CommonHeader />
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={
            <div className="text-center py-12">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Welcome to the Inventory Management System</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                This application helps you manage your inventory with ease.
                Navigate through products and categories to get started.
              </p>
              <HealthCheck />
            </div>
          } />
          <Route path="/items" element={<ItemList />} />
          <Route path="/items/new" element={<ItemCreate />} />
          <Route path="/items/:id" element={<ItemDetail />} />
          <Route path="/style-guide" element={<StyleGuide />} />
        </Routes>
      </main>
    </div>
  )
}
