import { Response, Request, CookieOptions } from 'express';
import { IExpressCookieAdapter } from '../interfaces';

export class ExpressCookieAdapter implements IExpressCookieAdapter {
  setCookie(response: Response, name: string, value: string, options?: CookieOptions): void {
    response.cookie(name, value, options);
  }

  getCookie(request: Request, name: string): string | null {
    return request.cookies?.[name] || null;
  }

  clearCookie(response: Response, name: string, options?: CookieOptions): void {
    const clearOptions = { ...options, expires: new Date(0) };
    response.clearCookie(name, clearOptions);
  }
}
