import Vue from 'vue';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);

function loadLocaleMessages() {
  const locales = require.context('../i18n', true, /[A-Za-z0-9-_,\s]+\.json$/i);
  const messages: Record<string, any> = {};
  locales.keys().forEach(key => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i);
    if (matched && matched.length > 1) {
      const locale = matched[1];
      messages[locale] = locales(key);
    }
  });
  return messages;
}

function detectLanguage() {
  const lng = (window.navigator as any).userLanguage || window.navigator.language;
  const locales = require.context('../i18n', true, /[A-Za-z0-9-_,\s]+\.json$/i);
  const lang = locales.keys().find(key => lng.includes(key.replace('./', '').replace('.json', '')));
  return lang ? lang.replace('./', '').replace('.json', '') : null;
}

function CISPluralizationRule(choice: number, choicesLength: number) {
  if (choice === 0) {
    return 0;
  }

  const teen = choice > 10 && choice < 20;
  const endsWithOne = choice % 10 === 1;

  if (choicesLength < 4) {
    return !teen && endsWithOne ? 1 : 2;
  }
  if (!teen && endsWithOne) {
    return 1;
  }
  if (!teen && choice % 10 >= 2 && choice % 10 <= 4) {
    return 2;
  }

  return choicesLength < 4 ? 2 : 3;
}

export default new VueI18n({
  locale: localStorage.getItem('lang') || detectLanguage() || process.env.VUE_APP_I18N_LOCALE,
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'en',
  messages: loadLocaleMessages(),
  pluralizationRules: {
    ru: CISPluralizationRule,
    ul: CISPluralizationRule
  }
});
