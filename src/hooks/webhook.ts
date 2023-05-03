import { Content, ContentDelta } from "../core/content";
import { Hook } from "../core/hook";

type Options<T extends Content, Q> = {
  formatter: (doc: ContentDelta<T>) => Q;
};

export class WebHook<T extends Content, Q> implements Hook<T> {
  constructor(
    readonly endpoint: string,
    readonly options: Partial<Options<T, Q>> = {}
  ) {}

  async emit(delta: ContentDelta<T>): Promise<void> {
    const payload = this.options.formatter?.(delta) || delta;
    const resp = await fetch(this.endpoint, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    if (!resp.ok) {
      return Promise.reject(new Error(resp.statusText));
    }
  }
}
