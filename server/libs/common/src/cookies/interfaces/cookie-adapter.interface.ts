export interface ICookieAdapter<
  RequestType = Record<string, any>,
  ResponseType = Record<string, any>,
  OptionsType = Record<string, any>,
> {
  setCookie(response: ResponseType, name: string, value: string, options?: OptionsType): void;
  getCookie(request: RequestType, name: string): string | null;
  clearCookie(response: ResponseType, name: string, options?: OptionsType): void;
}
