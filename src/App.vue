<template>
  <q-layout view="hHh lpR fFf">
    <the-header />
    <q-page-container>
      <container>
        <router-view />
      </container>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import TheHeader from '@/components/TheHeader.vue';
import { UserModule } from '@/store/modules/user';
import { initialize } from '@/common/utils/initialize-store';
import { PreferencesModule } from '@/store/modules/preferences';

@Component({ components: { TheHeader } })
export default class App extends Vue {
  async created(): Promise<void> {
    await initialize(UserModule, PreferencesModule);
  }
}
</script>
