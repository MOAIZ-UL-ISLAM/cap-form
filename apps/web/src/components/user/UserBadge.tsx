import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ROLE_LABELS, type Role } from '@/types/user.types';

const styles: Record<Role, string> = {
    SUPER_ADMIN: 'bg-red-50 text-red-700 border-red-200',
    MANAGER: 'bg-blue-50 text-[#17A2B8] border-[#17A2B8]/30',
    PARTNER: 'bg-zinc-100 text-zinc-700 border-zinc-300',
    CUSTOMER: 'bg-white text-zinc-600 border-zinc-200',
};

export function UserBadge({ role }: { role: Role }) {
    return (
        <Badge variant="outline" className={cn('text-xs font-medium', styles[role])}>
            {ROLE_LABELS[role]}
        </Badge>
    );
}