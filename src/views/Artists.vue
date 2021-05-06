<template>
  <div class="artists">
    <new-artist-popup v-model="showNewArtistPopup" />
    <h3 class="text-center">{{ $t('artist.your-artists') }}</h3>
    <template v-if="hasArtists">
      <div class="row">
        <q-input v-model="search" class="col-grow" :label="$t('search')" outlined />
        <q-btn :label="$t('artist.create-new-one')" class="q-ml-md" @click="openNewArtistPopup" />
      </div>
      <div class="artists--list q-mt-md" v-if="filteredArtists.length">
        <router-link class="artists--list--item" v-for="artist in filteredArtists" :key="artist.url" :to="artist.link">
          <q-img :src="getImage(artist.avatar)" ratio="1"></q-img>
          <h4 class="text-center q-my-xs">{{ artist.name }}</h4>
        </router-link>
      </div>
      <h4 class="text-center" v-else>{{ $t('artist.no-artist-found', [search]) }}</h4>
    </template>
    <template v-else>
      <p class="text-center text-h5">
        {{ $t('artist.no-artists') }}
        <router-link to="new-artist">{{ $t('artist.create-new-one') }}</router-link>
      </p>
    </template>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import ARTIST_AVATAR_DEFAULT from '@/assets/images/ARTIST-AVATAR-FALLBACK.png';
import { ArtistModule } from '@/store/modules/artist';
import { Nullable, isNull } from '@xbeat/toolkit';
import { ArtistEntity } from '@/common/entities/artist';
import NewArtistPopup from '@/components/NewArtistPopup.vue';

@Component({ components: { NewArtistPopup } })
export default class Artists extends Vue {
  search = '';
  showNewArtistPopup = false;

  get artists(): ArtistEntity[] {
    return ArtistModule.artists;
  }

  get filteredArtists(): ArtistEntity[] {
    const query = new RegExp(this.search, 'gi');
    return this.artists.filter(artists => query.test(artists.name) || query.test(artists.url));
  }

  get hasArtists(): boolean {
    return ArtistModule.hasUserArtists;
  }

  openNewArtistPopup(): void {
    this.showNewArtistPopup = true;
  }

  private getImage(image: Nullable<string>) {
    return !isNull(image) ? image : ARTIST_AVATAR_DEFAULT;
  }
}
</script>

<style lang="less" scoped>
@import '../assets/styles/colors.less';

.artists {
  &--list {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 10px;
    background: @white;

    &--item {
      text-decoration: none;
      height: 100%;
      transform: scale(1);
      border: 1px solid @secondary;
      transition: all 0.15s ease-in;

      h4 {
        color: @black;
      }

      &:hover {
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
        transform: scale(1.05);
      }
    }
  }
}
</style>
