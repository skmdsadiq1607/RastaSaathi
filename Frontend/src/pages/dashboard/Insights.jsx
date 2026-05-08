import { useState } from 'react';
import HotspotChart from '../../components/insights/HotspotChart';
import ResponseTimeBar from '../../components/insights/ResponseTimeBar';
import SeverityPieChart from '../../components/insights/SeverityPieChart';
import TrendLineChart from '../../components/insights/TrendLineChart';
import { useHotspotsQuery, useTrendsQuery } from '../../features/insights/insights.api';
export default function Insights() { const [period, setPeriod] = useState('30d'); const { data: hotspots } = useHotspotsQuery(period); const { data: trends } = useTrendsQuery(period); const t = trends?.data || {}; return <div className="space-y-4"><div className="flex gap-2">{['7d', '30d', '90d'].map((item) => <button key={item} onClick={() => setPeriod(item)} className={(period === item ? 'bg-red-600' : 'bg-surface') + ' rounded px-3 py-2'}>{item}</button>)}</div><HotspotChart geojson={hotspots?.data} /><div className="grid gap-4 lg:grid-cols-3"><SeverityPieChart data={t.severityDistribution} /><TrendLineChart data={t.daily} /><ResponseTimeBar data={t.avgHospitalEtaByRegion} /></div><section className="rounded border border-border bg-surface p-4"><h2 className="font-bold">Top injury types</h2>{(t.commonInjuryTypes || []).map((item) => <p key={item.injuryType} className="mt-2 text-sm">{item.injuryType}: {item.count}</p>)}</section></div>; }
