<template>
  <q-dialog v-model="value" persistent maximized transition-show="slide-up" transition-hide="slide-down">
    <q-dialog v-model="isAlbumPublishing" persistent>
      <div class="flex column items-center album__loading">
        <q-circular-progress
          show-value
          font-size="36px"
          :value="publishingPercentage"
          size="150px"
          :thickness="0.22"
          color="purple"
          track-color="grey-3"
          class="q-ma-md text-white"
        >
          {{ publishingPercentage }}%
        </q-circular-progress>
        <span class="text-white text-h4 text-center">{{ $t('album.publishing') }}</span>
      </div>
    </q-dialog>
    <date-time-picker-popup v-if="releaseDate !== 'now'" v-model="releaseDate" :show.sync="showReleaseDatePopup" />
    <q-card>
      <image-cropper-popup v-model="showAlbumCropperPopup" :src="rawCover" @cropped="coverCropped" />
      <q-card-section class="flex justify-between items-center">
        <h2 class="q-my-none">{{ $t('album.new') }}</h2>
        <q-btn dense flat icon="close" v-close-popup @click="closePopup">
          <q-tooltip anchor="center left" self="center right">
            {{ $t('close') }}
          </q-tooltip>
        </q-btn>
      </q-card-section>
      <q-card-section>
        <container>
          <div class="row">
            <q-input
              v-model="albumTitle"
              :label="$t('album.enter-title')"
              :rules="albumRules"
              outlined
              style="width: 300px"
            />
          </div>
          <div class="row">
            <drag-and-drop
              width="300px"
              height="300px"
              class="q-mx-auto"
              mimetype="image/jpeg,png,bmp"
              :text="$t('upload.new-cover')"
              :dragging-text="$t('upload.drop-files')"
              :multiple="false"
              :disable-border="hasAlbumCover"
              @dropped="onCoverDropped"
            >
              <div class="album__cover" v-if="hasAlbumCover">
                <span class="album__cover--text">
                  {{ $t('upload.another-cover') }}
                </span>
                <img :src="cover.dataUrl" alt="Album cover" />
              </div>
            </drag-and-drop>
          </div>
          <div class="row q-mt-lg">
            <template v-if="hasAlbumSongs">
              <draggable v-model="songs" class="full-width q-mb-md">
                <song-editable
                  v-for="(song, index) in songs"
                  :key="index"
                  :index="index"
                  :song="song"
                  :featurings.sync="song.featuring"
                  @song:updated="songUpdated"
                  @song:delete="deleteSong"
                />
              </draggable>
            </template>
            <drag-and-drop
              width="100%"
              :height="hasAlbumSongs ? '150px' : '400px'"
              mimetype="audio/mpeg"
              :text="$t('upload.new-songs')"
              :dragging-text="$t('upload.drop-files')"
              multiple
              @dropped="songsDropped"
            />
          </div>
        </container>
      </q-card-section>
      <q-card-actions>
        <container class="flex">
          <q-btn-dropdown
            class="q-ml-auto min-width-zero"
            :label="publishText"
            color="purple"
            split
            :disabled="!isAllowedToPublish"
            :disable-dropdown="!isAllowedToPublish"
            @click="publish()"
          >
            <q-list>
              <q-item clickable v-close-popup>
                <q-item-section @click="publishNow">{{ $t('album.release-now') }}</q-item-section>
              </q-item>
              <q-item clickable v-close-popup>
                <q-item-section @click="chooseReleaseDate">{{ $t('album.choose-release-date') }}</q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </container>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script lang="ts">
import { FIELD_LENGTH, Nullable } from '@xbeat/toolkit';
import { TranslateResult } from 'vue-i18n';
import { Vue, Component, Prop } from 'vue-property-decorator';
import { fileToDataUrl } from '@xbeat/client-toolkit';
import SongEditable from '@/components/Song/SongEditable.vue';
import { Song } from '@/common/types';
import { formatSong } from '@/common/utils/format-song';
import Draggable from 'vuedraggable';
import DateTimePickerPopup from '@/components/Common/DateTimePickerPopup.vue';
import { format } from 'date-fns';
import { ArtistModule } from '@/store/modules/artist';

const MAX_COVER_SIZE = 2000000;
type ValidationResult = boolean | TranslateResult;

@Component({ components: { SongEditable, Draggable, DateTimePickerPopup } })
export default class NewAlbumPopup extends Vue {
  albumTitle = '';
  releaseDate: Date | 'now' = 'now';
  showAlbumCropperPopup = false;
  areSongsUploaded = false;
  showReleaseDatePopup = false;
  albumMaxLength = FIELD_LENGTH.ALBUM.MAX;
  rawCover: Nullable<string> = '';
  cover: { dataUrl: Nullable<string>; file: Nullable<Blob> } = {
    dataUrl: null,
    file: null
  };
  rules = {
    MIN_LEGTH: (length: number, message: TranslateResult) => (v: string): ValidationResult =>
      v.length >= length || message,
    MAX_LEGTH: (length: number, message: TranslateResult) => (v: string): ValidationResult =>
      v.length <= length || message,
    FIT_PATTERN: (pattern: RegExp, message: TranslateResult) => (v: string): ValidationResult =>
      pattern.test(v) || message
  };
  songs: Song[] = [];

  @Prop({ default: false })
  value!: boolean;

  get albumRules(): ((v: string) => ValidationResult)[] {
    return [
      this.rules.MIN_LEGTH(FIELD_LENGTH.ALBUM.MIN, this.$t('error.field.min', [FIELD_LENGTH.ALBUM.MIN])),
      this.rules.MAX_LEGTH(FIELD_LENGTH.ALBUM.MAX, this.$t('error.field.max', [FIELD_LENGTH.ALBUM.MAX]))
    ];
  }

  get hasAlbumCover(): boolean {
    return !!this.cover.file;
  }

  get hasAlbumSongs(): boolean {
    return this.songs.length > 0;
  }

  get hasAlbumTitle(): boolean {
    return !!this.albumTitle;
  }

  get isAllowedToPublish(): boolean {
    return [this.hasAlbumTitle, this.hasAlbumSongs].every(condition => condition === true);
  }

  get publishText(): TranslateResult {
    return this.releaseDate === 'now'
      ? this.$t('album.release-now')
      : this.$t('album.release-date', [format(this.releaseDate.getTime(), 'dd.MM.yyyy HH:mm')]);
  }

  get isAlbumPublishing(): boolean {
    return ArtistModule.isAlbumPublishing;
  }

  closePopup(): void {
    this.$emit('input', false);
  }

  reset(): void {
    this.albumTitle = '';
    this.releaseDate = 'now';
    this.cover = {
      dataUrl: null,
      file: null
    };
    this.songs = [];
    this.rawCover = null;
  }

  isValidFileSize(file: File, maxFileSize: number): boolean {
    return file.size < maxFileSize;
  }

  songUpdated({ title, index }: { title: string; index: number }): void {
    this.songs[index].name = title;
  }

  deleteSong(index: number): void {
    this.songs.splice(index, 1);
  }

  get publishingPercentage(): number {
    return ArtistModule.publishingPercentage;
  }

  async coverCropped(cover: Blob): Promise<void> {
    this.cover.file = cover;
    this.cover.dataUrl = await fileToDataUrl(cover as File);
    this.showAlbumCropperPopup = false;
  }

  async onCoverDropped(cover: File): Promise<void> {
    if (!this.isValidFileSize(cover, MAX_COVER_SIZE)) {
      this.$q.notify({
        message: this.$t('error.file.big', [cover.name]) as string,
        type: 'negative',
        position: 'bottom-right'
      });
      return;
    }

    this.rawCover = await fileToDataUrl(cover);
    this.showAlbumCropperPopup = true;
  }

  async songsDropped(songs: File[]): Promise<void> {
    const _songs = songs.filter(song => {
      if (song.type.includes('audio')) {
        return true;
      }

      this.$q.notify({
        message: this.$t('error.file.should-be.audio', [song.name]) as string
      });
    });
    const formatedSongs = await Promise.all(_songs.map(formatSong));
    this.songs = [...this.songs, ...formatedSongs];
  }

  chooseReleaseDate(): void {
    const isDate = this.releaseDate instanceof Date;

    if (!isDate) {
      this.releaseDate = new Date();
    }

    this.showReleaseDatePopup = true;
  }

  publishNow(): void {
    this.publish('now');
  }

  async publish(release: Date | 'now' = this.releaseDate): Promise<void> {
    const date = release instanceof Date ? release.toISOString() : release;
    await ArtistModule.publishAlbum({ name: this.albumTitle, cover: this.cover.file, songs: this.songs, date });
    this.reset();
    this.closePopup();
  }
}
</script>

<style lang="less">
@import '../assets/styles/colors.less';

.min-width-zero {
  .q-btn-dropdown__arrow-container {
    .q-btn__wrapper {
      min-width: 0 !important;
    }
  }
}

body .album {
  &__loading {
    overflow: initial;
    box-shadow: none;
  }

  &__cover {
    width: 100%;
    height: 100%;
    position: relative;

    .hide() {
      opacity: 0;
      transition: 0.15s opacity ease-in;
    }

    .show() {
      opacity: 1;
    }

    &--text {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: @white;

      .hide();
    }

    &::before {
      content: '';
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      background: rgba(@black, 0.7);

      .hide();
    }

    &:hover {
      .album__cover--text {
        .show();
      }

      &::before {
        .show();
      }
    }

    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
