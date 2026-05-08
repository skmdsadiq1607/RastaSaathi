import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';
import env from './env';

let app;
let messaging;

export async function getFirebaseMessaging() {
  const supported = await isSupported();
  if (!supported || !env.firebase.apiKey) return null;
  if (!app) app = initializeApp(env.firebase);
  if (!messaging) messaging = getMessaging(app);
  return messaging;
}

export async function requestFcmToken() {
  const instance = await getFirebaseMessaging();
  if (!instance) return null;
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') return null;
  return getToken(instance, { vapidKey: env.firebase.vapidKey });
}

export async function listenForegroundMessages(callback) {
  const instance = await getFirebaseMessaging();
  if (!instance) return () => {};
  return onMessage(instance, callback);
}
