<template>
  <div class="new-artist-popup">
    <q-dialog v-model="value" persistent>
      <q-card class="new-artist-popup--card">
        <q-card-section>{{ $t('new-artist.name') }}</q-card-section>
        <q-card-section class="q-pt-none">
          <q-input dense v-model="artistName" autofocus outlined @input="onType" debounce="500" :rules="rules" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat :label="$t('cancel')" @click="hide" />
          <q-btn flat :label="$t('create')" @click="createNewArtist" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import IsArtistExists from '@/graphql/IsArtistExists.gql';
import { ExistsType } from '@xbeat/client-toolkit';
import { FIELD_LENGTH } from '@xbeat/toolkit';
import { ArtistModule } from '@/store/modules/artist';

@Component
export default class NewArtistPopup extends Vue {
  @Prop({ default: false })
  value!: boolean;

  artistName = '';
  artistExists = false;

  get rules(): any[] {
    return [
      (v: string) => !!v || this.$t('error.field.not-empty'),
      (v: string) => v.length > FIELD_LENGTH.ARTIST.MIN || this.$t('error.field.min'),
      this.isArtistExistRule
    ];
  }

  hide(): void {
    this.artistName = '';
    this.$emit('input', false);
  }

  async isArtistExist(name: string): Promise<boolean> {
    const {
      data: {
        isArtistExists: { exists }
      }
    } = await this.$apolloProvider.clients.studio.query<{ isArtistExists: ExistsType }>({
      query: IsArtistExists,
      variables: {
        artistInput: { name }
      }
    });

    return exists;
  }

  async isArtistExistRule(): Promise<any> {
    const exists = await this.isArtistExist(this.artistName);

    return !exists || this.$t('new-artist.error.exists');
  }

  async onType(): Promise<void> {
    this.artistExists = await this.isArtistExist(this.artistName);
  }

  async createNewArtist(): Promise<void> {
    const isArtistExist = await this.isArtistExist(this.artistName);

    if (isArtistExist) {
      (this as any).$q.notify({
        type: 'negative',
        message: this.$t('new-artist.error.exists'),
        position: 'bottom-right'
      });
      return;
    }

    await ArtistModule.createNewArtist(this.artistName);
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
