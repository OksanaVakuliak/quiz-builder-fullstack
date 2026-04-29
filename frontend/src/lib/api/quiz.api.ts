import { ApiResponse } from '@/types/api.types';
import { CreateQuizPayload, Quiz, QuizSummary } from '@/types/quiz.types';
import { apiClient } from './client';

export const quizApi = {
  async getAll(): Promise<QuizSummary[]> {
    const response = await apiClient.get<ApiResponse<QuizSummary[]>>('/quizzes');
    return response.data.data;
  },

  async getById(id: number): Promise<Quiz> {
    const response = await apiClient.get<ApiResponse<Quiz>>(`/quizzes/${id}`);
    return response.data.data;
  },

  async create(payload: CreateQuizPayload): Promise<Quiz> {
    const response = await apiClient.post<ApiResponse<Quiz>>('/quizzes', payload);
    return response.data.data;
  },

  async remove(id: number): Promise<void> {
    await apiClient.delete(`/quizzes/${id}`);
  },
};
