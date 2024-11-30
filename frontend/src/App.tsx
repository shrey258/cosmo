import React, { useEffect, useState } from 'react';
import { Student, studentApi } from './services/api';
import { StudentCard } from './components/StudentCard';
import { StudentForm } from './components/StudentForm';
import { Toaster, toast } from 'react-hot-toast';
import { MagnifyingGlassIcon, PlusIcon, MoonIcon, SunIcon } from '@heroicons/react/24/outline';

function App() {
  const [students, setStudents] = useState<Student[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [darkMode, setDarkMode] = useState(() => 
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  const limit = 6;

  useEffect(() => {
    fetchStudents();
  }, [page, search]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      const response = await studentApi.getStudents(page, limit, search);
      setStudents(response.students);
      setTotal(response.total);
    } catch (error) {
      toast.error('Failed to fetch students');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateStudent = async (data: Omit<Student, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setIsLoading(true);
      await studentApi.createStudent(data);
      toast.success('Student created successfully');
      setShowForm(false);
      fetchStudents();
    } catch (error) {
      toast.error('Failed to create student');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStudent = async (data: Omit<Student, 'id' | 'created_at' | 'updated_at'>) => {
    if (!editingStudent?.id) return;
    try {
      setIsLoading(true);
      await studentApi.updateStudent(editingStudent.id, data);
      toast.success('Student updated successfully');
      setEditingStudent(null);
      fetchStudents();
    } catch (error) {
      toast.error('Failed to update student');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteStudent = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    try {
      setIsLoading(true);
      await studentApi.deleteStudent(id);
      toast.success('Student deleted successfully');
      fetchStudents();
    } catch (error) {
      toast.error('Failed to delete student');
    } finally {
      setIsLoading(false);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Toaster position="top-right" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Student Management System
          </h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
          >
            {darkMode ? (
              <SunIcon className="h-6 w-6" />
            ) : (
              <MoonIcon className="h-6 w-6" />
            )}
          </button>
        </div>

        {(showForm || editingStudent) ? (
          <div className="card max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              {editingStudent ? 'Edit Student' : 'Add New Student'}
            </h2>
            <StudentForm
              initialData={editingStudent || {}}
              onSubmit={editingStudent ? handleUpdateStudent : handleCreateStudent}
              onCancel={() => {
                setShowForm(false);
                setEditingStudent(null);
              }}
              isLoading={isLoading}
            />
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Search students..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input-field pl-10"
                />
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              </div>
              <button
                onClick={() => setShowForm(true)}
                className="btn-primary flex items-center space-x-2 w-full sm:w-auto justify-center"
              >
                <PlusIcon className="h-5 w-5" />
                <span>Add Student</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {students.map((student) => (
                <StudentCard
                  key={student.id}
                  student={student}
                  onEdit={setEditingStudent}
                  onDelete={handleDeleteStudent}
                />
              ))}
            </div>

            {!isLoading && students.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">
                  No students found. {search ? 'Try a different search term.' : 'Add your first student!'}
                </p>
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex justify-center space-x-2 mt-8">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="btn-secondary disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-gray-700 dark:text-gray-300">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="btn-secondary disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
