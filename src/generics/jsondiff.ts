import * as jsondiffpatch from 'jsondiffpatch'
import { createHash } from 'crypto'
import { Diff } from '../core/diff'
import { Content, ContentDelta } from '../core/content'
import { Delta } from 'jsondiffpatch'

export class JsonDiff<T extends Content> implements Diff<T> {

    private readonly jsondiffpatch = jsondiffpatch.create()

    isDiff(left: T, right: T): boolean {
        return hash(left) !== hash(right)
    }

    diff(oldValue: T, newValue: T): ContentDelta<T> {
        const diff = this.jsondiffpatch.diff(oldValue, newValue)
        if (!diff) return {}
        return {
            inserted: inserted<T>(diff),
            modified: modified<T>(diff),
            removed: removed<T>(diff)
        }
    }
}

function hash(x: Content): string {
    const hashFunc = createHash('md5')
    const str = JSON.stringify(sortByKey(x))
    return hashFunc.update(str).digest('hex')
}

function sortByKey(x: object): object {
    const entries = Object.entries(x)
    return entries.sort(
        ([ka, _a], [kb, _b]) => ka.localeCompare(kb)
    ).map(([k, v]) => {
        if (typeof v === 'object') {
            return { [k]: sortByKey(v) }
        }
        else {
            return { [k]: v }
        }
    })
}

function inserted<T extends Content>(delta: Delta): T | undefined {
    // https://github.com/benjamine/jsondiffpatch/blob/master/docs/deltas.md#object-with-inner-changes
    const entries = Object.entries(delta)
    const inserted = entries
        .filter(e => e[1].length === 1)
        .map(([key, value]) => ({ [key]: value[0] }))
        .reduce((l, r) => Object.assign(l, r), {})
    return inserted as T
}

function modified<T extends Content>(delta: Delta): T | undefined {
    // https://github.com/benjamine/jsondiffpatch/blob/master/docs/deltas.md#object-with-inner-changes
    const entries = Object.entries(delta)
    const modified = entries
        .filter(e => e[1].length === 2)
        .map(([key, value]) => ({ [key]: value[1] }))
        .reduce((l, r) => Object.assign(l, r), {})
    return modified as T
}

function removed<T extends Content>(delta: Delta): T | undefined {
    // https://github.com/benjamine/jsondiffpatch/blob/master/docs/deltas.md#object-with-inner-changes
    const entries = Object.entries(delta)
    const modified = entries
        .filter(e => e[1].length === 3)
        .map(([key, value]) => ({ [key]: value[0] }))
        .reduce((l, r) => Object.assign(l, r), {})
    return modified as T
}
