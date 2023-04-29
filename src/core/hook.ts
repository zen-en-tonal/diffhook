import { Error } from "./error"

type EmitResult =
    | Error
    | { ok :true }

export interface Hook<T> {
    emit(doc: T): Promise<EmitResult>
}
