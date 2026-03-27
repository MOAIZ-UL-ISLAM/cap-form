import { useAuthStore } from '@/store/auth.store';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckSquare, FileText, Phone, ArrowRight } from 'lucide-react';

export function CustomerDashboard() {
    const user = useAuthStore(s => s.user);

    return (
        <div className="min-h-screen flex items-start justify-center px-4 py-10">
            <div className="w-full max-w-3xl text-center space-y-6">

                {/* Header */}
                <div>
                    <h1 className="text-2xl font-semibold text-zinc-900">
                        Hi {user?.userId}
                    </h1>
                    <p className="text-zinc-500 mt-1">
                        You're one step closer to managing your finances!
                    </p>
                </div>

                {/* Card */}
                <Card className="rounded-xl border border-zinc-200 shadow-sm">
                    <CardContent className="p-6 space-y-6 text-left">

                        {/* Title */}
                        <h2 className="text-center text-lg font-semibold text-zinc-900">
                            Complete your application in 3 easy steps
                        </h2>

                        {/* Steps */}
                        <div className="space-y-3">

                            {/* Step 1 */}
                            <div className="flex items-center gap-4 p-4 rounded-lg bg-zinc-100">
                                <div className="w-10 h-10 flex items-center justify-center rounded-md bg-teal-100">
                                    <CheckSquare className="text-teal-600" size={18} />
                                </div>
                                <div>
                                    <p className="font-medium text-sm text-zinc-900">
                                        1. Complete your details
                                    </p>
                                    <p className="text-xs text-zinc-500">
                                        Personal details, creditors & affordability
                                    </p>
                                </div>
                            </div>

                            {/* Step 2 */}
                            <div className="flex items-center gap-4 p-4 rounded-lg bg-zinc-100">
                                <div className="w-10 h-10 flex items-center justify-center rounded-md bg-teal-100">
                                    <FileText className="text-teal-600" size={18} />
                                </div>
                                <div>
                                    <p className="font-medium text-sm text-zinc-900">
                                        2. Upload documents
                                    </p>
                                    <p className="text-xs text-zinc-500">
                                        Supporting documents for your application
                                    </p>
                                </div>
                            </div>

                            {/* Step 3 */}
                            <div className="flex items-center gap-4 p-4 rounded-lg bg-zinc-100">
                                <div className="w-10 h-10 flex items-center justify-center rounded-md bg-teal-100">
                                    <Phone className="text-teal-600" size={18} />
                                </div>
                                <div>
                                    <p className="font-medium text-sm text-zinc-900">
                                        3. Receive a call
                                    </p>
                                    <p className="text-xs text-zinc-500">
                                        An assessor will contact you within the hour
                                    </p>
                                </div>
                            </div>

                        </div>

                        {/* Requirements */}
                        <div className="pt-2">
                            <h3 className="text-sm font-semibold text-zinc-900 mb-2">
                                What you'll need:
                            </h3>
                            <ul className="text-sm text-zinc-500 space-y-1 list-disc pl-5">
                                <li>A full understanding of your creditors and balances</li>
                                <li>A copy of your documents including income & expenditure</li>
                            </ul>
                        </div>

                    </CardContent>
                </Card>

                {/* CTA */}
                <div>
                    <Button
                        size="lg"
                        className="bg-teal-400 hover:bg-teal-600 text-white px-12 py-6 rounded-lg text-lg hover:cursor-pointer font-medium"
                    >
                        Let’s get started
                        <ArrowRight className="ml-2" size={16} />
                    </Button>
                </div>

            </div>
        </div>
    );
}