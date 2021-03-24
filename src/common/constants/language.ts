export enum Language {
  EN = 'en',
  RU = 'ru',
  UK = 'uk',
  DE = 'de'
}

export const LanguageName: { [k in Language]: string } = {
  [Language.EN]: 'English',
  [Language.RU]: 'Русский',
  [Language.UK]: 'Українська',
  [Language.DE]: 'Deutsche'
};

export type LanguageWithName = { label: string; value: Language };

export const ALLOWED_LANGUAGES = Object.values(Language);
