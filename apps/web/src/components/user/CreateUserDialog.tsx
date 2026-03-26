import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Loader2 } from 'lucide-react';
import {
    Dialog, DialogContent, DialogHeader,
    DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { createUserSchema, type CreateUserFormValues } from '@/schemas/user/create-user.schema';
import { useCreateUser } from '@/hooks/user/useCreateUser';
import type { Role, Title, Gender, Country, DebtRange } from '@/types/user.types';
import { TITLES, GENDERS, COUNTRIES, DEBT_RANGES } from '@/types/user.types';

interface CreateUserDialogProps {
    allowedRoles: { value: Role; label: string }[];
    triggerLabel: string;
}

export function CreateUserDialog({ allowedRoles, triggerLabel }: CreateUserDialogProps) {
    const [open, setOpen] = useState(false);
    const createUser = useCreateUser();

    const { register, handleSubmit, setValue, watch, reset, formState: { errors } } =
        useForm<CreateUserFormValues>({ resolver: zodResolver(createUserSchema) });

    const selectedRole = watch('role');
    const isCustomer = selectedRole === 'CUSTOMER';
    const isPartner = selectedRole === 'PARTNER';

    const onSubmit = (values: CreateUserFormValues) => {
        createUser.mutate(values, {
            onSuccess: () => { setOpen(false); reset(); },
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="gap-2 bg-[#17A2B8] hover:bg-[#138a9e] text-white">
                    <Plus size={14} /> {triggerLabel}
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-base font-semibold">{triggerLabel}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2" noValidate>
                    {/* Role */}
                    <Field label="Role" error={errors.role?.message}>
                        <Select onValueChange={v => setValue('role', v as Role)}>
                            <SelectTrigger><SelectValue placeholder="Select role" /></SelectTrigger>
                            <SelectContent>
                                {allowedRoles.map(r => (
                                    <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </Field>

                    {/* Name row */}
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="First Name" error={errors.firstName?.message}>
                            <Input {...register('firstName')} placeholder="Jane" />
                        </Field>
                        <Field label="Last Name" error={errors.lastName?.message}>
                            <Input {...register('lastName')} placeholder="Smith" />
                        </Field>
                    </div>

                    {/* Email */}
                    <Field label="Email" error={errors.email?.message}>
                        <Input {...register('email')} type="email" placeholder="jane@example.com" />
                    </Field>

                    {/* Phone */}
                    <Field label="Phone (optional)" error={errors.phone?.message}>
                        <Input {...register('phone')} placeholder="+447911123456" />
                    </Field>

                    {/* Customer-only fields */}
                    {isCustomer && (
                        <>
                            <div className="grid grid-cols-2 gap-3">
                                <Field label="Title" error={errors.title?.message}>
                                    <Select onValueChange={v => setValue('title', v as Title)}>
                                        <SelectTrigger><SelectValue placeholder="—" /></SelectTrigger>
                                        <SelectContent>
                                            {TITLES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </Field>
                                <Field label="Gender" error={errors.gender?.message}>
                                    <Select onValueChange={v => setValue('gender', v as Gender)}>
                                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                        <SelectContent>
                                            {GENDERS.map(g => <SelectItem key={g.value} value={g.value}>{g.label}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </Field>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <Field label="Country" error={errors.country?.message}>
                                    <Select onValueChange={v => setValue('country', v as Country)}>
                                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                        <SelectContent>
                                            {COUNTRIES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </Field>
                                <Field label="Debt Range" error={errors.debtRange?.message}>
                                    <Select onValueChange={v => setValue('debtRange', v as DebtRange)}>
                                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                                        <SelectContent>
                                            {DEBT_RANGES.map(d => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </Field>
                            </div>
                        </>
                    )}

                    {/* Partner-only field */}
                    {isPartner && (
                        <Field label="Company Name (optional)">
                            <Input {...register('companyName')} placeholder="Debt Solutions Ltd" />
                        </Field>
                    )}

                    <div className="flex gap-2 pt-2">
                        <Button
                            type="submit"
                            disabled={createUser.isPending}
                            className="flex-1 bg-[#17A2B8] hover:bg-[#138a9e] text-white"
                        >
                            {createUser.isPending
                                ? <><Loader2 size={14} className="animate-spin mr-2" />Creating...</>
                                : 'Create User'}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => { setOpen(false); reset(); }}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

// Tiny reusable field wrapper — keeps form lines short
function Field({
    label, error, children,
}: { label: string; error?: string; children: React.ReactNode }) {
    return (
        <div className="space-y-1.5">
            <Label className="text-xs font-medium text-zinc-600 uppercase tracking-wide">
                {label}
            </Label>
            {children}
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
}