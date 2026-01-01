import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { companyService, Company } from '../services/company';
import { contentService, ContentSection } from '../services/content';
import { jobService, Job } from '../services/jobs';
import BrandThemeEditor from '../components/BrandThemeEditor';
import ContentSectionsEditor from '../components/ContentSectionsEditor';
import JobsEditor from '../components/JobsEditor';
import { Copy, Eye, LogOut } from 'lucide-react';

const RecruiterDashboard = () => {
  const { companySlug } = useParams<{ companySlug: string }>();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'brand' | 'content' | 'jobs'>('brand');

  const { data: company, isLoading: companyLoading } = useQuery({
    queryKey: ['company', 'me'],
    queryFn: () => companyService.getMyCompany(),
    retry: false,
  });

  useEffect(() => {
    if (company && company.slug !== companySlug) {
      navigate(`/${company.slug}/edit`, { replace: true });
    }
  }, [company, companySlug, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const copyShareLink = () => {
    if (company) {
      const link = `${window.location.origin}/${company.slug}/careers`;
      navigator.clipboard.writeText(link);
      alert('Link copied to clipboard!');
    }
  };

  const copySlug = () => {
    if (company) {
      navigator.clipboard.writeText(company.slug);
      alert('Company slug copied to clipboard!');
    }
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
          <h2 className="text-2xl font-bold mb-4">No Company Found</h2>
          <p className="text-gray-600 mb-4">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{company.name}</h1>
              <p className="text-sm text-gray-500 mt-1">Edit your careers page</p>
              
              {/* Company Slug Display */}
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600 mb-1">Company Slug</p>
                    <div className="flex items-center gap-2">
                      <code className="text-sm font-mono font-semibold text-blue-700 bg-white px-2 py-1 rounded border">
                        {company.slug}
                      </code>
                      <button
                        onClick={copySlug}
                        className="text-xs text-blue-600 hover:text-blue-700 underline"
                        title="Copy slug"
                      >
                        Copy
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Careers page: <span className="font-mono text-blue-600">/{company.slug}/careers</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={copyShareLink}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <Copy className="w-4 h-4" />
                Copy Share Link
              </button>
              <Link
                to={`/${company.slug}/preview`}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                <Eye className="w-4 h-4" />
                Preview
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('brand')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'brand'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Brand Theme
            </button>
            <button
              onClick={() => setActiveTab('content')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'content'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Content Sections
            </button>
            <button
              onClick={() => setActiveTab('jobs')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'jobs'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Jobs
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'brand' && <BrandThemeEditor company={company} />}
          {activeTab === 'content' && <ContentSectionsEditor company={company} />}
          {activeTab === 'jobs' && <JobsEditor company={company} />}
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;

