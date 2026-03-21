export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export function isPrivilegedRole(role: string): boolean {
  return role === Role.ADMIN || role === Role.SUPER_ADMIN;
}
