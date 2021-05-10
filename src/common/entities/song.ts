import { Artist } from '@/common/types';
import { SONG_EXTENSION } from '@/common/constants/constants';

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
