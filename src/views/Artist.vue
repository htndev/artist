<template>
  <div>
    <new-album-popup v-model="showNewAlbumPopup" />
    <artist-header />
    <div class="row justify-between q-my-md">
      <q-btn-group outline>
        <q-btn
          v-for="filter in filters"
          :key="filter.value"
          :label="filter.label"
          :icon="filter.value === currentFilter ? 'done' : void 0"
          color="purple"
          outline
          @click="changeFilter(filter.value)"
        />
      </q-btn-group>
      <q-btn :label="$t('album.new')" rounded color="purple" @click="openPopup" />
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
import { AlbumFilterCriteria } from '@/common/types';
import { TranslateResult } from 'vue-i18n';

@Component({ components: { ArtistHeader, ArtistAlbums, NewAlbumPopup } })
export default class Artist extends Vue {
  showNewAlbumPopup = false;

  get filters(): { value: AlbumFilterCriteria; label: TranslateResult }[] {
    return [
      { value: 'all', label: this.$t('all') },
      { value: 'released-first', label: this.$t('album.released-first') },
      { value: 'not-released-first', label: this.$t('album.not-released-first') },
      { value: 'only-not-released', label: this.$t('album.only-not-released') },
      { value: 'only-released', label: this.$t('album.only-released') }
    ];
  }

  get currentFilter(): AlbumFilterCriteria {
    return ArtistModule.albumsFilterCriteria;
  }

  get currentArtist(): Nullable<ArtistEntity> {
    return ArtistModule.currentArtist;
  }

  openPopup(): void {
    this.showNewAlbumPopup = true;
  }

  changeFilter(filter: AlbumFilterCriteria): void {
    ArtistModule.SET_ALBUM_FILTER_CRITERIA(filter);
  }
}
</script>

<style lang="less" scoped></style>
