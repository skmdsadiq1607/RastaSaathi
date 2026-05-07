import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import SOSButton from '../../components/sos/SOSButton';
import SOSConfirmModal from '../../components/sos/SOSConfirmModal';
import VoiceSOSButton from '../../components/sos/VoiceSOSButton';
import AlertBanner from '../../components/alerts/AlertBanner';
import LanguageSwitcher from '../../components/shared/LanguageSwitcher';
import useSOS from '../../hooks/useSOS';
import useNotifications from '../../hooks/useNotifications';
export default function Home() { useNotifications(); const [confirm, setConfirm] = useState(false); const language = useSelector((state) => state.language.language); const active = useSelector((state) => state.sos.activeSOS); const navigate = useNavigate(); const sos = useSOS(); const trigger = () => sos.triggerSOS({ injuryType: 'unknown', vehicleType: 'unknown' }); return <div className="mx-auto flex min-h-[calc(100vh-96px)] max-w-[430px] flex-col items-center justify-between gap-4"><div className="flex w-full items-center justify-between"><LanguageSwitcher /><VoiceSOSButton language={language} onDetected={() => trigger()} /></div><AlertBanner incidentId={active?._id} /><div className="grid place-items-center text-center"><SOSButton disabled={Boolean(active)} onTap={() => setConfirm(true)} onLongPress={trigger} /><p className="mt-5 rounded-full bg-slate-800 px-4 py-2 text-sm">Nearest Hospital: live after SOS | ETA: pending</p></div><nav className="grid w-full grid-cols-4 gap-2 text-center text-xs"><button onClick={() => navigate('/home')} className="rounded bg-surface py-3">Home</button><button onClick={() => navigate('/active')} className="rounded bg-surface py-3">Active</button><button onClick={() => navigate('/first-aid')} className="rounded bg-surface py-3">First Aid</button><button onClick={() => navigate('/history')} className="rounded bg-surface py-3">History</button></nav><SOSConfirmModal open={confirm} onCancel={() => setConfirm(false)} onConfirm={() => { setConfirm(false); trigger(); }} /></div>; }
