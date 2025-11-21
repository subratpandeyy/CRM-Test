import { useAuth } from '../contexts/AuthContext.jsx';

export function useRole(roleName) {
  const { hasRole, loading } = useAuth();
  return {
    allowed: !loading && hasRole(roleName),
    loading,
  };
}
