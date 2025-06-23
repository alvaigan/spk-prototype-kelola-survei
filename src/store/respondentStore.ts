import { create } from 'zustand';
import { Respondent } from '@/types/survey';

interface RespondentStore {
  respondents: Respondent[];
  addRespondent: (respondent: Respondent) => void;
  updateRespondentStatus: (id: string, status: 'Belum Verifikasi' | 'Terverifikasi') => void;
  getIncomingResponses: () => Respondent[];
  getVerifiedResponses: () => Respondent[];
}

// Initial mock data
const initialRespondents: Respondent[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@email.com',
    surveyForm: 'Survei Kepuasan Pelanggan 2024',
    verificationStatus: 'Belum Verifikasi',
    submittedAt: '2024-12-10T08:30:00Z',
    surveyId: '1',
    responses: {
      userInfo: {
        email: 'john.doe@email.com',
        birthDate: '1990-05-15'
      },
      'q1': 'Sangat puas dengan layanan yang diberikan',
      'q2': 'Pelayanan cepat dan ramah',
      'q3': 'option1',
      'q4': ['option1', 'option3'],
      'q5': 'option2',
      'q6': 'Ya, saya akan merekomendasikan kepada teman',
      'q7': 'option3',
      'q8': 'Terima kasih atas layanan yang excellent!'
    }
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@email.com',
    surveyForm: 'Survei Kualitas Layanan',
    verificationStatus: 'Terverifikasi',
    submittedAt: '2024-12-09T14:20:00Z',
    verifiedAt: '2024-12-09T15:45:00Z',
    surveyId: '1',
    responses: {
      userInfo: {
        email: 'jane.smith@email.com',
        birthDate: '1985-08-22'
      },
      'q1': 'Layanan memuaskan secara keseluruhan',
      'q2': 'Staff sangat membantu dan profesional',
      'q3': 'option2',
      'q4': ['option2'],
      'q5': 'option1',
      'q6': 'Mungkin, tergantung situasi',
      'q7': 'option2',
      'q8': 'Semoga terus ditingkatkan kualitasnya'
    }
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob.johnson@email.com',
    surveyForm: 'Survei Kepuasan Pelanggan 2024',
    verificationStatus: 'Belum Verifikasi',
    submittedAt: '2024-12-08T10:15:00Z',
    surveyId: '1',
    responses: {
      userInfo: {
        email: 'bob.johnson@email.com',
        birthDate: '1992-12-03'
      },
      'q1': 'Cukup baik, masih ada yang perlu diperbaiki',
      'q2': 'Waktu tunggu agak lama tapi hasil memuaskan',
      'q3': 'option3',
      'q4': ['option1', 'option2', 'option3'],
      'q5': 'option3',
      'q6': 'Belum tentu, perlu evaluasi lebih lanjut',
      'q7': 'option1',
      'q8': 'Harap tingkatkan kecepatan pelayanan'
    }
  },
  {
    id: '4',
    name: 'Alice Brown',
    email: 'alice.brown@email.com',
    surveyForm: 'Survei Evaluasi Program',
    verificationStatus: 'Terverifikasi',
    submittedAt: '2024-12-07T16:45:00Z',
    verifiedAt: '2024-12-07T17:30:00Z',
    surveyId: '1',
    responses: {
      userInfo: {
        email: 'alice.brown@email.com',
        birthDate: '1988-03-10'
      },
      'q1': 'Program sangat bermanfaat dan informatif',
      'q2': 'Materi disajikan dengan baik dan mudah dipahami',
      'q3': 'option1',
      'q4': ['option1', 'option2'],
      'q5': 'option1',
      'q6': 'Tentu saja, program ini sangat recommended',
      'q7': 'option1',
      'q8': 'Lanjutkan program serupa di masa depan!'
    }
  },
];

export const useRespondentStore = create<RespondentStore>((set, get) => ({
  respondents: initialRespondents,
  
  addRespondent: (respondent: Respondent) => {
    set((state) => ({
      respondents: [...state.respondents, respondent]
    }));
  },
  
  updateRespondentStatus: (id: string, status: 'Belum Verifikasi' | 'Terverifikasi') => {
    set((state) => ({
      respondents: state.respondents.map((respondent) =>
        respondent.id === id
          ? {
              ...respondent,
              verificationStatus: status,
              verifiedAt: status === 'Terverifikasi' ? new Date().toISOString() : undefined
            }
          : respondent
      )
    }));
  },
  
  getIncomingResponses: () => {
    return get().respondents.filter(r => r.verificationStatus === 'Belum Verifikasi');
  },
  
  getVerifiedResponses: () => {
    return get().respondents.filter(r => r.verificationStatus === 'Terverifikasi');
  }
})); 