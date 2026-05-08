import PropTypes from 'prop-types';
import { MarkerF } from '@react-google-maps/api';
export default function LiveLocationDot({ position, color }) { if (!position) return null; return <MarkerF position={position} icon={{ path: window.google.maps.SymbolPath.CIRCLE, scale: 8, fillColor: color, fillOpacity: 1, strokeColor: '#ffffff', strokeWeight: 2 }} />; }
LiveLocationDot.propTypes = { position: PropTypes.object, color: PropTypes.string };
LiveLocationDot.defaultProps = { position: null, color: '#3B82F6' };
