<template>
  <div class="avatar">
    <q-avatar class="avatar-bg">
      <span v-if="!avatar">{{ avatarUsername }}</span>
      <template v-else>
        <img :src="avatar" v-if="avatarLoaded" />
        <q-spinner v-else />
      </template>
      <q-menu v-if="$slots.onclick" max-width="300px" class="avatar-menu">
        <q-list class="avatar-menu-width">
          <slot name="onclick"></slot>
        </q-list>
      </q-menu>
      <q-menu v-if="$slots['context-menu']">
        <q-list>
          <slot name="context-menu"></slot>
        </q-list>
      </q-menu>
    </q-avatar>
  </div>
</template>

<script lang="ts">
import { isNil, Nullable } from '@xbeat/toolkit';
import { Vue, Prop, Component, Watch } from 'vue-property-decorator';
@Component
export default class Avatar extends Vue {
  private avatarLoaded = false;
  @Prop({ type: String, default: '' })
  username!: string;
  @Prop({ type: [String, Object], default: null })
  avatar!: Nullable<string>;
  get avatarUsername(): string {
    return this.username ? (this.avatar ? '' : this.username[0]) : '';
  }
  @Watch('avatar', { immediate: true })
  onAvatarChanged(avatar: Nullable<string>) {
    if (isNil(avatar)) {
      return;
    }
    const img = document.createElement('img');
    img.onload = () => {
      this.avatarLoaded = true;
    };
    img.src = avatar;
    this.avatarLoaded = false;
  }
}
</script>

<style lang="less" scoped>
@import '../../assets/styles/colors.less';
.avatar {
  transition: 0.25s box-shadow ease-in;
  border-radius: 50%;
  &:hover {
    cursor: pointer;
    box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  }
  &-bg {
    background: @dark-purple;
  }
}
</style>

<style lang="less">
.avatar-menu-width {
  min-width: 150px;
}
</style>
