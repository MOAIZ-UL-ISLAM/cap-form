import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useSearchParams } from 'react-router';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { loginSchema, type LoginFormValues } from '@/schemas/auth/login.schema';
import { useLogin } from '@/hooks/auth/useLogin';

export function LoginForm() {
    const [showPass, setShowPass] = useState(false);
    const [params] = useSearchParams();
    const login = useLogin();

    const { register, handleSubmit, formState: { errors } } =
        useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Sign in</h1>
                <p className="text-sm text-zinc-500 mt-1">Use your TIGCAP User ID and password</p>
            </div>

            {params.get('registered') && (
                <Alert className="border-[#17A2B8]/30 bg-[#17A2B8]/5">
                    <AlertDescription className="text-[#17A2B8] text-sm">
                        Account created — check your email for login credentials.
                    </AlertDescription>
                </Alert>
            )}

            {params.get('activated') && (
                <Alert className="border-[#17A2B8]/30 bg-[#17A2B8]/5">
                    <AlertDescription className="text-[#17A2B8] text-sm">
                        Password set — you can now sign in.
                    </AlertDescription>
                </Alert>
            )}

            <form onSubmit={handleSubmit(v => login.mutate(v))} className="space-y-4" noValidate>
                <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-zinc-500 uppercase tracking-wide">
                        User ID
                    </Label>
                    <Input
                        {...register('userId')}
                        placeholder="TIGCAP1234567"
                        autoComplete="username"
                        className="h-10 border-zinc-200 focus:border-[#17A2B8] focus:ring-[#17A2B8]/20"
                    />
                    {errors.userId && <p className="text-xs text-red-500">{errors.userId.message}</p>}
                    <p className="text-xs text-zinc-400">Sent to your email upon registration</p>
                </div>

                <div className="space-y-1.5">
                    <Label className="text-xs font-medium text-zinc-500 uppercase tracking-wide">
                        Password
                    </Label>
                    <div className="relative">
                        <Input
                            {...register('password')}
                            type={showPass ? 'text' : 'password'}
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            className="h-10 pr-10 border-zinc-200 focus:border-[#17A2B8] focus:ring-[#17A2B8]/20"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPass(p => !p)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                        >
                            {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                    </div>
                    {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
                </div>

                <Button
                    type="submit"
                    disabled={login.isPending}
                    className="w-full h-10 bg-[#17A2B8] hover:bg-[#138a9e] text-white font-medium"
                >
                    {login.isPending
                        ? <><Loader2 size={15} className="animate-spin mr-2" />Signing in...</>
                        : 'Sign In'}
                </Button>
            </form>

            <p className="text-center text-sm text-zinc-500">
                No account?{' '}
                <Link to="/register" className="text-[#17A2B8] hover:underline font-medium">
                    Register here
                </Link>
            </p>
        </div>
    );
}