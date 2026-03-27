import { NavLink } from 'react-router';
import { useAuthStore } from '@/store/auth.store';
import { useLogout } from '@/hooks/auth/useLogout';
import { NAV_ITEMS } from '@/utils/sidebar.config';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from '@/components/ui/sidebar';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { ChevronDown, LogOut } from 'lucide-react';
import { UserBadge } from '@/components/user/UserBadge';
import { cn } from '@/lib/utils';

export function AppSidebar() {
    const user = useAuthStore(s => s.user);
    const logout = useLogout();

    const role = user?.role;
    const initials = (user?.email ?? 'U').slice(0, 2).toUpperCase();

    const filteredNav = NAV_ITEMS.filter(item =>
        item.roles.includes(role)
    );

    return (
        <Sidebar>
            <SidebarHeader>
                <div className="flex items-center px-2 py-2">
                    <span className="font-bold tracking-widest text-[#17A2B8]">TIG</span>
                    <span className="font-bold tracking-widest text-zinc-900">CAP</span>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarMenu>
                    {filteredNav.map(item => (
                        <SidebarMenuItem key={item.href}>
                            <SidebarMenuButton asChild>
                                <NavLink to={item.href} className={({ isActive }) =>
                                    cn('flex items-center gap-2', isActive && 'text-[#17A2B8]')
                                }>
                                    <item.icon size={16} />
                                    {item.label}
                                </NavLink>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>

            <SidebarFooter>
                <div className="space-y-2 border-t-2 border-zinc-200 p-1">
                    {role && <UserBadge role={role} />}

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="w-full  justify-start gap-2">
                                <Avatar className="h-7 w-7">
                                    <AvatarFallback className="bg-[#17A2B8]/10 text-[#17A2B8] text-xs font-bold">
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="flex-1 text-left">
                                    <p className="text-xs font-medium truncate">{user?.userId}</p>
                                    <p className="text-[10px] text-zinc-400 truncate">{user?.email}</p>
                                </div>

                                <ChevronDown size={11} />
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="start" className="w-58">
                            <DropdownMenuItem
                                onClick={logout}
                                className="text-red-500 focus:text-red-500 focus:bg-red-50 gap-2"
                            >
                                <LogOut size={14} /> Sign out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </SidebarFooter>
        </Sidebar>
    );
}