<template>
  <div class="album">
    <q-linear-progress v-if="isAlbumLoading" indeterminate color="purple" />
    <template v-else>
      <date-time-picker-popup
        :value.sync="newReleaseDate"
        :show.sync="showDatePickerPopup"
        @input="changeReleaseDate"
      />
      <q-dialog v-model="showDeletePopup" persistent>
        <q-card>
          <q-card-section class="row">
            <q-icon name="warning" class="text-red" style="font-size: 4rem" />
            <h5 class="q-ma-none q-mt-sm q-mb-md">{{ $t('album.delete-confirm', [album.name]) }}</h5>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn :label="$t('cancel')" flat @click="closeDeletePopup" />
            <q-btn :label="$t('album.delete')" color="red" outline />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <div class="row justify-end">
        <q-btn-dropdown dropdown-icon="more_vert" fab no-icon-animation>
          <q-list>
            <q-item clickable v-close-popup>
              <q-item-section @click="openChangeDatePopup">{{ $t('album.change-release-date') }}</q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
              <q-item-section @click="openDeletePopup">{{ $t('album.delete') }}</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>
      <div class="row justify-center">
        <q-img width="350px" :src="cover" ratio="1" />
      </div>
      <div class="row justify-center column items-center">
        <h1 class="q-mb-none">{{ album.name }}</h1>
        <h5 class="q-my-none q-mt-sm">{{ $t(album.isSingle ? 'album.single' : 'album.album') }}</h5>
      </div>
      <div class="row justify-center q-mt-sm q-mb-lg" v-if="!album.isReleased">
        <h6 class="q-my-none">{{ date }}</h6>
      </div>
      <div class="row">
        <song-readonly
          v-for="(song, index) in songs"
          :key="song.url"
          :song="song"
          :is-playing="index === playingIndex"
          @update:song-control="toggleControl(index)"
        />
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { fallbackImage } from '@/common/utils/image-fallback';
import { ArtistModule } from '@/store/modules/artist';
import { Vue, Component } from 'vue-property-decorator';
import DEFAULT_ALBUM_PLACEHOLDER from '@/assets/images/svg/ALBUM_PLACEHOLDER.svg';
import SongReadonly from '@/components/Song/SongReadonly.vue';
import DateTimePickerPopup from '@/components/Common/DateTimePickerPopup.vue';
import { ReadonlyAlbum } from '@/common/entities/readonly-album';
import { ReadonlySong } from '@/common/entities/readonly-song';
import { Nullable } from '@xbeat/toolkit';
import { formatDistanceToNow, Locale } from 'date-fns';
import ru from 'date-fns/locale/ru';
import uk from 'date-fns/locale/uk';
import de from 'date-fns/locale/de';
import en from 'date-fns/locale/en-US';
import { Language } from '@/common/constants/language';
import { ArtistEntity } from '@/common/entities/artist';

const LOCALES: { [k in Language]: Locale } = { ru, uk, de, en };

@Component({ components: { SongReadonly, DateTimePickerPopup } })
export default class Album extends Vue {
  getImage = fallbackImage(DEFAULT_ALBUM_PLACEHOLDER);
  playingIndex: Nullable<number> = null;
  showDeletePopup = false;
  showDatePickerPopup = false;
  date = '';
  newReleaseDate = this.album?.releaseDate || new Date();

  get isAlbumLoading(): boolean {
    return ArtistModule.isCurrentAlbumLoading;
  }

  get isAlbumDeleting(): boolean {
    return ArtistModule.isAlbumDeleting;
  }

  get album(): ReadonlyAlbum {
    return ArtistModule.currentAlbum as ReadonlyAlbum;
  }

  get songs(): ReadonlySong[] {
    return this.album.songs;
  }

  get cover(): string {
    return this.getImage(this.album.cover);
  }

  get locale(): Locale {
    const locale = this.$i18n.locale as Language;
    return LOCALES[locale];
  }

  get currentArtist(): ArtistEntity {
    return ArtistModule.currentArtist as ArtistEntity;
  }

  openChangeDatePopup(): void {
    this.showDatePickerPopup = true;
  }

  openDeletePopup(): void {
    this.showDeletePopup = true;
  }

  closeDeletePopup(): void {
    this.showDeletePopup = false;
  }

  toggleControl(index: number): void {
    this.playingIndex = index !== this.playingIndex ? index : null;
  }

  async changeReleaseDate(releaseDate: Date): Promise<void> {
    await ArtistModule.changeAlbumReleaseDate({ releaseDate, albumUrl: this.album.url });
    this.$router.push(`/a/${this.currentArtist.url}`);
  }

  private updateDate(): void {
    this.date = formatDistanceToNow(this.album.releaseDate.getTime(), { addSuffix: true, locale: this.locale });
  }

  async created(): Promise<void | unknown> {
    const albumUrl: string = this.$route.params.id;
    ArtistModule.CURRENT_ALBUM_LOADING_STARTED();
    const [album] = await ArtistModule.getAlbums(albumUrl);

    if (!album) {
      return this.$router.push('/404');
    }

    await ArtistModule.setCurrentAlbum(album);
    ArtistModule.CURRENT_ALBUM_LOADING_COMPLETED();
    this.updateDate();
    setInterval(this.updateDate, 1000);
  }
}
</script>

<style lang="less" scoped>
.album {
  padding-top: 5em;
}
</style>
