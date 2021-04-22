import { initialize } from './../common/utils/initialize-store';
import { ArtistModule } from '@/store/modules/artist';
import { PreferencesModule } from '@/store/modules/preferences';
import { UserModule } from '@/store/modules/user';
import Home from '@/views/Home.vue';
import NotFound from '@/views/NotFound.vue';
import { isNil } from '@xbeat/toolkit';
import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

const MODULES = [ArtistModule, UserModule, PreferencesModule];

const areModulesInitialized = () => MODULES.every(({ isInitialized }) => isInitialized);

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
    beforeEnter: async (to, from, next) => {
      if (isNil(to.params.id)) {
        next('/a');
      }

      if (!(await ArtistModule.userHasArtist(to.params.id))) {
        next('/404');
      }

      ArtistModule.SET_CURRENT_ARTIST(to.params.id);
      next();
    }
  },
  {
    path: '/a',
    name: 'Artists',
    component: () => import(/* webpackChunkName: "artists" */ '@/views/Artists.vue')
  },
  {
    path: '/404',
    name: '404',
    component: NotFound
  },
  {
    path: '*',
    name: 'NotFound',
    component: NotFound
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

router.beforeEach(async (to, from, next) => {
  if (!areModulesInitialized()) {
    await initialize(UserModule, ArtistModule, PreferencesModule);
  }

  next();
});

export default router;
