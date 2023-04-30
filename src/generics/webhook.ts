import { Content, ContentDelta } from "../core/content"
import { Error } from "../core/error"
import { Hook } from "../core/hook"
import fetch, { Response } from "node-fetch"

type Options<T extends Content, Q> = {
    formatter: (doc: ContentDelta<T>) => Q
}

const errorMsg = async (resp: Response) => {
    return `${resp.status}: ${await resp.text()}`
}

export class WebHook<T extends Content, Q> implements Hook<T> {
    constructor(
        readonly endpoint: string,
        readonly options: Partial<Options<T, Q>> = {}
    ) { }

    async emit(delta: ContentDelta<T>): Promise<Error | { ok: true; }> {
        const payload = this.options.formatter?.(delta) || delta
        const resp = await fetch(this.endpoint, { 
            method: 'POST', 
            body: JSON.stringify(payload) 
        })
        if (!resp.ok) return { ok: false, reason: await errorMsg(resp) }
        return { ok: true }
    }
}
