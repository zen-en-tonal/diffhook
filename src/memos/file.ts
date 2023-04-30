import fs from 'fs'
import { Memo } from '../core/memo'
import { Content } from '../core/content'
import { Error } from '../core/error'
import path from 'path'

type Options = {
    tmpDir: string
}

export class FileMemo<T extends Content> implements Memo<T> {

    private readonly tempDir: string

    constructor(
        private readonly key: string,
        options: Partial<Options> = {}
    ) { 
        this.tempDir = options.tmpDir || fs.mkdtempSync(`/tmp/${key}`)
    }

    latest(): Promise<Error | { ok: true; res: T; }> {
        const dirents = fs.readdirSync(this.tempDir, { withFileTypes: true })
        const filenames = dirents.filter(
            d => d.isFile()
        ).map(
            d => d.name
        ).sort(
            (a, b) => b.localeCompare(a)
        )
        if (filenames.length === 0) {
            return Promise.resolve({ ok: true, res: {} as T })
        }
        const filename = path.join(this.tempDir, filenames[0])
        const json = JSON.parse(fs.readFileSync(filename, { encoding: 'utf8'}))
        return Promise.resolve({ ok: true, res: json })
    }

    async push(doc: T): Promise<Error | { ok: true; }> {
        if (!(await this.clear()).ok) {
            return { ok: false, reason: 'failed to remove memo.' }
        }
        fs.writeFileSync(this.generateFilename(), JSON.stringify(doc))
        return { ok: true }
    }

    clear(): Promise<Error | { ok: true; }> {
        try {
            unlinkFilesInDir(this.tempDir)
            return Promise.resolve({ok: true})
        }
        catch (e) {
            return Promise.resolve({ok: false, reason: 'failed to clear file.'})
        }
    }

    private generateFilename() {
        return path.resolve(this.tempDir, `${this.key}-${Date.now()}.json`)
    }

}

function unlinkFilesInDir(dir: string) {
    for (const file of fs.readdirSync(dir)) {
        fs.unlinkSync(path.resolve(dir, file));
    }
}
