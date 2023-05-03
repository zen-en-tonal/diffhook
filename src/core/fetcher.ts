import { Content } from "./content";
import { Error } from "./error";

export type FetchResult<T extends Content> = Error | { ok: true; res: T };

export interface Fetcher<T extends Content> {
  get(): Promise<FetchResult<T>>;
}
