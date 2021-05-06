import { SONG_EXTENSION } from './constants/constants';
import { ApiEndpoint, Nullable } from '@xbeat/toolkit';
import { Language } from '@/common/constants/language';

export type Tokens = { [k in ApiEndpoint]: string };

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

export class Song {
  private isSongInitialized = false;
  audio!: HTMLAudioElement;
  file: File;
  name!: string;
  featuring: Artist[];

  constructor(file: File) {
    this.file = file;
    this.featuring = [];
  }

  get duration(): number {
    return this.audio.duration;
  }

  async init(): Promise<this> {
    return new Promise(resolve => {
      this.audio = new Audio(URL.createObjectURL(this.file));
      this.name = Song.removeFileExtension(this.file.name);
      this.audio.onloadeddata = () => {
        this.isSongInitialized = true;
        resolve(this);
      };
    });
  }

  get feats(): string[] {
    return this.featuring.map(({ url }) => url);
  }

  static removeFileExtension(file: string): string {
    return file.replace(SONG_EXTENSION(), '');
  }
}
