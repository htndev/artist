<template>
  <div class="image-cropper">
    <img ref="img" :src="src" />
    <div class="preview q-mt-md" />
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator';
import 'cropperjs/dist/cropper.css';
import { Nullable } from '@xbeat/toolkit';
import Cropper from 'cropperjs';
import eventBus from '@/common/event-bus';
import { dataUrlToBlob } from '@xbeat/client-toolkit';
// import { fileToDataUrl, dataUrlToBlob } from '@xbeat/client-toolkit';
@Component
export default class ImageCropper extends Vue {
  $refs!: { cropper: any; img: any };

  private file = '';
  private cropper!: Cropper;

  @Prop({ type: Number })
  aspectRatio!: number;
  @Prop({ type: String })
  src!: Nullable<string>;

  mounted(): void {
    this.cropper = new Cropper(this.$refs.img, {
      aspectRatio: 1,
      preview: '.preview'
    });

    eventBus.$on('crop', this.crop);
  }

  async crop(): Promise<void> {
    const dataUrl = this.cropper.crop().getCroppedCanvas().toDataURL('image/jpeg', 0.5);

    this.$emit('cropped', await dataUrlToBlob(dataUrl));
  }
}
</script>

<style lang="less" scoped>
.image-cropper {
  img {
    display: block;
    max-width: 100%;
  }

  .preview {
    width: 100%;
    height: calc(200px);
    overflow: hidden;
    margin-left: auto;
    margin-right: auto;
  }
}
</style>
