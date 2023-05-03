import { Content } from "./content";

export interface Fetcher<T extends Content> {
  get(): Promise<T>;
}
