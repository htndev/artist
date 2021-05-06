import { UserModule } from '@/store/modules/user';
import { AxiosRequestConfig } from 'axios';
import { BaseEndpoint } from './base.endpoint';
import { ENDPOINTS } from '@/common/constants/constants';

class MediaEndpoint extends BaseEndpoint {
  constructor() {
    super(`${ENDPOINTS.MEDIA}/v1`);
  }

  async upload(...files: Blob[]) {
    const fd = new FormData();
    files.forEach(file => fd.append('files', file));

    return this.instance.post<{ files: string[] }>('/files', fd);
  }

  protected preRequest(config: AxiosRequestConfig): AxiosRequestConfig {
    const cfg: AxiosRequestConfig = { ...config };

    cfg.headers.Authorization = `Bearer ${UserModule.tokens.media}`;

    return cfg;
  }
}

export default new MediaEndpoint();
