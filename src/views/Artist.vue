<template>
  <div>
    <artist-header />
    <div class="row justify-end q-my-md">
      <new-album-popup v-model="showNewAlbumPopup" />
      <q-btn label="New album" rounded color="purple" @click="openPopup" />
    </div>
    <artist-albums />
  </div>
</template>

<script lang="ts">
import ArtistHeader from '@/components/Artist/ArtistHeader.vue';
import ArtistAlbums from '@/components/Artist/ArtistAlbums.vue';
import NewAlbumPopup from '@/components/NewAlbumPopup.vue';
import { ArtistEntity } from '@/common/entities/artist';
import { ArtistModule } from '@/store/modules/artist';
import { Nullable } from '@xbeat/toolkit';
import { Vue, Component } from 'vue-property-decorator';

@Component({ components: { ArtistHeader, ArtistAlbums, NewAlbumPopup } })
export default class Artist extends Vue {
  showNewAlbumPopup = false;

  get currentArtist(): Nullable<ArtistEntity> {
    return ArtistModule.currentArtist;
  }

  openPopup(): void {
    this.showNewAlbumPopup = true;
  }
}
</script>

<style lang="less" scoped></style>
