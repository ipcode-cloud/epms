import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { authService } from '../services/api'

function Layout({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const user = authService.getCurrentUser()

  const handleLogout = () => {
    authService.logout()
    navigate('/login')
  }

  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <div className="flex h-screen">
      <nav className="w-64 bg-gray-800 text-white p-4">
        <h2 className="text-xl font-bold mb-6 pb-2 border-b border-gray-700">SmartPark EPMS</h2>
        <ul className="space-y-2">
          <li 
            className={`px-3 py-2 rounded-md cursor-pointer ${isActive('/dashboard') ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
            onClick={() => navigate('/dashboard')}
          >
            Dashboard
          </li>
          <li 
            className={`px-3 py-2 rounded-md cursor-pointer ${isActive('/employees') ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
            onClick={() => navigate('/employees')}
          >
            Employees
          </li>
          <li 
            className={`px-3 py-2 rounded-md cursor-pointer ${isActive('/departments') ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
            onClick={() => navigate('/departments')}
          >
            Departments
          </li>
          <li 
            className={`px-3 py-2 rounded-md cursor-pointer ${isActive('/salaries') ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
            onClick={() => navigate('/salaries')}
          >
            Salaries
          </li>
          <li 
            className={`px-3 py-2 rounded-md cursor-pointer ${isActive('/reports') ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
            onClick={() => navigate('/reports')}
          >
            Reports
          </li>
        </ul>
      </nav>
      <main className="flex-1 p-6 bg-gray-50 overflow-auto">
        <header className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800">SmartPark EPMS</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Welcome, {user?.email}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Logout
            </button>
          </div>
        </header>
        {children}
      </main>
    </div>
  )
}

export default Layout 