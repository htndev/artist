import { Tokens, User as UserType } from '@/common/types';
import { isNil, isNull, Nullable } from '@xbeat/toolkit';
import { Action, getModule, Module, VuexModule } from 'vuex-module-decorators';
import store from '@/store';
import { EMPTY_TOKENS } from '@/common/constants/constants';
import { InitializeStore } from '@/common/utils/initialize-store';

@Module({ dynamic: true, store, name: 'user', namespaced: true })
export class User extends VuexModule implements InitializeStore {
  private isUserFetching = false;
  private identity: Nullable<UserType> = null;

  tokens: Tokens = { ...EMPTY_TOKENS };

  get user(): Nullable<UserType> {
    return this.identity;
  }

  get hasAvatar(): boolean {
    return this.isUserInitialized ? !isNil(this.user?.avatar) : false;
  }

  get avatar(): Nullable<string> {
    return this.hasAvatar ? (this.user as UserType).avatar : null;
  }

  get isUserInitialized(): boolean {
    return !isNull(this.user);
  }

  async initialize(): Promise<void> {
    console.log('init');
  }
}

export const UserModule = getModule(User);
