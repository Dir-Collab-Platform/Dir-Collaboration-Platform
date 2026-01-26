export const USER_ROLES = {
    OWNER: "owner",        // Full repo control
    CORE: "core",          // Can invite, edit, manage
    CONTRIBUTOR: "contributor", // Can create messages, tasks
    VIEWER: "viewer",      // Read-only access
};

export const ROLE_PERMISSIONS = {
    owner: ["read", "write", "delete", "manage_members", "manage_settings"],
    core: ["read", "write", "delete", "manage_members"],
    contributor: ["read", "write", "comment"],
    viewer: ["read"],
};

export const PERMISSION_LEVELS = {
    read: 1,
    write: 2,
    delete: 3,
    manage_members: 4,
    manage_settings: 5,
};

/**
 * Check if a role has a specific permission
 * @param {string} role - User role (owner, core, contributor, viewer)
 * @param {string} permission - Permission to check (read, write, delete, etc.)
 * @returns {boolean}
 */
export const hasPermission = (role, permission) => {
    if (!role || !permission) return false;
    const permissions = ROLE_PERMISSIONS[role.toLowerCase()];
    return permissions ? permissions.includes(permission) : false;
};
