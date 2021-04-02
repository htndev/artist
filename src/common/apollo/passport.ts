import { ENDPOINTS } from '@/common/constants/constants';
import { UserModule } from '@/store/modules/user';
import { ApiEndpoint } from '@xbeat/toolkit';
import { createApolloClient } from '@xbeat/client-toolkit';

export const passport = createApolloClient(
  `${ENDPOINTS.PASSPORT}/v1/graphql`,
  ApiEndpoint.Passport,
  UserModule,
  UserModule.setTokens,
  console.log
);
