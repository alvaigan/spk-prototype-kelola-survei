'use client'

import { useSurveyStore } from '@/store/surveyStore';
import { Survey } from '@/types/survey';
import { 
  EllipsisVerticalIcon,
  DocumentTextIcon,
  PencilIcon,
  EyeIcon,
  TrashIcon,
  LinkIcon,
  XMarkIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ShareLinkModal from '@/components/modals/ShareLinkModal';

export default function SurveyTable() {
  const router = useRouter();
  const { 
    getFilteredSurveys, 
    updateSurveyStatus, 
    deleteSurvey,
    setCurrentSurvey 
  } = useSurveyStore();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
  
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

  const handleKelolaClick = (survey: Survey) => {
    setCurrentSurvey(survey);
    setActiveDropdown(null);
    router.push(`/admin/surveys/${survey.id}`);
  };

  const handleEditClick = (survey: Survey) => {
    // TODO: Implement edit functionality
    setActiveDropdown(null);
    console.log('Edit survey:', survey.id);
  };

  const handlePratinjauClick = (survey: Survey) => {
    // Navigate to survey preview page
    setActiveDropdown(null);
    router.push(`/survey/preview/${survey.id}`);
  };

  const handleBagikanClick = (survey: Survey) => {
    setSelectedSurvey(survey);
    setShowShareModal(true);
    setActiveDropdown(null);
  };

  const handleCutoffClick = (survey: Survey) => {
    // TODO: Implement cutoff functionality
    setActiveDropdown(null);
    console.log('Cutoff survey:', survey.id);
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
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                    <div className="py-1">
                      <button
                        onClick={() => handleKelolaClick(survey)}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <DocumentTextIcon className="h-4 w-4 mr-3 text-purple-500" />
                        Kelola Pertanyaan
                      </button>
                      
                      <button
                        onClick={() => handleEditClick(survey)}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <PencilIcon className="h-4 w-4 mr-3 text-blue-500" />
                        Edit
                      </button>
                      
                      <button
                        onClick={() => handlePratinjauClick(survey)}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <EyeIcon className="h-4 w-4 mr-3 text-gray-500" />
                        Pratinjau
                      </button>
                      
                      <button
                        onClick={() => handleDelete(survey.id)}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <TrashIcon className="h-4 w-4 mr-3 text-red-500" />
                        Hapus
                      </button>
                      
                      <button
                        onClick={() => handleBagikanClick(survey)}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <LinkIcon className="h-4 w-4 mr-3 text-blue-500" />
                        Bagikan Link
                      </button>
                      
                      <button
                        onClick={() => handleStatusToggle(survey.id, survey.status)}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <XMarkIcon className="h-4 w-4 mr-3 text-red-500" />
                        {survey.status === 'Aktif' ? 'Non-Aktifkan' : 'Aktifkan'}
                      </button>
                      
                      <button
                        onClick={() => handleCutoffClick(survey)}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        <ClockIcon className="h-4 w-4 mr-3 text-orange-500" />
                        Cutoff
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

      <ShareLinkModal
        isOpen={showShareModal}
        onClose={() => {
          setShowShareModal(false);
          setSelectedSurvey(null);
        }}
        survey={selectedSurvey}
      />
    </div>
  );
} 