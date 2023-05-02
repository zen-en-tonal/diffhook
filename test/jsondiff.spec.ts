import { JsonDiff } from '../src/generics/jsondiff';

test('inserted', () => {
    const left = {
        'a': 'hoge'
    }
    const right = {
        'a': 'hoge',
        'b': 'hoge'
    }

    const diff = new JsonDiff()
    const res = diff.diff(left, right)

    expect(res.inserted).toStrictEqual({ 'b': 'hoge' })
})

test('modified', () => {
    const left = {
        'a': 'hoge'
    }
    const right = {
        'a': 'fuga',
    }

    const diff = new JsonDiff()
    const res = diff.diff(left, right)

    expect(res.modified).toStrictEqual({ 'a': 'fuga' })
})

test('removed', () => {
    const left = {
        'a': 'hoge',
        'b': 'fuga'
    }
    const right = {
        'a': 'hoge',
    }

    const diff = new JsonDiff()
    const res = diff.diff(left, right)

    expect(res.removed).toStrictEqual({ 'b': 'fuga' })
})

test('isDiff falsy with random order', () => {
    const left = {
        'a': 'hoge',
        'b': {
            'c': 'fuga',
            'd': 'piyo'
        }
    }
    const right = {
        'b': {
            'd': 'piyo',
            'c': 'fuga'
        },
        'a': 'hoge',
    }

    const diff = new JsonDiff()

    expect(diff.isDiff(left, right)).toBeFalsy()
})

test('isDiff falsy', () => {
    const left = {
        'a': 'hoge',
        'b': {
            'c': 'fuga',
            'd': 'piyo'
        }
    }
    const right = {
        'a': 'hoge',
        'b': {
            'c': 'fuga',
            'd': 'piyo',
        },
    }

    const diff = new JsonDiff()

    expect(diff.isDiff(left, right)).toBeFalsy()
})
