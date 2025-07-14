import { create } from 'zustand';

export interface PostSubmitInfo {
  id: string;
  title: string;
  description: string;
  selectedSurveyIds: string[]; // Changed from selectedSurveyId to selectedSurveyIds array
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Legacy interface for migration
interface LegacyPostSubmitInfo {
  id: string;
  title: string;
  description: string;
  selectedSurveyId: string; // Old format
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PostSubmitState {
  postSubmitInfo: PostSubmitInfo | null;
  isLoading: boolean;
  
  // Actions
  setPostSubmitInfo: (info: PostSubmitInfo) => void;
  setLoading: (loading: boolean) => void;
  savePostSubmitInfo: (data: Omit<PostSubmitInfo, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  loadPostSubmitInfo: () => Promise<void>;
}

// Migration function to convert legacy format to new format
const migrateLegacyData = (data: any): PostSubmitInfo => {
  if (data.selectedSurveyId && !data.selectedSurveyIds) {
    // Convert legacy format
    return {
      ...data,
      selectedSurveyIds: data.selectedSurveyId ? [data.selectedSurveyId] : [],
      selectedSurveyId: undefined
    };
  }
  return data;
};

export const usePostSubmitStore = create<PostSubmitState>((set, get) => ({
  postSubmitInfo: null,
  isLoading: false,
  
  setPostSubmitInfo: (info) => set({ postSubmitInfo: info }),
  
  setLoading: (loading) => set({ isLoading: loading }),
  
  savePostSubmitInfo: async (data) => {
    set({ isLoading: true });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const now = new Date().toISOString();
      const postSubmitInfo: PostSubmitInfo = {
        id: '1',
        ...data,
        createdAt: get().postSubmitInfo?.createdAt || now,
        updatedAt: now
      };
      
      // Save to localStorage for demonstration
      localStorage.setItem('postSubmitInfo', JSON.stringify(postSubmitInfo));
      
      set({ postSubmitInfo });
    } catch (error) {
      console.error('Error saving post-submit info:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  
  loadPostSubmitInfo: async () => {
    set({ isLoading: true });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const savedData = localStorage.getItem('postSubmitInfo');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        const migratedData = migrateLegacyData(parsedData);
        set({ postSubmitInfo: migratedData });
      }
    } catch (error) {
      console.error('Error loading post-submit info:', error);
    } finally {
      set({ isLoading: false });
    }
  }
})); 