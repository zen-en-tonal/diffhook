import { Content, ContentDelta } from "./content";

export interface Diff<T extends Content> {
  isDiff(oldValue: T, newValue: T): boolean;
  diff(oldValue: T, newValue: T): ContentDelta<T>;
}
