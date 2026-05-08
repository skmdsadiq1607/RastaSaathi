import { LogOut, ShieldAlert } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useLogoutMutation } from '../../features/auth/auth.api';
import { clearCredentials } from '../../features/auth/auth.slice';
import LanguageSwitcher from './LanguageSwitcher';
export default function Navbar() { const user = useSelector((state) => state.auth.user); const [logout] = useLogoutMutation(); const dispatch = useDispatch(); const navigate = useNavigate(); const signOut = async () => { await logout(); dispatch(clearCredentials()); navigate('/login'); }; return <header className="sticky top-0 z-40 border-b border-border bg-dark/95 backdrop-blur"><div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-4"><Link to="/" className="flex items-center gap-2 text-lg font-bold"><ShieldAlert className="h-6 w-6 text-red-500" />RoadSoS</Link><div className="flex items-center gap-3"><LanguageSwitcher /><span className="hidden text-sm text-slate-300 sm:block">{user?.name}</span><button aria-label="Logout" onClick={signOut} className="rounded border border-border p-2 text-slate-200 hover:bg-surface"><LogOut className="h-5 w-5" /></button></div></div></header>; }
