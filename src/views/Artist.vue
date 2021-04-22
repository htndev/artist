<template>
  <div>
    <artist-header />
  </div>
</template>

<script lang="ts">
import ArtistHeader from '@/components/Artist/ArtistHeader.vue';
import { ArtistEntity } from '@/common/entities/artist';
import { ArtistModule } from '@/store/modules/artist';
import { Nullable } from '@xbeat/toolkit';
import { Vue, Component } from 'vue-property-decorator';

@Component({ components: { ArtistHeader } })
export default class Artist extends Vue {
  get currentArtist(): Nullable<ArtistEntity> {
    return ArtistModule.currentArtist;
  }
}
</script>

<style lang="less" scoped></style>
