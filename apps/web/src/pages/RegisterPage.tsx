// apps/web/src/pages/RegisterPage.tsx
import { AuthLayout } from '@/layout/AuthLayout';
import { RegisterForm } from '@/components/forms/RegisterForm';

export default function RegisterPage() {
    return (
        <AuthLayout>
            <RegisterForm />
        </AuthLayout>
    );
}