import Employee from '../models/Employee.js';

// Create new employee
const createEmployee = async (req, res) => {
  try {
    const {
      employeeNumber,
      firstName,
      lastName,
      position,
      address,
      telephone,
      gender,
      hiredDate,
      department
    } = req.body;
    
    const employee = new Employee({
      employeeNumber,
      firstName,
      lastName,
      position,
      address,
      telephone,
      gender,
      hiredDate,
      department
    });

    await employee.save();
    res.status(201).json(employee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all employees
const getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find()
      .populate('department', 'departmentName');
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get employee by ID
const getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id)
      .populate('department', 'departmentName');
    
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update employee
const updateEmployee = async (req, res) => {
  try {
    const {
      employeeNumber,
      firstName,
      lastName,
      position,
      address,
      telephone,
      gender,
      hiredDate,
      department
    } = req.body;

    const employee = await Employee.findById(req.params.id);
    
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    employee.employeeNumber = employeeNumber || employee.employeeNumber;
    employee.firstName = firstName || employee.firstName;
    employee.lastName = lastName || employee.lastName;
    employee.position = position || employee.position;
    employee.address = address || employee.address;
    employee.telephone = telephone || employee.telephone;
    employee.gender = gender || employee.gender;
    employee.hiredDate = hiredDate || employee.hiredDate;
    employee.department = department || employee.department;

    await employee.save();
    res.json(employee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete employee
const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    await Employee.deleteOne({ _id: req.params.id });
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee
}; 