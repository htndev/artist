<template>
  <router-link :to="albumUrl" class="album" :class="{ 'no-cover': !hasCover }">
    <date-time-picker-popup v-model="releaseDate" :show.sync="showChangeReleaseDatePopup" @input="dateChanged" />
    <q-img :src="coverImage" />
    <q-btn-dropdown
      :ripple="false"
      class="album__actions text-white"
      dropdown-icon="more_vert"
      rounded
      flat
      fab-mini
      @click.prevent
      no-icon-animation
    >
      <q-list>
        <q-item clickable v-close-popup @click="copyShareLink">
          <q-item-section>{{ $t('album.copy-share-link') }}</q-item-section>
        </q-item>
        <q-item v-if="isNotReleased" clickable v-close-popup @click="changeReleaseDate">
          <q-item-section>{{ $t('album.change-release-date') }}</q-item-section>
        </q-item>
        <q-item v-if="isNotReleased" clickable v-close-popup @click="releaseNow">
          <q-item-section>{{ $t('album.release-now') }}</q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
    <div class="album__overlay">
      <span class="album__label-not-released" v-if="isNotReleased">{{ $t('album.not-released') }}</span>
      <span class="album__title">{{ album.name }}</span>
    </div>
  </router-link>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import ALBUM_PLACEHOLDER from '@/assets/images/svg/ALBUM_PLACEHOLDER.svg';
import { isNull } from '@xbeat/toolkit';
import { CLIENTS } from '@/common/constants/constants';
import copyToClipboard from 'copy-to-clipboard';
import { Album } from '@/common/entities/album';
import { ArtistModule } from '@/store/modules/artist';
import DateTimePickerPopup from '@/components/Common/DateTimePickerPopup.vue';
import { toBaseFormat } from '@xbeat/client-toolkit';

@Component({ components: { DateTimePickerPopup } })
export default class AlbumPlate extends Vue {
  @Prop({ type: Album, required: true })
  album!: Album;

  showChangeReleaseDatePopup = false;
  releaseDate = this.album.releaseDate;

  get hasCover(): boolean {
    return !isNull(this.album.cover);
  }

  get coverImage(): string {
    return this.album.cover || ALBUM_PLACEHOLDER;
  }

  get albumUrl(): string {
    return `/album/${this.album.url}`;
  }

  get shareLink(): string {
    return `${CLIENTS.PLAYER}/album/${this.album.url}`;
  }

  get isNotReleased(): boolean {
    return !this.album.isReleased;
  }

  copyShareLink(): void {
    copyToClipboard(this.shareLink);
    this.$q.notify({
      type: 'positive',
      position: 'bottom-right',
      message: this.$t('album.share-link-copied') as string
    });
  }

  changeReleaseDate(): void {
    this.releaseDate = this.album.releaseDate;
    this.showChangeReleaseDatePopup = true;
  }

  async dateChanged(date: Date): Promise<void> {
    await ArtistModule.changeAlbumReleaseDate({ releaseDate: date, albumUrl: this.album.url });
    this.$q.notify({
      message: this.$t('album.released-date-changed', [
        this.album.name,
        toBaseFormat(this.releaseDate.getTime())
      ]) as string,
      position: 'bottom-right',
      type: 'positive'
    });
  }

  async releaseNow(): Promise<void> {
    await ArtistModule.releaseAlbumNow(this.album.url);

    this.$q.notify({
      message: this.$t('album.released-successful', [this.album.name]) as string,
      type: 'positive',
      position: 'bottom-right'
    });
  }

  created(): void {
    console.log(this.album.name, this.album.releaseDate, this.album.isReleased);
  }
}
</script>

<style scoped lang="less">
@import '../../assets/styles/colors.less';

.album {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border: 2px solid @secondary;
  border-radius: 4px;
  cursor: pointer;
  transition: 0.15s box-shadow ease-in;

  &__label-not-released {
    position: absolute;
    top: 0;
    left: 0;
    background: rgba(@secondary, 0.8);
    color: @white;
    padding: 0.3rem;
  }

  &__actions {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 2;
  }

  &.no-cover {
    background: rgba(@secondary, 0.3);
  }

  &__overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    z-index: 1;
    display: flex;
    align-items: flex-end;
    padding: 1em;
    background: linear-gradient(to bottom, transparent 0%, black 120%);
    transition: 0.15s background ease-in;

    &:hover {
      background: linear-gradient(to bottom, transparent 0%, black 110%);
    }
  }

  &__title {
    color: @white;
    font-size: 16px;
  }

  &:hover {
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  }
}
</style>
