const blogsRouter = require("express").Router();
const Blog = require("../models/blog");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
  const body = request.body
  if (body.title && body.url) {
    const blog = new Blog(request.body);
    const result = await blog.save()
    response.status(201).json(result);
  } else {
    response.status(400).end()
  }
});

module.exports = blogsRouter;
