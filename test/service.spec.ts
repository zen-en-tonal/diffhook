import { Diff } from "../src/core/diff";
import { Fetcher } from "../src/core/fetcher";
import { Hook } from "../src/core/hook";
import { Memo } from "../src/core/memo";
import { Service } from "../src/core/service";

const fetcherMock = jest.fn<Fetcher<any>, []>().mockImplementation(() => ({
  get: jest.fn().mockReturnValue(Promise.resolve({})),
}));
const memoMock = jest.fn<Memo<any>, []>().mockImplementation(() => ({
  latest: jest.fn().mockReturnValue(Promise.resolve({})),
  push: jest.fn().mockReturnValue(Promise.resolve()),
  clear: jest.fn().mockReturnValue(Promise.resolve()),
}));
const diffMock = jest.fn<Diff<any>, []>().mockImplementation(() => ({
  isDiff: jest.fn().mockReturnValue(true),
  diff: jest.fn().mockReturnValue({}),
}));
const hookMock = jest.fn<Hook<any>, []>().mockImplementation(() => ({
  emit: jest.fn().mockReturnValue(Promise.resolve()),
}));

it("if has no diff, should not to be diff() called.", () => {
  const diff = diffMock.mockImplementation(() => ({
    isDiff: jest.fn().mockReturnValue(false),
    diff: jest.fn().mockReturnValue({}),
  }))();
  const components = {
    fetcher: fetcherMock(),
    memo: memoMock(),
    diff,
    hook: hookMock(),
  };
  const service = new Service(components);
  service.run();
  expect(diff.diff).not.toBeCalled();
});

it("if diff returns empty, should not to be hook.emit called.", () => {
  const diff = diffMock.mockImplementation(() => ({
    isDiff: jest.fn().mockReturnValue(true),
    diff: jest.fn().mockReturnValue({}),
  }))();
  const hook = hookMock();
  const components = {
    fetcher: fetcherMock(),
    memo: memoMock(),
    diff,
    hook,
  };
  const service = new Service(components);
  service.run();
  expect(hook.emit).not.toBeCalled();
});
