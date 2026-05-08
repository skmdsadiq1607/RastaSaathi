import PropTypes from 'prop-types';
import { Clock3 } from 'lucide-react';
import { formatEta } from '../../utils/formatters';
export default function ETAChip({ seconds }) { return <span className="inline-flex items-center gap-1 rounded bg-slate-800 px-2 py-1 font-mono text-xs text-slate-100"><Clock3 className="h-3.5 w-3.5" />{formatEta(seconds)}</span>; }
ETAChip.propTypes = { seconds: PropTypes.number };
ETAChip.defaultProps = { seconds: 0 };
