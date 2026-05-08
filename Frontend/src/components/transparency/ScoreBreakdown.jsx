import PropTypes from 'prop-types';
export default function ScoreBreakdown({ components }) { return <div className="space-y-2">{Object.entries(components || {}).map(([key, value]) => <label key={key} className="block"><div className="flex justify-between text-xs text-slate-300"><span>{key}</span><span>{Math.round(value)}</span></div><progress value={Math.max(0, Math.min(100, value))} max="100" className="h-2 w-full accent-red-500" /></label>)}</div>; }
ScoreBreakdown.propTypes = { components: PropTypes.object };
ScoreBreakdown.defaultProps = { components: {} };
