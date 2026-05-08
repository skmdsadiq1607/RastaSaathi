import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import EmergencyMap from '../../components/map/EmergencyMap';
import SeverityBadge from '../../components/severity/SeverityBadge';
import SeverityGauge from '../../components/severity/SeverityGauge';
import ETAChip from '../../components/hospital/ETAChip';
import HospitalCard from '../../components/hospital/HospitalCard';
import FirstAidChat from '../../components/firstaid/FirstAidChat';
import EmergencyTimeline from '../../components/timeline/EmergencyTimeline';
import useSocket from '../../hooks/useSocket';
import { useGetIncidentQuery } from '../../features/incident/incident.api';
import { useGetTimelineQuery } from '../../features/timeline/timeline.api';
import { useFollowupMutation } from '../../features/firstaid/firstaid.api';

export default function ActiveEmergency() {
  const { incidentId } = useParams();
  const active = useSelector((state) => state.sos.activeSOS);
  const id = incidentId || active?._id;

  const { data } = useGetIncidentQuery(id, { skip: !id, pollingInterval: 30000 });
  const { data: timelineData } = useGetTimelineQuery(id, { skip: !id });

  const [tab, setTab] = useState('Status');
  const [incident, setIncident] = useState(null);
  const [events, setEvents] = useState([]);
  const [responderLocation, setResponderLocation] = useState(null);

  // First Aid state
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [steps, setSteps] = useState([]);
  const [sendFollowup] = useFollowupMutation();

  const { socket } = useSocket('/emergency', id);

  useEffect(() => { if (data?.data) setIncident(data.data); }, [data]);
  useEffect(() => { if (timelineData?.data) setEvents(timelineData.data); }, [timelineData]);

  // Listen for first aid guide from workflow
  useEffect(() => {
    if (!socket) return undefined;
    socket.on('sos:updated', setIncident);
    socket.on('timeline:update', (event) => setEvents((items) => [...items, event]));
    socket.on('responder:location', setResponderLocation);
    socket.on('eta:update', (eta) => setIncident((item) => item ? { ...item, route: { ...item.route, ...eta } } : item));
    socket.on('firstaid:ready', ({ sessionId: sid, messages: msgs, steps: s }) => {
      setSessionId(sid);
      setMessages(msgs);
      setSteps(s);
      setTab('First Aid');
    });
    return () => {
      socket.off('sos:updated');
      socket.off('timeline:update');
      socket.off('responder:location');
      socket.off('eta:update');
      socket.off('firstaid:ready');
    };
  }, [socket]);

  const handleSend = async (text) => {
    if (!sessionId) return;
    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    try {
      const res = await sendFollowup({ sessionId, question: text }).unwrap();
      setMessages(res.data.messages);
      setSteps(res.data.steps);
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, I could not connect right now. Please stay calm and call 108.' }]);
    }
  };

  const location = incident?.location?.coordinates
    ? { lat: incident.location.coordinates[1], lng: incident.location.coordinates[0] }
    : null;

  const tabs = ['Status', 'Hospital', 'First Aid', 'Timeline'];

  return (
    <div className="mx-auto grid h-[calc(100vh-100px)] max-w-[430px] grid-rows-[55%_45%] overflow-hidden rounded border border-border md:max-w-none">
      <EmergencyMap
        incidents={incident ? [incident] : []}
        hospitals={incident?.selectedHospital ? [incident.selectedHospital] : []}
        route={incident?.route}
        userLocation={location}
        responderLocation={responderLocation}
      />
      <section className="flex flex-col overflow-hidden bg-dark">
        <div className="grid grid-cols-4 gap-1 border-b border-border p-2 shrink-0">
          {tabs.map((item) => (
            <button
              key={item}
              onClick={() => setTab(item)}
              className={(tab === item ? 'bg-red-600 text-white' : 'bg-surface text-slate-300') + ' rounded px-2 py-2 text-xs font-semibold transition-colors'}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-auto p-3">
          {tab === 'Status' && (
            <div className="space-y-3">
              <SeverityBadge level={incident?.severity?.level} />
              <SeverityGauge score={incident?.severity?.score || 0} level={incident?.severity?.level || 'LOW'} />
              <ETAChip seconds={incident?.route?.etaSeconds || 0} />
              <p className="text-sm text-slate-300">
                Responder: {incident?.responder?.name || 'Assigning now…'}
              </p>
              {!incident && (
                <div className="rounded bg-slate-800 p-4 text-center text-sm text-slate-400 animate-pulse">
                  ⏳ Emergency workflow is running. Finding nearest hospital…
                </div>
              )}
            </div>
          )}
          {tab === 'Hospital' && incident?.selectedHospital && (
            <HospitalCard
              item={{ hospital: incident.selectedHospital, etaSeconds: incident.route?.etaSeconds, score: 0, reasoning: incident.severity?.reasoning }}
              selected
            />
          )}
          {tab === 'Hospital' && !incident?.selectedHospital && (
            <div className="rounded bg-slate-800 p-4 text-center text-sm text-slate-400 animate-pulse">
              ⏳ Selecting best hospital based on your location and injury…
            </div>
          )}
          {tab === 'First Aid' && (
            <FirstAidChat
              messages={messages}
              steps={steps}
              onSend={handleSend}
              disabled={!sessionId}
            />
          )}
          {tab === 'First Aid' && !sessionId && (
            <p className="mt-2 text-center text-xs text-slate-500">First aid guide is being generated… Please wait.</p>
          )}
          {tab === 'Timeline' && <EmergencyTimeline events={events} />}
        </div>
      </section>
    </div>
  );
}
