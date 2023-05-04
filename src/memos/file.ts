import fs from "fs";
import { Memo } from "../core/memo";
import { Content } from "../core/content";
import path from "path";

type Options = {
  tmpDir: string;
};

export class FileMemo<T extends Content> implements Memo<T> {
  private readonly tempDir: string;

  constructor(private readonly key: string, options: Partial<Options> = {}) {
    this.tempDir = options.tmpDir || fs.mkdtempSync(`/tmp/${key}`);
  }

  latest(): Promise<T> {
    const dirents = fs.readdirSync(this.tempDir, { withFileTypes: true });
    const filenames = dirents
      .filter((d) => d.isFile())
      .map((d) => d.name)
      .sort((a, b) => b.localeCompare(a));
    if (filenames.length === 0) {
      return Promise.resolve({} as T);
    }
    const filename = path.join(this.tempDir, filenames[0]);
    const json = JSON.parse(fs.readFileSync(filename, { encoding: "utf8" }));
    return Promise.resolve(json);
  }

  async push(doc: T): Promise<void> {
    await this.clear();
    fs.writeFileSync(
      generateFilename(this.tempDir, this.key),
      JSON.stringify(doc)
    );
  }

  clear(): Promise<void> {
    unlinkFilesInDir(this.tempDir, this.key);
    return Promise.resolve();
  }
}

const generateFilename = (dir: string, key: string) => {
  return path.resolve(dir, `${key}-${Date.now()}.json`);
};

export const collectFilenames = (filenames: string[], key: string) => {
  return filenames.filter((name) => name.match(`^${key}-[0-9]+.json$`));
};

const unlinkFilesInDir = (dir: string, key: string) => {
  for (const file of collectFilenames(fs.readdirSync(dir), key)) {
    fs.unlinkSync(path.resolve(dir, file));
  }
};
