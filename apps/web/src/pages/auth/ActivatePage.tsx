import { ActivateView } from '@/components/auth/ActivateView';

export function ActivatePage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white p-6">
            <div className="w-full max-w-sm">
                <ActivateView />
            </div>
        </div>
    );
}