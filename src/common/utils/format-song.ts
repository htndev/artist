import { Song } from '@/common/entities/song';

export const formatSong = (song: File): Promise<Song> => new Song(song).init();
