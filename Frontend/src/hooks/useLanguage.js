import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { setLanguage } from '../features/language/language.slice';
export default function useLanguage() { const { t, i18n } = useTranslation(); const dispatch = useDispatch(); const language = useSelector((state) => state.language.language); const changeLanguage = (value) => { dispatch(setLanguage(value)); i18n.changeLanguage(value); }; return { t, language, changeLanguage, loading: false, error: null }; }
