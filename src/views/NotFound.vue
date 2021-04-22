<template>
  <section class="not-found">
    <img svg-inline src="@/assets/images/svg/not-found.svg" />
    <div class="redirects">
      <h3>Choose your way:</h3>
      <p class="flex justify-around">
        <a :href="homepageLink" class="text-black text-decoration-none text-h6">Homepage</a>
        <a :href="playerLink" class="text-black text-decoration-none text-h6">Player</a>
        <router-link to="/a" class="text-black text-decoration-none text-h6">Artist's list</router-link>
      </p>
    </div>
  </section>
</template>

<script lang="ts">
import { CLIENTS } from '@/common/constants/constants';
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class NotFound extends Vue {
  homepageLink = CLIENTS.HOMEPAGE;
  playerLink = CLIENTS.PLAYER;
}
</script>

<style lang="less" scoped>
.not-found {
  margin-top: 5rem;
  display: flex;
  flex-direction: column;
  align-items: center;

  svg {
    outline: none;
  }
}
</style>
