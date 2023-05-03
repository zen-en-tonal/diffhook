import { Content } from "./content";

export interface Hook<T extends Content> {
  emit(doc: T): Promise<void>;
}
