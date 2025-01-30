import { HttpService as AxiosHttpService } from '@nestjs/axios';
import { Test } from '@nestjs/testing';

import { AxiosHeaders, AxiosRequestConfig } from 'axios';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';

import { HttpService } from './http.service';

type TestResponse = {
  name: string;
};

const expectedInRequest = (request: Partial<AxiosRequestConfig>) => {
  return expect.objectContaining(request);
};

describe('HttpService', () => {
  let mockedAxiosHttpService: DeepMockProxy<AxiosHttpService>;

  let sut: HttpService;

  beforeEach(async () => {
    mockedAxiosHttpService = mockDeep<AxiosHttpService>();

    const module = await Test.createTestingModule({
      providers: [
        HttpService,
        { provide: AxiosHttpService, useValue: mockedAxiosHttpService },
      ],
    }).compile();

    sut = await module.resolve<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('should make request with default headers configured by default', async () => {
    const expected = expectedInRequest({
      headers: sut.getDefaultHeaders,
    });

    await sut.execute<TestResponse>();

    expect(mockedAxiosHttpService.axiosRef.request).toHaveBeenCalledWith(
      expected,
    );
  });

  it('should add bearer token to request headers', async () => {
    const expected = expectedInRequest({
      headers: new AxiosHeaders({
        ...sut.getDefaultHeaders,
        Authorization: 'Bearer myToken',
      }),
    });

    await sut.withAuthTokenHeader('myToken').execute<TestResponse>();

    expect(mockedAxiosHttpService.axiosRef.request).toHaveBeenCalledWith(
      expected,
    );
  });

  it('should add custom headers to request headers', async () => {
    const expected = expectedInRequest({
      headers: new AxiosHeaders({
        ...sut.getDefaultHeaders,
        foo: 'foo',
        bar: true,
      }),
    });

    await sut
      .withCustomHeader('foo', 'foo')
      .withCustomHeader('bar', true)
      .execute<TestResponse>();

    expect(mockedAxiosHttpService.axiosRef.request).toHaveBeenCalledWith(
      expected,
    );
  });

  it('should add base url to request', async () => {
    const expected = expectedInRequest({
      baseURL: 'http://some-base-url',
    });

    await sut.withBaseUrl('http://some-base-url').execute<TestResponse>();

    expect(mockedAxiosHttpService.axiosRef.request).toHaveBeenCalledWith(
      expected,
    );
  });

  it('should add route path url to request', async () => {
    const expected = expectedInRequest({
      url: '/foo',
    });

    await sut.withRoutePath('/foo').execute<TestResponse>();

    expect(mockedAxiosHttpService.axiosRef.request).toHaveBeenCalledWith(
      expected,
    );
  });

  it('should add http method to request', async () => {
    const expected = expectedInRequest({
      method: 'POST',
    });

    await sut.withMethod('POST').execute<TestResponse>();

    expect(mockedAxiosHttpService.axiosRef.request).toHaveBeenCalledWith(
      expected,
    );
  });

  it('should add body to request', async () => {
    const expected = expectedInRequest({
      data: { someId: 1 },
    });

    await sut
      .withBody<{ someId: number }>({ someId: 1 })
      .execute<TestResponse>();

    expect(mockedAxiosHttpService.axiosRef.request).toHaveBeenCalledWith(
      expected,
    );
  });

  it('should add multiple params to request', async () => {
    const expected = expectedInRequest({
      baseURL: 'http://some-base-url',
      data: 'someString',
      headers: sut.getDefaultHeaders,
      method: 'POST',
      url: '/foo',
    });

    await sut
      .withBaseUrl('http://some-base-url')
      .withBody<string>('someString')
      .withMethod('POST')
      .withRoutePath('/foo')
      .execute<TestResponse>();

    expect(mockedAxiosHttpService.axiosRef.request).toHaveBeenCalledWith(
      expected,
    );
  });

  it('should reset request config once call is executed', async () => {
    await sut
      .withBaseUrl('http://some-base-url')
      .withBody<string>('someString')
      .withMethod('POST')
      .withRoutePath('/foo')
      .execute<TestResponse>();

    await sut.execute<TestResponse>(); // second call should reset request config

    expect(mockedAxiosHttpService.axiosRef.request).toHaveBeenLastCalledWith(
      expectedInRequest({
        headers: sut.getDefaultHeaders,
      }),
    );
  });
});
