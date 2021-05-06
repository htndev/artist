import { studio } from '@/common/apollo/studio';
import mediaEndpoint from '@/common/endpoints/media';
import { Album } from '@/common/entities/album';
import { ArtistEntity } from '@/common/entities/artist';
import { Artist as ArtistType, Song } from '@/common/types';
import { InitializeStore } from '@/common/utils/initialize-store';
import { sleep } from '@/common/utils/sleep';
import CreateNewAlbumMutation from '@/graphql/CreateNewAlbum.gql';
import CreateNewArtistMutation from '@/graphql/CreateNewArtist.gql';
import GetAlbumsQuery from '@/graphql/GetAlbums.gql';
import IsArtistExistsQuery from '@/graphql/IsArtistExists.gql';
import MyArtistsQuery from '@/graphql/MyArtists.gql';
import UpdateArtistAvatarMutation from '@/graphql/UpdateArtistAvatar.gql';
import UpdateArtistHeaderMutation from '@/graphql/UpdateArtistHeader.gql';
import store from '@/store';
import { ExistsType } from '@xbeat/client-toolkit';
import { isNull, Maybe, Nullable } from '@xbeat/toolkit';
import Vue from 'vue';
import { Action, getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators';

type RawAlbum = { name: string; cover: Nullable<string>; released: string; url: string };

@Module({ dynamic: true, store, name: 'artist', namespaced: true })
export default class Artist extends VuexModule implements InitializeStore {
  isInitialized = false;
  isAlbumPublishing = false;
  isAlbumsFetching = false;
  artists: ArtistEntity[] = [];
  currentArtist: Nullable<ArtistEntity> = null;
  currentArtistAlbums: Album[] = [];
  artistFetched = false;
  publishingSteps = 0;
  publishedSteps = 0;

  get hasUserArtists(): boolean {
    return !!this.artists.length;
  }

  get publishingPercentage(): number {
    return Math.round((100 / this.publishingSteps) * this.publishedSteps);
  }

  @Mutation
  ALBUMS_FETCHING_STARTED(): void {
    this.isAlbumsFetching = true;
  }

  @Mutation
  ALBUMS_FETCHING_COMPLETED(): void {
    this.isAlbumsFetching = false;
  }

  @Mutation
  ALBUM_PUBLISH_STARTED(): void {
    this.isAlbumPublishing = true;
  }

  @Mutation
  ALBUM_PUBLISH_COMPLETED(): void {
    this.isAlbumPublishing = false;
  }

  @Mutation
  SET_PUBLISHING_STEPS(number: number): void {
    this.publishingSteps = number;
  }

  @Mutation
  SET_PUBLISHED_STEPS(number: number): void {
    this.publishedSteps = number;
  }

  @Mutation
  RESET_PUBLISHING_STEPS(): void {
    this.publishedSteps = 0;
    this.publishingSteps = 0;
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
  SET_ARTIST_AVATAR({ url, avatar }: { url: string; avatar: string }): void {
    const artistIndex = findArtistIndex(this.artists, 'url', url);
    const artist = this.artists[artistIndex];

    artist.avatar = avatar;

    Vue.set(this.artists, artistIndex, artist);
  }

  @Mutation
  SET_ARTIST_HEADER({ url, header }: { url: string; header: string }): void {
    const artistIndex = findArtistIndex(this.artists, 'url', url);
    const artist = this.artists[artistIndex];

    artist.header = header;

    Vue.set(this.artists, artistIndex, artist);
  }

  @Mutation
  SET_CURRENT_ARTIST(id: string): void {
    this.currentArtist = this.artists.find(artist => artist.url === id) as ArtistEntity;
  }

  @Mutation
  SET_CURRENT_ALBUMS(albums: RawAlbum[]): void {
    this.currentArtistAlbums = albums.map(({ name, url, released, cover }) => new Album(name, url, cover, released));
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
  async getArtistAlbums(url: string): Promise<void> {
    this.ALBUMS_FETCHING_STARTED();

    const {
      data: { findAlbums: albums }
    } = await studio.query<{ findAlbums: RawAlbum[] }>({
      query: GetAlbumsQuery,
      variables: {
        search: {
          artist: url
        }
      }
    });

    this.SET_CURRENT_ALBUMS(albums);
    this.ALBUMS_FETCHING_COMPLETED();
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
  async updateArtistAvatar({ id: url, file }: { id: string; file: Blob }): Promise<void> {
    const {
      data: {
        files: [avatar]
      }
    } = await mediaEndpoint.upload(file);

    await studio.mutate({
      mutation: UpdateArtistAvatarMutation,
      variables: {
        updateArtistAvatarInput: {
          url,
          avatar
        }
      }
    });

    this.SET_ARTIST_AVATAR({ url, avatar });
  }

  @Action
  async updateArtistHeader({ id: url, file }: { id: string; file: Blob }): Promise<void> {
    const {
      data: {
        files: [header]
      }
    } = await mediaEndpoint.upload(file);

    await studio.mutate({
      mutation: UpdateArtistHeaderMutation,
      variables: {
        artistInput: {
          url,
          header
        }
      }
    });

    this.SET_ARTIST_HEADER({ url, header });
  }

  @Action
  async publishAlbum({
    name,
    cover,
    songs,
    date
  }: {
    name: string;
    cover: Nullable<Blob>;
    songs: Song[];
    date: string;
  }): Promise<void> {
    let albumCover: Nullable<Blob | string> = cover;

    this.RESET_PUBLISHING_STEPS();

    const steps = 1 + songs.length + +!isNull(cover);
    this.ALBUM_PUBLISH_STARTED();
    this.SET_PUBLISHING_STEPS(steps);

    if (!isNull(albumCover)) {
      const {
        data: {
          files: [file]
        }
      } = await mediaEndpoint.upload(albumCover);
      this.SET_PUBLISHED_STEPS(this.publishedSteps + 1);

      albumCover = file;
    }

    const uploadedSongsUrls: string[] = [];

    for (const song of songs) {
      const {
        data: {
          files: [songUrl]
        }
      } = await mediaEndpoint.upload(song.file);

      uploadedSongsUrls.push(songUrl);
      this.SET_PUBLISHED_STEPS(this.publishedSteps + 1);
    }

    const mappedSongs = songs.map(({ name, feats: featuring }, index) => ({
      name,
      featuring,
      file: uploadedSongsUrls[index]
    }));

    const newAlbum = {
      name,
      artistUrl: this.currentArtist?.url,
      release: date,
      cover: albumCover,
      songs: mappedSongs
    };

    await studio.mutate({
      mutation: CreateNewAlbumMutation,
      variables: { newAlbum }
    });

    this.SET_PUBLISHED_STEPS(this.publishedSteps + 1);
    await sleep(1000);
    this.ALBUM_PUBLISH_COMPLETED();
    this.RESET_PUBLISHING_STEPS();
  }
}

function findArtistIndex(artists: ArtistEntity[], field: keyof ArtistEntity, value: any): number {
  return artists.findIndex(artist => artist[field] === value);
}

export const ArtistModule = getModule(Artist);
