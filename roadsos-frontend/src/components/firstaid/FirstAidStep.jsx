import PropTypes from 'prop-types';
import { HeartPulse } from 'lucide-react';
export default function FirstAidStep({ step }) { return <div className="flex gap-3 rounded border border-border bg-white p-3 text-slate-900"><div className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-red-600 text-sm font-bold text-white">{step.stepNumber}</div><div><HeartPulse className="mb-1 h-4 w-4 text-red-600" /><p className="text-sm">{step.text}</p></div></div>; }
FirstAidStep.propTypes = { step: PropTypes.shape({ stepNumber: PropTypes.number, text: PropTypes.string }).isRequired };
