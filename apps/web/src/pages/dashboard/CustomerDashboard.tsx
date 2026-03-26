import { useAuthStore } from '@/store/auth.store';
import { Card, CardContent } from '@/components/ui/card';

export function CustomerDashboard() {
    const user = useAuthStore(s => s.user);

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-xl font-bold text-zinc-900 tracking-tight">
                    Welcome, {user?.userId}
                </h1>
                <p className="text-sm text-zinc-400 mt-0.5">
                    Your insolvency portal
                </p>
            </div>

            <Card className="border-zinc-100 max-w-lg">
                <CardContent className="pt-6">
                    <p className="text-sm text-zinc-500 leading-relaxed">
                        Your fact-find form will appear here once it has been prepared by your adviser.
                        If you have any questions, please contact your TIGCAP adviser directly.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}