import { Nullable } from '@xbeat/toolkit';

import { Artist } from '../types';

export class ArtistEntity {
  name = '';
  url = '';
  avatar: Nullable<string> = null;
  header: Nullable<string> = null;

  constructor({ name = '', avatar = null, header = null, url = '' }: Artist) {
    this.name = name;
    this.url = url;
    this.avatar = avatar;
    this.header = header;
  }

  get link(): string {
    return `/a/${this.url}`;
  }
}
