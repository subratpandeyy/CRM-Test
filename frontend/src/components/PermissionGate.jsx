import React from 'react';
import { usePermission } from '../hooks/usePermission.js';

export default function PermissionGate({ permission, children, fallback = null }) {
  const { allowed, loading } = usePermission(permission);

  if (loading) return null;
  return allowed ? children : fallback;
}
