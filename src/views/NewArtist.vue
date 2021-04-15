<template>
  <div>
    <h1 class="text-center">{{ $t('new-artist.question') }}</h1>
    <div class="row justify-center q-mb-lg">
      <q-btn outline :label="$t('new-artist.create')" @click="onCreateArtist" />
    </div>
    <new-artist-popup v-model="showPopup" />
    <p class="text-center">
      <a :href="playerLink" class="text-h4">{{ $t('new-artist.back-to-player') }}</a>
    </p>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { CLIENTS } from '@/common/constants/constants';
import NewArtistPopup from '@/components/NewArtistPopup.vue';

@Component({ components: { NewArtistPopup } })
export default class NewArtist extends Vue {
  playerLink = CLIENTS.PLAYER;
  showPopup = false;

  onCreateArtist(): void {
    this.showPopup = true;
  }
}
</script>
