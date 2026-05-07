import PropTypes from 'prop-types';
import { MarkerF } from '@react-google-maps/api';
import { pointToLatLng } from '../../utils/geoUtils';
function color(level) { return { CRITICAL: 'red', HIGH: 'orange', MEDIUM: 'yellow', LOW: 'green' }[level] || 'red'; }
export default function IncidentMarker({ incident, onClick, clusterer }) { const position = pointToLatLng(incident.location) || incident.position; if (!position) return null; return <MarkerF clusterer={clusterer} position={position} onClick={() => onClick(incident)} label={{ text: '!', color: '#fff' }} icon={{ url: 'http://maps.google.com/mapfiles/ms/icons/' + color(incident.severity?.level) + '-dot.png' }} />; }
IncidentMarker.propTypes = { incident: PropTypes.object.isRequired, onClick: PropTypes.func, clusterer: PropTypes.object };
IncidentMarker.defaultProps = { onClick: () => {}, clusterer: null };
