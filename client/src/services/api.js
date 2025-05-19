import axios from 'axios';

// const API_URL = 'http://localhost:3000/api';
const API_URL = 'https://epms-1.onrender.com/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  login: async (email, password) => {
    const response = await api.post('/users/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  register: async (email, password, role) => {
    const response = await api.post('/users/register', { email, password, role });
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

// Employee services
export const employeeService = {
  getEmployees: async () => {
    const response = await api.get('/employees');
    return response.data;
  },

  getEmployee: async (id) => {
    const response = await api.get(`/employees/${id}`);
    return response.data;
  },

  createEmployee: async (employeeData) => {
    const response = await api.post('/employees', employeeData);
    return response.data;
  },

  updateEmployee: async (id, employeeData) => {
    const response = await api.put(`/employees/${id}`, employeeData);
    return response.data;
  },

  deleteEmployee: async (id) => {
    const response = await api.delete(`/employees/${id}`);
    return response.data;
  },
};

// Department services
export const departmentService = {
  getDepartments: async () => {
    const response = await api.get('/departments');
    return response.data;
  },

  getDepartment: async (id) => {
    const response = await api.get(`/departments/${id}`);
    return response.data;
  },

  createDepartment: async (departmentData) => {
    const response = await api.post('/departments', departmentData);
    return response.data;
  },

  updateDepartment: async (id, departmentData) => {
    const response = await api.put(`/departments/${id}`, departmentData);
    return response.data;
  },

  deleteDepartment: async (id) => {
    const response = await api.delete(`/departments/${id}`);
    return response.data;
  },
};

// Salary services
export const salaryService = {
  getSalaries: async () => {
    const response = await api.get('/salaries');
    return response.data;
  },

  getMonthlyPayroll: async (month, year) => {
    const response = await api.get(`/salaries/monthly?month=${month}&year=${year}`);
    return response.data;
  },

  createSalary: async (salaryData) => {
    const response = await api.post('/salaries', salaryData);
    return response.data;
  },

  updateSalary: async (id, salaryData) => {
    const response = await api.put(`/salaries/${id}`, salaryData);
    return response.data;
  },

  deleteSalary: async (id) => {
    const response = await api.delete(`/salaries/${id}`);
    return response.data;
  },
}; 