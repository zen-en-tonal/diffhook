import { Content } from "./content";
import { Error } from "./error";

type EmitResult = Error | { ok: true };

export interface Hook<T extends Content> {
  emit(doc: T): Promise<EmitResult>;
}
