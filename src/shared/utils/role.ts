export const getRoleBadgeVariant = (role: string) => {
  switch (role) {
    case 'SUPER_ADMIN':
      return 'outline';
    case 'ADMIN':
      return 'outline';
    case 'USER':
      return 'default';
    default:
      return 'secondary';
  }
};

export const shouldShowRoleBadge = (role: string) =>
  role === 'SUPER_ADMIN' || role === 'ADMIN';

export const getRoleBadgeClassName = (role: string) => {
  switch (role) {
    case 'SUPER_ADMIN':
      return 'border-amber-300/80 bg-amber-100 text-amber-900 dark:border-amber-500/50 dark:bg-amber-500/20 dark:text-amber-200';
    case 'ADMIN':
      return 'border-sky-300/80 bg-sky-100 text-sky-900 dark:border-sky-500/50 dark:bg-sky-500/20 dark:text-sky-200';
    default:
      return '';
  }
};

export const getRoleBadgeNameVariant = (role: string) => {
  switch (role) {
    case 'SUPER_ADMIN':
      return 'Super Admin';
    case 'ADMIN':
      return 'Admin';
    case 'USER':
      return 'User';
    default:
      return 'secondary';
  }
};
