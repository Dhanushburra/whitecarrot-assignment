import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import RecruiterDashboard from './pages/RecruiterDashboard';
import PreviewPage from './pages/PreviewPage';
import PublicCareersPage from './pages/PublicCareersPage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <DashboardPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/:companySlug/edit"
              element={
                <PrivateRoute>
                  <RecruiterDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/:companySlug/preview"
              element={
                <PrivateRoute>
                  <PreviewPage />
                </PrivateRoute>
              }
            />
            <Route path="/:companySlug/careers" element={<PublicCareersPage />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

