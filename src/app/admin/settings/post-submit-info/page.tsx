'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { useSurveyStore } from '@/store/surveyStore';
import { usePostSubmitStore } from '@/store/postSubmitStore';
import { Survey } from '@/types/survey';

export default function PostSubmitInfoPage() {
  const { surveys, setSurveys } = useSurveyStore();
  const { postSubmitInfo, isLoading, savePostSubmitInfo, loadPostSubmitInfo } = usePostSubmitStore();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    selectedSurveyIds: [] as string[]
  });

  // Mock data for demonstration
  const mockSurveys: Survey[] = [
    {
      id: '1',
      code: 'S001',
      title: 'Survei Kepuasan Mahasiswa',
      description: 'Survei untuk mengukur kepuasan mahasiswa',
      totalQuestions: 25,
      createdAt: '2024-01-15',
      status: 'Aktif',
      instrumentStructure: []
    },
    {
      id: '2',
      code: 'S002',
      title: 'Survei Evaluasi Dosen',
      description: 'Survei untuk evaluasi kinerja dosen',
      totalQuestions: 20,
      createdAt: '2024-01-10',
      status: 'Aktif',
      instrumentStructure: []
    },
    {
      id: '3',
      code: 'S003',
      title: 'Survei Fasilitas Kampus',
      description: 'Survei kepuasan fasilitas kampus',
      totalQuestions: 15,
      createdAt: '2024-01-05',
      status: 'Nonaktif',
      instrumentStructure: []
    }
  ];

  useEffect(() => {
    // Load surveys data
    setSurveys(mockSurveys);
    
    // Load post-submit info
    loadPostSubmitInfo();
  }, [setSurveys, loadPostSubmitInfo]);

  // Update form data when postSubmitInfo changes
  useEffect(() => {
    if (postSubmitInfo) {
      setFormData({
        title: postSubmitInfo.title,
        description: postSubmitInfo.description,
        selectedSurveyIds: postSubmitInfo.selectedSurveyIds
      });
    }
  }, [postSubmitInfo]);

  const handleSurveySelection = (surveyId: string, isChecked: boolean) => {
    setFormData(prev => ({
      ...prev,
      selectedSurveyIds: isChecked 
        ? [...prev.selectedSurveyIds, surveyId]
        : prev.selectedSurveyIds.filter(id => id !== surveyId)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate that at least one survey is selected
    if (formData.selectedSurveyIds.length === 0) {
      alert('Silakan pilih minimal satu survei');
      return;
    }
    
    try {
      await savePostSubmitInfo({ ...formData, isActive: true });
      alert('Informasi pasca submit berhasil disimpan!');
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Gagal menyimpan data. Silakan coba lagi.');
    }
  };

  const activeSurveys = surveys.filter(survey => survey.status === 'Aktif');
  const selectedSurveys = activeSurveys.filter(survey => 
    formData.selectedSurveyIds.includes(survey.id)
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Informasi Pasca Submit</h1>
          <p className="text-gray-600 mt-1">
            Atur informasi yang akan ditampilkan setelah responden menyelesaikan survei
          </p>
        </div>

        {/* Single Form Card */}
        <div className="bg-white p-6 rounded-lg shadow">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Judul */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Judul</h2>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Masukkan judul yang akan ditampilkan setelah submit"
                required
              />
            </div>

            {/* Deskripsi */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Deskripsi</h2>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Masukkan deskripsi yang akan ditampilkan setelah submit"
                required
              />
            </div>

            {/* Survei Pilihan - Multiple Selection */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Survei Pilihan</h2>
              <p className="text-sm text-gray-500 mt-2">
                Pilih satu atau lebih survei aktif yang akan ditampilkan sebagai rekomendasi
              </p>
              {formData.selectedSurveyIds.length > 0 && (
                <p className="text-sm text-blue-600 mt-1">
                  {formData.selectedSurveyIds.length} survei dipilih
                </p>
              )}
              <div className="space-y-2 max-h-60 overflow-y-auto border border-gray-300 rounded-lg p-3">
                {activeSurveys.length === 0 ? (
                  <p className="text-gray-500 text-sm">Tidak ada survei aktif</p>
                ) : (
                  activeSurveys.map((survey) => (
                    <label key={survey.id} className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.selectedSurveyIds.includes(survey.id)}
                        onChange={(e) => handleSurveySelection(survey.id, e.target.checked)}
                        className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900">
                          {survey.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {survey.code} • {survey.description}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {survey.totalQuestions} pertanyaan
                        </div>
                      </div>
                    </label>
                  ))
                )}
              </div>
              
            </div>

            {/* Preview */}
            {formData.title && formData.description && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Preview</h2>
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{formData.title}</h3>
                  <p className="text-gray-600 mb-3">{formData.description}</p>
                  {selectedSurveys.length > 0 && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-700 mb-2">
                        {selectedSurveys.length === 1 
                          ? 'Survei lain yang mungkin menarik:' 
                          : 'Survei lain yang mungkin menarik:'
                        }
                      </p>
                      <div className="space-y-2">
                        {selectedSurveys.map((survey) => (
                          <div key={survey.id} className="bg-blue-50 p-3 rounded border border-blue-200">
                            <p className="text-blue-800 font-medium">{survey.title}</p>
                            <p className="text-blue-600 text-sm">{survey.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end pt-4 border-t border-gray-200">
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
} 