export type QuestionType = 'short_answer' | 'paragraph' | 'multiple_choice' | 'checkbox' | 'dropdown';

export interface QuestionOption {
  id: string;
  text: string;
  value: string;
}

export interface Question {
  id: string;
  instrumentId: string; // Links to instrument structure
  questionNumber: number;
  title: string;
  type: QuestionType;
  required: boolean;
  options?: QuestionOption[]; // For multiple choice, checkbox, dropdown
  placeholder?: string;
  respondentJobType: string; // Job type filter for respondents
}

export interface QuestionsByInstrument {
  [instrumentId: string]: Question[];
} 