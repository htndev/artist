<template>
  <q-item :clickable="clickable">
    <q-item-section avatar v-if="icon">
      <slot name="icon">
        <router-link v-if="to" :to="to" class="text-decoration-none font-size-24">
          <q-icon class="color-dark-purple" :name="icon" />
        </router-link>
        <q-icon v-else class="color-dark-purple" :name="icon" />
      </slot>
    </q-item-section>
    <q-item-section>
      <q-item-label class="full-height">
        <slot>
          <router-link class="text-decoration-none color-black full-height flex items-center" :to="to">
            {{ text }}
          </router-link>
        </slot>
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
@Component
export default class NavigationDrawerItem extends Vue {
  @Prop({ type: String })
  text!: string;
  @Prop({ type: String })
  icon!: string;
  @Prop({ type: String })
  to!: string;
  @Prop({ type: Boolean, default: true })
  clickable!: boolean;
}
</script>
