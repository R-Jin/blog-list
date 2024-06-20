const { test, describe } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utils/list_helper");
const { initialBlogs } = require("./testInput");

describe("favorite blog", () => {
  test("when list has multiple blogs, equal blog with most number of likes", () => {
    const result = listHelper.favoriteBlog(initialBlogs);
    assert.deepStrictEqual(result, {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12,
    });
  });
});
