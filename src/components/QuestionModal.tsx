'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Dialog } from '@headlessui/react';
import { XMarkIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useSurveyStore } from '@/store/surveyStore';
import { QuestionType, QuestionOption } from '@/types/question';
import { InstrumentLevel } from '@/types/survey';

interface QuestionModalProps {
  surveyId: string;
}

const questionTypeOptions = [
  { value: 'short_answer', label: 'Short Answer' },
  { value: 'paragraph', label: 'Paragraph' },
  { value: 'multiple_choice', label: 'Multiple Choice' },
  { value: 'checkbox', label: 'Checkbox' },
  { value: 'dropdown', label: 'Dropdown' }
];

const respondentJobTypes = [
  { value: 'all', label: 'All Respondents' },
  { value: 'employee', label: 'Employee' },
  { value: 'manager', label: 'Manager' },
  { value: 'supervisor', label: 'Supervisor' },
  { value: 'director', label: 'Director' }
];

export const QuestionModal: React.FC<QuestionModalProps> = ({ surveyId }) => {
  const {
    isQuestionModalOpen,
    editingQuestion,
    currentSurvey,
    setQuestionModalOpen,
    setEditingQuestion,
    addQuestion,
    updateQuestion
  } = useSurveyStore();

  const [formData, setFormData] = useState({
    title: '',
    type: 'short_answer' as QuestionType,
    instrumentId: '',
    respondentJobType: 'all',
    required: false,
    options: [] as QuestionOption[]
  });

  const isEditing = !!editingQuestion;

  // Get all instruments recursively for dropdown - memoized to prevent infinite loops
  const availableInstruments = useMemo(() => {
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

    return currentSurvey?.instrumentStructure 
      ? getAllInstruments(currentSurvey.instrumentStructure)
      : [];
  }, [currentSurvey?.instrumentStructure]);

  // Reset form when modal opens/closes or when editing question changes
  useEffect(() => {
    if (isQuestionModalOpen && editingQuestion) {
      setFormData({
        title: editingQuestion.title,
        type: editingQuestion.type,
        instrumentId: editingQuestion.instrumentId,
        respondentJobType: editingQuestion.respondentJobType,
        required: editingQuestion.required,
        options: editingQuestion.options || []
      });
    } else if (isQuestionModalOpen) {
      setFormData({
        title: '',
        type: 'short_answer',
        instrumentId: availableInstruments[0]?.id || '',
        respondentJobType: 'all',
        required: false,
        options: []
      });
    }
  }, [isQuestionModalOpen, editingQuestion, availableInstruments]);

  const handleClose = () => {
    setQuestionModalOpen(false);
    setEditingQuestion(null);
  };

  const handleTypeChange = (newType: QuestionType) => {
    setFormData(prev => ({
      ...prev,
      type: newType,
      options: (newType === 'multiple_choice' || newType === 'checkbox' || newType === 'dropdown') 
        ? (prev.options.length > 0 ? prev.options : [{ id: 'opt1', text: '', value: '' }])
        : []
    }));
  };

  const addOption = () => {
    const newOptionId = `opt${formData.options.length + 1}`;
    setFormData(prev => ({
      ...prev,
      options: [...prev.options, { id: newOptionId, text: '', value: '' }]
    }));
  };

  const updateOption = (index: number, field: 'text' | 'value', value: string) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.map((option, i) => 
        i === index ? { ...option, [field]: value } : option
      )
    }));
  };

  const removeOption = (index: number) => {
    setFormData(prev => ({
      ...prev,
      options: prev.options.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim() || !formData.instrumentId) {
      alert('Please fill in all required fields');
      return;
    }

    // Validate options for choice-type questions
    if (['multiple_choice', 'checkbox', 'dropdown'].includes(formData.type)) {
      if (formData.options.length === 0 || formData.options.some(opt => !opt.text.trim())) {
        alert('Please add at least one option with text for choice-type questions');
        return;
      }
    }

    const questionData = {
      title: formData.title,
      type: formData.type,
      instrumentId: formData.instrumentId,
      respondentJobType: formData.respondentJobType,
      required: formData.required,
      options: ['multiple_choice', 'checkbox', 'dropdown'].includes(formData.type) ? formData.options : undefined
    };

    if (isEditing && editingQuestion) {
      updateQuestion(surveyId, {
        ...editingQuestion,
        ...questionData
      });
    } else {
      addQuestion(surveyId, questionData);
    }

    handleClose();
  };

  const needsOptions = ['multiple_choice', 'checkbox', 'dropdown'].includes(formData.type);

  return (
    <Dialog open={isQuestionModalOpen} onClose={handleClose} className="relative z-50">
      <div className="fixed inset-0 bg-black bg-opacity-25" />
      
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-2xl w-full bg-white rounded-lg shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <Dialog.Title className="text-lg font-semibold text-gray-900">
                {isEditing ? 'Edit Question' : 'Add New Question'}
              </Dialog.Title>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Question Text */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Enter your question..."
                  required
                />
              </div>

              {/* Question Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => handleTypeChange(e.target.value as QuestionType)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {questionTypeOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Instrument */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instrument <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.instrumentId}
                  onChange={(e) => setFormData(prev => ({ ...prev, instrumentId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="">Select an instrument...</option>
                  {availableInstruments.map(instrument => (
                    <option key={instrument.id} value={instrument.id}>
                      {'  '.repeat(instrument.level - 1) + instrument.code} - {instrument.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Respondent Job Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Respondent Job Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.respondentJobType}
                  onChange={(e) => setFormData(prev => ({ ...prev, respondentJobType: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {respondentJobTypes.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Required Toggle */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="required"
                  checked={formData.required}
                  onChange={(e) => setFormData(prev => ({ ...prev, required: e.target.checked }))}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="required" className="ml-2 block text-sm text-gray-700">
                  Required question
                </label>
              </div>

              {/* Options for choice-type questions */}
              {needsOptions && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Options <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={addOption}
                      className="flex items-center text-sm text-blue-600 hover:text-blue-700"
                    >
                      <PlusIcon className="h-4 w-4 mr-1" />
                      Add Option
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    {formData.options.map((option, index) => (
                      <div key={option.id} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={option.text}
                          onChange={(e) => updateOption(index, 'text', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder={`Option ${index + 1}`}
                        />
                        <input
                          type="text"
                          value={option.value}
                          onChange={(e) => updateOption(index, 'value', e.target.value)}
                          className="w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Value"
                        />
                        {formData.options.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeOption(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {isEditing ? 'Update Question' : 'Add Question'}
                </button>
              </div>
            </form>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
}; 