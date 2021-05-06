<template>
  <div class="albums">
    <album-plate v-for="album in albums" :key="album.title" :name="album.title" :cover="album.cover" />
  </div>
</template>

<script lang="ts">
import { Album } from '@/common/entities/album';
import AlbumPlate from '@/components/Common/AlbumPlate.vue';
import { ArtistModule } from '@/store/modules/artist';
import { Vue, Component } from 'vue-property-decorator';

// const random = (min: number, max: number) => Math.random() * (max - min) + min;

@Component({ components: { AlbumPlate } })
export default class ArtistAlbums extends Vue {
  get albums(): Album[] {
    return ArtistModule.currentArtistAlbums;
  }
}
</script>

<style scoped lang="less">
@size: 200px;

.albums {
  display: grid;
  grid-template-columns: repeat(auto-fit, @size);
  justify-content: space-between;
  gap: 20px;
  grid-auto-rows: @size;
}
</style>
