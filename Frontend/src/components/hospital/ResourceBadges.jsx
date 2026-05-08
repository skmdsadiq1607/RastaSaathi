import PropTypes from 'prop-types';
import { Ambulance, Droplets, Hospital, Wind } from 'lucide-react';
export default function ResourceBadges({ resources, hospital }) { const data = resources || {}; return <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4"><span className="rounded bg-slate-800 p-2"><Hospital className="mb-1 h-4 w-4 text-green-400" />ICU {data.icuBeds ?? hospital?.icuBeds ?? 0}</span><span className="rounded bg-slate-800 p-2"><Wind className="mb-1 h-4 w-4 text-sky-400" />Vent {data.ventilators ?? 0}</span><span className="rounded bg-slate-800 p-2"><Droplets className="mb-1 h-4 w-4 text-red-400" />Blood {hospital?.bloodBankAvailable ? 'Yes' : 'Check'}</span><span className="rounded bg-slate-800 p-2"><Ambulance className="mb-1 h-4 w-4 text-amber-400" />Amb {data.ambulancesAvailable ?? 0}</span></div>; }
ResourceBadges.propTypes = { resources: PropTypes.object, hospital: PropTypes.object };
ResourceBadges.defaultProps = { resources: null, hospital: null };
