import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema({
  departmentCode: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  departmentName: {
    type: String,
    required: true,
    trim: true
  },
  grossSalary: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  timestamps: true
});

const Department = mongoose.model('Department', departmentSchema);

export default Department; 