<template>
  <div class="song-readonly">
    <span class="song-readonly__control">
      <q-btn :icon="icon" size="md" flat round dense />
    </span>
    {{ song.name }}
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, PropSync, Watch } from 'vue-property-decorator';
import { ReadonlySong } from '@/common/entities/readonly-song';

@Component
export default class SongReadonly extends Vue {
  @Prop({ required: true, type: ReadonlySong })
  song!: ReadonlySong;

  @PropSync('isPlaying', { default: false, type: Boolean })
  isPlayingSync!: boolean;

  get icon(): string {
    return this.isPlayingSync ? 'pause' : 'play_arrow';
  }

  controlSong(): void {
    this.isPlayingSync = !this.isPlayingSync;
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
  width: 100%;
  padding: 1rem 2rem;
  background: @secondary;
  border-radius: 40px;

  &:not(:last-child) {
    margin-bottom: 1rem;
  }
}
</style>
