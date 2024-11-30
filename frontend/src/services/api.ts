import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json'
  }
});

export interface Student {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  gender?: string;
  created_at?: string;
  updated_at?: string;
}

export interface StudentListResponse {
  students: Student[];
  total: number;
  page: number;
  limit: number;
}

export const studentApi = {
  // Get all students with pagination and search
  getStudents: async (page: number = 1, limit: number = 10, search?: string) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search })
      });
      const response = await api.get<StudentListResponse>(`/students?${params}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching students:', error);
      throw error;
    }
  },

  // Get a single student by ID
  getStudent: async (id: string) => {
    try {
      const response = await api.get<Student>(`/students/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching student:', error);
      throw error;
    }
  },

  // Create a new student
  createStudent: async (student: Omit<Student, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const response = await api.post<Student>('/students', student);
      return response.data;
    } catch (error) {
      console.error('Error creating student:', error);
      throw error;
    }
  },

  // Update a student
  updateStudent: async (id: string, student: Partial<Student>) => {
    try {
      const response = await api.patch<Student>(`/students/${id}`, student);
      return response.data;
    } catch (error) {
      console.error('Error updating student:', error);
      throw error;
    }
  },

  // Delete a student
  deleteStudent: async (id: string) => {
    try {
      await api.delete(`/students/${id}`);
    } catch (error) {
      console.error('Error deleting student:', error);
      throw error;
    }
  }
};
