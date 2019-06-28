const dummy = blogs => {
  return 1;
};

const totalLikes = blogs => {
  return blogs.map(blog => blog.likes).reduce((a, b) => a + b);
};

module.exports = {
  dummy,
  totalLikes
};
