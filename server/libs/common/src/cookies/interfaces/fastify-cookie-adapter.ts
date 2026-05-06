import { FastifyReply, FastifyRequest } from 'fastify';
import { ICookieAdapter } from '.';
import { CookieSerializeOptions } from '@fastify/cookie';

export interface IFastifyCookieAdapter
  extends ICookieAdapter<FastifyRequest, FastifyReply, CookieSerializeOptions> {}
