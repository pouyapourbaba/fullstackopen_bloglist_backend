const Blog = require("../models/blog");
const initialBlogs = [
  {
    title: "blog 1",
    author: "Pouya",
    url: "URL",
    likes: 10
  },
  {
    title: "blog 2",
    author: "Hamid",
    url: "URL",
    likes: 5
  }
];

const nonExistingId = async () => {
  const blog = new Blog({ content: "willremovethissoon" });
  await blog.save();
  await blog.remove();

  return blog._id.toString();
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map(blog => blog.toJSON());
};

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb
};
