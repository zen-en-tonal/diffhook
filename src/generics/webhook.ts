import { Error } from "../core/error"
import { Hook } from "../core/hook"
import fetch, { Response } from "node-fetch"

type Options<T, Q> = {
    formatter: (doc: T) => Q
}

const errorMsg = async (resp: Response) => {
    return `${resp.status}: ${await resp.text()}`
}

export class WebHook<T, Q> implements Hook<T> {
    constructor(
        readonly endpoint: string,
        readonly options: Partial<Options<T, Q>> = {}
    ) { }

    async emit(doc: T): Promise<Error | { ok: true; }> {
        const payload = this.options.formatter?.(doc) || doc
        const resp = await fetch(this.endpoint, { 
            method: 'POST', 
            body: JSON.stringify(payload) 
        })
        if (!resp.ok) return { ok: false, reason: await errorMsg(resp) }
        return { ok: true }
    }
}
