import React, { useState, useEffect } from 'react'
import { authService, employeeService, departmentService, salaryService } from './services/api'
import EmployeeList from './components/employees/EmployeeList'
import DepartmentList from './components/departments/DepartmentList'
import SalaryList from './components/salaries/SalaryList'
import PayrollReport from './components/reports/PayrollReport'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [showRegister, setShowRegister] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'hr'
  })
  const [error, setError] = useState('')
  const [activePage, setActivePage] = useState('dashboard')
  const [dashboardStats, setDashboardStats] = useState({
    totalEmployees: 0,
    totalDepartments: 0,
    totalSalary: 0,
    recentSalaries: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const currentUser = authService.getCurrentUser()
    if (currentUser) {
      setUser(currentUser)
      setIsAuthenticated(true)
    }
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardStats()
    }
  }, [isAuthenticated])

  const fetchDashboardStats = async () => {
    try {
      setLoading(true)
      setError('')
      
      const [employees, departments, salaries] = await Promise.all([
        employeeService.getEmployees(),
        departmentService.getDepartments(),
        salaryService.getSalaries()
      ])

      const currentMonth = new Date().getMonth() + 1
      const currentYear = new Date().getFullYear()
      const monthlySalaries = salaries.filter(salary => {
        const salaryDate = new Date(salary.month)
        return salaryDate.getMonth() + 1 === currentMonth && 
               salaryDate.getFullYear() === currentYear
      })

      const totalSalary = monthlySalaries.reduce((sum, salary) => sum + (salary.netSalary || 0), 0)

      setDashboardStats({
        totalEmployees: employees.length || 0,
        totalDepartments: departments.length || 0,
        totalSalary: totalSalary || 0,
        recentSalaries: monthlySalaries.slice(0, 5) // Get last 5 salary records
      })
    } catch (err) {
      console.error('Failed to fetch dashboard stats:', err)
      setError(err.response?.data?.message || 'Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const data = await authService.login(formData.email, formData.password)
      setUser(data.user)
      setIsAuthenticated(true)
      setError('')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    try {
      await authService.register(formData.email, formData.password, formData.role)
      setShowRegister(false)
      setFormData({
        email: '',
        password: '',
        role: 'hr'
      })
      setError('')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    }
  }

  const handleLogout = () => {
    authService.logout()
    setIsAuthenticated(false)
    setUser(null)
  }

  const renderContent = () => {
    switch (activePage) {
      case 'dashboard':
        if (loading) {
          return (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading dashboard data...</p>
              </div>
            </div>
          )
        }

        if (error) {
          return (
            <div className="bg-red-50 p-4 rounded-md">
              <p className="text-red-600">{error}</p>
            </div>
          )
        }

        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Total Employees Card */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Employees</p>
                    <p className="text-2xl font-semibold text-gray-900">{dashboardStats.totalEmployees}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Total Departments Card */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Departments</p>
                    <p className="text-2xl font-semibold text-gray-900">{dashboardStats.totalDepartments}</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Total Salary Card */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Monthly Salary</p>
                    <p className="text-2xl font-semibold text-gray-900">${dashboardStats.totalSalary.toFixed(2)}</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Salary Records */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Recent Salary Records</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Salary</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {dashboardStats.recentSalaries.map((salary) => (
                      <tr key={salary._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {`${salary.employee.firstName} ${salary.employee.lastName}`}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {salary.department.departmentName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${salary.netSalary.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(salary.month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )
      case 'employees':
        return <EmployeeList />
      case 'departments':
        return <DepartmentList />
      case 'salaries':
        return <SalaryList />
      case 'reports':
        return <PayrollReport />
      default:
        return null
    }
  }

  const renderAuthForm = () => {
    if (showRegister) {
      return (
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Register HR Account</h2>
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Register
            </button>
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => setShowRegister(false)}
                className="text-blue-600 hover:text-blue-800"
              >
                Already have an account? Login
              </button>
            </div>
          </form>
        </div>
      )
    }

  return (
      <div>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Login</h2>
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
      </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Login
          </button>
          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => setShowRegister(true)}
              className="text-blue-600 hover:text-blue-800"
            >
              Need an account? Register
        </button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {!isAuthenticated ? (
        <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
            SmartPark EPMS
          </h1>
          <div className="space-y-6">
            {renderAuthForm()}
          </div>
        </div>
      ) : (
        <div className="flex h-screen">
          <nav className="w-64 bg-gray-800 text-white p-4">
            <h2 className="text-xl font-bold mb-6 pb-2 border-b border-gray-700">SmartPark EPMS</h2>
            <ul className="space-y-2">
              <li 
                className={`px-3 py-2 rounded-md cursor-pointer ${activePage === 'dashboard' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
                onClick={() => setActivePage('dashboard')}
              >
                Dashboard
              </li>
              <li 
                className={`px-3 py-2 rounded-md cursor-pointer ${activePage === 'employees' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
                onClick={() => setActivePage('employees')}
              >
                Employees
              </li>
              <li 
                className={`px-3 py-2 rounded-md cursor-pointer ${activePage === 'departments' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
                onClick={() => setActivePage('departments')}
              >
                Departments
              </li>
              <li 
                className={`px-3 py-2 rounded-md cursor-pointer ${activePage === 'salaries' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
                onClick={() => setActivePage('salaries')}
              >
                Salaries
              </li>
              <li 
                className={`px-3 py-2 rounded-md cursor-pointer ${activePage === 'reports' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
                onClick={() => setActivePage('reports')}
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
            {renderContent()}
          </main>
        </div>
      )}
    </div>
  )
}

export default App
