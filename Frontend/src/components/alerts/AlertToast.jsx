import { X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { dismissAlert } from '../../features/alerts/alerts.slice';
export default function AlertToast() { const alerts = useSelector((state) => state.alerts.items); const dispatch = useDispatch(); return <div className="fixed right-3 top-20 z-50 space-y-2">{alerts.map((alert) => <div key={alert.id} className="w-80 rounded border border-red-500/40 bg-red-950 p-3 shadow-xl"><div className="flex items-start justify-between gap-3"><div><p className="font-bold">{alert.title}</p><p className="text-sm text-red-100">{alert.body}</p></div><button aria-label="Dismiss alert" onClick={() => dispatch(dismissAlert(alert.id))}><X className="h-4 w-4" /></button></div></div>)}</div>; }
