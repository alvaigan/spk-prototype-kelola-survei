'use client';

import { useState } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { EyeIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import { Respondent } from '@/types/survey';
import { useRespondentStore } from '@/store/respondentStore';


export default function RespondentsPage() {
  const [activeTab, setActiveTab] = useState<'incoming' | 'verified'>('incoming');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    type: 'verify' | 'unverify';
    respondentId: string;
    respondentName: string;
  } | null>(null);


  const { respondents, updateRespondentStatus, getIncomingResponses, getVerifiedResponses } = useRespondentStore();

  const incomingResponses = getIncomingResponses();
  const verifiedResponses = getVerifiedResponses();

  const handleViewResponse = (respondentId: string) => {
    const respondent = respondents.find(r => r.id === respondentId);
    if (respondent) {
      // Use survey ID from respondent data, fallback to '1' if not available
      const surveyId = respondent.surveyId || '1';
      window.open(`/survey/${surveyId}?mode=view&respondentId=${respondentId}`, '_blank');
    }
  };

  const handleVerify = (respondentId: string) => {
    const respondent = respondents.find(r => r.id === respondentId);
    if (respondent) {
      setConfirmAction({
        type: 'verify',
        respondentId,
        respondentName: respondent.name
      });
      setShowConfirmDialog(true);
    }
  };

  const handleUnverify = (respondentId: string) => {
    const respondent = respondents.find(r => r.id === respondentId);
    if (respondent) {
      setConfirmAction({
        type: 'unverify',
        respondentId,
        respondentName: respondent.name
      });
      setShowConfirmDialog(true);
    }
  };

  const handleConfirmAction = () => {
    if (!confirmAction) return;

    const { type, respondentId } = confirmAction;
    
    if (type === 'verify') {
      updateRespondentStatus(respondentId, 'Terverifikasi');
    } else {
      updateRespondentStatus(respondentId, 'Belum Verifikasi');
    }

    setShowConfirmDialog(false);
    setConfirmAction(null);
  };

  const handleCancelAction = () => {
    setShowConfirmDialog(false);
    setConfirmAction(null);
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

  const renderTable = (respondents: Respondent[], isVerified: boolean = false) => (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              No
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nama Responden
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Formulir Survei
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status Verifikasi
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {respondents.map((respondent, index) => (
            <tr key={respondent.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {index + 1}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{respondent.name}</div>
                <div className="text-sm text-gray-500">
                  Submitted: {formatDate(respondent.submittedAt)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {respondent.email}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {respondent.surveyForm}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    respondent.verificationStatus === 'Terverifikasi'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {respondent.verificationStatus}
                </span>
                {respondent.verifiedAt && (
                  <div className="text-xs text-gray-500 mt-1">
                    Verified: {formatDate(respondent.verifiedAt)}
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button
                  onClick={() => handleViewResponse(respondent.id)}
                  className="text-blue-600 hover:text-blue-900 inline-flex items-center space-x-1"
                >
                  <EyeIcon className="h-4 w-4" />
                  <span>Lihat Respon</span>
                </button>
                {isVerified ? (
                  <button
                    onClick={() => handleUnverify(respondent.id)}
                    className="text-red-600 hover:text-red-900 inline-flex items-center space-x-1"
                  >
                    <XCircleIcon className="h-4 w-4" />
                    <span>Batal Verifikasi</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleVerify(respondent.id)}
                    className="text-green-600 hover:text-green-900 inline-flex items-center space-x-1"
                  >
                    <CheckCircleIcon className="h-4 w-4" />
                    <span>Verifikasi</span>
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kelola Responden</h1>
          <p className="text-gray-600 mt-1">Kelola responden dan verifikasi tanggapan survei</p>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('incoming')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'incoming'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Respon Masuk
              <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs">
                {incomingResponses.length}
              </span>
            </button>
            <button
              onClick={() => setActiveTab('verified')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'verified'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Respon Terverifikasi
              <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2.5 rounded-full text-xs">
                {verifiedResponses.length}
              </span>
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow">
          {activeTab === 'incoming' && (
            <div className="p-6">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Respon Masuk</h2>
                <p className="text-sm text-gray-600">Daftar responden yang belum diverifikasi</p>
              </div>
              {incomingResponses.length > 0 ? (
                renderTable(incomingResponses, false)
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">Tidak ada respon masuk yang perlu diverifikasi.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'verified' && (
            <div className="p-6">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Respon Terverifikasi</h2>
                <p className="text-sm text-gray-600">Daftar responden yang telah diverifikasi</p>
              </div>
              {verifiedResponses.length > 0 ? (
                renderTable(verifiedResponses, true)
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500">Belum ada respon yang terverifikasi.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Confirmation Dialog */}
        {showConfirmDialog && confirmAction && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3 text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
                  <svg
                    className="h-6 w-6 text-yellow-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg leading-6 font-medium text-gray-900 mt-2">
                  {confirmAction.type === 'verify' ? 'Konfirmasi Verifikasi' : 'Konfirmasi Batal Verifikasi'}
                </h3>
                <div className="mt-2 px-7 py-3">
                  <p className="text-sm text-gray-500">
                    {confirmAction.type === 'verify'
                      ? `Apakah Anda yakin ingin memverifikasi responden "${confirmAction.respondentName}"? Setelah diverifikasi, data akan dipindahkan ke tab "Respon Terverifikasi".`
                      : `Apakah Anda yakin ingin membatalkan verifikasi responden "${confirmAction.respondentName}"? Data akan dipindahkan kembali ke tab "Respon Masuk".`
                    }
                  </p>
                </div>
                <div className="items-center px-4 py-3">
                  <div className="flex space-x-3">
                    <button
                      onClick={handleCancelAction}
                      className="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    >
                      Batal
                    </button>
                    <button
                      onClick={handleConfirmAction}
                      className={`px-4 py-2 text-white text-base font-medium rounded-md w-full shadow-sm focus:outline-none focus:ring-2 ${
                        confirmAction.type === 'verify'
                          ? 'bg-green-500 hover:bg-green-600 focus:ring-green-300'
                          : 'bg-red-500 hover:bg-red-600 focus:ring-red-300'
                      }`}
                    >
                      {confirmAction.type === 'verify' ? 'Ya, Verifikasi' : 'Ya, Batal Verifikasi'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}


      </div>
    </AdminLayout>
  );
} 