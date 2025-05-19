import React from 'react'
import { useState, useEffect } from 'react'
import { departmentService } from '../../services/api'

function DepartmentList() {
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingDepartment, setEditingDepartment] = useState(null)
  const [formData, setFormData] = useState({
    departmentCode: '',
    departmentName: '',
    grossSalary: ''
  })

  useEffect(() => {
    fetchDepartments()
  }, [])

  const fetchDepartments = async () => {
    try {
      const data = await departmentService.getDepartments()
      setDepartments(data)
      setLoading(false)
    } catch (err) {
      setError('Failed to fetch departments')
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingDepartment) {
        await departmentService.updateDepartment(editingDepartment._id, {
          ...formData,
          grossSalary: Number(formData.grossSalary)
        })
      } else {
        await departmentService.createDepartment({
          ...formData,
          grossSalary: Number(formData.grossSalary)
        })
      }
      setShowForm(false)
      setEditingDepartment(null)
      setFormData({
        departmentCode: '',
        departmentName: '',
        grossSalary: ''
      })
      fetchDepartments()
    } catch (err) {
      setError(editingDepartment ? 'Failed to update department' : 'Failed to create department')
    }
  }

  const handleEdit = (department) => {
    setEditingDepartment(department)
    setFormData({
      departmentCode: department.departmentCode,
      departmentName: department.departmentName,
      grossSalary: department.grossSalary.toString()
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      try {
        await departmentService.deleteDepartment(id)
        fetchDepartments()
      } catch (err) {
        setError('Failed to delete department')
      }
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingDepartment(null)
    setFormData({
      departmentCode: '',
      departmentName: '',
      grossSalary: ''
    })
  }

  if (loading) return <div className="text-center">Loading...</div>
  if (error) return <div className="text-red-600">{error}</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Department Management</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : 'Add Department'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Department Code</label>
              <input
                type="text"
                name="departmentCode"
                value={formData.departmentCode}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Department Name</label>
              <input
                type="text"
                name="departmentName"
                value={formData.departmentName}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
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
              {editingDepartment ? 'Update Department' : 'Save Department'}
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gross Salary</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {departments.map((department) => (
              <tr key={department._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{department.departmentCode}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{department.departmentName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${department.grossSalary.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button 
                    onClick={() => handleEdit(department)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(department._id)}
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

export default DepartmentList 