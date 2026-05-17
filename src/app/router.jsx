import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import RootMotionLayout from '../layouts/RootMotionLayout.jsx';
import PublicLayout from '../layouts/PublicLayout.jsx';
import AuthLayout from '../layouts/AuthLayout.jsx';
import AppLayout from '../layouts/AppLayout.jsx';
import ReviewLayout from '../layouts/ReviewLayout.jsx';
import AdminLayout from '../layouts/AdminLayout.jsx';
import MarketingLayout from '../layouts/MarketingLayout.jsx';
import HomePage from '../pages/public/HomePage.jsx';
import PackagesPage from '../pages/public/PackagesPage.jsx';
import HowItWorksPage from '../pages/public/HowItWorksPage.jsx';
import FaqPage from '../pages/public/FaqPage.jsx';
import ContactPage from '../pages/public/ContactPage.jsx';
import LoginPage from '../pages/auth/LoginPage.jsx';
import RegisterPage from '../pages/auth/RegisterPage.jsx';
import RequireAuth from '../components/auth/RequireAuth.jsx';
import RequireRole from '../components/auth/RequireRole.jsx';
import ClientAreaGate from '../components/auth/ClientAreaGate.jsx';
import ClientDashboardPage from '../pages/app/ClientDashboardPage.jsx';
import ClientRequestsPage from '../pages/app/ClientRequestsPage.jsx';
import ClientRequestDetailPage from '../pages/app/ClientRequestDetailPage.jsx';
import CompanyProfilePage from '../pages/app/CompanyProfilePage.jsx';
import SubscriptionPage from '../pages/app/SubscriptionPage.jsx';
import NotificationsPage from '../pages/app/NotificationsPage.jsx';
import ClientArchivePage from '../pages/app/ClientArchivePage.jsx';
import ReviewQueuePage from '../pages/review/ReviewQueuePage.jsx';
import ReviewRequestDetailPage from '../pages/review/ReviewRequestDetailPage.jsx';
import AdminHomePage from '../pages/admin/AdminHomePage.jsx';
import AdminUsersPage from '../pages/admin/AdminUsersPage.jsx';
import AdminRequestsPage from '../pages/admin/AdminRequestsPage.jsx';
import AdminAuditPage from '../pages/admin/AdminAuditPage.jsx';
import MarketingHomePage from '../pages/marketing/MarketingHomePage.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootMotionLayout />,
    children: [
      {
        element: <PublicLayout />,
        children: [
          { index: true, element: <HomePage /> },
          { path: 'packages', element: <PackagesPage /> },
          { path: 'how-it-works', element: <HowItWorksPage /> },
          { path: 'faq', element: <FaqPage /> },
          { path: 'contact', element: <ContactPage /> },
        ],
      },
      {
        path: 'auth',
        element: <AuthLayout />,
        children: [
          { path: 'login', element: <LoginPage /> },
          { path: 'register', element: <RegisterPage /> },
        ],
      },
      {
        path: 'app',
        element: (
          <RequireAuth>
            <ClientAreaGate>
              <AppLayout />
            </ClientAreaGate>
          </RequireAuth>
        ),
        children: [
          { index: true, element: <ClientDashboardPage /> },
          { path: 'requests', element: <ClientRequestsPage /> },
          { path: 'requests/:id', element: <ClientRequestDetailPage /> },
          { path: 'company', element: <CompanyProfilePage /> },
          { path: 'subscription', element: <SubscriptionPage /> },
          { path: 'notifications', element: <NotificationsPage /> },
          { path: 'archive', element: <ClientArchivePage /> },
        ],
      },
      {
        path: 'review',
        element: (
          <RequireAuth>
            <RequireRole anyOf={['REVIEWER', 'ADMIN', 'SUPER_ADMIN']} redirectTo="/app">
              <ReviewLayout />
            </RequireRole>
          </RequireAuth>
        ),
        children: [
          { index: true, element: <ReviewQueuePage /> },
          { path: 'requests/:id', element: <ReviewRequestDetailPage /> },
        ],
      },
      {
        path: 'admin',
        element: (
          <RequireAuth>
            <RequireRole anyOf={['ADMIN', 'SUPER_ADMIN']} redirectTo="/app">
              <AdminLayout />
            </RequireRole>
          </RequireAuth>
        ),
        children: [
          { index: true, element: <AdminHomePage /> },
          { path: 'users', element: <AdminUsersPage /> },
          { path: 'requests', element: <AdminRequestsPage /> },
          { path: 'audit', element: <AdminAuditPage /> },
        ],
      },
      {
        path: 'marketing',
        element: (
          <RequireAuth>
            <RequireRole anyOf={['MARKETING', 'ADMIN', 'SUPER_ADMIN']} redirectTo="/app">
              <MarketingLayout />
            </RequireRole>
          </RequireAuth>
        ),
        children: [{ index: true, element: <MarketingHomePage /> }],
      },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
