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

blogsRouter.delete("/:id", async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put("/:id", async (request, response) => {
  const body = request.body
  if ("title" in body && "author" in body && "url" in body && "likes" in body) {
    const updatedBlog = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes,
    }

    const result = await Blog.findByIdAndUpdate(request.params.id, updatedBlog, {new: true})
    response.json(result)
  } else {
    response.status(400).end()
  }

})

module.exports = blogsRouter;
