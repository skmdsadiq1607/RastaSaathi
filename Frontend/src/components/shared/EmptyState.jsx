import PropTypes from 'prop-types';
export default function EmptyState({ title, body }) { return <div className="rounded border border-border bg-surface p-6 text-center"><p className="font-semibold">{title}</p><p className="mt-1 text-sm text-slate-400">{body}</p></div>; }
EmptyState.propTypes = { title: PropTypes.string.isRequired, body: PropTypes.string.isRequired };
