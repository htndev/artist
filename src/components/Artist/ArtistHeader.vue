<template>
  <div class="artist-header">
    <q-img height="350px" width="100%" :src="getHeaderImage(artist.header)" />
    <div class="artist-header--overlay"></div>
    <div class="artist-header--description flex items-end">
      <artist-avatar />
      <h2 class="q-ma-none q-ml-md text-weight-bold text-white">{{ artist.name }}</h2>
      <span class="q-my-none q-ml-auto q-mr-sm update-artist-header" @click="uploadHeader">
        {{ $t('upload.new-cover') }}
      </span>
      <image-cropper-popup
        v-model="showHeaderCropper"
        :aspect-ratio="45 / 14"
        :src="header"
        @cropped="haederCropper"
        :loading="cropButtonLoading"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import DEFAULT_ARTIST_HEADER_IMAGE from '@/assets/images/ARTIST-HEADER-FALLBACK.svg';
import ArtistAvatar from './ArtistAvatar.vue';
import { ArtistEntity } from '@/common/entities/artist';
import { ArtistModule } from '@/store/modules/artist';
import { fallbackImage } from '@/common/utils/image-fallback';
import { fileToDataUrl } from '@xbeat/client-toolkit';

const MAX_HEADER_SIZE = 2000000;

@Component({ components: { ArtistAvatar } })
export default class ArtistHeader extends Vue {
  showHeaderCropper = false;
  cropButtonLoading = false;
  header = '';
  getHeaderImage = fallbackImage(DEFAULT_ARTIST_HEADER_IMAGE);

  get artist(): ArtistEntity {
    return ArtistModule.currentArtist as ArtistEntity;
  }

  async uploadHeader(): Promise<void> {
    const fileUploader = document.createElement('input');
    fileUploader.type = 'file';
    fileUploader.accept = 'image/x-png,image/gif,image/jpeg';

    fileUploader.onchange = async () => {
      const files = fileUploader.files;

      if (!files) {
        return;
      }

      const [file] = [...files];

      if (file.size > MAX_HEADER_SIZE) {
        this.$q.notify({
          message: this.$t('error.file.big', ['']) as string,
          type: 'negative',
          position: 'bottom-right'
        });
        return;
      }

      this.header = await fileToDataUrl(file);
      this.showHeaderCropper = true;
      fileUploader.remove();
    };

    fileUploader.click();
  }

  async haederCropper(header: Blob): Promise<void> {
    this.cropButtonLoading = true;
    await ArtistModule.updateArtistHeader({ id: this.artist.url, file: header });
    this.cropButtonLoading = false;
    this.showHeaderCropper = false;
  }
}
</script>

<style lang="less" scoped>
@import '../../assets/styles/colors.less';

.artist-header {
  position: relative;

  &--overlay {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    width: 100%;
    height: 100%;
    background: linear-gradient(to bottom, transparent 0%, black 110%);
  }

  &--description {
    position: absolute;
    bottom: 1rem;
    left: 1rem;
    z-index: 2;
    width: calc(100% - 1rem);

    .update-artist-header {
      padding: 5px 10px;
      background: rgba(@light-gray, 0.8);
      color: @black;
      border: 1px solid transparent;
      border-radius: 15px;
      cursor: pointer;
      transition: all 0.15s ease-in;

      &:hover {
        background: rgba(@light-gray, 1);
        border-color: @secondary;
      }
    }
  }
}
</style>
