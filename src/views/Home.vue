<template>
  <div class="home">
    <router-link to="new-artist">Create new artist</router-link>
    <router-link to="a">Artist's list</router-link>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Home extends Vue {}
</script>
