import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { setLanguage } from '../../features/language/language.slice';
export default function LanguageSwitcher() { const { i18n } = useTranslation(); const dispatch = useDispatch(); const language = useSelector((state) => state.language.language); const change = (event) => { dispatch(setLanguage(event.target.value)); i18n.changeLanguage(event.target.value); }; return <select aria-label="Language" value={language} onChange={change} className="rounded border border-border bg-surface px-2 py-2 text-sm"><option value="en">EN</option><option value="hi">HI</option><option value="ta">TA</option><option value="te">TE</option><option value="kn">KN</option></select>; }
