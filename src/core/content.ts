export interface Content {
  [key: string]: any;
  [key: number]: any;
}

export type ContentDelta<T extends Content> = {
  inserted?: T;
  modified?: T;
  removed?: T;
};

export const isContentDeltaEmpty = (delta: ContentDelta<any>) =>
  !delta.inserted && !delta.modified && !delta.removed;
