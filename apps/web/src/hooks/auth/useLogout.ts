import { useNavigate } from 'react-router';
import { useAuthStore } from '@/store/auth.store';

export function useLogout() {
    const clearAuth = useAuthStore(s => s.clearAuth);
    const navigate = useNavigate();

    return () => {
        clearAuth();
        navigate('/login');
    };
}