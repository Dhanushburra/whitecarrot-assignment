import api from './api';

export type SectionType = 'about' | 'life' | 'benefits' | 'values' | 'mission' | 'custom';

export interface ContentSection {
  id: number;
  company: number;
  company_name?: string;
  company_slug?: string;
  section_type: SectionType;
  title: string;
  content: string;
  order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContentSectionPublic {
  id: number;
  section_type: SectionType;
  title: string;
  content: string;
  order: number;
}

export const contentService = {
  async getSections(): Promise<ContentSection[]> {
    const response = await api.get<ContentSection[]>('/content/');
    return response.data;
  },

  async createSection(data: Omit<ContentSection, 'id' | 'created_at' | 'updated_at' | 'company_name' | 'company_slug'>): Promise<ContentSection> {
    const response = await api.post<ContentSection>('/content/', data);
    return response.data;
  },

  async updateSection(id: number, data: Partial<ContentSection>): Promise<ContentSection> {
    const response = await api.put<ContentSection>(`/content/${id}/`, data);
    return response.data;
  },

  async deleteSection(id: number): Promise<void> {
    await api.delete(`/content/${id}/`);
  },

  async reorderSections(sectionIds: number[]): Promise<ContentSection[]> {
    const response = await api.post<ContentSection[]>('/content/reorder/', {
      section_ids: sectionIds,
    });
    return response.data;
  },

  async getPublicSections(companySlug: string): Promise<ContentSectionPublic[]> {
    const response = await api.get<ContentSectionPublic[]>(`/content/public/?company=${companySlug}`);
    return response.data;
  },
};

