import _ from 'lodash';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import moment from 'moment';
import enLocale from './locales/en.json';
import itLocale from './locales/it.json';
import ruLocale from './locales/ru.json';
import TimeAgo from 'react-timeago';
import enStrings from 'react-timeago/lib/language-strings/en';
import itaStrings from 'react-timeago/lib/language-strings/it';
import ruStrings from 'react-timeago/lib/language-strings/ru';
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter';

const languageDetector = {
  type: 'languageDetector',
  async: true, // flags below detection to be async
  detect: async (callback) => {
    const userLanguage = 'it';
    if (!_.isNil(userLanguage)) {
      callback(userLanguage);
      moment.locale(userLanguage);
    }
  },
  init: () => {},
  cacheUserLanguage: () => {},
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'it',

    resources: {
      en: enLocale,
      it: itLocale,
      ru: ruLocale,
    },
    ns: ['common'],
    defaultNS: 'common',
    debug: true,

    // cache: {
    //   enabled: true
    // },

    interpolation: {
      escapeValue: false, // not needed for react as it does escape per default to prevent xss!
    },
  });

export const isLanguageSupported = (language) => {
  if (language === 'en' || language === 'it' || language === 'ru') return true;

  return false;
};

export default i18n;
