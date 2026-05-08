import PropTypes from 'prop-types';
import { MarkerF } from '@react-google-maps/api';
import { pointToLatLng } from '../../utils/geoUtils';
export default function HospitalMarker({ hospital, onClick }) { const position = pointToLatLng(hospital.location) || hospital.position; if (!position) return null; return <MarkerF position={position} onClick={() => onClick(hospital)} label={{ text: 'H', color: '#fff' }} icon={{ url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png' }} />; }
HospitalMarker.propTypes = { hospital: PropTypes.object.isRequired, onClick: PropTypes.func };
HospitalMarker.defaultProps = { onClick: () => {} };
