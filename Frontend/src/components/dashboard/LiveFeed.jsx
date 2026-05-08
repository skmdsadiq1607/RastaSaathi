import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { formatDate } from '../../utils/formatters';
export default function LiveFeed({ events }) { const [filter, setFilter] = useState('All'); const filtered = filter === 'All' ? events : events.filter((event) => event.eventType?.toLowerCase().includes(filter.toLowerCase())); return <section className="rounded border border-border bg-surface p-4"><div className="mb-3 flex gap-2">{['All', 'SOS', 'Severity', 'Hospital', 'Resolved'].map((item) => <button key={item} onClick={() => setFilter(item)} className={(filter === item ? 'bg-red-600' : 'bg-slate-800') + ' rounded px-2 py-1 text-xs'}>{item}</button>)}</div><div className="max-h-[520px] space-y-2 overflow-auto">{filtered.slice(0, 50).map((event) => <motion.div key={event._id} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="rounded bg-slate-900 p-2 text-sm"><p>{event.message}</p><p className="text-xs text-slate-500">{formatDate(event.createdAt)}</p></motion.div>)}</div></section>; }
LiveFeed.propTypes = { events: PropTypes.arrayOf(PropTypes.object) };
LiveFeed.defaultProps = { events: [] };
