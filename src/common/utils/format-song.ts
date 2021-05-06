import { Song } from '../types';

export const formatSong = (song: File): Promise<Song> => new Song(song).init();
