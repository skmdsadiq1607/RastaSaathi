import { useState } from 'react';
import EmergencyMap from '../../components/map/EmergencyMap';
import HospitalCard from '../../components/hospital/HospitalCard';
import { useHotspotsQuery } from '../../features/insights/insights.api';
import { useLiveQuery } from '../../features/dashboard/dashboard.api';
import { useListHospitalsQuery } from '../../features/hospital/hospital.api';
export default function LiveMap() { const [selected, setSelected] = useState(null); const [heat, setHeat] = useState(false); const { data: live } = useLiveQuery(undefined, { pollingInterval: 10000 }); const { data: hospitals } = useListHospitalsQuery(); const { data: hotspots } = useHotspotsQuery('30d', { skip: !heat }); return <div className="relative h-[calc(100vh-120px)] overflow-hidden rounded border border-border"><button onClick={() => setHeat(!heat)} className="absolute left-3 top-3 z-10 rounded bg-slate-900 px-3 py-2 text-sm">Heatmap</button><EmergencyMap incidents={live?.data || []} hospitals={hospitals?.data || []} heatmap={hotspots?.data} onIncidentClick={setSelected} />{selected && <div className="absolute right-3 top-3 z-10 w-96 max-w-[calc(100%-24px)]"><HospitalCard item={{ hospital: selected.selectedHospital || {}, etaSeconds: selected.route?.etaSeconds, reasoning: selected.severity?.reasoning }} /></div>}</div>; }
