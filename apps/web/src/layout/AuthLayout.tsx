import { Outlet } from 'react-router';
import { Separator } from '@/components/ui/separator';

export function AuthLayout() {
    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left panel */}
            <div className="hidden lg:flex flex-col justify-between p-12 bg-zinc-950">
                <div className="flex items-baseline gap-0.5">
                    <span className="text-xl font-bold tracking-widest text-[#17A2B8]">TIG</span>
                    <span className="text-xl font-bold tracking-widest text-white">CAP</span>
                </div>

                <div className="space-y-6">
                    <h1 className="text-5xl font-bold text-white leading-tight tracking-tight">
                        Debt relief,<br />
                        <span className="text-[#17A2B8]">redefined.</span>
                    </h1>
                    <p className="text-zinc-400 text-base leading-relaxed max-w-xs">
                        Specialist insolvency practitioners serving England, Wales & Northern Ireland.
                    </p>
                    <Separator className="bg-zinc-800 w-12" />
                    <div className="flex gap-8">
                        {[
                            { n: '£2.4B', l: 'Debt managed' },
                            { n: '14K+', l: 'Clients helped' },
                            { n: '15yr', l: 'Experience' },
                        ].map(s => (
                            <div key={s.l}>
                                <p className="text-2xl font-bold text-[#17A2B8]">{s.n}</p>
                                <p className="text-xs text-zinc-500 uppercase tracking-widest mt-1">{s.l}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="text-xs text-zinc-600">
                    Authorised by the Insolvency Practitioners Association
                </p>
            </div>

            {/* Right panel */}
            <div className="flex items-center justify-center p-8 bg-white">
                <div className="w-full max-w-md">
                    <div className="flex lg:hidden items-baseline gap-0.5 mb-8">
                        <span className="text-lg font-bold tracking-widest text-[#17A2B8]">TIG</span>
                        <span className="text-lg font-bold tracking-widest text-zinc-900">CAP</span>
                    </div>
                    <Outlet />
                </div>
            </div>
        </div>
    );
}