import React from 'react'
import { useState, useEffect } from 'react'
import { salaryService } from '../../services/api'

function PayrollReport() {
  const [report, setReport] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  useEffect(() => {
    fetchPayrollReport()
  }, [selectedMonth, selectedYear])

  const fetchPayrollReport = async () => {
    try {
      const data = await salaryService.getMonthlyPayroll(selectedMonth, selectedYear)
      setReport(data)
      setLoading(false)
    } catch (err) {
      setError('Failed to fetch payroll report')
      setLoading(false)
    }
  }

  const handleMonthChange = (e) => {
    setSelectedMonth(Number(e.target.value))
  }

  const handleYearChange = (e) => {
    setSelectedYear(Number(e.target.value))
  }

  const calculateTotals = () => {
    return report.reduce((acc, curr) => ({
      grossSalary: acc.grossSalary + curr.grossSalary,
      totalDeduction: acc.totalDeduction + curr.totalDeduction,
      netSalary: acc.netSalary + curr.netSalary
    }), { grossSalary: 0, totalDeduction: 0, netSalary: 0 })
  }

  const handlePrint = () => {
    const printContent = document.getElementById('print-content')
    const printStyles = `
      <style>
        @media print {
          body { 
            margin: 0; 
            padding: 20px;
            font-family: Arial, sans-serif;
          }
          .print-header { 
            text-align: center; 
            margin-bottom: 20px;
            padding: 20px;
            border-bottom: 2px solid #000;
          }
          .print-header h1 { 
            font-size: 24px; 
            margin: 0;
            color: #000;
          }
          .print-header p { 
            font-size: 16px; 
            margin: 5px 0;
            color: #000;
          }
          table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-top: 20px;
            font-size: 14px;
          }
          th, td { 
            border: 1px solid #000; 
            padding: 8px; 
            text-align: left;
            color: #000;
          }
          th { 
            background-color: #f0f0f0 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .totals-row { 
            font-weight: bold; 
            background-color: #f0f0f0 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .no-print { 
            display: none !important;
          }
          @page {
            size: A4;
            margin: 1cm;
          }
        }
      </style>
    `
    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      alert('Please allow popups for this website to print the report.')
      return
    }

    const monthYear = new Date(selectedYear, selectedMonth - 1).toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    })

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Payroll Report - ${monthYear}</title>
          <meta charset="utf-8">
          ${printStyles}
        </head>
        <body>
          <div class="print-header">
            <h1>SmartPark EPMS</h1>
            <p>Monthly Payroll Report</p>
            <p>${monthYear}</p>
          </div>
          ${printContent.innerHTML}
        </body>
      </html>
    `)

    printWindow.document.close()

    // Wait for images and styles to load
    printWindow.onload = function() {
      printWindow.focus()
      setTimeout(() => {
        printWindow.print()
        printWindow.close()
      }, 250)
    }
  }

  if (loading) return <div className="text-center">Loading...</div>
  if (error) return <div className="text-red-600">{error}</div>

  const totals = calculateTotals()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Monthly Payroll Report</h2>
        <div className="flex space-x-4">
          <div className="no-print">
            <label className="block text-sm font-medium text-gray-700">Month</label>
            <select
              value={selectedMonth}
              onChange={handleMonthChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="1">January</option>
              <option value="2">February</option>
              <option value="3">March</option>
              <option value="4">April</option>
              <option value="5">May</option>
              <option value="6">June</option>
              <option value="7">July</option>
              <option value="8">August</option>
              <option value="9">September</option>
              <option value="10">October</option>
              <option value="11">November</option>
              <option value="12">December</option>
            </select>
          </div>
          <div className="no-print">
            <label className="block text-sm font-medium text-gray-700">Year</label>
            <select
              value={selectedYear}
              onChange={handleYearChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {[...Array(5)].map((_, i) => {
                const year = new Date().getFullYear() - 2 + i
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                )
              })}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={handlePrint}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 no-print"
            >
              Print Report
            </button>
          </div>
        </div>
      </div>

      <div id="print-content" className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gross Salary</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deductions</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net Salary</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {report.map((record) => (
              <tr key={record._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {`${record.employee.firstName} ${record.employee.lastName}`}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {record.department.departmentName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${record.grossSalary.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${record.totalDeduction.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${record.netSalary.toFixed(2)}
                </td>
              </tr>
            ))}
            <tr className="bg-gray-50">
              <td colSpan="2" className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                Totals
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                ${totals.grossSalary.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                ${totals.totalDeduction.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                ${totals.netSalary.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default PayrollReport 