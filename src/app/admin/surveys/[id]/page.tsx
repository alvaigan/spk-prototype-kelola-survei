'use client'

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeftIcon, PlusIcon, ArrowUpIcon, ArrowDownIcon, PencilIcon, TrashIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import AdminLayout from '@/components/layout/AdminLayout';
import { QuestionModal } from '@/components/QuestionModal';
import { useSurveyStore } from '@/store/surveyStore';
import { Question } from '@/types/question';
import { InstrumentLevel } from '@/types/survey';

const questionTypeLabels = {
  short_answer: 'Short Answer',
  paragraph: 'Paragraph',
  multiple_choice: 'Multiple Choice',
  checkbox: 'Checkbox',
  dropdown: 'Dropdown'
};

const questionTypeColors = {
  short_answer: 'bg-blue-100 text-blue-800',
  paragraph: 'bg-green-100 text-green-800',
  multiple_choice: 'bg-purple-100 text-purple-800',
  checkbox: 'bg-yellow-100 text-yellow-800',
  dropdown: 'bg-red-100 text-red-800'
};

export default function SurveyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { 
    surveys, 
    currentSurvey, 
    setCurrentSurvey, 
    setQuestionModalOpen, 
    setEditingQuestion,
    deleteQuestion,
    moveQuestionUp,
    moveQuestionDown 
  } = useSurveyStore();
  
  const surveyId = params.id as string;

  // Helper function to get questions for a specific instrument
  const getQuestionsForInstrument = (instrumentId: string): Question[] => {
    if (!currentSurvey?.questions) return [];
    return currentSurvey.questions.filter(q => q.instrumentId === instrumentId);
  };



  // Helper function to count total questions in instrument and its children
  const countQuestionsInInstrument = (instrument: InstrumentLevel): number => {
    let count = getQuestionsForInstrument(instrument.id).length;
    if (instrument.children) {
      instrument.children.forEach(child => {
        count += countQuestionsInInstrument(child);
      });
    }
    return count;
  };

  useEffect(() => {
    const survey = surveys.find(s => s.id === surveyId);
    if (survey) {
      setCurrentSurvey(survey);
    }
  }, [surveyId, surveys, setCurrentSurvey]);

  if (!currentSurvey) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">Survey not found</p>
        </div>
      </AdminLayout>
    );
  }

  const handleBack = () => {
    router.push('/admin/surveys');
  };

  const handleAddQuestion = () => {
    setEditingQuestion(null);
    setQuestionModalOpen(true);
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setQuestionModalOpen(true);
  };

  const handleDeleteQuestion = (questionId: string) => {
    if (confirm('Are you sure you want to delete this question?')) {
      deleteQuestion(surveyId, questionId);
    }
  };

  const handleMoveQuestionUp = (questionId: string) => {
    moveQuestionUp(surveyId, questionId);
  };

  const handleMoveQuestionDown = (questionId: string) => {
    moveQuestionDown(surveyId, questionId);
  };

  const renderQuestionOptions = (question: Question) => {
    if (!question.options || question.options.length === 0) return null;

    return (
      <div className="mt-2 space-y-1">
        {question.options.map((option, index) => (
          <div key={option.id} className="text-sm text-gray-600 ml-4">
            {index + 1}. {option.text}
          </div>
        ))}
      </div>
    );
  };

  const renderQuestion = (question: Question, instrumentQuestions: Question[]) => {
    const questionIndex = instrumentQuestions.findIndex(q => q.id === question.id);
    const isFirst = questionIndex === 0;
    const isLast = questionIndex === instrumentQuestions.length - 1;
    
    return (
      <div key={question.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <span className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full text-sm font-medium">
                {question.questionNumber}
              </span>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-medium text-gray-900">
                  {question.title}
                  {question.required && <span className="text-red-500 ml-1">*</span>}
                </h3>
              </div>
            </div>
            
            <div className="ml-11">
              <div className="flex items-center space-x-2 mb-2">
                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${questionTypeColors[question.type]}`}>
                  {questionTypeLabels[question.type]}
                  {question.options && ` • ${question.options.length} options`}
                </span>
                <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">
                  {question.respondentJobType === 'all' ? 'All' : question.respondentJobType.charAt(0).toUpperCase() + question.respondentJobType.slice(1)}
                </span>
              </div>
              {renderQuestionOptions(question)}
            </div>
          </div>

          <div className="flex items-center space-x-1 ml-4">
            <button
              onClick={() => handleMoveQuestionUp(question.id)}
              disabled={isFirst}
              className={`p-2 rounded ${
                isFirst 
                  ? 'text-gray-300 cursor-not-allowed' 
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
              }`}
              title="Move Up"
            >
              <ArrowUpIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleMoveQuestionDown(question.id)}
              disabled={isLast}
              className={`p-2 rounded ${
                isLast 
                  ? 'text-gray-300 cursor-not-allowed' 
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
              }`}
              title="Move Down"
            >
              <ArrowDownIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleEditQuestion(question)}
              className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
              title="Edit Question"
            >
              <PencilIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleDeleteQuestion(question.id)}
              className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
              title="Delete Question"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderInstrumentSection = (instrument: InstrumentLevel, depth: number = 0) => {
    const questions = getQuestionsForInstrument(instrument.id);
    const totalQuestions = countQuestionsInInstrument(instrument);
    
    const levelColors = {
      1: 'border-l-blue-500 bg-blue-50',
      2: 'border-l-green-500 bg-green-50', 
      3: 'border-l-purple-500 bg-purple-50'
    };

    const levelTextColors = {
      1: 'text-blue-700',
      2: 'text-green-700',
      3: 'text-purple-700'
    };

    return (
      <div key={instrument.id} className={`${depth > 0 ? 'ml-6' : ''} mb-6`}>
        {/* Instrument Header */}
        <div className={`border-l-4 ${levelColors[instrument.level]} rounded-lg p-4 mb-4`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className={`px-2 py-1 text-xs font-medium rounded ${levelTextColors[instrument.level]} bg-white border`}>
                Level {instrument.level}
              </span>
              <span className="text-sm font-mono text-gray-600">#{instrument.code}</span>
              <h3 className="text-lg font-semibold text-gray-900">{instrument.name}</h3>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                {totalQuestions} pertanyaan
              </span>
              <button 
                onClick={handleAddQuestion}
                className="flex items-center space-x-2 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
              >
                <PlusIcon className="h-4 w-4" />
                <span>Add Question</span>
              </button>
            </div>
          </div>
        </div>

        {/* Questions for this instrument */}
        {questions.length > 0 && (
          <div className="space-y-3 mb-4">
            {questions.map(question => renderQuestion(question, questions))}
          </div>
        )}

        {/* Child instruments */}
        {instrument.children && instrument.children.length > 0 && (
          <div className="space-y-4">
            {instrument.children.map(child => renderInstrumentSection(child, depth + 1))}
          </div>
        )}

        {/* Empty state for instrument with no questions */}
        {questions.length === 0 && (!instrument.children || instrument.children.length === 0) && (
          <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <PlusIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">No questions in this section yet</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              <span>Kembali ke daftar survei</span>
            </button>
          </div>
        </div>

        {/* Survey Info */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{currentSurvey.title}</h1>
              <p className="text-gray-600 mt-1">{currentSurvey.description}</p>
              <div className="flex items-center space-x-4 mt-4 text-sm text-gray-500">
                <span>Kode: {currentSurvey.code}</span>
                <span>•</span>
                <span>Dibuat: {currentSurvey.createdAt}</span>
                <span>•</span>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  currentSurvey.status === 'Aktif' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {currentSurvey.status}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Questions Section */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <h2 className="text-lg font-semibold text-gray-900">Pertanyaan</h2>
                <span className="text-sm text-gray-500">
                  {currentSurvey.questions?.length || 0} pertanyaan
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
                  <ArrowDownTrayIcon className="h-4 w-4" />
                  <span>Import Question</span>
                </button>
                <button 
                  onClick={handleAddQuestion}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <PlusIcon className="h-4 w-4" />
                  <span>Add Question</span>
                </button>
              </div>
            </div>
          </div>

          <div className="p-6">
            {currentSurvey.instrumentStructure && currentSurvey.instrumentStructure.length > 0 ? (
              <div className="space-y-6">
                {currentSurvey.instrumentStructure.map(instrument => 
                  renderInstrumentSection(instrument)
                )}
              </div>
            ) : currentSurvey.questions && currentSurvey.questions.length > 0 ? (
              // Fallback: show questions without grouping if no instrument structure
              <div className="space-y-4">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <p className="text-yellow-800 text-sm">
                    <strong>Note:</strong> This survey has questions but no instrument structure. 
                    Questions are displayed without grouping.
                  </p>
                </div>
                {currentSurvey.questions.map(question => renderQuestion(question, currentSurvey.questions || []))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <PlusIcon className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Questions Yet</h3>
                <p className="text-gray-500 mb-6">Get started by adding your first question to this survey.</p>
                <button 
                  onClick={handleAddQuestion}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <PlusIcon className="h-4 w-4" />
                  <span>Add First Question</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Question Modal */}
      <QuestionModal surveyId={surveyId} />
    </AdminLayout>
  );
} 