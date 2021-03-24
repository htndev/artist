import Vue, { PluginObject } from 'vue';
import axios, { AxiosRequestConfig } from 'axios';

const config: AxiosRequestConfig = {};

const _axios = axios.create(config);

const Plugin: PluginObject<AxiosRequestConfig> = {
  install(Vue) {
    (Vue as any).axios = _axios;

    Object.defineProperties(Vue.prototype, {
      axios: {
        get() {
          return _axios;
        }
      },
      $axios: {
        get() {
          return _axios;
        }
      }
    });
  }
};

Vue.use(Plugin);

export default Plugin;
