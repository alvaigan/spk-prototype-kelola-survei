'use client';


import { XMarkIcon } from '@heroicons/react/24/outline';
import { Respondent } from '@/types/survey';

interface ViewResponseModalProps {
  isOpen: boolean;
  onClose: () => void;
  respondent: Respondent | null;
}

export default function ViewResponseModal({ isOpen, onClose, respondent }: ViewResponseModalProps) {
  if (!isOpen || !respondent) return null;

  const renderResponseValue = (value: string | string[] | Record<string, unknown>) => {
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value, null, 2);
    }
    
    return String(value || '-');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-4 mx-auto p-5 border max-w-4xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Detail Respon</h3>
            <p className="text-sm text-gray-600 mt-1">
              Respon dari {respondent.name} • {formatDate(respondent.submittedAt)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-6 max-h-96 overflow-y-auto">
          {/* Respondent Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Informasi Responden</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nama</label>
                <p className="text-sm text-gray-900">{respondent.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="text-sm text-gray-900">{respondent.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Formulir Survei</label>
                <p className="text-sm text-gray-900">{respondent.surveyForm}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    respondent.verificationStatus === 'Terverifikasi'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {respondent.verificationStatus}
                </span>
              </div>
            </div>
          </div>

          {/* User Information from responses */}
          {(() => {
            if (!respondent.responses || !respondent.responses.userInfo || 
                typeof respondent.responses.userInfo !== 'object' || 
                respondent.responses.userInfo === null) {
              return null;
            }
            
            const userInfo = respondent.responses.userInfo as { email?: string; birthDate?: string };
            
            return (
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">Identifikasi Responden</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <p className="text-sm text-gray-900">{userInfo.email || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tanggal Lahir</label>
                    <p className="text-sm text-gray-900">
                      {userInfo.birthDate 
                        ? new Date(userInfo.birthDate).toLocaleDateString('id-ID')
                        : '-'
                      }
                    </p>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Survey Responses */}
          {respondent.responses && (
            <div className="bg-white border rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-4">Jawaban Survei</h4>
              <div className="space-y-4">
                {Object.entries(respondent.responses).map(([key, value], index) => {
                  // Skip userInfo as it's displayed separately
                  if (key === 'userInfo') return null;
                  
                  return (
                    <div key={key} className="border-b border-gray-100 pb-3 last:border-b-0">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-blue-600">{index}</span>
                        </div>
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Pertanyaan {key}
                          </label>
                          <div className="bg-gray-50 rounded p-3">
                            <p className="text-sm text-gray-900 whitespace-pre-wrap">
                              {renderResponseValue(value as string | string[] | Record<string, unknown>)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {Object.keys(respondent.responses).filter(key => key !== 'userInfo').length === 0 && (
                  <div className="text-center py-4">
                    <p className="text-gray-500 text-sm">Tidak ada jawaban survei yang tersimpan.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white text-sm font-medium rounded-md hover:bg-gray-600 transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
} 