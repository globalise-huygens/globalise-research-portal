import type { RegisteredRouter, ToOptions } from '@tanstack/react-router';
import { stringifyUrlParams } from './params/urlParams.ts';

export function toHref<const TTo extends `/${string}`>(options: HrefOptions<TTo>): string {
  return `${options.to}${stringifyUrlParams(options.search ?? {})}`;
}

type HrefOptions<TTo extends string> = Omit<RouteOptions<TTo>, 'search'> & (
  undefined extends RouteOptions<TTo>['search']
    ? { search?: UrlParamsOf<TTo> }
    : { search: UrlParamsOf<TTo> }
);

type UrlParamsOf<TTo extends string> = Exclude<RouteOptions<TTo>['search'], undefined | true | ((...args: never[]) => unknown)>;

type RouteOptions<TTo extends string> = ToOptions<RegisteredRouter, '/', TTo>;
