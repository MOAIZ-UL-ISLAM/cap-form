import { SetPasswordForm } from '@/components/auth/SetPasswordForm';

export function SetPasswordPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white p-6">
            <div className="w-full max-w-sm">
                <SetPasswordForm />
            </div>
        </div>
    );
}