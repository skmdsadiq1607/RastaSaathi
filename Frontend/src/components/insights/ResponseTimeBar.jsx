import PropTypes from 'prop-types';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
export default function ResponseTimeBar({ data }) { const items = Object.entries(data || {}).map(([region, seconds]) => ({ region, minutes: Math.round(seconds / 60) })); return <div className="h-64 rounded border border-border bg-surface p-3"><ResponsiveContainer><BarChart data={items}><XAxis dataKey="region" /><YAxis /><Tooltip /><Bar dataKey="minutes" fill="#16A34A" /></BarChart></ResponsiveContainer></div>; }
ResponseTimeBar.propTypes = { data: PropTypes.object };
ResponseTimeBar.defaultProps = { data: {} };
