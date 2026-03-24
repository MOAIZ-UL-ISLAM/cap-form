// apps/web/src/components/layout/AuthLayout.tsx
import type { ReactNode } from 'react';
import { BadgeCheck } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface AuthLayoutProps {
    children: ReactNode;
}

const STATS = [
    { num: '£2.4B', label: 'Debt managed' },
    { num: '14K+', label: 'Clients helped' },
    { num: '15yr', label: 'Experience' },
];

export function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className="min-h-svh grid grid-cols-1 lg:grid-cols-[480px_1fr]">
            {/* ── LEFT PANEL ── */}
            <aside className="hidden lg:flex flex-col justify-between bg-card border-r border-border px-12 py-12 relative overflow-hidden">
                {/* Decorative glow orbs */}
                <div className="pointer-events-none absolute -top-24 -right-24 size-80 rounded-full bg-primary/10 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-20 -left-20 size-64 rounded-full bg-primary/5 blur-3xl" />

                {/* Brand */}
                <div className="relative z-10 flex items-baseline gap-0.5 font-serif text-2xl font-bold tracking-widest">
                    <span className="text-primary">TIG</span>
                    <span className="text-foreground">CAP</span>
                </div>

                {/* Hero copy */}
                <div className="relative z-10 flex flex-col justify-center flex-1 py-12">
                    <h1 className="font-serif text-5xl font-semibold leading-[1.1] tracking-tight text-foreground mb-4">
                        Debt relief,<br />
                        <em className="text-primary not-italic font-serif italic">redefined.</em>
                    </h1>
                    <p className="text-sm text-muted-foreground leading-relaxed max-w-xs mb-12">
                        Specialist insolvency practitioners serving England,
                        Wales &amp; Northern Ireland since 2009.
                    </p>

                    {/* Stats */}
                    <div className="flex items-center gap-8">
                        {STATS.map(({ num, label }, i) => (
                            <div key={label} className="flex items-center gap-8">
                                {i > 0 && <Separator orientation="vertical" className="h-9 bg-border" />}
                                <div className="flex flex-col gap-1">
                                    <span className="font-serif text-3xl font-bold text-primary leading-none">{num}</span>
                                    <span className="text-[11px] uppercase tracking-widest text-muted-foreground">{label}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <footer className="relative z-10 flex items-center gap-2 text-[11px] text-muted-foreground pt-6 border-t border-border">
                    <BadgeCheck size={13} className="text-primary shrink-0" />
                    Authorised by the Insolvency Practitioners Association
                </footer>
            </aside>

            {/* ── RIGHT PANEL ── */}
            <main className="flex items-center justify-center bg-background px-5 py-12 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}