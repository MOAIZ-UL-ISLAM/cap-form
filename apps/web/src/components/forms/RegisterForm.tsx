"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router";
import { Eye, EyeOff, CheckCircle2, AlertCircle, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    Field,
    FieldGroup,
    FieldLabel,
    FieldError,
} from "@/components/ui/field";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

import {
    registerSchema,
    type RegisterFormValues,
} from "@/schemas/register.schema";
import { useRegister } from "@/hooks/useRegister";

// ── Constants ─────────────────────────────────────────────
const TITLES = ["MR", "MRS", "MS", "DR", "PROF", "LORD", "LADY", "REV"] as const;

const GENDERS = [
    { value: "MALE", label: "Male" },
    { value: "FEMALE", label: "Female" },
    { value: "OTHER", label: "Other" },
    { value: "PREFER_NOT_TO_SAY", label: "Prefer not to say" },
] as const;

const COUNTRIES = [
    { value: "ENGLAND", label: "England" },
    { value: "WALES", label: "Wales" },
    { value: "NORTHERN_IRELAND", label: "Northern Ireland" },
] as const;

const DEBT_RANGES = [
    { value: "LESS_THAN_5000", label: "Less than £5,000" },
    { value: "BETWEEN_5000_AND_20000", label: "£5,000 – £20,000" },
    { value: "GREATER_THAN_20000", label: "Greater than £20,000" },
] as const;

const LABEL_CLASS =
    "text-[11px] uppercase tracking-widest text-muted-foreground font-medium";

// ── Component ─────────────────────────────────────────────
export function RegisterForm() {
    const navigate = useNavigate();
    const [showPw, setShowPw] = useState(false);
    const [showConf, setShowConf] = useState(false);
    const [done, setDone] = useState(false);

    const { mutate, isPending, error } = useRegister();

    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            title: "MR",
            firstName: "",
            lastName: "",
            gender: "MALE",
            phone: "",
            email: "",
            country: "ENGLAND",
            debtRange: "LESS_THAN_5000",
            password: "",
            confirmPassword: "",
        },
    });

    const apiError = (error as any)?.response?.data?.message as string | undefined;

    const onSubmit = (values: RegisterFormValues) => {
        mutate(values, { onSuccess: () => setDone(true) });
    };

    // ── Success ────────────────────────────────────────────
    if (done) {
        return (
            <div className="w-full max-w-md flex flex-col items-center text-center gap-4 py-16 px-8">
                <div className="size-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                    <CheckCircle2 size={30} />
                </div>
                <h2 className="text-3xl font-semibold">Account Created</h2>
                <p className="text-sm text-muted-foreground">
                    Check your email for credentials.
                </p>
                <Button onClick={() => navigate("/login")}>
                    Proceed to Login
                </Button>
            </div>
        );
    }

    // ── Form ──────────────────────────────────────────────
    return (
        <div className="w-full max-w-xl flex flex-col">
            {/* Header */}
            <div className="mb-8">
                <div className="size-11 rounded-lg bg-primary/10 flex items-center justify-center mb-5">
                    <UserPlus size={20} className="text-primary" />
                </div>
                <h2 className="text-3xl font-semibold">Create your account</h2>
            </div>

            {/* API error */}
            {apiError && (
                <Alert variant="destructive" className="mb-6">
                    <AlertCircle size={14} />
                    <AlertDescription>{apiError}</AlertDescription>
                </Alert>
            )}

            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col gap-6"
            >
                {/* ── Personal Details ── */}
                <FieldGroup>
                    <div className="grid grid-cols-[100px_1fr_1fr] gap-3">
                        {/* Title */}
                        <Controller
                            name="title"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel className={LABEL_CLASS}>Title</FieldLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="—" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {TITLES.map((t) => (
                                                <SelectItem key={t} value={t}>
                                                    {t}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        {/* First Name */}
                        <Controller
                            name="firstName"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel className={LABEL_CLASS}>
                                        First Name
                                    </FieldLabel>
                                    <Input {...field} placeholder="John" />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        {/* Last Name */}
                        <Controller
                            name="lastName"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel className={LABEL_CLASS}>
                                        Last Name
                                    </FieldLabel>
                                    <Input {...field} placeholder="Doe" />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                    </div>

                    {/* Gender + Phone */}
                    <div className="grid grid-cols-2 gap-3">
                        <Controller
                            name="gender"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel className={LABEL_CLASS}>
                                        Gender
                                    </FieldLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select gender" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {GENDERS.map((g) => (
                                                <SelectItem key={g.value} value={g.value}>
                                                    {g.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="phone"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel className={LABEL_CLASS}>
                                        Phone
                                    </FieldLabel>
                                    <Input {...field} placeholder="+447911123456" />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                    </div>

                    {/* Email */}
                    <Controller
                        name="email"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel className={LABEL_CLASS}>
                                    Email
                                </FieldLabel>
                                <Input {...field} type="email" />
                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                </FieldGroup>

                <Separator />

                {/* ── Enquiry ── */}
                <FieldGroup>
                    <div className="grid grid-cols-2 gap-3">
                        <Controller
                            name="country"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel className={LABEL_CLASS}>
                                        Country
                                    </FieldLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select country" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {COUNTRIES.map((c) => (
                                                <SelectItem key={c.value} value={c.value}>
                                                    {c.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="debtRange"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel className={LABEL_CLASS}>
                                        Debt Range
                                    </FieldLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select range" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {DEBT_RANGES.map((d) => (
                                                <SelectItem key={d.value} value={d.value}>
                                                    {d.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                    </div>
                </FieldGroup>

                <Separator />

                {/* ── Security ── */}
                <FieldGroup>
                    <div className="grid grid-cols-2 gap-3">
                        {/* Password */}
                        <Controller
                            name="password"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel className={LABEL_CLASS}>
                                        Password
                                    </FieldLabel>
                                    <div className="relative">
                                        <Input
                                            {...field}
                                            type={showPw ? "text" : "password"}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPw((p) => !p)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2"
                                        >
                                            {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                                        </button>
                                    </div>
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        {/* Confirm */}
                        <Controller
                            name="confirmPassword"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel className={LABEL_CLASS}>
                                        Confirm
                                    </FieldLabel>
                                    <div className="relative">
                                        <Input
                                            {...field}
                                            type={showConf ? "text" : "password"}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConf((p) => !p)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2"
                                        >
                                            {showConf ? <EyeOff size={15} /> : <Eye size={15} />}
                                        </button>
                                    </div>
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                    </div>
                </FieldGroup>

                <Button type="submit" disabled={isPending}>
                    {isPending ? "Loading..." : "Create Account"}
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link to="/login" className="text-primary underline">
                        Sign in
                    </Link>
                </p>
            </form>
        </div>
    );
}