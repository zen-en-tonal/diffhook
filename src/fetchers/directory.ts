import fs from "fs";
import { FetchResult, Fetcher } from "../core/fetcher";
import path from "path";

export type Directory = {
  [key in string]: string;
};

export class DirectoryFetcher implements Fetcher<Directory> {
  constructor(private readonly watching: string) {}

  get(): Promise<FetchResult<Directory>> {
    const dirents = fs.readdirSync(this.watching, { withFileTypes: true });
    const files = dirents
      .filter((d) => d.isFile())
      .map((d) => ({ [d.name]: path.normalize(d.name) }))
      .reduce((l, r) => Object.assign(l, r), {});
    return Promise.resolve({ ok: true, res: files });
  }
}
