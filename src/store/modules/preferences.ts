import { passport } from '@/common/apollo/passport';
import { Language, LanguageName, LanguageWithName } from '@/common/constants/language';
import { Preferences as PreferencesType } from '@/common/types';
import { InitializeStore } from '@/common/utils/initialize-store';
import AvailableLanguages from '@/graphql/AvailableLanguages.gql';
import GetPreferences from '@/graphql/GetPreferences.gql';
import i18n from '@/plugins/i18n';
import store from '@/store';
import { Action, getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators';

@Module({ dynamic: true, store, name: 'preferences', namespaced: true })
export class Preferences extends VuexModule implements InitializeStore {
  isInitialized = false;
  language = Language.EN;
  _availableLanguages: Language[] = [];

  loading = {
    language: false
  };

  get availableLanguages(): Language[] {
    return this._availableLanguages;
  }

  get currentLanguage(): LanguageWithName {
    return {
      value: this.language,
      label: LanguageName[this.language]
    };
  }

  get languages(): LanguageWithName[] {
    return Object.values(Language).map((key: Language) => ({
      value: key,
      label: LanguageName[key]
    }));
  }

  @Mutation
  APP_INITIALIZED(): void {
    this.isInitialized = true;
  }

  @Mutation
  SET_AVAILABLE_LANGUAGES(languages: Language[]): void {
    this._availableLanguages = languages;
  }

  @Mutation
  SET_CURRENT_LANGUAGE(language: Language): void {
    i18n.locale = language;
    this.language = language;
  }

  @Action
  async initialize(): Promise<void> {
    const {
      data: {
        availableLanguages: { languages }
      }
    } = await passport.query<{ availableLanguages: { languages: Language[] } }>({
      query: AvailableLanguages
    });

    this.SET_AVAILABLE_LANGUAGES(languages);

    const {
      data: { getPreferences: preferences }
    } = await passport.query<{ getPreferences: PreferencesType }>({
      query: GetPreferences
    });

    this.SET_CURRENT_LANGUAGE(preferences.language);
    this.APP_INITIALIZED();
  }
}

export const PreferencesModule = getModule(Preferences);
