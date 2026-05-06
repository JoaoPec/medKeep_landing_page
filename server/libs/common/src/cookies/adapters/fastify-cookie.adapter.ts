import { FastifyReply, FastifyRequest } from 'fastify';
import { CookieSerializeOptions } from '@fastify/cookie';
import { IFastifyCookieAdapter } from '../interfaces';

export class FastifyCookieAdapter implements IFastifyCookieAdapter {
  setCookie(
    response: FastifyReply,
    name: string,
    value: string,
    options?: CookieSerializeOptions,
  ): void {
    response.setCookie(name, value, options);
  }

  getCookie(request: FastifyRequest, name: string): string | null {
    return request.cookies?.[name] || null;
  }

  clearCookie(response: FastifyReply, name: string, options?: CookieSerializeOptions): void {
    const clearOptions = { ...options, expires: new Date(0) };
    response.clearCookie(name, clearOptions);
  }
}
