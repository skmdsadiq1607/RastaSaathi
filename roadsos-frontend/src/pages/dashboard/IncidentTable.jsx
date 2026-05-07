import IncidentRow from '../../components/dashboard/IncidentRow';
import {
  useAssignMutation,
  useEscalateMutation,
  useLiveQuery,
  useResolveMutation
} from '../../features/dashboard/dashboard.api';

export default function IncidentTable() {
  const { data } = useLiveQuery(undefined, { pollingInterval: 10000 });
  const [assign] = useAssignMutation();
  const [resolve] = useResolveMutation();
  const [escalate] = useEscalateMutation();
  const incidents = data?.data || [];

  const csv = () => {
    const rows = incidents.map((item) =>
      [item._id, item.victim?.name, item.severity?.level, item.status].join(',')
    );
    const blob = new Blob(['Incident ID,Victim,Severity,Status\n' + rows.join('\n')], {
      type: 'text/csv'
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'roadsos-incidents.csv';
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-3">
      <button onClick={csv} className="rounded bg-slate-800 px-3 py-2">
        Export CSV
      </button>
      <div className="overflow-auto rounded border border-border">
        <table className="w-full min-w-[980px]">
          <thead>
            <tr className="bg-surface text-left text-sm">
              <th>Incident ID</th>
              <th>Victim</th>
              <th>Severity</th>
              <th>Location</th>
              <th>Responder</th>
              <th>ETA</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {incidents.map((incident) => (
              <IncidentRow
                key={incident._id}
                incident={incident}
                onAssign={(item) => assign({ id: item._id })}
                onResolve={(item) => resolve({ id: item._id })}
                onEscalate={(item) => escalate({ id: item._id })}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
