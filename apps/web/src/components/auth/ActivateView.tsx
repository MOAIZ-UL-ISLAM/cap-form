import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useActivate } from '@/hooks/auth/useActivate';

export function ActivateView() {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const token = params.get('token') ?? '';
    const activate = useActivate();

    useEffect(() => { if (token) activate.mutate(token); }, [token]); // eslint-disable-line

    return (
        <div className="text-center space-y-4">
            <div className="mb-2">
                <span className="text-xl font-bold tracking-widest text-[#17A2B8]">TIG</span>
                <span className="text-xl font-bold tracking-widest text-zinc-900">CAP</span>
            </div>

            <h1 className="text-xl font-bold text-zinc-900">Account Activation</h1>

            {activate.isPending && (
                <div className="space-y-3">
                    <Loader2 size={36} className="animate-spin text-[#17A2B8] mx-auto" />
                    <p className="text-sm text-zinc-500">Verifying your link...</p>
                </div>
            )}

            {activate.isSuccess && (
                <div className="space-y-4">
                    <CheckCircle2 size={36} className="text-green-500 mx-auto" />
                    <p className="text-sm text-zinc-600">Account activated. Please set your password.</p>
                    <Button
                        className="w-full bg-[#17A2B8] hover:bg-[#138a9e] text-white"
                        onClick={() =>
                            navigate(`/set-password?token=${activate.data?.data?.token ?? token}`)
                        }
                    >
                        Set Password →
                    </Button>
                </div>
            )}

            {activate.isError && (
                <div className="space-y-4">
                    <XCircle size={36} className="text-red-500 mx-auto" />
                    <p className="text-sm text-zinc-500">{(activate.error as Error).message}</p>
                    <Button variant="outline" className="w-full" onClick={() => navigate('/login')}>
                        Back to Login
                    </Button>
                </div>
            )}
        </div>
    );
}