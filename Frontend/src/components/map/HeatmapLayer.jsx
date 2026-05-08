import PropTypes from 'prop-types';
import { HeatmapLayerF } from '@react-google-maps/api';
export default function HeatmapLayer({ geojson }) { if (!geojson?.features?.length || !window.google) return null; const data = geojson.features.map((feature) => ({ location: new window.google.maps.LatLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0]), weight: feature.properties.count })); return <HeatmapLayerF data={data} />; }
HeatmapLayer.propTypes = { geojson: PropTypes.object };
HeatmapLayer.defaultProps = { geojson: null };
