<template>
  <div class="albums" :class="{ 'no-albums': !hasAlbums }">
    <q-linear-progress v-if="isAlbumsFetching" indeterminate color="purple" />
    <template v-else-if="hasAlbums && !isAlbumsFetching">
      <album-plate v-for="album in albums" :key="album.url" :album="album" />
    </template>
    <h3 v-else class="text-center">{{ $t('album.no-albums') }}</h3>
  </div>
</template>

<script lang="ts">
import { Album } from '@/common/entities/album';
import AlbumPlate from '@/components/Common/AlbumPlate.vue';
import { ArtistModule } from '@/store/modules/artist';
import { Vue, Component } from 'vue-property-decorator';

@Component({ components: { AlbumPlate } })
export default class ArtistAlbums extends Vue {
  get albums(): Album[] {
    return ArtistModule.filteredAlbums;
  }

  get hasAlbums(): boolean {
    return this.albums.length > 0;
  }

  get isAlbumsFetching(): boolean {
    return ArtistModule.isAlbumsFetching;
  }

  async created(): Promise<void> {
    await ArtistModule.getArtistAlbums(this.$route.params.id);
  }
}
</script>

<style scoped lang="less">
@size: 300px;

.albums {
  &:not(.no-albums) {
    display: grid;
    grid-template-columns: repeat(auto-fit, @size);
    justify-content: space-evenly;
    gap: 20px;
    grid-auto-rows: @size;
  }
}
</style>
