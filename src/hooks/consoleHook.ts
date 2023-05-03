import { Content } from "../core/content";
import { Error } from "../core/error";
import { Hook } from "../core/hook";

export class ConsoleHook<T extends Content> implements Hook<T> {
  emit(doc: T): Promise<Error | { ok: true }> {
    console.log(doc);
    return Promise.resolve({ ok: true });
  }
}
