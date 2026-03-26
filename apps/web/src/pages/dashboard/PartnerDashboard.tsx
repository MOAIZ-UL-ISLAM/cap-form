import { UserCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { UserTable } from '@/components/user/UserTable';
import { CreateUserDialog } from '@/components/user/CreateUserDialog';
import { useUsers } from '@/hooks/user/useUsers';
import type { User } from '@/types/user.types';

const CUSTOMER_ROLES = [{ value: 'CUSTOMER' as const, label: 'Customer' }];

export function PartnerDashboard() {
    const { data: all = [], isLoading } = useUsers();
    const customers = all.filter((u: User) => u.role === 'CUSTOMER');

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Partner Dashboard</h1>
                <p className="text-sm text-zinc-400 mt-0.5">Your referred customers</p>
            </div>

            <Card className="border-zinc-100 max-w-[160px]">
                <CardHeader className="pb-1 pt-4 px-4 flex flex-row items-center justify-between">
                    <CardTitle className="text-xs text-zinc-400 font-medium uppercase tracking-wide">
                        Customers
                    </CardTitle>
                    <UserCheck size={14} className="text-[#17A2B8]" />
                </CardHeader>
                <CardContent className="px-4 pb-4">
                    <p className="text-2xl font-bold text-zinc-900">
                        {isLoading ? '—' : customers.length}
                    </p>
                </CardContent>
            </Card>

            <Separator />

            <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-zinc-700">
                    Customers ({customers.length})
                </p>
                <CreateUserDialog allowedRoles={CUSTOMER_ROLES} triggerLabel="Add Customer" />
            </div>

            <UserTable users={customers} />
        </div>
    );
}