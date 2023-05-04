import { WebHook } from "../src/hooks/webhook";

test("if formatter returns undefined, should not to be fetch called.", async () => {
  global.fetch = jest.fn();
  const hook = new WebHook("", { formatter: (_) => undefined });
  await hook.emit({});
  expect(global.fetch).not.toBeCalled();
});
