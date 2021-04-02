<template>
  <div class="container" :class="[align, size]">
    <slot />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

enum Align {
  Left = 'left',
  Center = 'center',
  Right = 'right'
}

enum Size {
  Half = 'half',
  Default = 'default'
}

@Component
export default class Container extends Vue {
  @Prop({ type: String, default: Size.Default, validator: (v: Size) => [Size.Half, Size.Default].includes(v) })
  size!: Size;
  @Prop({
    type: String,
    default: Align.Center,
    validator: (v: Align) => [Align.Left, Align.Center, Align.Right].includes(v)
  })
  align!: Align;
}
</script>

<style lang="less" scoped>
.container {
  &.half {
    width: 50%;
    @media screen and (max-width: 420px) {
      width: 100%;
    }
  }
  &.default {
    width: 80%;
  }
  &.left {
    margin-right: auto;
  }
  &.center {
    margin: 0 auto;
  }
  &.right {
    margin-left: auto;
  }
}
</style>
