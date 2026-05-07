import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTriggerSosMutation, useCancelSosMutation } from '../features/sos/sos.api';
import { setActiveSOS } from '../features/sos/sos.slice';
import useGeolocation from './useGeolocation';
import useOnlineStatus from './useOnlineStatus';
import { sendSmsFallback } from '../services/sms.service';
export default function useSOS() { const { coords } = useGeolocation(); const { isOnline } = useOnlineStatus(); const user = useSelector((state) => state.auth.user); const activeSOS = useSelector((state) => state.sos.activeSOS); const [trigger] = useTriggerSosMutation(); const [cancel] = useCancelSosMutation(); const [loading, setLoading] = useState(false); const [error, setError] = useState(null); const navigate = useNavigate(); const dispatch = useDispatch(); const triggerSOS = async (payload = {}) => { setLoading(true); setError(null); try { const location = payload.coords || coords; if (!location) throw new Error('Location is required for SOS'); if (!isOnline) { sendSmsFallback({ user, location, payload }); return null; } const response = await trigger({ lat: location.lat, lng: location.lng, ...payload }).unwrap(); dispatch(setActiveSOS(response.data.incident)); navigate('/active/' + response.data.incident._id); return response.data; } catch (err) { setError(err.data?.error?.message || err.message); return null; } finally { setLoading(false); } }; const cancelSOS = async (id) => cancel(id).unwrap(); return { triggerSOS, cancelSOS, loading, error, activeSOS, data: activeSOS }; }
