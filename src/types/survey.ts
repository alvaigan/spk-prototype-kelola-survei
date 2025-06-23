import { Question } from './question';

export interface Survey {
  id: string;
  code: string;
  title: string;
  description: string;
  totalQuestions: number;
  createdAt: string;
  status: 'Aktif' | 'Nonaktif';
  instrumentStructure: InstrumentLevel[];
  questions?: Question[];
}

// Re-export question types for convenience
export type { Question, QuestionOption, QuestionType, QuestionsByInstrument } from './question';

export interface InstrumentLevel {
  id: string;
  code: string;
  name: string;
  level: 1 | 2 | 3;
  parentId?: string;
  children: InstrumentLevel[];
}

export interface CreateSurveyData {
  title: string;
  description: string;
  isActive: boolean;
  instrumentStructure: InstrumentLevel[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'superadmin' | 'pengelola';
}

export interface Respondent {
  id: string;
  name: string;
  email: string;
  surveyForm: string;
  verificationStatus: 'Belum Verifikasi' | 'Terverifikasi';
  submittedAt: string;
  verifiedAt?: string;
  responses?: Record<string, unknown>;
  surveyId?: string;
}

export interface RespondentResponse {
  id: string;
  respondentId: string;
  questionId: string;
  answer: string | string[] | number;
  createdAt: string;
} 