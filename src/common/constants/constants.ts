import { ApiEndpoint } from '@xbeat/toolkit';
import { Tokens } from '@/common/types';

export const ENDPOINTS = {
  PASSPORT: process.env.PASSPORT_URL || 'http://localhost:3000',
  STUDIO: process.env.STUDIO_URL || 'http://localhost:5000',
  MEDIA: process.env.MEDIA_URL || 'http://localhost:4000'
};

export const CLIENTS = {
  ID: process.env.ID_URL || 'http://localhost:8080',
  HOMEPAGE: process.env.HOMEPAGE_URL || 'http://localhost:7070',
  PLAYER: process.env.PLAYER_URL || 'http://localhost:6060'
};

export const EMPTY_TOKENS: Tokens = {
  passport: '',
  studio: '',
  media: ''
};

export const STUDIO_REDIRECT_QUERY_PARAM = `?to=${ApiEndpoint.Studio}`;

export const SONG_EXTENSION = (): RegExp => /(\.mp3)$/gi;
