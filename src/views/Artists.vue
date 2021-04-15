<template>
  <div class="artists">
    <h3 class="text-center">Your artists</h3>
    <template v-if="hasArtists">
      <q-input v-model="search" :label="$t('search')" outlined />
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

@Component
export default class Artists extends Vue {
  search = '';

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

  private getImage(image: Nullable<string>) {
    return !isNull(image) ? image : ARTIST_AVATAR_DEFAULT;
  }
}
</script>

<style lang="less" scoped>
.artists {
  &--list {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-auto-rows: 200px;
    grid-gap: 10px;

    &--item {
      span {
      }
    }
  }
}
</style>
