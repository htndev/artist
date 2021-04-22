import { isNull, Nullable } from '@xbeat/toolkit';

export const fallbackImage = (fallbackImage: string) => (img: Nullable<string>): string =>
  !isNull(img) ? img : fallbackImage;
