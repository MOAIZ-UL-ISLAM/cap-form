import { UserCheck, Briefcase } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserTable } from '@/components/user/UserTable';
import { CreateUserDialog } from '@/components/user/CreateUserDialog';
import { useUsers } from '@/hooks/user/useUsers';
import type { User } from '@/types/user.types';

const PARTNER_ROLES = [{ value: 'PARTNER' as const, label: 'Partner' }];
const CUSTOMER_ROLES = [{ value: 'CUSTOMER' as const, label: 'Customer' }];

export function ManagerDashboard() {
    const { data: all = [], isLoading } = useUsers();

    const partners = all.filter((u: User) => u.role === 'PARTNER');
    const customers = all.filter((u: User) => u.role === 'CUSTOMER');

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Manager Dashboard</h1>
                <p className="text-sm text-zinc-400 mt-0.5">Manage partners and customers</p>
            </div>

            <div className="grid grid-cols-2 gap-3 max-w-xs">
                {[
                    { label: 'Partners', value: partners.length, icon: Briefcase },
                    { label: 'Customers', value: customers.length, icon: UserCheck },
                ].map(s => (
                    <Card key={s.label} className="border-zinc-100">
                        <CardHeader className="pb-1 pt-4 px-4 flex flex-row items-center justify-between">
                            <CardTitle className="text-xs text-zinc-400 font-medium uppercase tracking-wide">
                                {s.label}
                            </CardTitle>
                            <s.icon size={14} className="text-[#17A2B8]" />
                        </CardHeader>
                        <CardContent className="px-4 pb-4">
                            <p className="text-2xl font-bold text-zinc-900">
                                {isLoading ? '—' : s.value}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Separator />

            <Tabs defaultValue="partners">
                <div className="flex items-center justify-between">
                    <TabsList className="bg-zinc-100">
                        <TabsTrigger value="partners" className="text-xs">Partners ({partners.length})</TabsTrigger>
                        <TabsTrigger value="customers" className="text-xs">Customers ({customers.length})</TabsTrigger>
                    </TabsList>
                    <div className="flex gap-2">
                        <CreateUserDialog allowedRoles={PARTNER_ROLES} triggerLabel="Add Partner" />
                        <CreateUserDialog allowedRoles={CUSTOMER_ROLES} triggerLabel="Add Customer" />
                    </div>
                </div>

                <TabsContent value="partners" className="mt-4">
                    <UserTable users={partners} />
                </TabsContent>
                <TabsContent value="customers" className="mt-4">
                    <UserTable users={customers} />
                </TabsContent>
            </Tabs>
        </div>
    );
}