import api from './api';

export interface Job {
  id: number;
  company: number;
  company_name?: string;
  company_slug?: string;
  title: string;
  description: string;
  location: string;
  work_policy: 'remote' | 'hybrid' | 'onsite';
  department?: string;
  employment_type: 'full-time' | 'part-time' | 'contract';
  job_type?: 'full-time' | 'part-time' | 'contract'; // Backward compatibility
  experience?: 'junior' | 'mid-level' | 'senior';
  salary_range?: string;
  posted_date: string;
}

export interface JobPublic {
  id: number;
  company: {
    id: number;
    slug: string;
    name: string;
    primary_color: string;
    secondary_color: string;
    logo_url?: string;
    banner_url?: string;
    culture_video_url?: string;
  };
  title: string;
  description: string;
  location: string;
  work_policy: 'remote' | 'hybrid' | 'onsite';
  department?: string;
  employment_type: 'full-time' | 'part-time' | 'contract';
  job_type?: 'full-time' | 'part-time' | 'contract'; // Backward compatibility
  experience?: 'junior' | 'mid-level' | 'senior';
  salary_range?: string;
  posted_date: string;
}

export interface JobFilters {
  location?: string;
  employment_type?: string;
  job_type?: string; // Backward compatibility
  work_policy?: string;
  experience?: string;
  department?: string;
  search?: string;
}

export const jobService = {
  async getJobs(): Promise<Job[]> {
    const response = await api.get<Job[]>('/jobs/');
    return response.data;
  },

  async createJob(data: Omit<Job, 'id' | 'posted_date' | 'company_name' | 'company_slug'>): Promise<Job> {
    const response = await api.post<Job>('/jobs/', data);
    return response.data;
  },

  async updateJob(id: number, data: Partial<Job>): Promise<Job> {
    const response = await api.put<Job>(`/jobs/${id}/`, data);
    return response.data;
  },

  async deleteJob(id: number): Promise<void> {
    await api.delete(`/jobs/${id}/`);
  },

  async getPublicJobs(companySlug: string, filters?: JobFilters): Promise<JobPublic[]> {
    const params = new URLSearchParams();
    params.append('company', companySlug);
    
    // Only add non-empty filter values
    if (filters?.location && filters.location.trim()) {
      params.append('location', filters.location.trim());
    }
    if (filters?.employment_type && filters.employment_type.trim()) {
      params.append('employment_type', filters.employment_type.trim());
    }
    if (filters?.work_policy && filters.work_policy.trim()) {
      params.append('work_policy', filters.work_policy.trim());
    }
    if (filters?.experience && filters.experience.trim()) {
      params.append('experience', filters.experience.trim());
    }
    if (filters?.department && filters.department.trim()) {
      params.append('department', filters.department.trim());
    }
    if (filters?.search && filters.search.trim()) {
      params.append('search', filters.search.trim());
    }

    const response = await api.get<JobPublic[]>(`/jobs/public/?${params.toString()}`);
    return response.data;
  },
};

