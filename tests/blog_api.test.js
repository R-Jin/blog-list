const { test, after, beforeEach } = require("node:test")
const assert = require("node:assert")
const Blog = require("../models/blog")
const { initialBlogs, listWithOneBlog } = require("./testInput")
const mongoose = require("mongoose")
const supertest = require("supertest")
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
        .post("/api/blogs", blogToCreate)
        .expect(201)
        .expect("Content-Type", /application\/json/)

    const response = await api
        .get("/api/blogs")
        .expect(200)
        .expect("Content-Type", /application\/json/)
    
    assert.strictEqual(response.body.length, initialBlogs.length + 1)

    const contents = response.body.map(blog => blog.url)
    assert(contents.includes(listWithOneBlog.url))
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