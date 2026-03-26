import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams } from 'react-router';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { setPasswordSchema, type SetPasswordFormValues } from '@/schemas/auth/set-password.schema';
import { useSetPassword } from '@/hooks/auth/useSetPassword';

export function SetPasswordForm() {
    const [params] = useSearchParams();
    const token = params.get('token') ?? '';
    const [showP, setShowP] = useState(false);
    const [showC, setShowC] = useState(false);
    const setPass = useSetPassword();

    const { register, handleSubmit, formState: { errors } } =
        useForm<SetPasswordFormValues>({ resolver: zodResolver(setPasswordSchema) });

    const onSubmit = ({ password }: SetPasswordFormValues) =>
        setPass.mutate({ token, password });

    return (
        <div className="space-y-6">
            <div>
                <span className="text-lg font-bold tracking-widest text-[#17A2B8]">TIG</span>
                <span className="text-lg font-bold tracking-widest text-zinc-900">CAP</span>
            </div>
            <div>
                <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Set your password</h1>
                <p className="text-sm text-zinc-500 mt-1">Choose a strong password to secure your account</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-zinc-500 uppercase tracking-wide">New Password</Label>
                    <div className="relative">
                        <Input {...register('password')} type={showP ? 'text' : 'password'}
                            placeholder="Min 8 characters" className="h-10 pr-10" />
                        <button type="button" onClick={() => setShowP(p => !p)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600">
                            {showP ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                    </div>
                    {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
                </div>

                <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-zinc-500 uppercase tracking-wide">Confirm Password</Label>
                    <div className="relative">
                        <Input {...register('confirmPassword')} type={showC ? 'text' : 'password'}
                            placeholder="Repeat password" className="h-10 pr-10" />
                        <button type="button" onClick={() => setShowC(p => !p)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600">
                            {showC ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                    </div>
                    {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
                </div>

                <Button type="submit" disabled={setPass.isPending}
                    className="w-full h-10 bg-[#17A2B8] hover:bg-[#138a9e] text-white font-medium">
                    {setPass.isPending
                        ? <><Loader2 size={15} className="animate-spin mr-2" />Setting password...</>
                        : 'Set Password'}
                </Button>
            </form>
        </div>
    );
}