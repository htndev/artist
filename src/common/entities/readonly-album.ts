import { Nullable } from '@xbeat/toolkit';
import { ReadonlySong } from './readonly-song';
export class ReadonlyAlbum {
  constructor(
    public readonly name: string,
    public readonly url: string,
    public readonly cover: Nullable<string>,
    public readonly releaseDate: Date,
    public readonly songs: ReadonlySong[]
  ) {}

  get isSingle(): boolean {
    return this.songs.length === 1;
  }

  get isAlbum(): boolean {
    return this.songs.length > 1;
  }

  get isReleased(): boolean {
    return this.releaseDate < new Date();
  }
}
