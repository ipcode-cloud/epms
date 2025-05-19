import Department from '../models/Department.js';

// Create new department
const createDepartment = async (req, res) => {
  try {
    const { departmentCode, departmentName, grossSalary } = req.body;
    
    const department = new Department({
      departmentCode,
      departmentName,
      grossSalary
    });

    await department.save();
    res.status(201).json(department);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all departments
const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find();
    res.json(departments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get department by ID
const getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }
    res.json(department);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update department
const updateDepartment = async (req, res) => {
  try {
    const { departmentCode, departmentName, grossSalary } = req.body;
    const department = await Department.findById(req.params.id);
    
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    department.departmentCode = departmentCode || department.departmentCode;
    department.departmentName = departmentName || department.departmentName;
    department.grossSalary = grossSalary || department.grossSalary;

    await department.save();
    res.json(department);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete department
const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return res.status(404).json({ message: 'Department not found' });
    }

    await department.remove();
    res.json({ message: 'Department deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {
  createDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment
}; 