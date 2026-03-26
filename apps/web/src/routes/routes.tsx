import { createBrowserRouter, redirect } from 'react-router';
import { useAuthStore } from '@/store/auth.store';
import { AuthLayout } from '@/layout/AuthLayout';
import { DashboardLayout } from '@/layout/DashboardLayout';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { ActivatePage } from '@/pages/auth/ActivatePage';
import { SetPasswordPage } from '@/pages/auth/SetPasswordPage';
import { DashboardPage } from '@/pages/dashboard/DashboardPage';

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
        ],
    },
    { path: '/', loader: () => redirect('/dashboard') },
    { path: '*', loader: () => redirect('/login') },
]);