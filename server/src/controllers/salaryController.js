import Salary from '../models/Salary.js';
import Employee from '../models/Employee.js';
import Department from '../models/Department.js';

// Create new salary record
const createSalary = async (req, res) => {
  try {
    const { employeeId, departmentId, grossSalary, totalDeduction, month } = req.body;
    
    const salary = new Salary({
      employee: employeeId,
      department: departmentId,
      grossSalary,
      totalDeduction,
      month
    });

    await salary.save();
    res.status(201).json(salary);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all salary records
const getSalaries = async (req, res) => {
  try {
    const salaries = await Salary.find()
      .populate('employee', 'firstName lastName position')
      .populate('department', 'departmentName');
    res.json(salaries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get monthly payroll report
const getMonthlyPayroll = async (req, res) => {
  try {
    const { month, year } = req.query;
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const payroll = await Salary.find({
      month: {
        $gte: startDate,
        $lte: endDate
      }
    })
    .populate('employee', 'firstName lastName position')
    .populate('department', 'departmentName')
    .select('employee department netSalary');

    res.json(payroll);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get salary by ID
const getSalaryById = async (req, res) => {
  try {
    const salary = await Salary.findById(req.params.id)
      .populate('employee', 'firstName lastName position')
      .populate('department', 'departmentName');
    
    if (!salary) {
      return res.status(404).json({ message: 'Salary record not found' });
    }
    res.json(salary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update salary record
const updateSalary = async (req, res) => {
  try {
    const { grossSalary, totalDeduction } = req.body;
    const salary = await Salary.findById(req.params.id);
    
    if (!salary) {
      return res.status(404).json({ message: 'Salary record not found' });
    }

    salary.grossSalary = grossSalary || salary.grossSalary;
    salary.totalDeduction = totalDeduction || salary.totalDeduction;

    await salary.save();
    res.json(salary);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete salary record
const deleteSalary = async (req, res) => {
  try {
    const salary = await Salary.findById(req.params.id);
    if (!salary) {
      return res.status(404).json({ message: 'Salary record not found' });
    }

    await salary.remove();
    res.json({ message: 'Salary record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  createSalary,
  getSalaries,
  getMonthlyPayroll,
  getSalaryById,
  updateSalary,
  deleteSalary
}; 