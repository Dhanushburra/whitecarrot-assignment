import { useParams, Link } from 'react-router-dom';
import PublicCareersPage from './PublicCareersPage';

const PreviewPage = () => {
  const { companySlug } = useParams<{ companySlug: string }>();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Preview Banner */}
      <div className="bg-blue-600 text-white py-3 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <p className="text-sm font-medium">
            👁️ Preview Mode - This is how your careers page will look
          </p>
          {companySlug && (
            <Link
              to={`/${companySlug}/edit`}
              className="text-sm underline hover:no-underline"
            >
              Back to Editor
            </Link>
          )}
        </div>
      </div>

      {/* Render the actual public page */}
      <PublicCareersPage />
    </div>
  );
};

export default PreviewPage;

