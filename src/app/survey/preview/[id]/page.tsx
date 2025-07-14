'use client'

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeftIcon, 
  DocumentTextIcon, 
  ChevronRightIcon,
  ChevronLeftIcon,
  UserIcon,
  CheckCircleIcon,
  IdentificationIcon
} from '@heroicons/react/24/outline';
import { useSurveyStore } from '@/store/surveyStore';
import { Survey, InstrumentLevel } from '@/types/survey';
import { Question } from '@/types/question';

const questionTypeLabels = {
  short_answer: 'Short Answer',
  paragraph: 'Paragraph',
  multiple_choice: 'Multiple Choice',
  checkbox: 'Checkbox',
  dropdown: 'Dropdown'
};

export default function SurveyPreviewPage() {
  const params = useParams();
  const router = useRouter();
  const { surveys } = useSurveyStore();
  const surveyId = params.id as string;
  
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [selectedInstrumentId, setSelectedInstrumentId] = useState<string>('user-identification');
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    memberId: '',
    isCompleted: false
  });
  const [responses, setResponses] = useState<{ [questionId: string]: string | string[] }>({});
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);

  useEffect(() => {
    const foundSurvey = surveys.find(s => s.id === surveyId);
    if (foundSurvey) {
      setSurvey(foundSurvey);
    }
  }, [surveyId, surveys]);

  const handleBack = () => {
    router.push('/admin/surveys');
  };

  const handleUserInfoSubmit = () => {
    if (userInfo.name && userInfo.email && userInfo.memberId) {
      setUserInfo(prev => ({ ...prev, isCompleted: true }));
      // Auto-select first instrument with questions after user info is completed
      if (survey?.instrumentStructure && survey.instrumentStructure.length > 0) {
        const allInstruments = getAllInstruments(survey.instrumentStructure);
        const firstInstrumentWithQuestions = allInstruments.find(inst => {
          const questions = getQuestionsForInstrument(inst.id);
          return questions.length > 0;
        });
        
        if (firstInstrumentWithQuestions) {
          setSelectedInstrumentId(firstInstrumentWithQuestions.id);
        }
      }
    }
  };

  const getAllInstruments = (instruments: InstrumentLevel[]): InstrumentLevel[] => {
    let result: InstrumentLevel[] = [];
    instruments.forEach(instrument => {
      result.push(instrument);
      if (instrument.children && instrument.children.length > 0) {
        result = result.concat(getAllInstruments(instrument.children));
      }
    });
    return result;
  };

  const getQuestionsForInstrument = (instrumentId: string): Question[] => {
    if (!survey?.questions) return [];
    return survey.questions.filter(q => q.instrumentId === instrumentId);
  };

  const handleResponseChange = (questionId: string, value: string | string[]) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  // Get all instruments with questions
  const getInstrumentsWithQuestions = () => {
    if (!survey?.instrumentStructure) return [];
    const allInstruments = getAllInstruments(survey.instrumentStructure);
    return allInstruments.filter(inst => getQuestionsForInstrument(inst.id).length > 0);
  };

  // Navigation helpers
  const getCurrentInstrumentIndex = () => {
    const instrumentsWithQuestions = getInstrumentsWithQuestions();
    return instrumentsWithQuestions.findIndex(inst => inst.id === selectedInstrumentId);
  };

  const canGoBack = () => {
    return getCurrentInstrumentIndex() > 0;
  };

  const canGoForward = () => {
    const instrumentsWithQuestions = getInstrumentsWithQuestions();
    return getCurrentInstrumentIndex() < instrumentsWithQuestions.length - 1;
  };

  const isLastInstrument = () => {
    const instrumentsWithQuestions = getInstrumentsWithQuestions();
    return getCurrentInstrumentIndex() === instrumentsWithQuestions.length - 1;
  };

  const handleBackInstrument = () => {
    if (canGoBack()) {
      const instrumentsWithQuestions = getInstrumentsWithQuestions();
      const currentIndex = getCurrentInstrumentIndex();
      setSelectedInstrumentId(instrumentsWithQuestions[currentIndex - 1].id);
    }
  };

  const handleForwardInstrument = () => {
    if (canGoForward()) {
      const instrumentsWithQuestions = getInstrumentsWithQuestions();
      const currentIndex = getCurrentInstrumentIndex();
      setSelectedInstrumentId(instrumentsWithQuestions[currentIndex + 1].id);
    }
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log('Saving responses:', responses);
    alert('Responses saved successfully!');
  };

  const handleSubmit = () => {
    setShowSubmitDialog(true);
  };

  const confirmSubmit = () => {
    // TODO: Implement submit functionality
    console.log('Submitting survey:', responses);
    setShowSubmitDialog(false);
    alert('Survey submitted successfully!');
    // Could redirect back to surveys or show success page
  };

  // User Identity Display Component
  const renderUserIdentityDisplay = () => {
    if (!userInfo.isCompleted) return null;

    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start space-x-3">
          <IdentificationIcon className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">Identitas Responden</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <div>
                <span className="text-blue-700 font-medium">Nama:</span>
                <p className="text-blue-800 truncate">{userInfo.name}</p>
              </div>
              <div>
                <span className="text-blue-700 font-medium">Email:</span>
                <p className="text-blue-800 truncate">{userInfo.email}</p>
              </div>
              <div>
                <span className="text-blue-700 font-medium">Member ID:</span>
                <p className="text-blue-800 truncate">{userInfo.memberId}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderQuestionInput = (question: Question) => {
    const value = responses[question.id] || '';

    switch (question.type) {
      case 'short_answer':
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleResponseChange(question.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Your answer..."
          />
        );

      case 'paragraph':
        return (
          <textarea
            value={value}
            onChange={(e) => handleResponseChange(question.id, e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            placeholder="Your detailed answer..."
          />
        );

      case 'multiple_choice':
        return (
          <div className="space-y-2">
            {question.options?.map((option) => (
              <label key={option.id} className="flex items-center space-x-3">
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={option.id}
                  checked={value === option.id}
                  onChange={(e) => handleResponseChange(question.id, e.target.value)}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{option.text}</span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        return (
          <div className="space-y-2">
            {question.options?.map((option) => (
              <label key={option.id} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  value={option.id}
                  checked={Array.isArray(value) ? value.includes(option.id) : false}
                  onChange={(e) => {
                    const currentValues = Array.isArray(value) ? value : [];
                    if (e.target.checked) {
                      handleResponseChange(question.id, [...currentValues, option.id]);
                    } else {
                      handleResponseChange(question.id, currentValues.filter(v => v !== option.id));
                    }
                  }}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{option.text}</span>
              </label>
            ))}
          </div>
        );

      case 'dropdown':
        return (
          <select
            value={value}
            onChange={(e) => handleResponseChange(question.id, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select an option...</option>
            {question.options?.map((option) => (
              <option key={option.id} value={option.id}>
                {option.text}
              </option>
            ))}
          </select>
        );

      default:
        return null;
    }
  };

  const renderUserIdentificationSection = () => (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="text-center mb-8">
          <UserIcon className="h-16 w-16 mx-auto text-blue-600 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Identifikasi Responden</h2>
          <p className="text-gray-600">Silakan lengkapi informasi berikut sebelum mengisi survei</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Lengkap <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={userInfo.name}
              onChange={(e) => setUserInfo(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Masukkan nama lengkap Anda"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={userInfo.email}
              onChange={(e) => setUserInfo(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="your.email@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Member ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={userInfo.memberId}
              onChange={(e) => setUserInfo(prev => ({ ...prev, memberId: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Masukkan Member ID Anda"
              required
            />
          </div>

          <button
            onClick={handleUserInfoSubmit}
            disabled={!userInfo.name || !userInfo.email || !userInfo.memberId}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
          >
            Lanjutkan ke Survei
          </button>
        </div>
      </div>
    </div>
  );

  const renderInstrumentQuestions = () => {
    if (!survey) return null;

    // Check if user identification is completed
    if (!userInfo.isCompleted) {
      return (
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="text-center">
              <UserIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Akses Terbatas</h2>
              <p className="text-gray-600 mb-6">
                Silakan lengkapi identifikasi responden terlebih dahulu sebelum mengakses pertanyaan survei.
              </p>
              <button
                onClick={() => setSelectedInstrumentId('user-identification')}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <UserIcon className="h-4 w-4" />
                <span>Kembali ke Identifikasi</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    const selectedInstrument = getAllInstruments(survey.instrumentStructure || [])
      .find(inst => inst.id === selectedInstrumentId);
    
    if (!selectedInstrument) return null;

    const questions = getQuestionsForInstrument(selectedInstrumentId);

    return (
      <div className="max-w-4xl mx-auto">
        {/* User Identity Display */}
        {renderUserIdentityDisplay()}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {/* Instrument Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">{selectedInstrument.name}</h2>
                <p className="text-gray-600">{questions.length} pertanyaan dalam instrumen ini</p>
              </div>
              
              {/* Navigation buttons */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleBackInstrument}
                  disabled={!canGoBack()}
                  className="flex items-center space-x-2 px-3 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                  <span className="hidden sm:inline">Sebelumnya</span>
                </button>
                <button
                  onClick={handleForwardInstrument}
                  disabled={!canGoForward()}
                  className="flex items-center space-x-2 px-3 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <span className="hidden sm:inline">Selanjutnya</span>
                  <ChevronRightIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {questions.length > 0 ? (
            <>
              <div className="space-y-8 mb-8">
                {questions.map((question, index) => (
                  <div key={question.id} className="border-b border-gray-200 pb-8 last:border-b-0 last:pb-0">
                    <div className="mb-4">
                      <div className="flex items-start space-x-4">
                        <span className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full text-sm font-medium flex-shrink-0 mt-1">
                          {index + 1}
                        </span>
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {question.title}
                            {question.required && <span className="text-red-500 ml-1">*</span>}
                          </h3>
                          <div className="flex items-center space-x-2 mb-4">
                            <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                              {questionTypeLabels[question.type]}
                            </span>
                            <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">
                              {question.respondentJobType === 'all' ? 'All' : question.respondentJobType.charAt(0).toUpperCase() + question.respondentJobType.slice(1)}
                            </span>
                          </div>
                          {renderQuestionInput(question)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <button
                  onClick={handleSave}
                  className="px-6 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
                >
                  Simpan Draft
                </button>
                
                {isLastInstrument() && (
                  <button
                    onClick={handleSubmit}
                    className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    Submit Survey
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Tidak ada pertanyaan dalam instrumen ini.</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderSidebar = () => {
    if (!survey) return null;

    const allInstruments = survey.instrumentStructure 
      ? getAllInstruments(survey.instrumentStructure)
      : [];
    
    const instrumentsWithQuestions = allInstruments.filter(inst => 
      getQuestionsForInstrument(inst.id).length > 0
    );

    return (
      <div 
        className={`fixed left-0 top-0 h-full bg-white shadow-lg border-r border-gray-200 transition-all duration-300 z-40 ${
          sidebarHovered ? 'w-80' : 'w-16'
        }`}
        onMouseEnter={() => setSidebarHovered(true)}
        onMouseLeave={() => setSidebarHovered(false)}
      >
        <div className="p-4">
          {/* Logo/Header */}
          <div className="flex items-center space-x-3 mb-6">
            <DocumentTextIcon className="h-8 w-8 text-blue-600 flex-shrink-0" />
            {sidebarHovered && (
              <div className="min-w-0">
                <h2 className="text-lg font-semibold text-gray-900 truncate">Survey Preview</h2>
                <p className="text-sm text-gray-500 truncate">{survey.title}</p>
              </div>
            )}
          </div>

          {/* Navigation Items */}
          <nav className="space-y-2">
            {/* User Identification */}
            <button
              onClick={() => setSelectedInstrumentId('user-identification')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-left ${
                selectedInstrumentId === 'user-identification'
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <UserIcon className="h-5 w-5 flex-shrink-0" />
              {sidebarHovered && (
                <div className="min-w-0 flex-1">
                  <span className="block text-sm font-medium truncate">Identifikasi</span>
                  <span className="block text-xs text-gray-500 truncate">
                    {userInfo.isCompleted ? '✓ Selesai' : 'Belum lengkap'}
                  </span>
                </div>
              )}
            </button>

            {/* Instruments */}
            {instrumentsWithQuestions.map((instrument, index) => (
              <button
                key={instrument.id}
                onClick={() => setSelectedInstrumentId(instrument.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors text-left ${
                  selectedInstrumentId === instrument.id
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="flex items-center justify-center w-5 h-5 bg-gray-300 text-gray-700 rounded text-xs font-medium flex-shrink-0">
                  {index + 1}
                </span>
                {sidebarHovered && (
                  <div className="min-w-0 flex-1">
                    <span className="block text-sm font-medium truncate">{instrument.name}</span>
                    <span className="block text-xs text-gray-500 truncate">
                      {getQuestionsForInstrument(instrument.id).length} pertanyaan
                    </span>
                  </div>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>
    );
  };

  if (!survey) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <DocumentTextIcon className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">Survey not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {renderSidebar()}
      
      <div className={`transition-all duration-300 ${sidebarHovered ? 'ml-80' : 'ml-16'}`}>
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBack}
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                <span>Kembali ke Kelola Survei</span>
              </button>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Preview Mode</div>
              <div className="text-xs text-gray-400">Testing survey flow</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {selectedInstrumentId === 'user-identification' 
            ? renderUserIdentificationSection()
            : renderInstrumentQuestions()
          }
        </div>
      </div>
      
      {/* Submit Confirmation Dialog */}
      {showSubmitDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="text-center">
              <CheckCircleIcon className="h-16 w-16 mx-auto text-green-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Konfirmasi Submit Survey</h3>
              <p className="text-gray-600 mb-6">
                Ini adalah mode preview. Dalam mode aktual, respons akan disimpan ke database.
              </p>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowSubmitDialog(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={confirmSubmit}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Ya, Submit (Preview)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 