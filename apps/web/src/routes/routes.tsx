import { createBrowserRouter, redirect } from 'react-router';
import { useAuthStore } from '@/store/auth.store';
import { AuthLayout } from '@/layout/AuthLayout';
import { DashboardLayout } from '@/layout/DashboardLayout';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { ActivatePage } from '@/pages/auth/ActivatePage';
import { SetPasswordPage } from '@/pages/auth/SetPasswordPage';
import { DashboardPage } from '@/pages/dashboard/DashboardPage';
import GetStarted from '@/pages/form/GetStarted';
import ResidentialStatus from '@/pages/form/ResidentialStatus';
import EmploymentDetails from '@/pages/form/EmploymentDetails';
import Vehicle from '@/pages/form/Vehicle';
import IncomeExpenditure from '@/pages/form/IncomeExpenditure';
import OtherAssets from '@/pages/form/OtherAssets';
import RequiredDocs from '@/pages/form/RequiredDocs';
import Solutions from '@/pages/form/Solutions';
import Creditors from '@/pages/form/Creditors';

const requireAuth = () => {
    if (!useAuthStore.getState().user?.accessToken) return redirect('/login');
    return null;
};

const requireGuest = () => {
    if (useAuthStore.getState().user?.accessToken) return redirect('/dashboard');
    return null;
};

export const router = createBrowserRouter([
    {
        element: <AuthLayout />,
        loader: requireGuest,
        children: [
            { path: '/login', element: <LoginPage /> },
            { path: '/register', element: <RegisterPage /> },
        ],
    },
    { path: '/activate', element: <ActivatePage /> },
    { path: '/set-password', element: <SetPasswordPage /> },
    {
        path: '/dashboard',
        element: <DashboardLayout />,
        loader: requireAuth,
        children: [
            { index: true, element: <DashboardPage /> },
            { path: 'get-started', element: <GetStarted /> },
            { path: 'personal-details', element: <GetStarted /> },
            { path: 'residential-status', element: <ResidentialStatus /> },
            { path: 'employment-details', element: <EmploymentDetails /> },
            { path: 'creditors', element: <Creditors /> },
            { path: 'income-expenditure', element: <IncomeExpenditure /> },
            { path: 'vehicles', element: <Vehicle /> },
            { path: 'other-assets', element: <OtherAssets /> },
            { path: 'required-documents', element: <RequiredDocs /> },
            { path: 'solutions', element: <Solutions /> },
        ],
    },
    { path: '/', loader: () => redirect('/dashboard') },
    { path: '*', loader: () => redirect('/login') },
]);