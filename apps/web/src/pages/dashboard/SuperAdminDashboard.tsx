import { Users, UserCheck, Briefcase, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserTable } from '@/components/user/UserTable';
import { CreateUserDialog } from '@/components/user/CreateUserDialog';
import { useUsers } from '@/hooks/user/useUsers';
import type { User } from '@/types/user.types';

const MANAGER_ROLES = [{ value: 'MANAGER' as const, label: 'Manager' }];
const PARTNER_ROLES = [{ value: 'PARTNER' as const, label: 'Partner' }];
const CUSTOMER_ROLES = [{ value: 'CUSTOMER' as const, label: 'Customer' }];

export function SuperAdminDashboard() {
    const { data: all = [], isLoading } = useUsers();

    const managers = all.filter((u: User) => u.role === 'MANAGER');
    const partners = all.filter((u: User) => u.role === 'PARTNER');
    const customers = all.filter((u: User) => u.role === 'CUSTOMER');

    const stats = [
        { label: 'Managers', value: managers.length, icon: ShieldCheck, color: 'text-blue-500' },
        { label: 'Partners', value: partners.length, icon: Briefcase, color: 'text-zinc-600' },
        { label: 'Customers', value: customers.length, icon: UserCheck, color: 'text-[#17A2B8]' },
        { label: 'Total', value: all.length, icon: Users, color: 'text-zinc-400' },
    ];

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Super Admin Dashboard</h1>
                <p className="text-sm text-zinc-400 mt-0.5">Manage all users across the platform</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-3">
                {stats.map(s => (
                    <Card key={s.label} className="border-zinc-100">
                        <CardHeader className="pb-1 pt-4 px-4 flex flex-row items-center justify-between">
                            <CardTitle className="text-xs text-zinc-400 font-medium uppercase tracking-wide">
                                {s.label}
                            </CardTitle>
                            <s.icon size={14} className={s.color} />
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

            {/* Tabs */}
            <Tabs defaultValue="managers">
                <div className="flex items-center justify-between">
                    <TabsList className="bg-zinc-100">
                        <TabsTrigger value="managers" className="text-xs">Managers ({managers.length})</TabsTrigger>
                        <TabsTrigger value="partners" className="text-xs">Partners ({partners.length})</TabsTrigger>
                        <TabsTrigger value="customers" className="text-xs">Customers ({customers.length})</TabsTrigger>
                    </TabsList>

                    <div className="flex gap-2">
                        <CreateUserDialog allowedRoles={MANAGER_ROLES} triggerLabel="Add Manager" />
                        <CreateUserDialog allowedRoles={PARTNER_ROLES} triggerLabel="Add Partner" />
                        <CreateUserDialog allowedRoles={CUSTOMER_ROLES} triggerLabel="Add Customer" />
                    </div>
                </div>

                <TabsContent value="managers" className="mt-4">
                    <UserTable users={managers} canDelete />
                </TabsContent>
                <TabsContent value="partners" className="mt-4">
                    <UserTable users={partners} canDelete />
                </TabsContent>
                <TabsContent value="customers" className="mt-4">
                    <UserTable users={customers} canDelete />
                </TabsContent>
            </Tabs>
        </div>
    );
}