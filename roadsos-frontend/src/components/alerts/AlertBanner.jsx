import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
export default function AlertBanner({ incidentId }) { if (!incidentId) return null; return <Link to={'/active/' + incidentId} className="block rounded border border-red-500 bg-red-950 p-3 text-sm font-semibold text-red-100">Active emergency in progress. Open live response.</Link>; }
AlertBanner.propTypes = { incidentId: PropTypes.string };
AlertBanner.defaultProps = { incidentId: '' };
