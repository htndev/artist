import { studio } from '@/common/apollo/studio';
import { ArtistEntity } from '@/common/entities/artist';
import { Artist as ArtistType } from '@/common/types';
import { InitializeStore } from '@/common/utils/initialize-store';
import CreateNewArtistMutation from '@/graphql/CreateNewArtist.gql';
import MyArtistsQuery from '@/graphql/MyArtists.gql';
import store from '@/store';
import { Nullable } from '@xbeat/toolkit';
import { Action, getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators';

@Module({ dynamic: true, store, name: 'artist', namespaced: true })
export default class Artist extends VuexModule implements InitializeStore {
  artists: ArtistEntity[] = [];
  private _currentArtist: Nullable<ArtistEntity> = null;

  get currentArtist(): Nullable<ArtistEntity> {
    return this._currentArtist;
  }

  set currentArtist(artist: Nullable<ArtistEntity>) {
    this._currentArtist = artist;
  }

  get hasUserArtists(): boolean {
    return !!this.artists.length;
  }

  @Mutation
  SET_ARTISTS(artists: ArtistType[]): void {
    this.artists = artists.map(artist => new ArtistEntity(artist));
  }

  @Mutation
  SET_CURRENT_ARTIST(id: string): void {
    this.currentArtist = this.artists.find(artist => artist.url === id) as ArtistEntity;
  }

  @Action
  async initialize(): Promise<void> {
    await this.getUserArtists();
  }

  @Action
  async createNewArtist(name: string): Promise<void> {
    await studio.mutate({
      mutation: CreateNewArtistMutation,
      variables: { newArtistInput: { name } }
    });

    await this.getUserArtists();
  }

  @Action
  async getUserArtists(): Promise<void> {
    const {
      data: { myArtists }
    } = await studio.query<{ myArtists: ArtistType[] }>({ query: MyArtistsQuery });

    this.SET_ARTISTS(myArtists);
  }
}

export const ArtistModule = getModule(Artist);
