<template>
  <div class="song" :class="{ 'is-editing': isEditingMode }">
    <span class="song__index">{{ index + 1 }}.</span>
    <span class="song__play q-mr-sm">
      <q-btn :icon="icon" round size="sm" @click="playSong" />
    </span>
    <span class="song__title">
      <template v-if="!isEditingMode">
        <span @click="isEditingMode = true">{{ song.name }}</span>
      </template>
      <template v-else>
        <div class="wrapper flex items-center">
          <q-input v-model="songName" outlined dense class="q-mr-md" />
          <q-btn icon="save" round class="q-mr-sm" @click="updateSongTitle" size="sm" />
          <q-btn icon="close" round size="sm" @click="reset" />
        </div>
      </template>
    </span>
    <span class="song__featerting">
      <template v-if="hasFeaturings">
        <transition-group name="slide-fade">
          <q-chip v-for="(feat, index) in feats" :key="feat.name">
            <q-avatar>
              <img :src="feat.avatar" />
            </q-avatar>
            {{ feat.name }}
            <q-btn class="song__featuring--remove" icon="remove" size="xs" round outline @click="removeItem(index)" />
          </q-chip>
        </transition-group>
      </template>
    </span>
    <span class="song__duration q-ml-auto">
      {{ song.duration | formatDuration }}
    </span>
    <span class="song__feat q-ml-md">
      <q-btn icon="person_add" round size="sm">
        <q-tooltip anchor="top middle" self="center middle">{{ $t('album.add-feat') }}</q-tooltip>
        <q-menu>
          <div class="song__feat-modal">
            <p>{{ $t('album.feat-description') }}</p>
            <q-select
              v-model="feats"
              :label="$t('album.add-feat')"
              :options="featuringOptions"
              :hint="$t('album.feat-hint')"
              input-debounce="500"
              option-label="name"
              use-chips
              use-input
              multiple
              outlined
              @filter="findArtist"
            >
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                  <q-item-section avatar>
                    <q-avatar>
                      <img :src="scope.opt.avatar" />
                    </q-avatar>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>{{ scope.opt.name }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    {{ $t('album.artist-with-name-not-found', [notFoundName]) }}
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
        </q-menu>
      </q-btn>
    </span>
    <span class="song__delete q-ml-md">
      <q-btn icon="delete" round size="sm" @click="deleteSong" />
    </span>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, PropSync } from 'vue-property-decorator';
import FeautringSearchQuery from '@/graphql/FeaturingSearch.gql';
import eventBus from '@/common/event-bus';
import { ArtistEntity } from '@/common/entities/artist';
import { ArtistModule } from '@/store/modules/artist';
import { Artist } from '@/common/types';
import { Song } from '@/common/entities/song';

@Component({
  filters: {
    formatDuration(duration: number) {
      const MINUTE = 60;
      const hours = Math.round(duration / (MINUTE * MINUTE));
      const minutes = Math.round(duration / MINUTE);
      const seconds = Math.round(duration % MINUTE);
      return `${hours > 0 ? `${hours < 10 ? '0' + hours : hours}` : ''}${minutes}:${
        seconds < 10 ? '0' + seconds : seconds
      }`;
    }
  }
})
export default class SongEditable extends Vue {
  isEditingMode = false;
  isSongPlaying = false;
  notFoundName = '';
  featuringOptions: Artist[] = [];

  @PropSync('featurings', { default: () => [], type: [Array] })
  feats!: Artist[];

  @Prop({ default: 0, type: Number })
  index!: number;

  @Prop({ required: true, type: Song })
  song!: Song;

  songName = this.song.name;

  get icon(): string {
    return this.isSongPlaying ? 'pause' : 'play_arrow';
  }

  get currentArtist(): ArtistEntity {
    return ArtistModule.currentArtist as ArtistEntity;
  }

  get hasFeaturings(): boolean {
    return this.feats.length > 0;
  }

  removeItem(index: number): void {
    this.feats.splice(index, 1);
  }

  async findArtist(value: string, update: (...args: any[]) => void): Promise<void> {
    if (!value || value.length < 2) {
      return;
    }

    const {
      data: { getArtists: artists }
    } = await this.$apolloProvider.clients.studio.query<{ getArtists: Artist[] }>({
      query: FeautringSearchQuery,
      variables: {
        artistsSearch: {
          name: value
        }
      }
    });

    const exlcudeCurrentArtist = (artist: Artist) => artist.url !== this.currentArtist.url;

    this.featuringOptions = artists.filter(exlcudeCurrentArtist);

    if (!this.featuringOptions.length) {
      this.notFoundName = value;
    }

    update();
  }

  reset(): void {
    this.songName = this.song.name;
    this.isEditingMode = false;
  }

  updateSongTitle(): void {
    this.$emit('song:updated', { title: this.songName, index: this.index });
    this.isEditingMode = false;
  }

  playSong(): void {
    if (this.isSongPlaying) {
      this.song.audio.pause();
      this.isSongPlaying = false;
      return;
    }

    eventBus.$emit('song:play', this.index);
    this.song.audio.play();
    this.isSongPlaying = true;
  }

  deleteSong(): void {
    this.$emit('song:delete', this.index);
  }

  created(): void {
    eventBus.$on('song:play', (index: number) => {
      if (this.index === index) {
        return;
      }

      this.song.audio.pause();
      this.isSongPlaying = false;
    });
  }
}
</script>

<style lang="less" scoped>
@import '../../assets/styles/colors.less';

.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active до версии 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}

.song {
  width: 100%;
  min-height: 4rem;
  padding: 1rem 2rem;
  background: rgba(@secondary, 0.6);
  border-radius: 40px;
  display: flex;
  align-items: center;
  border: 2px solid transparent;
  transition: 0.1s box-shadow ease-in;

  &__featuring {
    &--remove {
      margin-left: 1em;
      margin-right: -1.4em;
    }
  }

  &.sortable-chosen {
    border: 2px dashed @secondary;
  }

  &.is-editing {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  }

  &__index,
  &__title {
    font-family: 'Roboto', sans-serif;
    font-size: 1.2em;
    color: @black;
  }

  &__index {
    margin-right: 1rem;
  }

  &:not(:last-child) {
    margin-bottom: 1rem;
  }

  &__delete {
    opacity: 0;
  }

  &:hover {
    .song__delete {
      opacity: 1;
    }
  }
}
</style>

<style lang="less">
@import '../../assets/styles/colors.less';

.song {
  &__feat-modal {
    width: 300px;
    padding: 0.5rem 1rem;

    p {
      color: @black;
      font-size: 1em;
    }
  }
}
</style>
