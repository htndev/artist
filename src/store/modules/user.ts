import { passport } from '@/common/apollo/passport';
import { EMPTY_TOKENS } from '@/common/constants/constants';
import { Tokens, User as UserType } from '@/common/types';
import { InitializeStore } from '@/common/utils/initialize-store';
import TokensQuery from '@/graphql/Tokens.gql';
import store from '@/store';
import { isNil, isNull, Nullable } from '@xbeat/toolkit';
import { Action, getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators';

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

  @Mutation
  SET_TOKENS(tokens: Tokens): void {
    this.tokens = tokens;
  }

  @Action
  async initialize(): Promise<void> {
    await this.fetchTokens();
  }

  @Action
  async logout(): Promise<void> {
    console.log('Logout');
  }

  @Action
  setTokens(tokens: Record<string, string>): void {
    this.SET_TOKENS(tokens as Tokens);
  }

  @Action
  async fetchTokens(): Promise<void> {
    try {
      const response = await passport.query<{ tokens: Tokens }>({ query: TokensQuery });

      if (response.errors) {
        throw response.errors;
      }

      this.SET_TOKENS(response.data.tokens);
    } catch (e) {
      console.log(Object.entries(e));
    }
  }
}

export const UserModule = getModule(User);
