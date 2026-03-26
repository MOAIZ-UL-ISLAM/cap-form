import { Outlet, NavLink } from 'react-router';
import { LayoutDashboard, Users, Shield, LogOut, ChevronDown } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { useLogout } from '@/hooks/auth/useLogout';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
    DropdownMenu, DropdownMenuContent,
    DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserBadge } from '@/components/user/UserBadge';
import { cn } from '@/lib/utils';
import type { Role } from '@/types/user.types';

const CAN_SEE_USERS: Role[] = ['SUPER_ADMIN', 'MANAGER', 'PARTNER'];

export function DashboardLayout() {
    const user = useAuthStore(s => s.user);
    const logout = useLogout();
    const role = user?.role as Role;
    const initials = (user?.email ?? 'U').slice(0, 2).toUpperCase();

    return (
        <div className="min-h-screen flex bg-zinc-50">
            {/* Sidebar */}
            <aside className="w-56 flex flex-col bg-white border-r border-zinc-100 shrink-0">
                {/* Brand */}
                <div className="h-14 flex items-center px-5 border-b border-zinc-100">
                    <span className="font-bold tracking-widest text-[#17A2B8]">TIG</span>
                    <span className="font-bold tracking-widest text-zinc-900">CAP</span>
                </div>

                {/* Nav */}
                <nav className="flex-1 p-3 space-y-0.5">
                    <NavItem to="/dashboard" icon={<LayoutDashboard size={15} />} label="Dashboard" end />
                    {CAN_SEE_USERS.includes(role) && (
                        <NavItem to="/dashboard/users" icon={<Users size={15} />} label="Users" />
                    )}
                    {role === 'SUPER_ADMIN' && (
                        <NavItem to="/dashboard/audit" icon={<Shield size={15} />} label="Audit Logs" />
                    )}
                </nav>

                <Separator />

                {/* User footer */}
                <div className="p-3 space-y-2">
                    {role && <UserBadge role={role} />}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost"
                                className="w-full justify-start gap-2 h-auto py-2 px-2 hover:bg-zinc-50 text-left">
                                <Avatar className="h-7 w-7">
                                    <AvatarFallback className="bg-[#17A2B8]/10 text-[#17A2B8] text-xs font-bold">
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-zinc-800 truncate">{user?.userId}</p>
                                    <p className="text-[11px] text-zinc-400 truncate">{user?.email}</p>
                                </div>
                                <ChevronDown size={13} className="text-zinc-400 shrink-0" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-48">
                            <DropdownMenuItem
                                onClick={logout}
                                className="text-red-500 focus:text-red-500 focus:bg-red-50 gap-2 cursor-pointer text-sm"
                            >
                                <LogOut size={13} /> Sign out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 overflow-y-auto">
                <Outlet />
            </main>
        </div>
    );
}

function NavItem({ to, icon, label, end }: {
    to: string; icon: React.ReactNode; label: string; end?: boolean;
}) {
    return (
        <NavLink to={to} end={end}
            className={({ isActive }) => cn(
                'flex items-center gap-2.5 px-3 py-2 rounded-md text-sm transition-colors',
                isActive
                    ? 'bg-[#17A2B8]/10 text-[#17A2B8] font-medium'
                    : 'text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50',
            )}
        >
            {icon} {label}
        </NavLink>
    );
}