import { Error } from './error';

export type FetchResult<T> = 
    | Error 
    | { ok: true, res: T }

export interface Fetcher<T> {
    get(): Promise<FetchResult<T>>
}
