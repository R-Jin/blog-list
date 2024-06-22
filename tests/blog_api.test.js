const { test, after, beforeEach } = require("node:test")
const assert = require("node:assert")
const Blog = require("../models/blog")
const { initialBlogs, listWithOneBlog, blogWithoutLikeProperty, blogWithoutTitle, blogWithoutUrl } = require("./testInput")
const mongoose = require("mongoose")
const supertest = require("supertest")
const config = require("../utils/config")
const app = require("../app")

const api = supertest(app)

test("Number of blogs returned are correct and in JSON format", async () => {
    const response = await api
        .get("/api/blogs")
        .expect(200)
        .expect("Content-Type", /application\/json/)
    
    assert.strictEqual(response.body.length, initialBlogs.length)
})

test("Unique identifier of blog posts is 'id'", async () => {
    const response = await api
        .get("/api/blogs")
        .expect(200)
        .expect("Content-Type", /application\/json/)

    
    const blogs = response.body
    assert(blogs.every(blog => "id" in blog))
})

test("Correctly creates new blog post on POST request", async () => {
    const blogToCreate = listWithOneBlog[0]
    await api
        .post("/api/blogs")
        .send(blogToCreate)
        .expect(201)
        .expect("Content-Type", /application\/json/)

    const response = await api
        .get("/api/blogs")
        .expect(200)
        .expect("Content-Type", /application\/json/)
    
    assert.strictEqual(response.body.length, initialBlogs.length + 1)

    const contents = response.body.map(blog => blog.url)
    assert(contents.includes(blogToCreate.url))
})

test("Blog posts created without the like property on POST requests defaults to 0", async () => {
    await api
        .post("/api/blogs")
        .send(blogWithoutLikeProperty)
        .expect(201)
        .expect("Content-Type", /application\/json/)

    const response = await api
        .get("/api/blogs")
        .expect(200)
        .expect("Content-Type", /application\/json/)

    const createdPost = response.body.find(post => post.title === blogWithoutLikeProperty.title)
    assert.strictEqual(createdPost.likes, 0)
})

test("Creating blogs without title results in 400 Bad Request", async () => {
    await api
        .post("/api/blogs")
        .send(blogWithoutTitle)
        .expect(400)
})

test("Creating blogs without url results in 400 Bad Request", async () => {
    await api
        .post("/api/blogs")
        .send(blogWithoutUrl)
        .expect(400)
})

test("Deleting a blog results in its removal from the database", async () => {
    const firstBlog = initialBlogs[0]

    await api
        .delete(`/api/blogs/${firstBlog._id}`)
        .expect(204)

    const response = await api
        .get("/api/blogs")
        .expect(200)
        .expect("Content-Type", /application\/json/)

    assert.strictEqual(response.body.length, initialBlogs.length - 1)
    assert(response.body.every(blog => blog.id !== firstBlog._id))
})

test("Updating likes of an existing blog", async () => {
    const firstBlog = initialBlogs[0]
    const updatedBlog =  {
        title: firstBlog.title,
        author: firstBlog.author,
        url: firstBlog.url,
        likes: 0,
    }

    // Check that the likes of the blog is correct
    let response = await api
        .get('/api/blogs')

    let blogs = response.body
    let modifiedBlog = blogs.find(blog => blog.id === firstBlog._id)
    assert.strictEqual(modifiedBlog.likes, 7)

    // Update this blog
    await api
        .put(`/api/blogs/${firstBlog._id}`)
        .send(updatedBlog)
        .expect(200)
        .expect("Content-Type", /application\/json/)


    // Check that the change was made correctly 
    response = await api
        .get('/api/blogs')

    assert.strictEqual(response.body.length, initialBlogs.length)
    blogs = response.body
    modifiedBlog = blogs.find(blog => blog.id === firstBlog._id)
    assert.strictEqual(modifiedBlog.likes, 0)
})

// Prepare the database with initial data
beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObjects = initialBlogs.map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blogObject => blogObject.save())
    await Promise.all(promiseArray)
})

// Close the database after test
after(async () => {
    await mongoose.connection.close()
})