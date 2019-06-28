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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
};
