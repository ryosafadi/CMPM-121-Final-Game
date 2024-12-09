import translations from '/translations.json';

export function getTranslation(key) {
  const lang = localStorage.getItem('language') || 'en';
  return translations[lang][key] || translations['en'][key];
}