import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { companyService } from '../services/company';
import { contentService } from '../services/content';
import { jobService, JobFilters } from '../services/jobs';
import { Search, MapPin, Briefcase, Filter } from 'lucide-react';

const PublicCareersPage = () => {
  const { companySlug } = useParams<{ companySlug: string }>();
  const [filters, setFilters] = useState<JobFilters>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const { data: company, isLoading: companyLoading } = useQuery({
    queryKey: ['company', 'public', companySlug],
    queryFn: () => companyService.getPublicCompany(companySlug!),
    enabled: !!companySlug,
  });

  const { data: sections = [] } = useQuery({
    queryKey: ['content-sections', 'public', companySlug],
    queryFn: () => contentService.getPublicSections(companySlug!),
    enabled: !!companySlug,
  });

  // Build filter object properly - only include non-empty values
  const activeFilters: JobFilters = {};
  
  if (filters.location?.trim()) {
    activeFilters.location = filters.location.trim();
  }
  if (filters.employment_type?.trim()) {
    activeFilters.employment_type = filters.employment_type.trim();
  }
  if (filters.work_policy?.trim()) {
    activeFilters.work_policy = filters.work_policy.trim();
  }
  if (filters.experience?.trim()) {
    activeFilters.experience = filters.experience.trim();
  }
  if (filters.department?.trim()) {
    activeFilters.department = filters.department.trim();
  }
  if (searchQuery?.trim()) {
    activeFilters.search = searchQuery.trim();
  }

  const { data: jobs = [], isLoading: jobsLoading } = useQuery({
    queryKey: ['jobs', 'public', companySlug, activeFilters],
    queryFn: () => jobService.getPublicJobs(companySlug!, activeFilters),
    enabled: !!companySlug,
  });

  const handleFilterChange = (key: keyof JobFilters, value: string) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      if (value && value.trim()) {
        newFilters[key] = value.trim();
      } else {
        // Remove the filter if empty
        delete newFilters[key];
      }
      return newFilters;
    });
  };

  const clearFilters = () => {
    setFilters({});
    setSearchQuery('');
  };

  if (companyLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Company not found</h1>
          <p className="text-gray-600">The careers page you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const primaryColor = company.primary_color || '#000000';
  const secondaryColor = company.secondary_color || '#FFFFFF';

  return (
    <div className="min-h-screen" style={{ backgroundColor: secondaryColor }}>
      {/* Banner */}
      {company.banner_url && (
        <div className="w-full h-64 md:h-96 relative">
          <img
            src={company.banner_url}
            alt={company.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Header */}
      <header
        className="py-12 px-4 sm:px-6 lg:px-8"
        style={{ backgroundColor: primaryColor, color: secondaryColor }}
      >
        <div className="max-w-7xl mx-auto text-center">
          {company.logo_url && (
            <img
              src={company.logo_url}
              alt={company.name}
              className="h-20 mx-auto mb-6"
            />
          )}
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{company.name}</h1>
          <p className="text-xl opacity-90">Join our team</p>
        </div>
      </header>

      {/* Culture Video */}
      {company.culture_video_url && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
            <iframe
              src={company.culture_video_url.replace('watch?v=', 'embed/')}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* Content Sections */}
      {sections.length > 0 && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
          {sections.map((section) => (
            <section key={section.id} className="prose max-w-none">
              <h2 className="text-3xl font-bold mb-4" style={{ color: primaryColor }}>
                {section.title}
              </h2>
              <div
                className="text-gray-700 whitespace-pre-line"
                dangerouslySetInnerHTML={{ __html: section.content.replace(/\n/g, '<br />') }}
              />
            </section>
          ))}
        </div>
      )}

      {/* Jobs Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-6" style={{ color: primaryColor }}>
            Open Positions
          </h2>

          {/* Search and Filters */}
          <div className="space-y-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
              {(Object.keys(filters).length > 0 || searchQuery) && (
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 underline"
                >
                  Clear Filters
                </button>
              )}
            </div>

            {/* Active Filters Display */}
            {(Object.keys(filters).length > 0 || searchQuery) && (
              <div className="flex flex-wrap gap-2 mb-2">
                {searchQuery && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-2">
                    Search: "{searchQuery}"
                    <button
                      onClick={() => setSearchQuery('')}
                      className="hover:bg-blue-200 rounded-full p-0.5"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filters.location && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm flex items-center gap-2">
                    Location: {filters.location}
                    <button
                      onClick={() => handleFilterChange('location', '')}
                      className="hover:bg-gray-200 rounded-full p-0.5"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filters.employment_type && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm flex items-center gap-2">
                    Type: {filters.employment_type.replace('-', ' ')}
                    <button
                      onClick={() => handleFilterChange('employment_type', '')}
                      className="hover:bg-gray-200 rounded-full p-0.5"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filters.work_policy && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm flex items-center gap-2">
                    Policy: {filters.work_policy}
                    <button
                      onClick={() => handleFilterChange('work_policy', '')}
                      className="hover:bg-gray-200 rounded-full p-0.5"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filters.experience && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm flex items-center gap-2">
                    Experience: {filters.experience.replace('-', ' ')}
                    <button
                      onClick={() => handleFilterChange('experience', '')}
                      className="hover:bg-gray-200 rounded-full p-0.5"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filters.department && (
                  <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm flex items-center gap-2">
                    Department: {filters.department}
                    <button
                      onClick={() => handleFilterChange('department', '')}
                      className="hover:bg-gray-200 rounded-full p-0.5"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>
            )}

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="Filter by location"
                    value={filters.location || ''}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employment Type
                  </label>
                  <select
                    value={filters.employment_type || ''}
                    onChange={(e) => handleFilterChange('employment_type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">All Types</option>
                    <option value="full-time">Full Time</option>
                    <option value="part-time">Part Time</option>
                    <option value="contract">Contract</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Work Policy
                  </label>
                  <select
                    value={filters.work_policy || ''}
                    onChange={(e) => handleFilterChange('work_policy', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">All Policies</option>
                    <option value="remote">Remote</option>
                    <option value="hybrid">Hybrid</option>
                    <option value="onsite">Onsite</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience Level
                  </label>
                  <select
                    value={filters.experience || ''}
                    onChange={(e) => handleFilterChange('experience', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">All Levels</option>
                    <option value="senior">Senior</option>
                    <option value="junior">Junior</option>
                    <option value="mid-level">Mid-level</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department
                  </label>
                  <input
                    type="text"
                    placeholder="Filter by department"
                    value={filters.department || ''}
                    onChange={(e) => handleFilterChange('department', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Jobs List */}
          {jobsLoading ? (
            <div className="text-center py-12">Loading jobs...</div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No open positions at the moment. Check back later!
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {job.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" />
                          {(job.employment_type || job.job_type || '').replace('-', ' ')}
                        </div>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded capitalize">
                          {job.work_policy}
                        </span>
                        {job.department && (
                          <span className="px-2 py-1 bg-gray-100 rounded">
                            {job.department}
                          </span>
                        )}
                        {job.experience && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded capitalize">
                            {job.experience.replace('-', ' ')}
                          </span>
                        )}
                        {job.salary_range && (
                          <span className="text-gray-700 font-medium">
                            {job.salary_range}
                          </span>
                        )}
                      </div>
                      {job.description && (
                        <p className="text-gray-700 line-clamp-3">{job.description}</p>
                      )}
                    </div>
                    <button
                      className="px-6 py-2 rounded-md text-white font-medium hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: primaryColor }}
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; {new Date().getFullYear()} {company.name}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default PublicCareersPage;

