const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");
const testHelper = require("./test_helper");

const api = supertest(app);

describe("api", () => {
  beforeEach(async () => {
    await Blog.deleteMany({});

    const blogObj1 = new Blog(testHelper.initialBlogs[0]);
    await blogObj1.save();

    const blogObj2 = new Blog(testHelper.initialBlogs[1]);
    await blogObj2.save();
  });

  it("should be 200 OK with the right Content-Type", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  it("should return all the blog posts in the DB", async () => {
    const response = await api.get("/api/blogs");
    expect(response.body.length).toBe(testHelper.initialBlogs.length);
  });

  it("should return objects with a unique identifier created by the DB", async () => {
    const response = await api.get("/api/blogs");
    response.body.map(blog => expect(blog._id).toBeDefined());
    // expect(response.body[0]._id).toBeDefined();
  });

  it("should successfully add a valid blog", async () => {
    const newBlog = {
      title: "blog 3",
      author: "Samad",
      url: "URL",
      likes: 15
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await testHelper.blogsInDb();
    expect(blogsAtEnd.length).toBe(testHelper.initialBlogs.length + 1);

    const titles = blogsAtEnd.map(blog => blog.title);
    expect(titles).toContain("blog 3");
  });

  it("should default likes to 0, when this property does not exist", async () => {
    const newBlog = {
      title: "blog 3",
      author: "Samad",
      url: "URL"
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const blogsAtEnd = await testHelper.blogsInDb();
    expect(blogsAtEnd[blogsAtEnd.length - 1].likes).toBe(0);
  });

  afterAll(() => {
    mongoose.connection.close();
  });
});
