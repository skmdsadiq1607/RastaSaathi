import PropTypes from 'prop-types';
import { GoogleMap, LoadScript, MarkerClustererF } from '@react-google-maps/api';
import { googleMapsApiKey, emergencyMapStyle } from '../../config/maps';
import { HYDERABAD_CENTER } from '../../utils/constants';
import IncidentMarker from './IncidentMarker';
import HospitalMarker from './HospitalMarker';
import RoutePolyline from './RoutePolyline';
import LiveLocationDot from './LiveLocationDot';
import HeatmapLayer from './HeatmapLayer';
export default function EmergencyMap({ incidents, hospitals, route, userLocation, responderLocation, heatmap, onIncidentClick }) { if (!googleMapsApiKey) return <div className="grid h-full min-h-72 place-items-center bg-slate-900 p-4 text-center text-sm text-slate-300">Set VITE_GOOGLE_MAPS_API_KEY to enable live Google Maps. Incident and hospital data still syncs in the panels.</div>; return <LoadScript googleMapsApiKey={googleMapsApiKey} libraries={['visualization']}><GoogleMap mapContainerClassName="emergency-map-shell" center={userLocation || HYDERABAD_CENTER} zoom={12} options={{ styles: emergencyMapStyle, disableDefaultUI: true, zoomControl: true }}><MarkerClustererF>{(clusterer) => <>{incidents.map((incident) => <IncidentMarker key={incident._id} incident={incident} onClick={onIncidentClick} clusterer={clusterer} />)}</>}</MarkerClustererF>{hospitals.map((hospital) => <HospitalMarker key={hospital._id || hospital.hospital?._id} hospital={hospital.hospital || hospital} />)}<RoutePolyline route={route} /><LiveLocationDot position={userLocation} color="#DC2626" /><LiveLocationDot position={responderLocation} color="#2563EB" /><HeatmapLayer geojson={heatmap} /></GoogleMap></LoadScript>; }
EmergencyMap.propTypes = { incidents: PropTypes.arrayOf(PropTypes.object), hospitals: PropTypes.arrayOf(PropTypes.object), route: PropTypes.object, userLocation: PropTypes.object, responderLocation: PropTypes.object, heatmap: PropTypes.object, onIncidentClick: PropTypes.func };
EmergencyMap.defaultProps = { incidents: [], hospitals: [], route: null, userLocation: null, responderLocation: null, heatmap: null, onIncidentClick: () => {} };
