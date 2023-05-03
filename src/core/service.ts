import { Fetcher } from "./fetcher";
import { Memo } from "./memo";
import { Diff } from "./diff";
import { Hook } from "./hook";
import { Content, ContentDelta } from "./content";

type Components<T extends Content> = {
  fetcher: Fetcher<T>;
  memo: Memo<T>;
  diff: Diff<T>;
  hook: Hook<ContentDelta<T>>;
};

type Options = {
  clearOnInit: boolean;
};

export class Service<T extends Content> {
  constructor(
    readonly components: Readonly<Components<T>>,
    readonly options: Partial<Readonly<Options>> = {}
  ) {}

  async init(): Promise<void> {
    if (this.options.clearOnInit) {
      await this.components.memo.clear();
    }
  }

  async run(): Promise<ContentDelta<T> | undefined> {
    const curr = await this.components.fetcher.get();
    const prev = await this.components.memo.latest();

    if (!this.components.diff.isDiff(prev, curr)) return undefined;
    const diff = this.components.diff.diff(prev, curr);

    await this.components.hook.emit(diff);
    await this.components.memo.push(curr);

    return diff;
  }
}
