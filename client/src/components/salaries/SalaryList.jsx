import React from 'react'
import { useState, useEffect } from 'react'
import { salaryService, employeeService, departmentService } from '../../services/api'

function SalaryList() {
  const [salaries, setSalaries] = useState([])
  const [employees, setEmployees] = useState([])
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingSalary, setEditingSalary] = useState(null)
  const [formData, setFormData] = useState({
    employee: '',
    department: '',
    grossSalary: '',
    totalDeduction: '',
    month: ''
  })

  useEffect(() => {
    fetchSalaries()
    fetchEmployees()
    fetchDepartments()
  }, [])

  const fetchSalaries = async () => {
    try {
      const data = await salaryService.getSalaries()
      setSalaries(data)
      setLoading(false)
    } catch (err) {
      setError('Failed to fetch salaries')
      setLoading(false)
    }
  }

  const fetchEmployees = async () => {
    try {
      const data = await employeeService.getEmployees()
      setEmployees(data)
    } catch (err) {
      setError('Failed to fetch employees')
    }
  }

  const fetchDepartments = async () => {
    try {
      const data = await departmentService.getDepartments()
      setDepartments(data)
    } catch (err) {
      setError('Failed to fetch departments')
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const salaryData = {
        employeeId: formData.employee,
        departmentId: formData.department,
        grossSalary: Number(formData.grossSalary),
        totalDeduction: Number(formData.totalDeduction),
        month: formData.month
      }

      if (editingSalary) {
        await salaryService.updateSalary(editingSalary._id, salaryData)
      } else {
        await salaryService.createSalary(salaryData)
      }
      setShowForm(false)
      setEditingSalary(null)
      setFormData({
        employee: '',
        department: '',
        grossSalary: '',
        totalDeduction: '',
        month: ''
      })
      fetchSalaries()
    } catch (err) {
      setError(editingSalary ? 'Failed to update salary record' : 'Failed to create salary record')
    }
  }

  const handleEdit = (salary) => {
    setEditingSalary(salary)
    setFormData({
      employee: salary.employee._id,
      department: salary.department._id,
      grossSalary: salary.grossSalary.toString(),
      totalDeduction: salary.totalDeduction.toString(),
      month: salary.month.split('T')[0]
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this salary record?')) {
      try {
        await salaryService.deleteSalary(id)
        fetchSalaries()
      } catch (err) {
        setError('Failed to delete salary record')
      }
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingSalary(null)
    setFormData({
      employee: '',
      department: '',
      grossSalary: '',
      totalDeduction: '',
      month: ''
    })
  }

  if (loading) return <div className="text-center">Loading...</div>
  if (error) return <div className="text-red-600">{error}</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Salary Management</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : 'Add Salary Record'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Employee</label>
              <select
                name="employee"
                value={formData.employee}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Select Employee</option>
                {employees.map(emp => (
                  <option key={emp._id} value={emp._id}>
                    {`${emp.firstName} ${emp.lastName}`}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Department</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept._id} value={dept._id}>
                    {dept.departmentName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Gross Salary</label>
              <input
                type="number"
                name="grossSalary"
                value={formData.grossSalary}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Total Deduction</label>
              <input
                type="number"
                name="totalDeduction"
                value={formData.totalDeduction}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Month</label>
              <input
                type="month"
                name="month"
                value={formData.month}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              {editingSalary ? 'Update Salary Record' : 'Save Salary Record'}
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gross Salary</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deductions</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Salary</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {salaries.map((salary) => (
              <tr key={salary._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {`${salary.employee.firstName} ${salary.employee.lastName}`}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {salary.department.departmentName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${salary.grossSalary.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${salary.totalDeduction.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${salary.netSalary.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(salary.month).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button 
                    onClick={() => handleEdit(salary)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(salary._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default SalaryList 