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
  avatar: Nullable<string>;
  header: Nullable<string>;
}
