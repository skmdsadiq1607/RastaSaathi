import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import TimelineEvent from './TimelineEvent';
export default function EmergencyTimeline({ events }) { return <ol className="relative space-y-1 before:absolute before:left-4 before:top-0 before:h-full before:w-px before:bg-slate-700">{events.map((event) => <motion.div key={event._id || event.createdAt} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}><TimelineEvent event={event} /></motion.div>)}</ol>; }
EmergencyTimeline.propTypes = { events: PropTypes.arrayOf(PropTypes.object) };
EmergencyTimeline.defaultProps = { events: [] };
