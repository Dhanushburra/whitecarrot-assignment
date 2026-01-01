import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Company } from '../services/company';
import { jobService, Job } from '../services/jobs';
import { Plus, Trash2, Edit2 } from 'lucide-react';

interface JobsEditorProps {
  company: Company;
}

const JobsEditor = ({ company: _company }: JobsEditorProps) => {
  const [showModal, setShowModal] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const queryClient = useQueryClient();

  const { data: jobs = [], isLoading, error } = useQuery({
    queryKey: ['jobs'],
    queryFn: () => jobService.getJobs(),
    retry: 1,
  });

  const createMutation = useMutation({
    mutationFn: jobService.createJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      setShowModal(false);
    },
    onError: (error) => {
      console.error('Error creating job:', error);
      alert('Failed to create job. Please try again.');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Job> }) =>
      jobService.updateJob(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
      setEditingJob(null);
      setShowModal(false);
    },
    onError: (error) => {
      console.error('Error updating job:', error);
      alert('Failed to update job. Please try again.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: jobService.deleteJob,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    },
    onError: (error) => {
      console.error('Error deleting job:', error);
      alert('Failed to delete job. Please try again.');
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const data: Partial<Job> = {
      title: formData.get('title') as string,
      location: formData.get('location') as string,
      work_policy: formData.get('work_policy') as Job['work_policy'],
      employment_type: formData.get('employment_type') as Job['employment_type'],
    };
    
    // Only include optional fields if they have values
    const description = formData.get('description') as string;
    if (description && description.trim()) {
      data.description = description.trim();
    }
    
    const department = formData.get('department') as string;
    if (department && department.trim()) {
      data.department = department.trim();
    }
    
    const experience = formData.get('experience') as string;
    if (experience && experience.trim()) {
      data.experience = experience as Job['experience'];
    }
    
    const salaryRange = formData.get('salary_range') as string;
    if (salaryRange && salaryRange.trim()) {
      data.salary_range = salaryRange.trim();
    }
    
    const postedDate = formData.get('posted_date') as string;
    if (postedDate && postedDate.trim()) {
      data.posted_date = postedDate.trim();
    } else {
      data.posted_date = 'Just now';
    }

    if (editingJob) {
      updateMutation.mutate({ id: editingJob.id, data });
    } else {
      createMutation.mutate(data as any);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-center py-8">
          <div className="text-lg text-gray-600">Loading jobs...</div>
        </div>
      </div>
    );
  }

  if (error) {
    const errorMessage = (error as any)?.response?.data?.error || 
                         (error as any)?.message || 
                         'Unknown error occurred';
    
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-center py-8">
          <div className="text-red-600 mb-4">
            <p className="font-semibold mb-2">Error loading jobs</p>
            <p className="text-sm text-gray-600">{errorMessage}</p>
          </div>
          <button
            onClick={() => queryClient.invalidateQueries({ queryKey: ['jobs'] })}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Jobs</h2>
        <button
          onClick={() => {
            setEditingJob(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Add Job
        </button>
      </div>

      {jobs.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          No jobs yet. Add your first job posting!
        </p>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="border border-gray-200 rounded-lg p-4 flex items-start justify-between"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-lg">{job.title}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-2">{job.location}</p>
                <p className="text-sm text-gray-500">
                  {job.employment_type || job.job_type} • {job.work_policy} • {job.department || 'No department'}
                  {job.experience && ` • ${job.experience}`}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingJob(job);
                    setShowModal(true);
                  }}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this job?')) {
                      deleteMutation.mutate(job.id);
                    }
                  }}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-4">
              {editingJob ? 'Edit Job' : 'Add Job'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Title
                </label>
                <input
                  type="text"
                  name="title"
                  defaultValue={editingJob?.title || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  name="description"
                  defaultValue={editingJob?.description || ''}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    defaultValue={editingJob?.location || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Work Policy
                  </label>
                  <select
                    name="work_policy"
                    defaultValue={editingJob?.work_policy || 'onsite'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="remote">Remote</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="onsite">Onsite</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employment Type
                  </label>
                  <select
                    name="employment_type"
                    defaultValue={editingJob?.employment_type || editingJob?.job_type || 'full-time'}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="full-time">Full Time</option>
                    <option value="part-time">Part Time</option>
                    <option value="contract">Contract</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience Level
                  </label>
                  <select
                    name="experience"
                    defaultValue={editingJob?.experience || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select experience level</option>
                    <option value="senior">Senior</option>
                    <option value="junior">Junior</option>
                    <option value="mid-level">Mid-level</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department
                  </label>
                  <input
                    type="text"
                    name="department"
                    defaultValue={editingJob?.department || ''}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Salary Range
                  </label>
                  <input
                    type="text"
                    name="salary_range"
                    defaultValue={editingJob?.salary_range || ''}
                    placeholder="e.g., $50k - $80k"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Posted Date (e.g., "20 days ago", "Just now", "1 week ago")
                </label>
                <input
                  type="text"
                  name="posted_date"
                  defaultValue={editingJob?.posted_date || 'Just now'}
                  placeholder="e.g., 20 days ago"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {editingJob ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingJob(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobsEditor;

