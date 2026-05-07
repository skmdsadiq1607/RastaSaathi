import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { ShieldAlert } from 'lucide-react';
import { useRef } from 'react';
export default function SOSButton({ disabled, onTap, onLongPress }) { const timer = useRef(null); const start = () => { timer.current = window.setTimeout(onLongPress, 500); }; const end = () => { window.clearTimeout(timer.current); }; return <motion.button aria-label="Activate Emergency SOS" disabled={disabled} onClick={onTap} onPointerDown={start} onPointerUp={end} onPointerLeave={end} animate={disabled ? {} : { scale: [1, 1.15, 1] }} transition={{ repeat: Infinity, duration: 1.6 }} className={(disabled ? 'bg-slate-600' : 'bg-red-600') + ' grid h-[180px] w-[180px] place-items-center rounded-full text-white shadow-2xl shadow-red-950 disabled:cursor-not-allowed'}><span className="flex flex-col items-center gap-2 text-3xl font-black"><ShieldAlert className="h-12 w-12" />SOS</span></motion.button>; }
SOSButton.propTypes = { disabled: PropTypes.bool, onTap: PropTypes.func.isRequired, onLongPress: PropTypes.func.isRequired };
SOSButton.defaultProps = { disabled: false };
