// apps/web/src/pages/LoginPage.tsx
import { AuthLayout } from '@/layout/AuthLayout';
import { LoginForm } from '@/components/forms/LoginForm';

export default function LoginPage() {
    return (
        <AuthLayout>
            <LoginForm />
        </AuthLayout>
    );
}