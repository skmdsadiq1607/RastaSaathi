import PropTypes from 'prop-types';
import { PolylineF } from '@react-google-maps/api';
import { decodePolyline } from '../../utils/geoUtils';
export default function RoutePolyline({ route }) { const path = route?.path || decodePolyline(route?.polyline || ''); if (!path.length) return null; return <PolylineF path={path} options={{ strokeColor: '#DC2626', strokeWeight: 5, strokeOpacity: 0.9 }} />; }
RoutePolyline.propTypes = { route: PropTypes.object };
RoutePolyline.defaultProps = { route: null };
