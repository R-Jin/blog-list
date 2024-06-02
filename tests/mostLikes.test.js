const { test, describe } = require("node:test");
const assert = require("node:assert");
const listHelper = require("../utils/list_helper");
const { blogs } = require("./testInput");

describe("most likes", () => {
  test("when list has multiple blogs, equal object with author name and total number of likes", () => {
    const result = listHelper.mostLikes(blogs);
    assert.deepStrictEqual(result, {
      author: "Edsger W. Dijkstra",
      likes: 17,
    });
  });
});
