import PropTypes from 'prop-types';
export default function ResponderStatus({ responder }) { return <div className="rounded border border-border bg-surface p-3"><p className="font-semibold">{responder?.name || 'No responder assigned'}</p><p className="text-sm text-slate-400">{responder?.responderStatus || 'Awaiting assignment'}</p></div>; }
ResponderStatus.propTypes = { responder: PropTypes.object };
ResponderStatus.defaultProps = { responder: null };
