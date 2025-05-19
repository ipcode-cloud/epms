import express from 'express';
import {
  createSalary,
  getSalaries,
  getMonthlyPayroll,
  getSalaryById,
  updateSalary,
  deleteSalary
} from '../controllers/salaryController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// All routes are protected
router.use(auth);

router.post('/', createSalary);
router.get('/', getSalaries);
router.get('/monthly', getMonthlyPayroll);
router.get('/:id', getSalaryById);
router.put('/:id', updateSalary);
router.delete('/:id', deleteSalary);

export default router; 