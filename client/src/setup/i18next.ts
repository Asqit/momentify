import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import english from '~/assets/locales/en-lang.json';
import czech from '~/assets/locales/cs-lang.json';

const resources = {
	en: { translation: english },
	cz: { translation: czech },
};

i18next.use(initReactI18next).use(LanguageDetector).init({
	resources,
	fallbackLng: 'en',
	debug: false,
});
