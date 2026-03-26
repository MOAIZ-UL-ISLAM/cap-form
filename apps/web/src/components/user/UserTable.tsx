import { Trash2 } from 'lucide-react';
import {
    Table, TableBody, TableCell,
    TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserBadge } from './UserBadge';
import { useDeleteUser } from '@/hooks/user/useDeleteUser';
import type { User } from '@/types/user.types';

interface UserTableProps {
    users: User[];
    canDelete?: boolean;
}

export function UserTable({ users, canDelete = false }: UserTableProps) {
    const deleteUser = useDeleteUser();

    if (users.length === 0) {
        return (
            <div className="border rounded-md p-8 text-center text-sm text-zinc-400">
                No users found
            </div>
        );
    }

    return (
        <div className="border rounded-md overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="bg-zinc-50">
                        <TableHead className="text-xs uppercase tracking-wide text-zinc-500">Name</TableHead>
                        <TableHead className="text-xs uppercase tracking-wide text-zinc-500">User ID</TableHead>
                        <TableHead className="text-xs uppercase tracking-wide text-zinc-500">Email</TableHead>
                        <TableHead className="text-xs uppercase tracking-wide text-zinc-500">Role</TableHead>
                        <TableHead className="text-xs uppercase tracking-wide text-zinc-500">Status</TableHead>
                        <TableHead className="text-xs uppercase tracking-wide text-zinc-500">Created</TableHead>
                        {canDelete && <TableHead />}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map(user => (
                        <TableRow key={user.id} className="hover:bg-zinc-50/50">
                            <TableCell className="font-medium text-sm">
                                {user.profile
                                    ? `${user.profile.firstName} ${user.profile.lastName}`
                                    : '—'}
                            </TableCell>
                            <TableCell className="text-sm font-mono text-zinc-500">
                                {user.userId}
                            </TableCell>
                            <TableCell className="text-sm text-zinc-600">{user.email}</TableCell>
                            <TableCell><UserBadge role={user.role} /></TableCell>
                            <TableCell>
                                <Badge
                                    variant="outline"
                                    className={user.isActive
                                        ? 'bg-green-50 text-green-700 border-green-200 text-xs'
                                        : 'bg-zinc-50 text-zinc-400 border-zinc-200 text-xs'}
                                >
                                    {user.isActive ? 'Active' : 'Inactive'}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-xs text-zinc-400">
                                {new Date(user.createdAt).toLocaleDateString('en-GB')}
                            </TableCell>
                            {canDelete && (
                                <TableCell>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 text-zinc-400 hover:text-red-500 hover:bg-red-50"
                                        onClick={() => {
                                            if (confirm(`Delete ${user.userId}?`)) {
                                                deleteUser.mutate(user.userId);
                                            }
                                        }}
                                    >
                                        <Trash2 size={14} />
                                    </Button>
                                </TableCell>
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}