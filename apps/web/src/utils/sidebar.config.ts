// sidebar.config.ts
import { LayoutDashboard, Users, Shield, User, Book, House, Briefcase, Car, FileText, Calculator, Box, BadgeCheck, CreditCard } from 'lucide-react';
import type { Role } from '@/types/user.types';

export type NavItem = {
  label: string;
  href: string;
  icon: any;
  roles: Role[];
};

export const NAV_ITEMS: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: ['SUPER_ADMIN', 'MANAGER', 'PARTNER', 'CUSTOMER'],
  },
  {
    label: 'Users',
    href: '/dashboard/users',
    icon: Users,
    roles: ['SUPER_ADMIN', 'MANAGER', 'PARTNER'],
  },
  {
    label: 'Audit Logs',
    href: '/dashboard/audit',
    icon: Shield,
    roles: ['SUPER_ADMIN'],
  },
  {
    label: 'Get Started',
    href: '/dashboard/get-started',
    icon: Book,
    roles: ['CUSTOMER'],
  },
  {
    label: 'Personal Details',
    href: '/dashboard/personal-details',
    icon: User,
    roles: ['CUSTOMER'],
  },
  {
    label: 'Residential Status',
    href: '/dashboard/residential-status',
    icon: House,
    roles: ['CUSTOMER'],
  },
  {
    label: 'Employment Details',
    href: '/dashboard/employment-details',
    icon: Briefcase,
    roles: ['CUSTOMER'],
  },
  {
    label: 'Creditors',
    href: '/dashboard/creditors',
    icon: CreditCard,
    roles: ['CUSTOMER'],
  },

  {
    label: 'Income and Expenditure',
    href: '/dashboard/income-expenditure',
    icon: Calculator,
    roles: ['CUSTOMER'],
  },

  {
    label: 'Vehicles',
    href: '/dashboard/vehicles',
    icon: Car,
    roles: ['CUSTOMER'],
  },

  {
    label: 'Other Assets ',
    href: '/dashboard/other-assets',
    icon: Box,
    roles: ['CUSTOMER'],
  },
  {
    label: 'Required Documents',
    href: '/dashboard/required-documents',
    icon: FileText,
    roles: ['CUSTOMER'],
  },
  {
    label: 'Solutions',
    href: '/dashboard/solutions',
    icon: BadgeCheck,
    roles: ['CUSTOMER'],
  },

];