import { useAuth } from '../contexts/AuthContext.jsx';

export function usePermission(permissionName) {
  const { hasPermission, loading } = useAuth();
  return {
    allowed: !loading && hasPermission(permissionName),
    loading,
  };
}
