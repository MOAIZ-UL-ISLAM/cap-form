import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { registerSchema, type RegisterFormValues } from '@/schemas/auth/register.schema';
import { useRegister } from '@/hooks/auth/useRegister';
import type { Title, Gender, Country, DebtRange } from '@/types/user.types';
import { TITLES, GENDERS, COUNTRIES, DEBT_RANGES } from '@/types/user.types';


function Field({
    label,
    error,
    required,
    children
}: {
    label: string;
    error?: string;
    required?: boolean;
    children: React.ReactNode
}) {
    return (
        <div className="space-y-1.5">
            <Label className="text-xs font-medium text-zinc-500 uppercase tracking-wide">
                {label}
                {required && <span className="text-red-700">*</span>}
            </Label>
            {children}
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
}

export function RegisterForm() {
    const [showP, setShowP] = useState(false);
    const [showC, setShowC] = useState(false);
    const reg = useRegister();

    const { register, handleSubmit, setValue, formState: { errors } } =
        useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Create account</h1>
                <p className="text-sm text-zinc-500 mt-1">Begin your path to financial freedom</p>
            </div>

            <form onSubmit={handleSubmit(v => reg.mutate(v))} className="space-y-4" noValidate>
                {/* Title + First + Last */}
                <div className="grid grid-cols-[90px_1fr_1fr] gap-3">
                    <Field label="Title" error={errors.title?.message} required>
                        <Select onValueChange={v => setValue('title', v as Title)}>
                            <SelectTrigger className="h-10 w-full"><SelectValue placeholder="Select" /></SelectTrigger>
                            <SelectContent >
                                {TITLES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </Field>
                    <Field label="First Name" error={errors.firstName?.message} required>
                        <Input {...register('firstName')} placeholder="First name" className="h-10" />
                    </Field>
                    <Field label="Last Name" error={errors.lastName?.message} required>
                        <Input {...register('lastName')} placeholder="Last name" className="h-10" />
                    </Field>
                </div>

                {/* Gender + Phone */}
                <div className="grid grid-cols-2 gap-1">
                    <Field label="Gender" error={errors.gender?.message} required>
                        <Select onValueChange={v => setValue('gender', v as Gender)}>
                            <SelectTrigger className="h-10 w-full"><SelectValue placeholder="Select" /></SelectTrigger>
                            <SelectContent>
                                {GENDERS.map(g => <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </Field>
                    <Field label="Phone" error={errors.phone?.message} required>
                        <Input {...register('phone')} placeholder="+44XXXXXXXXXX" className="h-10" />
                    </Field>
                </div>

                {/* Email */}
                <Field label="Email" error={errors.email?.message} required>
                    <Input {...register('email')} type="email" placeholder="Email" className="h-10" />
                </Field>

                {/* Country + Debt Range */}
                <div className="grid grid-cols-2 gap-3">
                    <Field label="Country" error={errors.country?.message} required>
                        <Select onValueChange={v => setValue('country', v as Country)}>
                            <SelectTrigger className="h-10 w-full"><SelectValue placeholder="Select" /></SelectTrigger>
                            <SelectContent>
                                {COUNTRIES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </Field>
                    <Field label="Debt Range" error={errors.debtRange?.message} required>
                        <Select onValueChange={v => setValue('debtRange', v as DebtRange)}>
                            <SelectTrigger className="h-10 w-full "><SelectValue placeholder="Select" /></SelectTrigger>
                            <SelectContent>
                                {DEBT_RANGES.map(d => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </Field>
                </div>

                {/* Password + Confirm */}
                <div className="grid grid-cols-2 gap-3">
                    <Field label="Password" error={errors.password?.message} required>
                        <div className="relative">
                            <Input {...register('password')} type={showP ? 'text' : 'password'}
                                placeholder="Min 8 chars" className="h-10 pr-9" />
                            <button type="button" onClick={() => setShowP(p => !p)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600">
                                {showP ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                        </div>
                    </Field>
                    <Field label="Confirm" error={errors.confirmPassword?.message} required>
                        <div className="relative">
                            <Input {...register('confirmPassword')} type={showC ? 'text' : 'password'}
                                placeholder="Repeat" className="h-10 pr-9" />
                            <button type="button" onClick={() => setShowC(p => !p)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600">
                                {showC ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                        </div>
                    </Field>
                </div>

                <Button type="submit" disabled={reg.isPending}
                    className="w-full h-10 bg-[#17A2B8] hover:bg-[#138a9e] text-white font-medium">
                    {reg.isPending
                        ? <><Loader2 size={15} className="animate-spin mr-2" />Creating account...</>
                        : 'Create Account'}
                </Button>
            </form>

            <p className="text-center text-sm text-zinc-500">
                Already have an account?{' '}
                <Link to="/login" className="text-[#17A2B8] hover:underline font-medium">Sign in</Link>
            </p>
        </div>
    );
}