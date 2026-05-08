import PropTypes from 'prop-types';
import EmergencyMap from '../map/EmergencyMap';
export default function HotspotChart({ geojson }) { return <div className="h-[420px] overflow-hidden rounded border border-border"><EmergencyMap heatmap={geojson} /></div>; }
HotspotChart.propTypes = { geojson: PropTypes.object };
HotspotChart.defaultProps = { geojson: null };
