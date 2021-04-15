import { passport } from '@/common/apollo/passport';
import { ApiEndpoint } from '@xbeat/toolkit';
import Vue from 'vue';
import VueApollo from 'vue-apollo';

import { studio } from '@/common/apollo/studio';

Vue.use(VueApollo);

export const createProvider = (): VueApollo => {
  return new VueApollo({
    clients: {
      [ApiEndpoint.Passport]: passport,
      [ApiEndpoint.Studio]: studio
    },
    defaultClient: passport
  });
};
