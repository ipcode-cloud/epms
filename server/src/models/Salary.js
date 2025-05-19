import mongoose from 'mongoose';

const salarySchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: true
  },
  grossSalary: {
    type: Number,
    required: true,
    min: 0
  },
  totalDeduction: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  netSalary: {
    type: Number,
    required: true,
    min: 0
  },
  month: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

// Calculate net salary before validation
salarySchema.pre('validate', function(next) {
  this.netSalary = this.grossSalary - this.totalDeduction;
  next();
});

const Salary = mongoose.model('Salary', salarySchema);

export default Salary; 