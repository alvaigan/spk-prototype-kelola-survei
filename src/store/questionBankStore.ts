import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { QuestionType } from '../types/question';

export interface QuestionBankItem {
  id: string;
  question: string;
  questionType: QuestionType;
  createdAt: string;
  updatedAt: string;
}

interface QuestionBankStore {
  questions: QuestionBankItem[];
  isLoading: boolean;
  
  // CRUD operations
  addQuestion: (question: Omit<QuestionBankItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateQuestion: (id: string, updates: Partial<Omit<QuestionBankItem, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  deleteQuestion: (id: string) => void;
  getQuestion: (id: string) => QuestionBankItem | undefined;
  
  // Bulk operations
  importQuestions: (questions: Omit<QuestionBankItem, 'id' | 'createdAt' | 'updatedAt'>[]) => void;
  clearAllQuestions: () => void;
  
  // Utility functions
  setLoading: (loading: boolean) => void;
  searchQuestions: (query: string) => QuestionBankItem[];
  getQuestionsByType: (type: QuestionType) => QuestionBankItem[];
}

export const useQuestionBankStore = create<QuestionBankStore>()(
  persist(
    (set, get) => ({
      questions: [],
      isLoading: false,
      
      addQuestion: (questionData) => {
        const newQuestion: QuestionBankItem = {
          id: `question_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          ...questionData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        set((state) => ({
          questions: [...state.questions, newQuestion],
        }));
      },
      
      updateQuestion: (id, updates) => {
        set((state) => ({
          questions: state.questions.map((question) =>
            question.id === id
              ? { ...question, ...updates, updatedAt: new Date().toISOString() }
              : question
          ),
        }));
      },
      
      deleteQuestion: (id) => {
        set((state) => ({
          questions: state.questions.filter((question) => question.id !== id),
        }));
      },
      
      getQuestion: (id) => {
        return get().questions.find((question) => question.id === id);
      },
      
      importQuestions: (questionsData) => {
        const newQuestions: QuestionBankItem[] = questionsData.map((data) => ({
          id: `question_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          ...data,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }));
        
        set((state) => ({
          questions: [...state.questions, ...newQuestions],
        }));
      },
      
      clearAllQuestions: () => {
        set({ questions: [] });
      },
      
      setLoading: (loading) => {
        set({ isLoading: loading });
      },
      
      searchQuestions: (query) => {
        const { questions } = get();
        if (!query.trim()) return questions;
        
        const searchTerm = query.toLowerCase();
        return questions.filter((question) =>
          question.question.toLowerCase().includes(searchTerm) ||
          question.questionType.toLowerCase().includes(searchTerm)
        );
      },
      
      getQuestionsByType: (type) => {
        const { questions } = get();
        return questions.filter((question) => question.questionType === type);
      },
    }),
    {
      name: 'question-bank-storage',
      version: 1,
      migrate: (persistedState: unknown, version: number) => {
        if (version === 0) {
          // Handle migration from version 0 to 1 if needed
          const oldState = persistedState as Record<string, unknown>;
          return {
            ...oldState,
            questions: (oldState.questions as QuestionBankItem[]) || [],
            isLoading: false,
          };
        }
        return persistedState as QuestionBankStore;
      },
    }
  )
); 