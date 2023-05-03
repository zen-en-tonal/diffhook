import { Content } from "../core/content";
import { Hook } from "../core/hook";

export class ConsoleHook<T extends Content> implements Hook<T> {
  emit(doc: T): Promise<void> {
    console.log(doc);
    return Promise.resolve();
  }
}
