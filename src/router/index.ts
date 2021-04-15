import Home from '@/views/Home.vue';
import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: Home.name,
    component: Home
  },
  {
    path: '/new-artist',
    name: 'NewArtist',
    component: () => import(/* webpackChunkName: "about" */ '@/views/NewArtist.vue')
  },
  {
    path: '/a/:id',
    name: 'Artist',
    component: () => import(/* webpackChunkName: "artist" */ '@/views/Artist.vue'),
    beforeEnter: (to, from, next) => {
      console.log(to.params.id);
      next();
    }
  },
  {
    path: '/a',
    name: 'Artists',
    component: () => import(/* webpackChunkName: "artists" */ '@/views/Artists.vue')
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;
