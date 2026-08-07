import { Routes, Route, Link } from 'react-router-dom'
import HealthCheck from './components/HealthCheck'
import StyleGuide from './pages/StyleGuide'
import ItemList from './pages/ItemList'
import ItemCreate from './pages/ItemCreate'
import ItemDetail from './pages/ItemDetail'

export default function App() {
  console.log('App component rendered');
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Inventory App</h1>
            </div>
            <div className="flex space-x-4">
              <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors">
                Home
              </Link>
              <Link to="/items" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors">
                Items
              </Link>
              <Link to="/style-guide" className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors">
                Style Guide
              </Link>
            </div>
          </div>
        </nav>
      </header>
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={
            <div className="text-center py-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to the Inventory Management System</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
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
