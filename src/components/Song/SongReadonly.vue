<template>
  <div class="song-readonly">
    <span class="song-readonly__control">
      <q-btn :icon="icon" size="md" flat round dense @click="controlSong" />
    </span>
    <span class="song-readonly__title q-ml-md">{{ song.name }}</span>
    <template v-if="hasFeats">
      <q-chip v-for="feat in feats" :key="feat.name">
        <q-avatar>
          <img :src="feat.avatar" />
        </q-avatar>
        {{ feat.name }}
      </q-chip>
    </template>
    <span class="song-readonly__duration q-ml-auto">{{ song.duration | formatDuration }}</span>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, PropSync, Watch } from 'vue-property-decorator';
import { ReadonlySong } from '@/common/entities/readonly-song';
import { FeatType } from '@/common/types';
import { FormatFilter } from '@/common/mixin/format-filter';

@Component({ mixins: [FormatFilter] })
export default class SongReadonly extends Vue {
  @Prop({ required: true, type: ReadonlySong })
  song!: ReadonlySong;

  @PropSync('isPlaying', { default: false, type: Boolean })
  isPlayingSync!: boolean;

  get icon(): string {
    return this.isPlayingSync ? 'pause' : 'play_arrow';
  }

  get feats(): FeatType[] {
    return this.song.feats;
  }

  get hasFeats(): boolean {
    return this.feats.length > 0;
  }

  controlSong(): void {
    this.$emit('update:song-control');
  }

  @Watch('isPlaying')
  onControlChange(): void {
    const action = this.isPlayingSync ? 'play' : 'pause';

    this.song.audio[action]();
  }
}
</script>

<style lang="less" scoped>
@import '../../assets/styles/colors.less';

.song-readonly {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 1rem 2rem;
  background: @secondary;
  border-radius: 40px;

  &:not(:last-child) {
    margin-bottom: 1rem;
  }
}
</style>
