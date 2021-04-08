import { passport } from '@/common/apollo/passport';
import { CLIENTS, EMPTY_TOKENS, STUDIO_REDIRECT_QUERY_PARAM } from '@/common/constants/constants';
import { Tokens, User as UserType } from '@/common/types';
import { InitializeStore } from '@/common/utils/initialize-store';
import TokensQuery from '@/graphql/Tokens.gql';
import MeQuery from '@/graphql/Me.gql';
import LogoutMutation from '@/graphql/Logout.gql';
import store from '@/store';
import { isNil, isNull, Nullable } from '@xbeat/toolkit';
import { Action, getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators';
import { StatusType } from '@xbeat/client-toolkit';
import { redirect } from '@/common/utils/redirect';

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
      console.log(Object.entries(e));
    }
  }

  @Action
  async identify(): Promise<void> {
    try {
      const { data, errors } = await passport.query<{ me: UserType }>({ query: MeQuery });
      console.log(errors);

      if (errors) {
        throw errors;
      }

      this.SET_USER(data.me);
    } catch (e) {
      console.log('error...');
    }
  }
}

export const UserModule = getModule(User);
