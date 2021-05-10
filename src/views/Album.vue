<template>
  <div class="album">
    <q-linear-progress v-if="isAlbumLoading" indeterminate color="purple" />
    <template v-else>
      <div class="row justify-center">
        <q-img width="350px" :src="cover" ratio="1" />
      </div>
      <div class="row justify-center">
        <h1>{{ album.name }}</h1>
      </div>
      <div class="row">
        <!-- <song-readonly v-for="song in songs" :key="song.url" :song="song" :isPlaying="" /> -->
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { fallbackImage } from '@/common/utils/image-fallback';
import { ArtistModule } from '@/store/modules/artist';
import { Vue, Component } from 'vue-property-decorator';
import DEFAULT_ALBUM_PLACEHOLDER from '@/assets/images/svg/ALBUM_PLACEHOLDER.svg';
import SongReadonly from '@/components/Song/SongReadonly.vue';
import { ReadonlyAlbum } from '@/common/entities/readonly-album';
import { ReadonlySong } from '@/common/entities/readonly-song';

@Component({ components: { SongReadonly } })
export default class Album extends Vue {
  getImage = fallbackImage(DEFAULT_ALBUM_PLACEHOLDER);

  get isAlbumLoading(): boolean {
    return ArtistModule.isCurrentAlbumLoading;
  }

  get album(): ReadonlyAlbum {
    return ArtistModule.currentAlbum as ReadonlyAlbum;
  }

  get songs(): ReadonlySong[] {
    return this.album.songs;
  }

  get cover(): string {
    return this.getImage(this.album.cover);
  }

  async created(): Promise<void | unknown> {
    const albumUrl: string = this.$route.params.id;
    ArtistModule.CURRENT_ALBUM_LOADING_STARTED();
    const [album] = await ArtistModule.getAlbums(albumUrl);

    if (!album) {
      return this.$router.push('/404');
    }

    await ArtistModule.setCurrentAlbum(album);
    ArtistModule.CURRENT_ALBUM_LOADING_COMPLETED();
  }
}
</script>

<style lang="less" scoped>
.album {
  padding-top: 5em;
}
</style>
