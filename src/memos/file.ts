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
    fs.writeFileSync(this.generateFilename(), JSON.stringify(doc));
  }

  clear(): Promise<void> {
    unlinkFilesInDir(this.tempDir);
    return Promise.resolve();
  }

  private generateFilename() {
    return path.resolve(this.tempDir, `${this.key}-${Date.now()}.json`);
  }
}

function unlinkFilesInDir(dir: string) {
  for (const file of fs.readdirSync(dir)) {
    fs.unlinkSync(path.resolve(dir, file));
  }
}
