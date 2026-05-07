import PropTypes from 'prop-types';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
const colors = ['#DC2626', '#EA580C', '#D97706', '#16A34A'];
export default function SeverityPieChart({ data }) { const items = Object.entries(data || {}).map(([name, value]) => ({ name, value })); return <div className="h-64 rounded border border-border bg-surface p-3"><ResponsiveContainer><PieChart><Pie data={items} dataKey="value" nameKey="name">{items.map((item, index) => <Cell key={item.name} fill={colors[index % colors.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></div>; }
SeverityPieChart.propTypes = { data: PropTypes.object };
SeverityPieChart.defaultProps = { data: {} };
