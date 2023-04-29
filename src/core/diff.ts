export type DiffObject<T> = Partial<T>

export interface Diff<T> {
    isDiff(a: T, b: T): boolean
    diff(a: T, b: T): DiffObject<T>
}
