import { passport } from '@/common/apollo/passport';
import { CLIENTS, EMPTY_TOKENS, STUDIO_REDIRECT_QUERY_PARAM } from '@/common/constants/constants';
import { Tokens, User as UserType } from '@/common/types';
import { InitializeStore } from '@/common/utils/initialize-store';
import { redirect } from '@/common/utils/redirect';
import LogoutMutation from '@/graphql/Logout.gql';
import MeQuery from '@/graphql/Me.gql';
import TokensQuery from '@/graphql/Tokens.gql';
import store from '@/store';
import { StatusType } from '@xbeat/client-toolkit';
import { isNil, isNull, Nullable } from '@xbeat/toolkit';
import { Action, getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators';

@Module({ dynamic: true, store, name: 'user', namespaced: true })
export class User extends VuexModule implements InitializeStore {
  isInitialized = false;
  private isUserFetching = false;
  private identity: Nullable<UserType> = null;

  tokens: Tokens = { ...EMPTY_TOKENS };

  get hasTokens(): boolean {
    return Object.keys(this.tokens).length > 0;
  }

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
  APP_INITIALIZED(): void {
    this.isInitialized = true;
  }

  @Mutation
  SET_TOKENS(tokens: Tokens): void {
    this.tokens = tokens;
  }

  @Mutation
  SET_USER(user: UserType): void {
    this.identity = user;
  }

  @Mutation
  LOGOUT(): void {
    this.identity = null;
    this.tokens = { ...EMPTY_TOKENS };
  }

  @Action
  async initialize(): Promise<void> {
    await this.fetchTokens();
    await this.identify();
    this.APP_INITIALIZED();
  }

  @Action
  async logout(): Promise<void> {
    try {
      const { errors } = await passport.mutate<{ logout: StatusType }>({
        mutation: LogoutMutation
      });

      if (errors) {
        throw errors;
      }

      redirect(`${CLIENTS.ID}/${STUDIO_REDIRECT_QUERY_PARAM}`);
    } catch (e) {
      console.log(e);
    }
  }

  @Action
  async fetchTokens(): Promise<void> {
    try {
      const { data, errors } = await passport.query<{ tokens: Tokens }>({ query: TokensQuery });

      if (errors) {
        throw errors;
      }

      this.SET_TOKENS(data.tokens);
    } catch (e) {
      redirect(`${CLIENTS.ID}/${STUDIO_REDIRECT_QUERY_PARAM}`);
    }
  }

  @Action
  async identify(): Promise<void> {
    const { data, errors } = await passport.query<{ me: UserType }>({ query: MeQuery });

    if (errors) {
      throw errors;
    }

    this.SET_USER(data.me);
  }
}

export const UserModule = getModule(User);
