import { create } from 'zustand';
import { Survey, CreateSurveyData, Question } from '@/types/survey';

interface SurveyState {
  surveys: Survey[];
  currentSurvey: Survey | null;
  isLoading: boolean;
  isCreateModalOpen: boolean;
  isQuestionModalOpen: boolean;
  editingQuestion: Question | null;
  searchTerm: string;
  statusFilter: 'all' | 'Aktif' | 'Nonaktif';
  
  // Actions
  setSurveys: (surveys: Survey[]) => void;
  setCurrentSurvey: (survey: Survey | null) => void;
  setLoading: (loading: boolean) => void;
  setCreateModalOpen: (open: boolean) => void;
  setQuestionModalOpen: (open: boolean) => void;
  setEditingQuestion: (question: Question | null) => void;
  setSearchTerm: (term: string) => void;
  setStatusFilter: (status: 'all' | 'Aktif' | 'Nonaktif') => void;
  createSurvey: (data: CreateSurveyData) => void;
  updateSurveyStatus: (id: string, status: 'Aktif' | 'Nonaktif') => void;
  deleteSurvey: (id: string) => void;
  addQuestion: (surveyId: string, question: Omit<Question, 'id' | 'questionNumber'>) => void;
  updateQuestion: (surveyId: string, question: Question) => void;
  deleteQuestion: (surveyId: string, questionId: string) => void;
  moveQuestionUp: (surveyId: string, questionId: string) => void;
  moveQuestionDown: (surveyId: string, questionId: string) => void;
  getFilteredSurveys: () => Survey[];
}

// Mock instrument structure for Survey 1
const mockInstrumentStructure = [
  {
    id: 'inst-1',
    code: 'L1001',
    name: 'Data Demografi',
    level: 1 as const,
    children: [
      {
        id: 'inst-1-1',
        code: 'L1001.201',
        name: 'Informasi Personal',
        level: 2 as const,
        parentId: 'inst-1',
        children: []
      },
      {
        id: 'inst-1-2',
        code: 'L1001.202',
        name: 'Lokasi Geografis',
        level: 2 as const,
        parentId: 'inst-1',
        children: []
      }
    ]
  },
  {
    id: 'inst-2',
    code: 'L1002',
    name: 'Evaluasi Layanan',
    level: 1 as const,
    children: [
      {
        id: 'inst-2-1',
        code: 'L1002.201',
        name: 'Pengalaman Pengguna',
        level: 2 as const,
        parentId: 'inst-2',
        children: []
      },
      {
        id: 'inst-2-2',
        code: 'L1002.202',
        name: 'Fitur yang Digunakan',
        level: 2 as const,
        parentId: 'inst-2',
        children: []
      }
    ]
  }
];

// Mock questions for Survey 1 - linked to instruments (at least 3 per instrument)
const mockQuestions: Question[] = [
  // Informasi Personal (inst-1-1) - 3 questions
  {
    id: 'q1',
    instrumentId: 'inst-1-1',
    questionNumber: 1,
    title: 'Nama lengkap',
    type: 'short_answer',
    required: true,
    respondentJobType: 'all'
  },
  {
    id: 'q2',
    instrumentId: 'inst-1-1',
    questionNumber: 2,
    title: 'Jenis kelamin',
    type: 'multiple_choice',
    required: true,
    respondentJobType: 'all',
    options: [
      { id: 'opt1', text: 'Laki-laki', value: 'male' },
      { id: 'opt2', text: 'Perempuan', value: 'female' }
    ]
  },
  {
    id: 'q3',
    instrumentId: 'inst-1-1',
    questionNumber: 3,
    title: 'Usia Anda saat ini',
    type: 'short_answer',
    required: true,
    respondentJobType: 'all'
  },

  // Lokasi Geografis (inst-1-2) - 3 questions
  {
    id: 'q4',
    instrumentId: 'inst-1-2',
    questionNumber: 4,
    title: 'Pilih kota tempat tinggal Anda',
    type: 'dropdown',
    required: true,
    respondentJobType: 'all',
    options: [
      { id: 'opt1', text: 'Jakarta', value: 'jakarta' },
      { id: 'opt2', text: 'Surabaya', value: 'surabaya' },
      { id: 'opt3', text: 'Bandung', value: 'bandung' },
      { id: 'opt4', text: 'Medan', value: 'medan' }
    ]
  },
  {
    id: 'q5',
    instrumentId: 'inst-1-2',
    questionNumber: 5,
    title: 'Alamat lengkap tempat tinggal',
    type: 'paragraph',
    required: false,
    respondentJobType: 'all'
  },
  {
    id: 'q6',
    instrumentId: 'inst-1-2',
    questionNumber: 6,
    title: 'Sudah berapa lama tinggal di kota tersebut?',
    type: 'multiple_choice',
    required: false,
    respondentJobType: 'all',
    options: [
      { id: 'opt1', text: 'Kurang dari 1 tahun', value: 'less_1' },
      { id: 'opt2', text: '1-5 tahun', value: '1_5' },
      { id: 'opt3', text: '5-10 tahun', value: '5_10' },
      { id: 'opt4', text: 'Lebih dari 10 tahun', value: 'more_10' }
    ]
  },

  // Pengalaman Pengguna (inst-2-1) - 3 questions
  {
    id: 'q7',
    instrumentId: 'inst-2-1',
    questionNumber: 7,
    title: 'Ceritakan pengalaman Anda dengan layanan kami',
    type: 'paragraph',
    required: false,
    respondentJobType: 'all'
  },
  {
    id: 'q8',
    instrumentId: 'inst-2-1',
    questionNumber: 8,
    title: 'Seberapa puas Anda dengan layanan kami?',
    type: 'multiple_choice',
    required: true,
    respondentJobType: 'all',
    options: [
      { id: 'opt1', text: 'Sangat Tidak Puas', value: '1' },
      { id: 'opt2', text: 'Tidak Puas', value: '2' },
      { id: 'opt3', text: 'Netral', value: '3' },
      { id: 'opt4', text: 'Puas', value: '4' },
      { id: 'opt5', text: 'Sangat Puas', value: '5' }
    ]
  },
  {
    id: 'q9',
    instrumentId: 'inst-2-1',
    questionNumber: 9,
    title: 'Apakah Anda akan merekomendasikan layanan kami?',
    type: 'multiple_choice',
    required: true,
    respondentJobType: 'all',
    options: [
      { id: 'opt1', text: 'Ya, pasti', value: 'definitely_yes' },
      { id: 'opt2', text: 'Mungkin ya', value: 'maybe_yes' },
      { id: 'opt3', text: 'Tidak yakin', value: 'unsure' },
      { id: 'opt4', text: 'Mungkin tidak', value: 'maybe_no' },
      { id: 'opt5', text: 'Tidak', value: 'no' }
    ]
  },

  // Fitur yang Digunakan (inst-2-2) - 3 questions
  {
    id: 'q10',
    instrumentId: 'inst-2-2',
    questionNumber: 10,
    title: 'Apa saja fitur yang Anda gunakan dari layanan kami?',
    type: 'checkbox',
    required: false,
    respondentJobType: 'all',
    options: [
      { id: 'opt1', text: 'Pembayaran', value: 'payment' },
      { id: 'opt2', text: 'Pengiriman', value: 'shipping' },
      { id: 'opt3', text: 'Pelacakan', value: 'tracking' },
      { id: 'opt4', text: 'Customer Service', value: 'support' }
    ]
  },
  {
    id: 'q11',
    instrumentId: 'inst-2-2',
    questionNumber: 11,
    title: 'Fitur mana yang paling sering Anda gunakan?',
    type: 'dropdown',
    required: true,
    respondentJobType: 'all',
    options: [
      { id: 'opt1', text: 'Pembayaran', value: 'payment' },
      { id: 'opt2', text: 'Pengiriman', value: 'shipping' },
      { id: 'opt3', text: 'Pelacakan', value: 'tracking' },
      { id: 'opt4', text: 'Customer Service', value: 'support' }
    ]
  },
  {
    id: 'q12',
    instrumentId: 'inst-2-2',
    questionNumber: 12,
    title: 'Fitur apa yang ingin Anda lihat ditambahkan?',
    type: 'paragraph',
    required: false,
    respondentJobType: 'all'
  }
];

// Mock data for development
const mockSurveys: Survey[] = [
  {
    id: '1',
    code: 'SRV001',
    title: 'Survey 1',
    description: 'Description for Survey 1',
    totalQuestions: 12,
    createdAt: '1 Januari 2025 pukul 07:00:00',
    status: 'Aktif',
    instrumentStructure: mockInstrumentStructure,
    questions: mockQuestions
  },
  {
    id: '2',
    code: 'SRV002',
    title: 'Survey 2',
    description: 'Description for Survey 2',
    totalQuestions: 10,
    createdAt: '1 Februari 2025 pukul 07:00:00',
    status: 'Nonaktif',
    instrumentStructure: [],
    questions: []
  },
  {
    id: '3',
    code: 'SRV003',
    title: 'Survey 3',
    description: 'Description for Survey 3',
    totalQuestions: 25,
    createdAt: '1 Maret 2025 pukul 07:00:00',
    status: 'Aktif',
    instrumentStructure: [],
    questions: []
  },
  {
    id: '4',
    code: 'SRV004',
    title: 'Survey 4',
    description: 'Description for Survey 4',
    totalQuestions: 20,
    createdAt: '1 April 2025 pukul 07:00:00',
    status: 'Nonaktif',
    instrumentStructure: [],
    questions: []
  },
  {
    id: '5',
    code: 'SRV005',
    title: 'Survey 5',
    description: 'Description for Survey 5',
    totalQuestions: 17,
    createdAt: '1 Mei 2025 pukul 07:00:00',
    status: 'Aktif',
    instrumentStructure: [],
    questions: []
  }
];

export const useSurveyStore = create<SurveyState>((set, get) => ({
  surveys: mockSurveys,
  currentSurvey: null,
  isLoading: false,
  isCreateModalOpen: false,
  isQuestionModalOpen: false,
  editingQuestion: null,
  searchTerm: '',
  statusFilter: 'all',
  
  setSurveys: (surveys) => set({ surveys }),
  setCurrentSurvey: (survey) => set({ currentSurvey: survey }),
  setLoading: (loading) => set({ isLoading: loading }),
  setCreateModalOpen: (open) => set({ isCreateModalOpen: open }),
  setQuestionModalOpen: (open) => set({ isQuestionModalOpen: open }),
  setEditingQuestion: (question) => set({ editingQuestion: question }),
  setSearchTerm: (term) => set({ searchTerm: term }),
  setStatusFilter: (status) => set({ statusFilter: status }),

  createSurvey: (data) => {
    const newSurvey: Survey = {
      id: Date.now().toString(),
      code: `SRV${String(get().surveys.length + 1).padStart(3, '0')}`,
      title: data.title,
      description: data.description,
      totalQuestions: 0,
      createdAt: new Date().toLocaleString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }),
      status: data.isActive ? 'Aktif' : 'Nonaktif',
      instrumentStructure: data.instrumentStructure
    };
    
    set((state) => ({
      surveys: [...state.surveys, newSurvey],
      isCreateModalOpen: false
    }));
  },

  updateSurveyStatus: (id, status) => {
    set((state) => ({
      surveys: state.surveys.map(survey =>
        survey.id === id ? { ...survey, status } : survey
      )
    }));
  },

  deleteSurvey: (id) => {
    set((state) => ({
      surveys: state.surveys.filter(survey => survey.id !== id)
    }));
  },

  addQuestion: (surveyId, questionData) => {
    set((state) => {
      const surveys = state.surveys.map(survey => {
        if (survey.id === surveyId) {
          const existingQuestions = survey.questions || [];
          const nextQuestionNumber = Math.max(0, ...existingQuestions.map(q => q.questionNumber)) + 1;
          const newQuestion: Question = {
            ...questionData,
            id: `q${Date.now()}`,
            questionNumber: nextQuestionNumber
          };
          
          return {
            ...survey,
            questions: [...existingQuestions, newQuestion],
            totalQuestions: existingQuestions.length + 1
          };
        }
        return survey;
      });
      
      // Update current survey if it's the one being modified
      const currentSurvey = state.currentSurvey?.id === surveyId 
        ? surveys.find(s => s.id === surveyId) || null
        : state.currentSurvey;
      
      return { surveys, currentSurvey };
    });
  },
  
  updateQuestion: (surveyId, updatedQuestion) => {
    set((state) => {
      const surveys = state.surveys.map(survey => {
        if (survey.id === surveyId) {
          const questions = (survey.questions || []).map(question =>
            question.id === updatedQuestion.id ? updatedQuestion : question
          );
          return { ...survey, questions };
        }
        return survey;
      });
      
      // Update current survey if it's the one being modified
      const currentSurvey = state.currentSurvey?.id === surveyId 
        ? surveys.find(s => s.id === surveyId) || null
        : state.currentSurvey;
      
      return { surveys, currentSurvey };
    });
  },
  
  deleteQuestion: (surveyId, questionId) => {
    set((state) => {
      const surveys = state.surveys.map(survey => {
        if (survey.id === surveyId) {
          const questions = (survey.questions || []).filter(q => q.id !== questionId);
          // Reorder question numbers after deletion
          const reorderedQuestions = questions
            .sort((a, b) => a.questionNumber - b.questionNumber)
            .map((q, index) => ({ ...q, questionNumber: index + 1 }));
          
          return { 
            ...survey, 
            questions: reorderedQuestions,
            totalQuestions: reorderedQuestions.length
          };
        }
        return survey;
      });
      
      // Update current survey if it's the one being modified
      const currentSurvey = state.currentSurvey?.id === surveyId 
        ? surveys.find(s => s.id === surveyId) || null
        : state.currentSurvey;
      
      return { surveys, currentSurvey };
    });
  },

  moveQuestionUp: (surveyId, questionId) => {
    set((state) => {
      const surveys = state.surveys.map(survey => {
        if (survey.id === surveyId) {
          const questions = [...(survey.questions || [])];
          const questionIndex = questions.findIndex(q => q.id === questionId);
          
          if (questionIndex > 0) {
            // Swap with previous question
            [questions[questionIndex - 1], questions[questionIndex]] = 
            [questions[questionIndex], questions[questionIndex - 1]];
            
            // Update question numbers
            questions[questionIndex - 1].questionNumber = questionIndex;
            questions[questionIndex].questionNumber = questionIndex + 1;
          }
          
          return { ...survey, questions };
        }
        return survey;
      });
      
      // Update current survey if it's the one being modified
      const currentSurvey = state.currentSurvey?.id === surveyId 
        ? surveys.find(s => s.id === surveyId) || null
        : state.currentSurvey;
      
      return { surveys, currentSurvey };
    });
  },

  moveQuestionDown: (surveyId, questionId) => {
    set((state) => {
      const surveys = state.surveys.map(survey => {
        if (survey.id === surveyId) {
          const questions = [...(survey.questions || [])];
          const questionIndex = questions.findIndex(q => q.id === questionId);
          
          if (questionIndex < questions.length - 1) {
            // Swap with next question
            [questions[questionIndex], questions[questionIndex + 1]] = 
            [questions[questionIndex + 1], questions[questionIndex]];
            
            // Update question numbers
            questions[questionIndex].questionNumber = questionIndex + 1;
            questions[questionIndex + 1].questionNumber = questionIndex + 2;
          }
          
          return { ...survey, questions };
        }
        return survey;
      });
      
      // Update current survey if it's the one being modified
      const currentSurvey = state.currentSurvey?.id === surveyId 
        ? surveys.find(s => s.id === surveyId) || null
        : state.currentSurvey;
      
      return { surveys, currentSurvey };
    });
  },

  getFilteredSurveys: () => {
    const { surveys, searchTerm, statusFilter } = get();
    return surveys.filter(survey => {
      const matchesSearch = survey.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           survey.code.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || survey.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }
})); 