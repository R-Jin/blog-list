const { test, describe } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utils/list_helper");
const { initialBlogs } = require("./testInput");

describe("most blogs", () => {
  test("when list has multiple blogs, equal object with author name and number of blogs", () => {
    const result = listHelper.mostBlogs(initialBlogs);
    assert.deepStrictEqual(result, {
      author: "Robert C. Martin",
      blogs: 3,
    });
  });
});
