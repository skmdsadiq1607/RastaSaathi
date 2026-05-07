import { useParams } from 'react-router-dom';
import EmergencyTimeline from '../../components/timeline/EmergencyTimeline';
import { useGetTimelineQuery } from '../../features/timeline/timeline.api';
export default function Timeline() { const { incidentId } = useParams(); const { data } = useGetTimelineQuery(incidentId); return <div><h1 className="mb-4 text-2xl font-bold">Emergency Timeline</h1><EmergencyTimeline events={data?.data || []} /></div>; }
