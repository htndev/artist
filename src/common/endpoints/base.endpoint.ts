import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

export abstract class BaseEndpoint {
  protected instance = axios.create();

  constructor(baseURL: string, options: Omit<AxiosRequestConfig, 'baseURL'> = {}) {
    this.instance = axios.create({ baseURL, ...options });

    if (this.preRequest) {
      this.instance.interceptors.request.use(this.preRequest);
    }
    if (this.postRequest) {
      this.instance.interceptors.response.use(this.postRequest);
    }
  }

  protected preRequest?(config: AxiosRequestConfig): AxiosRequestConfig;
  protected postRequest?(response: AxiosResponse): AxiosResponse;
}
