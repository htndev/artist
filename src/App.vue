<template>
  <q-layout view="hHh LpR fFf">
    <the-header />
    <navigation-drawer />
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
import NavigationDrawer from '@/components/NavigationDrawer/NavigationDrawer.vue';
import Container from '@/components/Common/Container.vue';
import { UserModule } from '@/store/modules/user';
import { initialize } from '@/common/utils/initialize-store';
import { PreferencesModule } from '@/store/modules/preferences';
import { DrawerModule } from '@/store/modules/drawer';

@Component({ components: { TheHeader, NavigationDrawer, Container } })
export default class App extends Vue {
  async created(): Promise<void> {
    await initialize(UserModule, PreferencesModule, DrawerModule.initialize((this as any).$q.platform.is.desktop));
  }
}
</script>
