import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { companyService } from '../services/company';

const DashboardPage = () => {
  const navigate = useNavigate();

  const { data: company, isLoading } = useQuery({
    queryKey: ['company', 'me'],
    queryFn: () => companyService.getMyCompany(),
    retry: false,
  });

  useEffect(() => {
    if (!isLoading) {
      if (company) {
        navigate(`/${company.slug}/edit`, { replace: true });
      } else {
        // No company yet - prompt user to create one or auto-create
        const createCompany = async () => {
          try {
            const companyName = prompt('Please enter your company name:');
            if (!companyName) {
              // User cancelled, redirect to login
              navigate('/login');
              return;
            }
            const newCompany = await companyService.createCompany(companyName);
            
            // Show company slug to recruiter
            const careersUrl = `${window.location.origin}/${newCompany.slug}/careers`;
            alert(
              `Company created successfully!\n\n` +
              `Company Slug: ${newCompany.slug}\n` +
              `Your careers page URL: ${careersUrl}\n\n` +
              `You can share this link with candidates.`
            );
            
            navigate(`/${newCompany.slug}/edit`, { replace: true });
          } catch (error: any) {
            console.error('Error creating company:', error);
            // If user cancels prompt, show message
            if (error?.response?.data?.error) {
              alert(error.response.data.error);
            }
          }
        };
        createCompany();
      }
    }
  }, [company, isLoading, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-lg">Loading...</div>
    </div>
  );
};

export default DashboardPage;

