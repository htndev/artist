import { isNull, Nullable } from '@xbeat/toolkit';

export class Album {
  constructor(
    public readonly name: string,
    public readonly url: string,
    public readonly cover: Nullable<string>,
    private readonly released: string
  ) {}

  get releaseDate(): Date {
    return new Date(this.released);
  }

  get isReleased(): boolean {
    return this.releaseDate < new Date();
  }

  get hasCover(): boolean {
    return !isNull(this.cover);
  }
}
