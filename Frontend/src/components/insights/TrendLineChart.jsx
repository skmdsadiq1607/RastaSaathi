import PropTypes from 'prop-types';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
export default function TrendLineChart({ data }) { return <div className="h-64 rounded border border-border bg-surface p-3"><ResponsiveContainer><LineChart data={data}><XAxis dataKey="date" /><YAxis /><Tooltip /><Line type="monotone" dataKey="count" stroke="#DC2626" strokeWidth={3} /></LineChart></ResponsiveContainer></div>; }
TrendLineChart.propTypes = { data: PropTypes.arrayOf(PropTypes.object) };
TrendLineChart.defaultProps = { data: [] };
