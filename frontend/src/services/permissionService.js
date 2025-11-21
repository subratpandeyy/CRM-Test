import api from './api.js';

export const getAllRolesWithPermissions = async () => {
  const res = await api.get('/rbac/roles');
  return res.data;
};

export const getAllPermissions = async () => {
  const res = await api.get('/rbac/permissions');
  return res.data;
};

export const assignPermissionsToRole = async (roleId, permissionNames) => {
  await api.post(`/rbac/roles/${roleId}/permissions`, { permissionNames });
};

export const revokePermissionFromRole = async (roleId, permissionId) => {
  await api.delete(`/rbac/roles/${roleId}/permissions/${permissionId}`);
};

export const getUserRbacInfo = async (memberId) => {
  const res = await api.get(`/rbac/users/${memberId}`);
  return res.data;
};

export const assignRolesToUser = async (memberId, roleNames) => {
  await api.post(`/rbac/users/${memberId}/roles`, { roleNames });
};

export const revokeRoleFromUser = async (memberId, roleId) => {
  await api.delete(`/rbac/users/${memberId}/roles/${roleId}`);
};
