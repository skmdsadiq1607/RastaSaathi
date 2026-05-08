import PropTypes from 'prop-types';
import { severityColor } from '../../utils/severityUtils';
export default function SeverityBadge({ level }) { return <span className={'inline-flex rounded px-2.5 py-1 text-xs font-bold ' + severityColor(level)}>{level || 'LOW'}</span>; }
SeverityBadge.propTypes = { level: PropTypes.string };
SeverityBadge.defaultProps = { level: 'LOW' };
