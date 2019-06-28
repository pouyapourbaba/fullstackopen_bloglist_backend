const _ = require("lodash");

const dummy = blogs => {
  return 1;
};

const totalLikes = blogs => {
  return blogs.map(blog => blog.likes).reduce((a, b) => a + b);
};

const favoriteBlog = blogs => {
  const sortedByLikes = blogs.sort((a, b) => a.likes < b.likes);
  const favorite = {
    title: sortedByLikes[0].title,
    author: sortedByLikes[0].author,
    likes: sortedByLikes[0].likes
  };
  return favorite;
};

const mostOfPropertyInBlogs = (blogs, property) => {
  
};

const mostBlogs = blogs => {
  const authors = {};
  blogs.forEach(blog => {
    _.has(authors, blog.author)
      ? (authors[blog.author] += 1)
      : (authors[blog.author] = 1);
  });

  const result = _.keys(authors).map(author => ({
    author: author,
    blogs: authors[author]
  }));
  return result.sort((a, b) => a.blogs < b.blogs)[0];
};

const mostLikes = blogs => {
    const authors = {};
    blogs.forEach(blog => {
      _.has(authors, blog.author)
        ? (authors[blog.author] += blog.likes)
        : (authors[blog.author] = blog.likes);
    });
  
    const result = _.keys(authors).map(author => ({
      author: author,
      likes: authors[author]
    }));
    return result.sort((a, b) => a.likes < b.likes)[0];
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
};
