import PropTypes from 'prop-types';
import { CheckCircle2, Phone } from 'lucide-react';
import ETAChip from './ETAChip';
import ResourceBadges from './ResourceBadges';
import AIDecisionCard from '../transparency/AIDecisionCard';
export default function HospitalCard({ item, selected }) { const hospital = item?.hospital || item; return <article className={(selected ? 'border-green-500' : 'border-border') + ' rounded border bg-surface p-4'}><div className="flex items-start justify-between gap-3"><div><h3 className="font-bold">{hospital?.name}</h3><p className="text-sm text-slate-400">{hospital?.address}</p></div>{selected && <CheckCircle2 className="h-5 w-5 text-green-400" />}</div><div className="mt-3 flex items-center gap-2"><ETAChip seconds={item?.etaSeconds || 0} /><span className="rounded bg-slate-800 px-2 py-1 text-xs">Score {item?.score ?? 0}</span><a aria-label="Call hospital" href={'tel:' + (hospital?.emergencyContact || hospital?.phone || '')} className="rounded bg-red-600 p-2"><Phone className="h-4 w-4" /></a></div><div className="mt-3"><ResourceBadges resources={item?.resource} hospital={hospital} /></div><div className="mt-3"><AIDecisionCard reasoning={item?.reasoning} confidence={(item?.score || 90) / 100} components={item?.components} /></div></article>; }
HospitalCard.propTypes = { item: PropTypes.object.isRequired, selected: PropTypes.bool };
HospitalCard.defaultProps = { selected: false };
