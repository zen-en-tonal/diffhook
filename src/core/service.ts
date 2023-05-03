import { Fetcher } from "./fetcher";
import { Memo } from "./memo";
import { Diff } from "./diff";
import { Hook } from "./hook";
import { Error } from "./error";
import { Content, ContentDelta } from "./content";

type RunResult<T extends Content> =
  | Error
  | { ok: true; noDiff: true }
  | { ok: true; noDiff: false; diff: ContentDelta<T> };

export class Service<T extends Content> {
  constructor(
    readonly fetcher: Fetcher<T>,
    readonly memo: Memo<T>,
    readonly diff: Diff<T>,
    readonly hook: Hook<ContentDelta<T>>
  ) {}

  async init(): Promise<boolean> {
    await this.memo.clear();
    return true;
  }

  async run(): Promise<RunResult<T>> {
    const curr = await this.fetcher.get();
    if (!curr.ok) return curr;
    const prev = await this.memo.latest();
    if (!prev.ok) return prev;

    if (!this.diff.isDiff(prev.res, curr.res)) {
      return { ok: true, noDiff: true };
    }
    const diff = this.diff.diff(prev.res, curr.res);

    const emitRes = await this.hook.emit(diff);
    if (!emitRes.ok) return emitRes;

    const pushRes = await this.memo.push(curr.res);
    if (!pushRes.ok) return pushRes;

    return { ok: true, noDiff: false, diff };
  }
}
