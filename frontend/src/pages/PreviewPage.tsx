import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { companyService } from '../services/company';
import { contentService } from '../services/content';
import { jobService } from '../services/jobs';
import PublicCareersPage from './PublicCareersPage';

const PreviewPage = () => {
  const { companySlug } = useParams<{ companySlug: string }>();

  const { data: company } = useQuery({
    queryKey: ['company', 'me'],
    queryFn: () => companyService.getMyCompany(),
  });

  if (!company || company.slug !== companySlug) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Preview Banner */}
      <div className="bg-blue-600 text-white py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <p className="text-sm font-medium">
            👁️ Preview Mode - This is how your careers page will look
          </p>
          <Link
            to={`/${company.slug}/edit`}
            className="text-sm underline hover:no-underline"
          >
            Back to Editor
          </Link>
        </div>
      </div>

      {/* Render the actual public page */}
      <PublicCareersPage />
    </div>
  );
};

export default PreviewPage;

