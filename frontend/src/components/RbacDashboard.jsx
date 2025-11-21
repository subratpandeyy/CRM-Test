import React, { useEffect, useState } from 'react';
import {
  getAllRolesWithPermissions,
  getAllPermissions,
  assignPermissionsToRole,
  revokePermissionFromRole,
  getUserRbacInfo,
  assignRolesToUser,
  revokeRoleFromUser,
} from '../services/permissionService.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import PermissionGate from './PermissionGate.jsx';

export default function RbacDashboard() {
  const { loading, hasPermission } = useAuth();
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [isBusy, setIsBusy] = useState(false);

  useEffect(() => {
    if (!loading && hasPermission('MANAGE_ROLES')) {
      refreshData();
    }
  }, [loading]);

  const refreshData = async () => {
    setIsBusy(true);
    try {
      const [roleData, permData] = await Promise.all([
        getAllRolesWithPermissions(),
        getAllPermissions(),
      ]);
      setRoles(roleData);
      setPermissions(permData);
    } finally {
      setIsBusy(false);
    }
  };

  const handleRoleClick = (role) => {
    setSelectedRole(role);
  };

  const handleTogglePermission = async (permissionName) => {
    if (!selectedRole) return;
    setIsBusy(true);
    try {
      const has = selectedRole.permissions.includes(permissionName);
      if (has) {
        const perm = permissions.find((p) => p.permissionName === permissionName);
        if (perm) {
          await revokePermissionFromRole(selectedRole.id, perm.id);
        }
      } else {
        await assignPermissionsToRole(selectedRole.id, [permissionName]);
      }
      const updated = (await getAllRolesWithPermissions()).find((r) => r.id === selectedRole.id);
      setSelectedRole(updated);
      setRoles(await getAllRolesWithPermissions());
    } finally {
      setIsBusy(false);
    }
  };

  const handleLoadUser = async () => {
    if (!selectedUserId) return;
    setIsBusy(true);
    try {
      const data = await getUserRbacInfo(selectedUserId);
      setUserInfo(data);
    } finally {
      setIsBusy(false);
    }
  };

  const handleAssignRoleToUser = async (roleName) => {
    if (!userInfo) return;
    setIsBusy(true);
    try {
      await assignRolesToUser(userInfo.memberId, [roleName]);
      const updated = await getUserRbacInfo(userInfo.memberId);
      setUserInfo(updated);
    } finally {
      setIsBusy(false);
    }
  };

  const handleRevokeRoleFromUser = async (roleName) => {
    if (!userInfo) return;
    const role = roles.find((r) => r.name === roleName);
    if (!role) return;

    setIsBusy(true);
    try {
      await revokeRoleFromUser(userInfo.memberId, role.id);
      const updated = await getUserRbacInfo(userInfo.memberId);
      setUserInfo(updated);
    } finally {
      setIsBusy(false);
    }
  };

  if (loading) return null;

  if (!hasPermission('MANAGE_ROLES')) {
    return <div className="p-4 text-red-600">You do not have access to RBAC administration.</div>;
  }

  return (
    <div className="p-4 space-y-6">
      {isBusy && <div className="text-sm text-gray-500">Processing...</div>}

      <h1 className="text-2xl font-bold">RBAC Admin Dashboard</h1>

      {/* Role -> Permission matrix */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border rounded-lg p-3">
          <h2 className="font-semibold mb-2">Roles</h2>
          <ul className="space-y-1">
            {roles.map((r) => (
              <li
                key={r.id}
                className={`cursor-pointer px-2 py-1 rounded ${
                  selectedRole?.id === r.id ? 'bg-blue-100' : 'hover:bg-gray-100'
                }`}
                onClick={() => handleRoleClick(r)}
              >
                {r.name}
              </li>
            ))}
          </ul>
        </div>

        <div className="border rounded-lg p-3 md:col-span-2">
          <h2 className="font-semibold mb-2">
            Role Permissions {selectedRole && `- ${selectedRole.name}`}
          </h2>
          {selectedRole ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {permissions.map((p) => {
                const active = selectedRole.permissions.includes(p.permissionName);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleTogglePermission(p.permissionName)}
                    className={`text-left px-2 py-1 border rounded text-sm ${
                      active
                        ? 'bg-green-100 border-green-400'
                        : 'bg-white border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    <span className="font-mono">{p.permissionName}</span>
                    <div className="text-xs text-gray-500">{p.description}</div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-gray-500 text-sm">Select a role to manage permissions.</div>
          )}
        </div>
      </section>

      {/* User role assignment */}
      <PermissionGate permission="MANAGE_ROLES">
        <section className="border rounded-lg p-3">
          <h2 className="font-semibold mb-2">User Role Assignment</h2>
          <div className="flex flex-col md:flex-row gap-2 items-center mb-3">
            <input
              type="number"
              className="border rounded px-2 py-1 w-full md:w-48"
              placeholder="Member ID"
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
            />
            <button
              type="button"
              onClick={handleLoadUser}
              className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
            >
              Load User
            </button>
          </div>

          {userInfo && (
            <div className="space-y-3">
              <div>
                <div className="font-semibold">
                  {userInfo.name} ({userInfo.email})
                </div>
                <div className="text-xs text-gray-500">ID: {userInfo.memberId}</div>
              </div>

              <div className="flex flex-wrap gap-2">
                {userInfo.roles.map((r) => (
                  <span
                    key={r}
                    className="inline-flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded text-xs"
                  >
                    <span>{r}</span>
                    <button
                      type="button"
                      onClick={() => handleRevokeRoleFromUser(r)}
                      className="text-red-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <div>
                <h3 className="font-semibold text-sm mb-1">Assign New Role</h3>
                <div className="flex flex-wrap gap-2">
                  {roles
                    .filter((r) => !userInfo.roles.includes(r.name))
                    .map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => handleAssignRoleToUser(r.name)}
                        className="px-2 py-1 border rounded text-xs hover:bg-gray-100"
                      >
                        {r.name}
                      </button>
                    ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-sm mb-1">Effective Permissions</h3>
                <div className="flex flex-wrap gap-1">
                  {userInfo.permissions.map((p) => (
                    <span
                      key={p}
                      className="inline-block bg-green-50 border border-green-200 text-green-800 text-[11px] px-1.5 py-0.5 rounded"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>
      </PermissionGate>
    </div>
  );
}
