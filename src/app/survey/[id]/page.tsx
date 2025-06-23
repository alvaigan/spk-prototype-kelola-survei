'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { 
  DocumentTextIcon, 
  ChevronRightIcon,
  ChevronLeftIcon,
  UserIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { useSurveyStore } from '@/store/surveyStore';
import { Survey, InstrumentLevel, Respondent } from '@/types/survey';
import { Question } from '@/types/question';
import { useRespondentStore } from '@/store/respondentStore';

const questionTypeLabels = {
  short_answer: 'Short Answer',
  paragraph: 'Paragraph',
  multiple_choice: 'Multiple Choice',
  checkbox: 'Checkbox',
  dropdown: 'Dropdown'
};

export default function PublicSurveyPage() {
  const params = useParams();
  const { surveys } = useSurveyStore();
  const surveyId = params.id as string;
  
  // Check if we're in view mode
  const [isViewMode, setIsViewMode] = useState(false);
  
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [selectedInstrumentId, setSelectedInstrumentId] = useState<string>('user-identification');
  const [userInfo, setUserInfo] = useState({
    email: '',
    birthDate: '',
    isCompleted: false
  });
  const [responses, setResponses] = useState<{ [questionId: string]: string | string[] }>({});
  const [sidebarHovered, setSidebarHovered] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);

  const { addRespondent, respondents } = useRespondentStore();

  useEffect(() => {
    const foundSurvey = surveys.find(s => s.id === surveyId);
    if (foundSurvey) {
      setSurvey(foundSurvey);
    }
  }, [surveyId, surveys]);

  const getAllInstruments = useCallback((instruments: InstrumentLevel[]): InstrumentLevel[] => {
    let result: InstrumentLevel[] = [];
    instruments.forEach(instrument => {
      result.push(instrument);
      if (instrument.children && instrument.children.length > 0) {
        result = result.concat(getAllInstruments(instrument.children));
      }
    });
    return result;
  }, []);

  const getQuestionsForInstrument = useCallback((instrumentId: string): Question[] => {
    if (!survey?.questions) return [];
    return survey.questions.filter(q => q.instrumentId === instrumentId);
  }, [survey?.questions]);

  useEffect(() => {
    // Check URL parameters for view mode
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      
      const mode = urlParams.get('mode');
      const respondentId = urlParams.get('respondentId');
      
      console.log('URL params:', { mode, respondentId });
      
      if (mode === 'view' && respondentId) {
        setIsViewMode(true);
        
        // Load respondent data and populate responses
        const respondent = respondents.find(r => r.id === respondentId);
        console.log('Found respondent:', respondent);
        
        if (respondent) {
          if (respondent.responses) {
            console.log('Respondent responses:', respondent.responses);
            
            // Separate userInfo from other responses
            const { userInfo, ...surveyResponses } = respondent.responses;
            console.log('User info:', userInfo);
            console.log('Survey responses:', surveyResponses);
            
            if (userInfo && typeof userInfo === 'object' && userInfo !== null) {
              const userInfoObj = userInfo as { email?: string; birthDate?: string };
              setUserInfo({
                email: userInfoObj.email || '',
                birthDate: userInfoObj.birthDate || '',
                isCompleted: true
              });
            }
            // Type assertion for survey responses - we know these should be string or string[]
            const typedResponses = Object.fromEntries(
              Object.entries(surveyResponses).map(([key, value]) => [
                key,
                Array.isArray(value) ? value : String(value || '')
              ])
            ) as { [questionId: string]: string | string[] };
            setResponses(typedResponses);
            
            // Auto-navigate to first instrument with questions in view mode
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
        }
      }
    }
  }, [respondents, survey, getAllInstruments, getQuestionsForInstrument]);

  const handleUserInfoSubmit = () => {
    if (userInfo.email && userInfo.birthDate) {
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
    // Submit the survey
    const respondentData: Respondent = {
      id: Date.now().toString(),
      name: userInfo.email.split('@')[0] || 'Anonymous',
      email: userInfo.email,
      surveyForm: survey?.title || 'Unknown Survey',
      verificationStatus: 'Belum Verifikasi',
      submittedAt: new Date().toISOString(),
      responses: { ...responses, userInfo },
      surveyId: surveyId // Add survey ID to respondent data
    };

    console.log('Prepared respondent data:', respondentData);
    console.log('Current responses:', responses);
    console.log('User info:', userInfo);

    // Add to respondent store
    try {
      addRespondent(respondentData);
      console.log('Successfully added respondent to store');
      setShowSubmitDialog(false);
      alert('Survey submitted successfully!');
      // Could redirect to a thank you page
    } catch (error) {
      console.error('Error adding respondent:', error);
      alert('Error submitting survey. Please try again.');
    }
  };

  const renderQuestionInput = (question: Question) => {
    const value = responses[question.id] || '';

    switch (question.type) {
      case 'short_answer':
        // Ensure value is a string for text input
        const textValue = Array.isArray(value) ? value.join(', ') : (value || '');
        return (
          <input
            type="text"
            value={textValue}
            onChange={isViewMode ? undefined : (e) => handleResponseChange(question.id, e.target.value)}
            readOnly={isViewMode}
            className={`w-full px-3 py-2 border rounded-md ${
              isViewMode 
                ? 'border-gray-200 bg-gray-50 text-gray-700' 
                : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            }`}
            placeholder={isViewMode ? '' : "Your answer..."}
          />
        );

      case 'paragraph':
        // Ensure value is a string for textarea
        const textareaValue = Array.isArray(value) ? value.join(', ') : (value || '');
        return (
          <textarea
            value={textareaValue}
            onChange={isViewMode ? undefined : (e) => handleResponseChange(question.id, e.target.value)}
            readOnly={isViewMode}
            rows={4}
            className={`w-full px-3 py-2 border rounded-md resize-none ${
              isViewMode 
                ? 'border-gray-200 bg-gray-50 text-gray-700' 
                : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            }`}
            placeholder={isViewMode ? '' : "Your detailed answer..."}
          />
        );

      case 'multiple_choice':
        // Ensure value is a string for radio buttons (not array)
        const radioValue = Array.isArray(value) ? value[0] || '' : value || '';
        return (
          <div className="space-y-2">
            {question.options?.map((option) => (
              <label key={option.id} className={`flex items-center space-x-3 ${isViewMode ? 'cursor-default' : 'cursor-pointer'}`}>
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={option.id}
                  checked={radioValue === option.id}
                  onChange={isViewMode ? undefined : (e) => handleResponseChange(question.id, e.target.value)}
                  disabled={isViewMode}
                  className={`w-4 h-4 ${
                    isViewMode 
                      ? 'text-gray-400 border-gray-300' 
                      : 'text-blue-600 border-gray-300 focus:ring-blue-500'
                  }`}
                />
                <span className={`text-sm ${isViewMode ? 'text-gray-600' : 'text-gray-700'}`}>
                  {option.text}
                </span>
              </label>
            ))}
          </div>
        );

      case 'checkbox':
        // Ensure value is an array for checkboxes
        const checkboxValues = Array.isArray(value) ? value : (value ? [value] : []);
        return (
          <div className="space-y-2">
            {question.options?.map((option) => (
              <label key={option.id} className={`flex items-center space-x-3 ${isViewMode ? 'cursor-default' : 'cursor-pointer'}`}>
                <input
                  type="checkbox"
                  value={option.id}
                  checked={checkboxValues.includes(option.id)}
                  onChange={isViewMode ? undefined : (e) => {
                    const currentValues = Array.isArray(value) ? value : [];
                    if (e.target.checked) {
                      handleResponseChange(question.id, [...currentValues, option.id]);
                    } else {
                      handleResponseChange(question.id, currentValues.filter(v => v !== option.id));
                    }
                  }}
                  disabled={isViewMode}
                  className={`w-4 h-4 rounded ${
                    isViewMode 
                      ? 'text-gray-400 border-gray-300' 
                      : 'text-blue-600 border-gray-300 focus:ring-blue-500'
                  }`}
                />
                <span className={`text-sm ${isViewMode ? 'text-gray-600' : 'text-gray-700'}`}>
                  {option.text}
                </span>
              </label>
            ))}
          </div>
        );

      case 'dropdown':
        // Ensure value is always a string for dropdown (not array)
        const dropdownValue = Array.isArray(value) ? value[0] || '' : value || '';
        return (
          <select
            value={dropdownValue}
            onChange={isViewMode ? undefined : (e) => handleResponseChange(question.id, e.target.value)}
            disabled={isViewMode}
            className={`w-full px-3 py-2 border rounded-md ${
              isViewMode 
                ? 'border-gray-200 bg-gray-50 text-gray-700' 
                : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
            }`}
          >
            <option value="">{isViewMode ? (dropdownValue ? '' : 'No selection') : 'Select an option...'}</option>
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
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={userInfo.email}
              onChange={isViewMode ? undefined : (e) => setUserInfo(prev => ({ ...prev, email: e.target.value }))}
              readOnly={isViewMode}
              className={`w-full px-3 py-2 border rounded-md ${
                isViewMode 
                  ? 'border-gray-200 bg-gray-50 text-gray-700' 
                  : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              }`}
              placeholder={isViewMode ? '' : "your.email@example.com"}
              required={!isViewMode}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tanggal Lahir <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={userInfo.birthDate}
              onChange={isViewMode ? undefined : (e) => setUserInfo(prev => ({ ...prev, birthDate: e.target.value }))}
              readOnly={isViewMode}
              className={`w-full px-3 py-2 border rounded-md ${
                isViewMode 
                  ? 'border-gray-200 bg-gray-50 text-gray-700' 
                  : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              }`}
              required={!isViewMode}
            />
          </div>

          {!isViewMode && (
            <button
              onClick={handleUserInfoSubmit}
              disabled={!userInfo.email || !userInfo.birthDate}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
            >
              Lanjutkan ke Survei
            </button>
          )}
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
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          {/* Navigation Header */}
          {!isViewMode && (
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
              <button
                onClick={handleBackInstrument}
                disabled={!canGoBack()}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                  canGoBack()
                    ? 'text-blue-600 hover:bg-blue-50 hover:text-blue-800'
                    : 'text-gray-300 cursor-not-allowed'
                }`}
              >
                <ChevronLeftIcon className="h-4 w-4" />
                <span>Sebelumnya</span>
              </button>

              <div className="text-center">
                <div className={`inline-flex px-3 py-1 text-sm font-medium rounded-full mb-2 ${
                  selectedInstrument.level === 1 ? 'bg-blue-100 text-blue-800' :
                  selectedInstrument.level === 2 ? 'bg-green-100 text-green-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  Level {selectedInstrument.level} • {selectedInstrument.code}
                </div>
                <div className="text-sm text-gray-500">
                  {getCurrentInstrumentIndex() + 1} dari {getInstrumentsWithQuestions().length} instrumen
                </div>
              </div>

              <button
                onClick={handleForwardInstrument}
                disabled={!canGoForward()}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                  canGoForward()
                    ? 'text-blue-600 hover:bg-blue-50 hover:text-blue-800'
                    : 'text-gray-300 cursor-not-allowed'
                }`}
              >
                <span>Selanjutnya</span>
                <ChevronRightIcon className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* View Mode Header */}
          {isViewMode && (
            <div className="text-center mb-6 pb-4 border-b border-gray-200">
              <div className={`inline-flex px-3 py-1 text-sm font-medium rounded-full mb-2 ${
                selectedInstrument.level === 1 ? 'bg-blue-100 text-blue-800' :
                selectedInstrument.level === 2 ? 'bg-green-100 text-green-800' :
                'bg-purple-100 text-purple-800'
              }`}>
                Level {selectedInstrument.level} • {selectedInstrument.code}
              </div>
              <div className="text-sm text-gray-500">
                Viewing submitted responses
              </div>
            </div>
          )}

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">{selectedInstrument.name}</h2>
            <p className="text-gray-600">{questions.length} pertanyaan dalam instrumen ini</p>
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
                          <div className="mt-4">
                            {renderQuestionInput(question)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              {!isViewMode && (
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
              )}
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

  const renderInstrumentTree = (instruments: InstrumentLevel[], depth: number = 0) => {
    return instruments.map((instrument) => {
      const hasQuestions = getQuestionsForInstrument(instrument.id).length > 0;
      const questions = getQuestionsForInstrument(instrument.id);
      const hasChildren = instrument.children && instrument.children.length > 0;
      const isSelected = selectedInstrumentId === instrument.id;

      return (
        <div key={instrument.id} className="space-y-1">
          <button
            onClick={() => hasQuestions && setSelectedInstrumentId(instrument.id)}
            disabled={!hasQuestions}
            className={`w-full transition-colors ${
              sidebarHovered
                ? `flex items-center space-x-3 p-3 rounded-lg ${
                    isSelected && hasQuestions
                      ? 'bg-blue-100 text-blue-800 border border-blue-200'
                      : hasQuestions
                      ? 'text-gray-700 hover:bg-gray-100'
                      : 'text-gray-400 cursor-not-allowed'
                  }`
                : `flex items-center justify-center p-3 mx-1 rounded-lg ${
                    isSelected && hasQuestions
                      ? 'bg-blue-100 border border-blue-200'
                      : hasQuestions
                      ? 'hover:bg-gray-100'
                      : 'text-gray-400 cursor-not-allowed'
                  }`
            }`}
            style={{ marginLeft: sidebarHovered ? `${depth * 16}px` : '0' }}
          >
            {sidebarHovered ? (
              <>
                {hasChildren && (
                  <div className="w-4 h-4 flex-shrink-0">
                    <ChevronRightIcon className="w-4 h-4" />
                  </div>
                )}
                
                {/* Level indicator dot */}
                <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                  instrument.level === 1 ? 'bg-blue-500' :
                  instrument.level === 2 ? 'bg-green-500' :
                  'bg-purple-500'
                }`} />
                
                <div className="flex-1 text-left min-w-0">
                  <div className="font-medium text-sm truncate">
                    {instrument.name}
                  </div>
                  {hasQuestions && (
                    <div className="text-xs opacity-75 truncate">
                      {instrument.code} • {questions.length} pertanyaan
                    </div>
                  )}
                  {!hasQuestions && (
                    <div className="text-xs opacity-75 truncate">
                      {instrument.code}
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* Minimized view - centered dot */
              <div className={`w-3 h-3 rounded-full ${
                instrument.level === 1 ? 'bg-blue-500' :
                instrument.level === 2 ? 'bg-green-500' :
                'bg-purple-500'
              }`} />
            )}
          </button>
          
          {/* Render children */}
          {hasChildren && sidebarHovered && (
            <div className="mt-1">
              {renderInstrumentTree(instrument.children!, depth + 1)}
            </div>
          )}
        </div>
      );
    });
  };

  const renderSidebar = () => {
    if (!survey?.instrumentStructure) return null;

    return (
      <div 
        className={`fixed left-0 top-0 h-full bg-white shadow-lg border-r border-gray-200 transition-all duration-300 z-50 overflow-y-auto ${
          sidebarHovered ? 'w-80' : 'w-16'
        }`}
        onMouseEnter={() => setSidebarHovered(true)}
        onMouseLeave={() => setSidebarHovered(false)}
      >
        <div className="p-4">
          <div className="flex items-center space-x-3 mb-6">
            <DocumentTextIcon className="h-6 w-6 text-blue-600 flex-shrink-0" />
            {sidebarHovered && (
              <div>
                <h3 className="font-semibold text-gray-900 text-sm truncate">Instrumen Survei</h3>
                <p className="text-xs text-gray-500">Pilih instrumen</p>
              </div>
            )}
          </div>

          <div className="space-y-1">
            {/* User Identification */}
            <button
              onClick={() => setSelectedInstrumentId('user-identification')}
              className={`w-full transition-colors ${
                sidebarHovered
                  ? `flex items-center space-x-3 p-3 rounded-lg ${
                      selectedInstrumentId === 'user-identification'
                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`
                  : `flex items-center justify-center p-3 mx-1 rounded-lg ${
                      selectedInstrumentId === 'user-identification'
                        ? 'bg-blue-100 border border-blue-200'
                        : 'hover:bg-gray-100'
                    }`
              }`}
            >
              {sidebarHovered ? (
                <>
                  <UserIcon className="h-5 w-5 flex-shrink-0 text-blue-600" />
                  <div className="flex-1 text-left">
                    <div className="font-medium text-sm">Identifikasi</div>
                    <div className="text-xs opacity-75">Informasi responden</div>
                  </div>
                  {userInfo.isCompleted && (
                    <CheckCircleIcon className="h-4 w-4 text-green-600 flex-shrink-0" />
                  )}
                </>
              ) : (
                <div className="relative">
                  <UserIcon className="h-5 w-5 text-blue-600" />
                  {userInfo.isCompleted && (
                    <CheckCircleIcon className="h-3 w-3 text-green-600 absolute -top-1 -right-1" />
                  )}
                </div>
              )}
            </button>

            {/* Instruments Tree */}
            <div className="space-y-1">
              {renderInstrumentTree(survey.instrumentStructure)}
            </div>
          </div>
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
              <div className="text-left">
                <h1 className="text-lg font-semibold text-gray-900">{survey.title}</h1>
                <p className="text-sm text-gray-500">{survey.description}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">
                {isViewMode ? 'View Mode' : 'Survey Mode'}
              </div>
              {isViewMode && (
                <div className="text-xs text-gray-400">Read-only</div>
              )}
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
      {showSubmitDialog && !isViewMode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="text-center">
              <CheckCircleIcon className="h-16 w-16 mx-auto text-green-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Konfirmasi Submit Survey</h3>
              <p className="text-gray-600 mb-6">
                Apakah Anda yakin ingin mengirimkan jawaban survey ini? 
                Setelah dikirim, Anda tidak dapat mengubah jawaban lagi.
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
                  Ya, Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 