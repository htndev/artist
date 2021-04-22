<template>
  <div class="artist-header">
    <q-img width="100%" :src="getHeaderImage(artist.header)" />
    <div class="artist-header--overlay"></div>
    <div class="artist-header--description flex items-end">
      <artist-avatar />
      <h2 class="q-ma-none q-ml-md text-weight-bold text-white">{{ artist.name }}</h2>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import DEFAULT_ARTIST_HEADER_IMAGE from '@/assets/images/ARTIST-HEADER-FALLBACK.svg';
import ArtistAvatar from './ArtistAvatar.vue';
import { ArtistEntity } from '@/common/entities/artist';
import { ArtistModule } from '@/store/modules/artist';
import { fallbackImage } from '@/common/utils/image-fallback';

@Component({ components: { ArtistAvatar } })
export default class ArtistHeader extends Vue {
  getHeaderImage = fallbackImage(DEFAULT_ARTIST_HEADER_IMAGE);

  get artist(): ArtistEntity {
    return ArtistModule.currentArtist as ArtistEntity;
  }
}
</script>

<style lang="less" scoped>
.artist-header {
  position: relative;

  &--overlay {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, transparent 0%, black 110%);
  }

  &--description {
    position: absolute;
    bottom: 1rem;
    left: 1rem;
    z-index: 2;
  }
}
</style>
