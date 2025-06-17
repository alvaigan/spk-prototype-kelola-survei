'use client'

import { useSurveyStore } from '@/store/surveyStore';
import { EllipsisVerticalIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SurveyTable() {
  const router = useRouter();
  const { 
    getFilteredSurveys, 
    updateSurveyStatus, 
    deleteSurvey,
    setCurrentSurvey 
  } = useSurveyStore();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  const surveys = getFilteredSurveys();

  const handleStatusToggle = (id: string, currentStatus: 'Aktif' | 'Nonaktif') => {
    const newStatus = currentStatus === 'Aktif' ? 'Nonaktif' : 'Aktif';
    updateSurveyStatus(id, newStatus);
    setActiveDropdown(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus survey ini?')) {
      deleteSurvey(id);
      setActiveDropdown(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              KODE
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              JUDUL
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              TOTAL PERTANYAAN
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              DIBUAT PADA
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              STATUS
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              AKSI
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {surveys.map((survey) => (
            <tr key={survey.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {survey.code}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                <div>
                  <div className="font-medium">{survey.title}</div>
                  <div className="text-gray-500 text-xs">{survey.description}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {survey.totalQuestions} Pertanyaan
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {survey.createdAt}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  survey.status === 'Aktif' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {survey.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                <button
                  onClick={() => setActiveDropdown(activeDropdown === survey.id ? null : survey.id)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <EllipsisVerticalIcon className="h-5 w-5" />
                </button>
                
                {activeDropdown === survey.id && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setCurrentSurvey(survey);
                          setActiveDropdown(null);
                          router.push(`/admin/surveys/${survey.id}`);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Lihat Detail
                      </button>
                      <button
                        onClick={() => handleStatusToggle(survey.id, survey.status)}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {survey.status === 'Aktif' ? 'Nonaktifkan' : 'Aktifkan'}
                      </button>
                      <button
                        onClick={() => handleDelete(survey.id)}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {surveys.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Tidak ada survey yang ditemukan.</p>
        </div>
      )}
    </div>
  );
} 