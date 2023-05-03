import { Content } from "./content";

export interface Memo<T extends Content> {
  latest(): Promise<T>;
  push(doc: T): Promise<void>;
  clear(): Promise<void>;
}
