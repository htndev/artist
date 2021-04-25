<template>
  <div class="artist-avatar">
    <span class="artist-avatar--overlay text-bold cursor-pointer" @click="uploadAvatar">
      {{ $t('upload.new-avatar') }}
    </span>
    <q-avatar size="150px">
      <q-img :src="getAvatarImage(artist.avatar)" ratio="1" />
    </q-avatar>
    <image-cropper-popup v-model="showCropPopup" :src="editingFile" @cropped="cropped" :loading="cropButtonLoading" />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import DEFAULT_ARTIST_AVATAR_IMAGE from '@/assets/images/ARTIST-AVATAR-FALLBACK.png';
import { fallbackImage } from '@/common/utils/image-fallback';
import { ArtistEntity } from '@/common/entities/artist';
import { ArtistModule } from '@/store/modules/artist';
import { Nullable } from '@xbeat/toolkit';
import { fileToDataUrl } from '@xbeat/client-toolkit';

const MAX_AVATAR_SIZE = 1000000;

@Component
export default class ArtistAvatar extends Vue {
  showCropPopup = false;
  cropButtonLoading = false;
  getAvatarImage = fallbackImage(DEFAULT_ARTIST_AVATAR_IMAGE);
  editingFile: Nullable<string> = null;

  get artist(): ArtistEntity {
    return ArtistModule.currentArtist as ArtistEntity;
  }

  async uploadAvatar(): Promise<void> {
    const fileUploader = document.createElement('input');
    fileUploader.type = 'file';
    fileUploader.accept = 'image/x-png,image/gif,image/jpeg';
    fileUploader.onchange = async () => {
      const files = fileUploader.files;
      if (!files) {
        return;
      }
      const [file] = [...files];
      if (file.size > MAX_AVATAR_SIZE) {
        this.$q.notify({ message: 'File is too big.', type: 'negative', position: 'bottom-right' });
        return;
      }
      this.editingFile = await fileToDataUrl(file);
      this.showCropPopup = true;
      fileUploader.remove();
    };
    fileUploader.click();
  }

  async cropped(avatar: Blob): Promise<void> {
    this.cropButtonLoading = true;
    await ArtistModule.updateArtistAvatar({ id: this.artist.url, file: avatar });
    this.cropButtonLoading = false;
    this.showCropPopup = false;
  }
}
</script>

<style lang="less" scoped>
@import '../../assets/styles/colors.less';

.artist-avatar {
  position: relative;

  &--overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    background: rgba(@dark-purple, 0.7);
    color: @white;
    opacity: 0;
    border-radius: 50%;
    transition: opacity 0.15s ease-in;

    &:hover {
      opacity: 1;
    }
  }
}
</style>
