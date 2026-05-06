import { Provider } from '@nestjs/common';
import { COOKIE_ADAPTER } from '../constants';
import { AbstractHttpAdapter, HttpAdapterHost } from '@nestjs/core';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { ExpressAdapter } from '@nestjs/platform-express';
import { ExpressCookieAdapter, FastifyCookieAdapter } from '../adapters';

export const CookieAdapter: Provider = {
  provide: COOKIE_ADAPTER,
  useFactory: async (adapterHost: HttpAdapterHost) => {
    const httpAdapter: AbstractHttpAdapter = adapterHost.httpAdapter;

    switch (httpAdapter.constructor) {
      case FastifyAdapter:
        return new FastifyCookieAdapter();
      case ExpressAdapter:
        return new ExpressCookieAdapter();
      default:
        throw new Error('Platform is currently unsupported.');
    }
  },
  inject: [HttpAdapterHost],
};
