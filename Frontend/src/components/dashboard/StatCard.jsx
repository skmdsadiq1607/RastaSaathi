import PropTypes from 'prop-types';
export default function StatCard({ label, value, tone }) { return <div className={'rounded border border-border bg-surface p-4 ' + tone}><p className="text-sm text-slate-400">{label}</p><p className="mt-2 font-mono text-3xl font-black">{value}</p></div>; }
StatCard.propTypes = { label: PropTypes.string.isRequired, value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired, tone: PropTypes.string };
StatCard.defaultProps = { tone: '' };
