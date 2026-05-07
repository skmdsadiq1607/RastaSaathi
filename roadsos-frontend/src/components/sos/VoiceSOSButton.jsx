import PropTypes from 'prop-types';
import { Mic } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import useVoiceDetection from '../../hooks/useVoiceDetection';
export default function VoiceSOSButton({ language, onDetected }) { const voice = useVoiceDetection(language); const press = () => { voice.startListening(); }; useEffect(() => { if (voice.keywordDetected) onDetected(voice.transcript); }, [voice.keywordDetected, voice.transcript, onDetected]); return <button aria-label="Voice SOS" onClick={press} className="flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-2 text-sm"><motion.span animate={voice.isListening ? { scale: [1, 1.25, 1] } : {}} transition={{ repeat: Infinity, duration: 1 }}><Mic className={voice.isListening ? 'h-5 w-5 text-red-400' : 'h-5 w-5'} /></motion.span>{voice.isListening ? 'Listening...' : 'Voice'}</button>; }
VoiceSOSButton.propTypes = { language: PropTypes.string.isRequired, onDetected: PropTypes.func.isRequired };
