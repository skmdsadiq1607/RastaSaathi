import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { pushAlert } from '../features/alerts/alerts.slice';
import { useSendFcmTokenMutation } from '../features/auth/auth.api';
import { listenForegroundMessages, requestFcmToken } from '../config/firebase';
export default function useNotifications() { const dispatch = useDispatch(); const [sendFcmToken] = useSendFcmTokenMutation(); useEffect(() => { let unsubscribe = () => {}; requestFcmToken().then((token) => { if (token) sendFcmToken(token); }); listenForegroundMessages((payload) => dispatch(pushAlert({ id: Date.now(), title: payload.notification?.title || 'RoadSoS', body: payload.notification?.body || 'Emergency update' }))).then((fn) => { unsubscribe = fn; }); return () => unsubscribe(); }, [dispatch, sendFcmToken]); return { data: null, loading: false, error: null }; }
