import { HttpService as AxiosHttpService } from '@nestjs/axios';
import { Injectable, Scope } from '@nestjs/common';
import {
  AxiosHeaders,
  AxiosHeaderValue,
  AxiosRequestConfig,
  AxiosResponse,
  Method,
} from 'axios';

@Injectable({ scope: Scope.TRANSIENT })
export class HttpService {
  private defaultHeaders = new AxiosHeaders({
    'Accept-Encoding': 'gzip,deflate,compress',
    'Content-Type': 'application/json',
  });

  private requestConfig: AxiosRequestConfig = {
    headers: this.defaultHeaders,
  };

  get getDefaultHeaders(): Record<string, AxiosHeaderValue> {
    return this.defaultHeaders;
  }

  constructor(private axiosHttpService: AxiosHttpService) {}

  withAuthTokenHeader(token: string): HttpService {
    this.requestConfig.headers['Authorization'] = `Bearer ${token}`;
    return this;
  }

  withBaseUrl(baseUrl: string): HttpService {
    this.requestConfig.baseURL = baseUrl;
    return this;
  }

  withBody<TBody>(body: TBody): HttpService {
    this.requestConfig.data = body;
    return this;
  }

  withCustomHeader(key: string, value: AxiosHeaderValue): HttpService {
    this.requestConfig.headers[key] = value.toString();
    return this;
  }

  withMethod(method: Method): HttpService {
    this.requestConfig.method = method;
    return this;
  }

  withRoutePath(routePath: string): HttpService {
    this.requestConfig.url = routePath;
    return this;
  }

  async execute<TResponse>(): Promise<AxiosResponse<TResponse>> {
    const completeRequest = this.requestConfig;

    this.requestConfig = {
      headers: this.getDefaultHeaders,
    };

    return this.axiosHttpService.axiosRef.request<TResponse>(completeRequest);
  }
}
