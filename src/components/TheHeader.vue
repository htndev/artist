<template>
  <q-header elevated class="header">
    <q-toolbar>
      <router-link to="/" class="flex items-center text-decoration-none">
        <logo small />
        <span class="text-white text-h5 text-bold q-ml-sm">Artist</span>
      </router-link>
      <q-space />
      <avatar :avatar="avatar" :username="username">
        <template #onclick>
          <q-item dense class="items-center justify-end">
            <q-item-label lines="1" class="text-weight-bold font-size-16 full-width text-right">
              <router-link :to="`/u/${username}`" class="text-decoration-none color-secondary">
                {{ username }}
                <q-tooltip
                  v-if="showUsernaneTooltip"
                  anchor="top middle"
                  self="bottom middle"
                  content-class="bg-dark-purple"
                >
                  {{ username }}
                </q-tooltip>
              </router-link>
            </q-item-label>
          </q-item>
          <q-item class="items-center justify-end">
            <q-item-label lines="1" class="font-size-16 full-width text-right">
              <a :href="playerUrl" class="text-decoration-none text-black">{{ $t('back-to-player') }}</a>
            </q-item-label>
          </q-item>
          <q-item class="items-center justify-end" clickable>
            <q-item-label lines="1" @click="logout">{{ $t('logout') }}</q-item-label>
          </q-item>
        </template>
      </avatar>
    </q-toolbar>
  </q-header>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import { UserModule } from '@/store/modules/user';
import { User } from '@/common/types';
import { Nullable } from '@xbeat/toolkit';
import { CLIENTS } from '@/common/constants/constants';

@Component
export default class TheHeader extends Vue {
  playerUrl = CLIENTS.PLAYER;

  get user(): Nullable<User> {
    return UserModule.user;
  }
  get username(): string {
    return this.user ? this.user.username : '';
  }
  get avatar(): string | null {
    return this.user ? this.user.avatar : '';
  }
  get showUsernaneTooltip(): boolean {
    return this.username.length > 12;
  }

  logout() {
    UserModule.logout();
  }
}
</script>

<style lang="less" scoped>
@import '../assets/styles/colors.less';

.header {
  background: @primary;
}
</style>
