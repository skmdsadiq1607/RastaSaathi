import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
export default function Layout() { return <div className="min-h-screen bg-dark text-slate-50"><Navbar /><div className="mx-auto flex w-full max-w-[1440px]"><Sidebar /><main className="min-h-[calc(100vh-64px)] flex-1 p-4 md:p-6"><Outlet /></main></div></div>; }
