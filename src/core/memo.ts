import { Error } from "./error"

type GetResult<T> = 
    | Error
    | { ok: true, res: T }

type PushResult =
    | Error
    | { ok: true }

type ClearResult =
    | Error
    | { ok: true }

export interface Memo<T> {
    latest(): Promise<GetResult<T>>
    push(doc: T): Promise<PushResult>
    clear(): Promise<ClearResult>
}
