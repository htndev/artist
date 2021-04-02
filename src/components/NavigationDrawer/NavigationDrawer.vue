<template>
  <q-drawer v-model="expanded" :mini="mini" bordered content-class="bg-grey-2">
    <q-list>
      <navigation-drawer-item
        v-for="item in baseNavigationItems"
        :key="item.text"
        :text="item.text"
        :icon="item.icon"
        :to="item.to"
      />
      <navigation-drawer-item class="q-pa-none" :clickable="false">
        <template>
          <q-expansion-item
            :label="$tc('playlist', 2)"
            :caption="$tc('playlists-amount', playlists.length, { amount: playlists.length })"
            dense-toggle
            default-opened
          >
            <template v-if="playlists.length">
              <q-virtual-scroll :items="playlists" style="max-height: 300px">
                <template v-slot="{ item }">
                  <router-link :to="item.link" class="p-16 block text-decoration-none color-black">
                    <!-- <playing-indication :active="item.active" :visible="item.active" /> -->
                    {{ item.title }}
                  </router-link>
                </template>
              </q-virtual-scroll>
            </template>
            <template v-else>
              <p class="text-center font-size-16 q-my-md">
                {{ $tc('playlists-amount', 0) }} <q-icon name="sentiment_very_dissatisfied" />
              </p>
              <p class="text-center">
                <q-btn outline :label="$t('create-playlist')" />
              </p>
            </template>
          </q-expansion-item>
        </template>
      </navigation-drawer-item>
    </q-list>
  </q-drawer>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import NavigationDrawerItem from '@/components/NavigationDrawer/NavigationDrawerItem.vue';
// import PlayingIndication from '@/components/Common/PlayingIndication.vue';
import { DrawerModule } from '@/store/modules/drawer';
import { UserModule } from '@/store/modules/user';
import { User } from '@/common/types';
import { Nullable } from '@xbeat/toolkit';
import { TranslateResult } from 'vue-i18n';
@Component({ components: { NavigationDrawerItem } })
export default class NavigationDrawer extends Vue {
  get mini(): boolean {
    return DrawerModule.drawerSettings.mini;
  }
  get expanded(): boolean {
    return DrawerModule.drawerSettings.expanded;
  }
  set expanded(isExpanded: boolean) {
    DrawerModule.MINIFY();
  }
  get user(): Nullable<User> {
    return UserModule.user;
  }
  get username(): string {
    return this.user ? this.user.username : '';
  }
  get userMusicLink(): string {
    return `/${this.username}/music`;
  }
  get baseNavigationItems(): { text: TranslateResult; to: string; icon: string }[] {
    return [
      { text: this.$t('home'), to: '/', icon: 'home' },
      { text: this.$t('recently-played'), to: '/recent', icon: 'settings_backup_restore' },
      { text: this.$t('browse'), to: '/browse', icon: 'explore' },
      { text: this.$t('my-music'), to: this.userMusicLink, icon: 'library_music' }
    ];
  }
  get playlists(): { title: string; link: string; active: boolean }[] {
    return Array.from({ length: 20 }, (v, i) => ({
      title: `Playlist ${i + 1}`,
      link: `/p/qwe/${i + 1}`,
      active: Math.random() > 0.5
    }));
  }
}
</script>

<style lang="less" scoped></style>
