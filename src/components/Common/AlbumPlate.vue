<template>
  <div class="album">
    <q-img :src="coverImage" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import ALBUM_PLACEHOLDER from '@/assets/images/svg/ALBUM_PLACEHOLDER.svg';
import { Nullable } from '@xbeat/toolkit';

@Component
export default class AlbumPlate extends Vue {
  @Prop({ default: '', type: [String, Number] })
  name!: string;

  @Prop({ default: null, type: [Object, String] })
  cover!: Nullable<string>;

  get coverImage(): string {
    return this.cover || ALBUM_PLACEHOLDER;
  }
}
</script>

<style scoped lang="less">
.album {
  width: 100%;
  height: 100%;
  background: red;
}
</style>
