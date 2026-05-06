import { CookieOptions, Request, Response } from 'express';
import { ICookieAdapter } from '.';

export interface IExpressCookieAdapter extends ICookieAdapter<Request, Response, CookieOptions> {}
