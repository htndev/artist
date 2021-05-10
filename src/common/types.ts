import { SONG_EXTENSION } from './constants/constants';
import { ApiEndpoint, Nullable } from '@xbeat/toolkit';
import { Language } from '@/common/constants/language';

export type Tokens = { [k in ApiEndpoint]: string };

export interface RawSong {
  name: string;
  file: string;
  url: string;
  released: boolean;
  feat: FeatType[];
}
export type RawAlbum = { name: string; cover: Nullable<string>; released: string; url: string; songs: RawSong[] };

export type AlbumFilterCriteria =
  | 'all'
  | 'released-first'
  | 'not-released-first'
  | 'only-not-released'
  | 'only-released';

export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string | null;
  location: {
    city: string;
    code: string;
    country: string;
    region: string;
  };
}

export interface Preferences {
  language: Language;
}

export interface Artist {
  name: string;
  url: string;
  avatar?: Nullable<string>;
  header?: Nullable<string>;
}

export interface ISong {
  name: string;
  file: File;
  duration: number;
}

export type FeatType = {
  name: string;
  avatar: Nullable<string>;
  url: string;
};
