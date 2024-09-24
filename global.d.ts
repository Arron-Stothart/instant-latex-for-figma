import { Console, FetchOptions, FetchResponse } from '@figma/plugin-typings';

declare global {
  const console: Console;
  const fetch: (url: string, init?: FetchOptions) => Promise<FetchResponse>;
}

export {};