import { Content } from "./content";
import { Error } from "./error";

type GetResult<T extends Content> = Error | { ok: true; res: T };

type PushResult = Error | { ok: true };

type ClearResult = Error | { ok: true };

export interface Memo<T extends Content> {
  latest(): Promise<GetResult<T>>;
  push(doc: T): Promise<PushResult>;
  clear(): Promise<ClearResult>;
}
