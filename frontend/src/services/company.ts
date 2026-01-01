import api from './api';

export interface Company {
  id: number;
  slug: string;
  name: string;
  primary_color: string;
  secondary_color: string;
  logo?: string;
  logo_url?: string;
  banner?: string;
  banner_url?: string;
  culture_video_url?: string;
  created_at: string;
  updated_at: string;
}

export interface CompanyPublic {
  id: number;
  slug: string;
  name: string;
  primary_color: string;
  secondary_color: string;
  logo_url?: string;
  banner_url?: string;
  culture_video_url?: string;
}

export const companyService = {
  async getMyCompany(): Promise<Company> {
    const response = await api.get<Company>('/companies/me/');
    return response.data;
  },

  async createCompany(name: string): Promise<Company> {
    const response = await api.post<Company>('/companies/me/', { name });
    return response.data;
  },

  async updateCompany(data: Partial<Company>): Promise<Company> {
    const formData = new FormData();
    
    Object.keys(data).forEach((key) => {
      const value = data[key as keyof Company];
      if (value !== undefined && value !== null) {
        if (key === 'logo' || key === 'banner') {
          // Check if value is a File object
          const fileValue = value as unknown;
          if (fileValue instanceof File) {
            formData.append(key, fileValue);
          }
        } else {
          formData.append(key, String(value));
        }
      }
    });

    const response = await api.put<Company>('/companies/me/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async getPublicCompany(slug: string): Promise<CompanyPublic> {
    const response = await api.get<CompanyPublic>(`/companies/${slug}/public/`);
    return response.data;
  },
};

