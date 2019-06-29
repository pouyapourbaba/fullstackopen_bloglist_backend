const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/blog");
const User = require("../models/user");
const testHelper = require("./test_helper");

const api = supertest(app);

describe("blog api", () => {
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
    response.body.map(blog => expect(blog.id).toBeDefined());
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

  it("it should return 400 bad request if the title and the url props are missing", async () => {
    const newBlog = {
      author: "Samad",
      likes: 15
    };

    await api
      .post("/api/blogs")
      .send(newBlog)
      .expect(400);
  });
});

describe("delete blogs", () => {
  it("should delete a blog with status code of 204", async () => {
    const blogsAtStart = await testHelper.blogsInDb();
    const blogToDelete = blogsAtStart[0];

    await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

    const blogsAtEnd = await testHelper.blogsInDb();
    expect(blogsAtEnd.length).toBe(blogsAtStart.length - 1);

    const titles = blogsAtEnd.map(blog => blog.title);
    expect(titles).not.toContain(blogToDelete.title);
  });
});

describe("update blogs", () => {
  it("should update a blog with status code of 200", async () => {
    const blogsAtStart = await testHelper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];
    blogToUpdate.title = "updated";

    await api
      .put(`/api/blogs/${blogToUpdate._id}`)
      .send()
      .expect(200);

    const blogsAtEnd = await testHelper.blogsInDb();
    expect(blogsAtEnd.length).toBe(blogsAtStart.length);

    const titles = blogsAtEnd.map(blog => blog.title);
    expect(titles).not.toContain(blogToUpdate.title);
  });
});

describe("User Registration", () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const userObj1 = new User(testHelper.initialUsers[0]);
    await userObj1.save();
  });

  // test the required fields
  it("the request must have username, and password. Return 400 if it does not", async () => {
    const user = {
      name: "pouya"
    };

    await api
      .post("/api/users")
      .send(user)
      .expect(400);
  });

  // test the unique username
  it("should return 400 if the username already exists in the DB", async () => {
    const newUser = {
      username: "pouya",
      name: "name",
      password: "secret"
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(400);
  });

  // test if the user is registered given the correct data
  it("should save the new user to the DB", async () => {
    const usersAtStart = await testHelper.usersInDb();
    const newUser = {
      username: "Hamid",
      name: "Hamid",
      password: "password"
    };

    await api
      .post("/api/users")
      .send(newUser)
      .expect(200);

    const usersAtEnd = await testHelper.usersInDb();
    expect(usersAtEnd.length).toBe(usersAtStart.length + 1);

    expect(usersAtEnd.map(user => user.username)).toContain(newUser.username);
  });

  // test the length of username and password
  it("should return 400 if username and password are less than 3 chars long", async () => {
    const newUser = {
      username: "uu",
      password: "pp"
    }

    await api.post("/api/users").send(newUser).expect(400)
  })
});

afterAll(() => {
  mongoose.connection.close();
});
