import { Content } from "../core/content";
import { FetchResult, Fetcher } from "../core/fetcher";

type Options<TJson, TContent> = {
  format: (json: TJson) => TContent;
};

export class JsonFetcher<TJson, TContent extends Content>
  implements Fetcher<TContent>
{
  constructor(
    readonly uri: string,
    readonly options: Partial<Options<TJson, TContent>> = {}
  ) {}

  async get(): Promise<FetchResult<TContent>> {
    const resp = await fetch(this.uri);
    const json = await resp.json();
    const res = this.options.format?.(json) ?? json;
    return {
      ok: true,
      res,
    };
  }
}
