import { Outlet } from 'react-router';
import {
    SidebarProvider,
    SidebarInset,
} from '@/components/ui/sidebar';
import { AppSidebar } from '@/sidebar/AppSidebar';

export function DashboardLayout() {
    return (
        <SidebarProvider>
            <AppSidebar />

            {/* ✅ This fixes width calculation */}
            <SidebarInset>
                <main className="min-h-screen bg-zinc-50">
                    <Outlet />
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
}