export interface Content {
    [key: string]: any
    [key: number]: any
}

export type ContentDelta<T extends Content> = {
    inserted?: T,
    modified?: T,
    removed?: T
}
