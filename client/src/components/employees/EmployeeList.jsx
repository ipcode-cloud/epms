import React from 'react'
import { useState, useEffect } from 'react'
import { employeeService, departmentService } from '../../services/api'

function EmployeeList() {
  const [employees, setEmployees] = useState([])
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState(null)
  const [formData, setFormData] = useState({
    employeeNumber: '',
    firstName: '',
    lastName: '',
    position: '',
    address: '',
    telephone: '',
    gender: '',
    hiredDate: '',
    department: ''
  })

  useEffect(() => {
    fetchEmployees()
    fetchDepartments()
  }, [])

  const fetchEmployees = async () => {
    try {
      const data = await employeeService.getEmployees()
      setEmployees(data)
      setLoading(false)
    } catch (err) {
      setError('Failed to fetch employees')
      setLoading(false)
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
      if (editingEmployee) {
        await employeeService.updateEmployee(editingEmployee._id, formData)
      } else {
        await employeeService.createEmployee(formData)
      }
      setShowForm(false)
      setEditingEmployee(null)
      setFormData({
        employeeNumber: '',
        firstName: '',
        lastName: '',
        position: '',
        address: '',
        telephone: '',
        gender: '',
        hiredDate: '',
        department: ''
      })
      fetchEmployees()
    } catch (err) {
      setError(editingEmployee ? 'Failed to update employee' : 'Failed to create employee')
    }
  }

  const handleEdit = (employee) => {
    setEditingEmployee(employee)
    setFormData({
      employeeNumber: employee.employeeNumber,
      firstName: employee.firstName,
      lastName: employee.lastName,
      position: employee.position,
      address: employee.address,
      telephone: employee.telephone,
      gender: employee.gender,
      hiredDate: employee.hiredDate.split('T')[0], // Format date for input
      department: employee.department._id
    })
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await employeeService.deleteEmployee(id)
        fetchEmployees()
      } catch (err) {
        setError('Failed to delete employee')
      }
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingEmployee(null)
    setFormData({
      employeeNumber: '',
      firstName: '',
      lastName: '',
      position: '',
      address: '',
      telephone: '',
      gender: '',
      hiredDate: '',
      department: ''
    })
  }

  if (loading) return <div className="text-center">Loading...</div>
  if (error) return <div className="text-red-600">{error}</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Employee Management</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          {showForm ? 'Cancel' : 'Add Employee'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Employee Number</label>
              <input
                type="text"
                name="employeeNumber"
                value={formData.employeeNumber}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Position</label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Telephone</label>
              <input
                type="tel"
                name="telephone"
                value={formData.telephone}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Hired Date</label>
              <input
                type="date"
                name="hiredDate"
                value={formData.hiredDate}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
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
              {editingEmployee ? 'Update Employee' : 'Save Employee'}
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee Number</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {employees.map((employee) => (
              <tr key={employee._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.employeeNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{`${employee.firstName} ${employee.lastName}`}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.position}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.department?.departmentName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button 
                    onClick={() => handleEdit(employee)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(employee._id)}
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

export default EmployeeList 