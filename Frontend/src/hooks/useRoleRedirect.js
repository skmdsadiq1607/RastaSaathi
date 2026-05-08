import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
export default function useRoleRedirect() { const user = useSelector((state) => state.auth.user); const navigate = useNavigate(); useEffect(() => { if (!user) return; navigate(user.role === 'admin' ? '/dashboard' : user.role === 'responder' ? '/responder' : '/home', { replace: true }); }, [navigate, user]); return { data: user, loading: false, error: null }; }
