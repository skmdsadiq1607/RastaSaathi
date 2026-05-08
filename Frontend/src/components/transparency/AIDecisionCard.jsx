import PropTypes from 'prop-types';
import { Brain } from 'lucide-react';
import { useState } from 'react';
import ScoreBreakdown from './ScoreBreakdown';
export default function AIDecisionCard({ reasoning, confidence, components }) { const [open, setOpen] = useState(false); return <div className="rounded border border-border bg-surface p-3"><button aria-label="Toggle AI decision explanation" onClick={() => setOpen(!open)} className="flex w-full items-center justify-between text-left"><span className="flex items-center gap-2 font-semibold"><Brain className="h-4 w-4 text-red-400" />Why did AI choose this?</span><span className="rounded bg-slate-800 px-2 py-1 text-xs">{Math.round((confidence || 0.9) * 100)}% confident</span></button>{open && <div className="mt-3 space-y-3 text-sm text-slate-300"><ScoreBreakdown components={components} /><p>{reasoning}</p><p className="text-xs text-slate-500">Powered by Claude</p></div>}</div>; }
AIDecisionCard.propTypes = { reasoning: PropTypes.string, confidence: PropTypes.number, components: PropTypes.object };
AIDecisionCard.defaultProps = { reasoning: 'Decision derived from RoadSoS emergency context.', confidence: 0.9, components: {} };
