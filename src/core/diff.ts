import { Content, ContentDelta } from "./content"

export interface Diff<T extends Content> {
    isDiff(a: T, b: T): boolean
    diff(a: T, b: T): ContentDelta<T>
}
