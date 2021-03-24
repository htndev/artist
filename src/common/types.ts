import { ApiEndpoint } from '@xbeat/toolkit';
import { Language } from '@/common/constants/language';

export type Tokens = Record<ApiEndpoint, string>;

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
