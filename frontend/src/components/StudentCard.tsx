import React from 'react';
import { Student } from '../services/api';
import { PencilIcon, TrashIcon, UserCircleIcon } from '@heroicons/react/24/outline';

interface StudentCardProps {
  student: Student;
  onEdit: (student: Student) => void;
  onDelete: (id: string) => void;
}

export const StudentCard: React.FC<StudentCardProps> = ({ student, onEdit, onDelete }) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="card hover:shadow-lg transition-shadow duration-300 animate-slide-in">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
            <UserCircleIcon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {student.first_name} {student.last_name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{student.email}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(student)}
            className="p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors duration-200"
            title="Edit student"
          >
            <PencilIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => onDelete(student.id!)}
            className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors duration-200"
            title="Delete student"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-gray-500 dark:text-gray-400">Gender</p>
          <p className="font-medium text-gray-900 dark:text-white">{student.gender || 'Not specified'}</p>
        </div>
        <div>
          <p className="text-gray-500 dark:text-gray-400">Joined</p>
          <p className="font-medium text-gray-900 dark:text-white">{formatDate(student.created_at)}</p>
        </div>
      </div>
    </div>
  );
};
