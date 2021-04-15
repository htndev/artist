<template>
  <div>Hi, artist page</div>
</template>

<script lang="ts">
import { ArtistEntity } from '@/common/entities/artist';
import { ArtistModule } from '@/store/modules/artist';
import { Nullable } from '@xbeat/toolkit';
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class Artist extends Vue {
  async created(): Promise<void> {
    console.log(ArtistModule.hasUserArtists);
  }

  get currentArtist(): Nullable<ArtistEntity> {
    return ArtistModule.currentArtist;
  }
}
</script>

<style lang="less" scoped></style>
