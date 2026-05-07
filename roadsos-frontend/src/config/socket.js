import { io } from 'socket.io-client';
import env from './env';

export function createSocket(namespace, token) {
  return io(env.socketUrl + namespace, { auth: { token }, transports: ['websocket'], autoConnect: true, reconnection: true, reconnectionAttempts: Infinity, reconnectionDelay: 1000 });
}
