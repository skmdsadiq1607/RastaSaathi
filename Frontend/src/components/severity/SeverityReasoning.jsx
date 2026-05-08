import PropTypes from 'prop-types';
export default function SeverityReasoning({ reasoning }) { return <p className="rounded border border-border bg-surface p-3 text-sm text-slate-200">{reasoning || 'Severity reasoning will appear as soon as triage completes.'}</p>; }
SeverityReasoning.propTypes = { reasoning: PropTypes.string };
SeverityReasoning.defaultProps = { reasoning: '' };
