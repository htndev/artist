<template>
  <div class="new-artist-popup">
    <q-dialog v-model="value" persistent>
      <q-card class="new-artist-popup--card">
        <q-card-section>{{ $t('new-artist.name') }}</q-card-section>
        <q-card-section class="q-pt-none">
          <q-input
            dense
            v-model="artistName"
            autofocus
            outlined
            @input="onType"
            debounce="500"
            :rules="rules"
            :placeholder="$t('new-artist.placeholder')"
          />
          <q-checkbox v-model="copyrightConcent" color="purple" />
          <span v-html="$t('new-artist.copyright-consent', [copyrightPolicyLink])" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat :label="$t('cancel')" @click="hide" />
          <q-btn flat :label="$t('create')" @click="createNewArtist" :disabled="isDisabled" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { FIELD_LENGTH } from '@xbeat/toolkit';
import { ArtistModule } from '@/store/modules/artist';
import { CLIENTS } from '@/common/constants/constants';

@Component
export default class NewArtistPopup extends Vue {
  @Prop({ default: false })
  value!: boolean;

  artistName = '';
  artistExists = false;
  copyrightConcent = false;
  copyrightPolicyLink = `${CLIENTS.HOMEPAGE}/copyright`;

  get rules(): any[] {
    return [
      (v: string) => !!v || this.$t('error.field.not-empty'),
      (v: string) => v.length > FIELD_LENGTH.ARTIST.MIN || this.$t('error.field.min', [2]),
      this.isArtistExistRule
    ];
  }

  get isDisabled(): boolean {
    return !this.copyrightConcent || this.rules.slice(0, -1).some(rule => rule(this.artistName) !== true);
  }

  hide(): void {
    this.artistName = '';
    this.$emit('input', false);
  }

  async isArtistExistRule(): Promise<any> {
    const exists = await ArtistModule.isArtistExist(this.artistName);

    return !exists || this.$t('new-artist.error.exists');
  }

  async onType(): Promise<void> {
    this.artistExists = await ArtistModule.isArtistExist(this.artistName);
  }

  async createNewArtist(): Promise<void> {
    const isArtistExist = await ArtistModule.isArtistExist(this.artistName);

    if (isArtistExist) {
      this.$q.notify({
        type: 'negative',
        message: this.$t('new-artist.error.exists') as string,
        position: 'bottom-right'
      });
      return;
    }

    await ArtistModule.createNewArtist(this.artistName);

    const artist = await ArtistModule.findArtist({ name: this.artistName });

    if (artist) {
      this.$router.push(artist.link);
    }

    this.hide();
  }
}
</script>

<style lang="less" scoped>
.new-artist-popup {
  &--card {
    width: 300px;
  }
}
</style>
