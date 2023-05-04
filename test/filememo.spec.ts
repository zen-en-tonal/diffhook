import { collectFilenames } from "../src/memos/file";

test("collectFilenames", () => {
  const filenames = ["test-123456.json", "test-22345.json", "hoge-123456.json"];
  const filtered = collectFilenames(filenames, "hoge");
  expect(filtered.length).toBe(1);
  expect(filtered[0]).toBe("hoge-123456.json");
});
