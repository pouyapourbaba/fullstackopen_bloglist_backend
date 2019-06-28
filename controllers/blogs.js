const blogsRouter = require("express").Router();
const Blog = require("../models/blog");
const logger = require("../utils/logger");

blogsRouter.get("/", async (req, res) => {
  const blogs = await Blog.find({});
  res.json(blogs);
});

blogsRouter.post("/", async (req, res) => {
  let blog = req.body;
  if (!blog.likes) blog.likes = 0;

  if (!blog.title && !blog.url) return res.status(400).end();

  blog = new Blog(req.body);

  const result = await blog.save();
  res.status(201).json(result);
});

blogsRouter.delete("/:id", async (req, res, next) => {
  try {
    const blog = await Blog.findByIdAndRemove(req.params.id);
    if (blog) res.status(204).end();
    else res.status(404).end();
  } catch (error) {
    next(error);
  }
});

module.exports = blogsRouter;
