import { studio } from '@/common/apollo/studio';
import { ArtistEntity } from '@/common/entities/artist';
import { Artist as ArtistType } from '@/common/types';
import { InitializeStore } from '@/common/utils/initialize-store';
import CreateNewArtistMutation from '@/graphql/CreateNewArtist.gql';
import MyArtistsQuery from '@/graphql/MyArtists.gql';
import IsArtistExistsQuery from '@/graphql/IsArtistExists.gql';
import store from '@/store';
import { ExistsType } from '@xbeat/client-toolkit';
import { Maybe, Nullable } from '@xbeat/toolkit';
import { Action, getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators';

@Module({ dynamic: true, store, name: 'artist', namespaced: true })
export default class Artist extends VuexModule implements InitializeStore {
  isInitialized = false;
  artists: ArtistEntity[] = [];
  currentArtist: Nullable<ArtistEntity> = null;
  artistFetched = false;

  get hasUserArtists(): boolean {
    return !!this.artists.length;
  }

  @Mutation
  APP_INITIALIZED(): void {
    this.isInitialized = true;
  }

  @Mutation
  ARTIST_FETCHING_STARTED(): void {
    this.artistFetched = false;
  }

  @Mutation
  ARTIST_FETCHING_FINISHED(): void {
    this.artistFetched = true;
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
    this.APP_INITIALIZED();
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
    this.ARTIST_FETCHING_STARTED();

    const {
      data: { myArtists }
    } = await studio.query<{ myArtists: ArtistType[] }>({ query: MyArtistsQuery });

    this.SET_ARTISTS(myArtists);
    this.ARTIST_FETCHING_FINISHED();
  }

  @Action
  async userHasArtist(id: string): Promise<boolean> {
    return !!this.artists.find(({ url }) => id === url);
  }

  @Action
  async findArtist(searchCriteria: Partial<ArtistEntity>): Promise<Maybe<ArtistEntity>> {
    type Fields = keyof Pick<ArtistEntity, 'name' | 'url' | 'link' | 'header' | 'avatar'>;
    const fields = Object.keys(searchCriteria) as Fields[];

    return this.artists.find(artist => {
      return fields.every(field => searchCriteria[field] === artist[field]);
    });
  }

  @Action
  async isArtistExist(name: string): Promise<boolean> {
    const {
      data: {
        isArtistExists: { exists }
      }
    } = await studio.query<{ isArtistExists: ExistsType }>({
      query: IsArtistExistsQuery,
      variables: {
        artistInput: { name }
      }
    });

    return exists;
  }

  @Action
  async updateArtistAvatar({ id, file }: { id: string; file: Blob }): Promise<void> {
    // TODO: Upload file and update artist avatar
    console.log(id, file);
  }
}

export const ArtistModule = getModule(Artist);