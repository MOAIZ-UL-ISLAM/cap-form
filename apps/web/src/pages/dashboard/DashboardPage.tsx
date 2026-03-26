import { useAuthStore } from '@/store/auth.store';
import { SuperAdminDashboard } from './SuperAdminDashboard';
import { ManagerDashboard } from './ManagerDashboard';
import { PartnerDashboard } from './PartnerDashboard';
import { CustomerDashboard } from './CustomerDashboard';
import type { Role } from '@/types/user.types';

const DASHBOARD_BY_ROLE: Record<Role, React.ComponentType> = {
    SUPER_ADMIN: SuperAdminDashboard,
    MANAGER: ManagerDashboard,
    PARTNER: PartnerDashboard,
    CUSTOMER: CustomerDashboard,
};

export function DashboardPage() {
    const role = useAuthStore(s => s.user?.role) as Role;
    const Dashboard = DASHBOARD_BY_ROLE[role] ?? CustomerDashboard;
    return <Dashboard />;
}