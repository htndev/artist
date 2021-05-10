import { FeatType } from '@/common/types';
export class ReadonlySong {
  audio!: HTMLAudioElement;
  private isSongInitialized = false;

  constructor(private readonly name: string, private readonly file: string, public readonly feats: FeatType[] = []) {}

  async init(): Promise<this> {
    return new Promise(resolve => {
      this.audio = new Audio(this.file);
      this.audio.onloadeddata = () => {
        this.isSongInitialized = true;
        resolve(this);
      };
    });
  }

  get duration(): number {
    return this.audio.duration;
  }

  get urlFeat(): string[] {
    return this.feats.map(feat => feat.url);
  }
}
