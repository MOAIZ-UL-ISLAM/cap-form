"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, AlertCircle, Fingerprint } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    Field,
    FieldGroup,
    FieldLabel,
    FieldError,
    FieldDescription,
} from "@/components/ui/field";

import { loginSchema, type LoginFormValues } from "@/schemas/login.schema";
import { useLogin } from "@/hooks/useLogin";

const LABEL_CLASS =
    "text-[11px] uppercase tracking-widest text-muted-foreground font-medium";

export function LoginForm() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const { mutate, isPending, error } = useLogin();

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            userId: "",
            password: "",
        },
    });

    const apiError = (error as any)?.response?.data?.message as string | undefined;

    const onSubmit = (values: LoginFormValues) => {
        mutate(values, {
            onSuccess: () => navigate("/dashboard"),
        });
    };

    return (
        <div className="w-full max-w-sm flex flex-col">
            {/* Mobile brand */}
            <div className="lg:hidden font-serif text-2xl font-bold tracking-widest text-foreground mb-8">
                <span className="text-primary">TIG</span>CAP
            </div>

            {/* Header */}
            <div className="mb-8">
                <div className="size-11 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-5">
                    <Fingerprint size={20} className="text-primary" />
                </div>
                <h2 className="font-serif text-3xl font-semibold tracking-tight text-foreground mb-1.5">
                    Welcome back
                </h2>
                <p className="text-sm text-muted-foreground">
                    Sign in with your User ID and password
                </p>
            </div>

            {/* API error */}
            {apiError && (
                <Alert variant="destructive" className="mb-6">
                    <AlertCircle size={14} />
                    <AlertDescription>{apiError}</AlertDescription>
                </Alert>
            )}

            {/* Form */}
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                noValidate
                className="flex flex-col gap-5"
            >
                <FieldGroup>
                    {/* User ID */}
                    <Controller
                        name="userId"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel className={LABEL_CLASS}>
                                    User ID
                                </FieldLabel>

                                <Input
                                    {...field}
                                    placeholder="TIGCAP1234567"
                                    autoComplete="username"
                                />

                                <FieldDescription className="text-[11px]">
                                    Sent to your email upon registration
                                </FieldDescription>

                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />

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
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter your password"
                                        autoComplete="current-password"
                                        className="pr-10"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((p) => !p)}
                                        aria-label={
                                            showPassword ? "Hide password" : "Show password"
                                        }
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {showPassword ? (
                                            <EyeOff size={15} />
                                        ) : (
                                            <Eye size={15} />
                                        )}
                                    </button>
                                </div>

                                {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                )}
                            </Field>
                        )}
                    />
                </FieldGroup>

                {/* Submit */}
                <Button
                    type="submit"
                    disabled={isPending}
                    className="w-full mt-1"
                >
                    {isPending ? (
                        <span className="size-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                    ) : (
                        "Sign In"
                    )}
                </Button>

                {/* Footer */}
                <p className="text-center text-sm text-muted-foreground">
                    Don&apos;t have an account?{" "}
                    <Link
                        to="/register"
                        className="text-primary hover:underline font-medium"
                    >
                        Register here
                    </Link>
                </p>
            </form>
        </div>
    );
}