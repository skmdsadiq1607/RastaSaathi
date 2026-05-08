import env from './env';

export const googleMapsApiKey = env.googleMapsApiKey;
export const emergencyMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#172033' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#F8FAFC' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0F172A' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#334155' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#EA580C' }] },
  { featureType: 'poi.medical', elementType: 'geometry', stylers: [{ color: '#16A34A' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0B1020' }] }
];
