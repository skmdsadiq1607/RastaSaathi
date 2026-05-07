import PropTypes from 'prop-types';
import { Ambulance, Brain, Check, Clock, Hospital, User } from 'lucide-react';
import { formatDate } from '../../utils/formatters';
const icons = { 'sos:created': User, 'severity:predicted': Brain, 'hospital:selected': Hospital, 'alert:dispatched': Ambulance, 'incident:resolved': Check };
export default function TimelineEvent({ event }) { const Icon = icons[event.eventType] || Clock; return <li className="relative flex gap-3 pb-4"><span className={(event.status === 'PENDING' ? 'border border-slate-400 bg-dark' : 'bg-red-600') + ' z-10 grid h-8 w-8 place-items-center rounded-full'}><Icon className="h-4 w-4" /></span><div><p className="font-medium">{event.description}</p><p className="text-xs text-slate-400">{event.actor} · {formatDate(event.createdAt)}</p></div></li>; }
TimelineEvent.propTypes = { event: PropTypes.object.isRequired };
