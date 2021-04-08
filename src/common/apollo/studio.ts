import { ENDPOINTS } from '@/common/constants/constants';
import { UserModule } from '@/store/modules/user';
import { ApiEndpoint } from '@xbeat/toolkit';
import { createApolloClient } from '@xbeat/client-toolkit';

export const studio = createApolloClient(`${ENDPOINTS.STUDIO}/v1/graphql`, ApiEndpoint.Studio, UserModule);
