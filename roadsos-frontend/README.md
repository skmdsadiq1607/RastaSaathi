# RoadSoS Frontend

RoadSoS is a React 18, Vite, Tailwind, RTK Query, Socket.IO, Google Maps, Firebase Messaging, and PWA frontend for the RoadSoS emergency response backend.

## Run

```bash
npm install
cp .env.example .env
npm run dev
```

Set `VITE_API_BASE_URL`, `VITE_SOCKET_URL`, Google Maps, and Firebase values to connect the app to production services. Tokens are kept in memory and refreshed through backend httpOnly cookies.
