const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((previous, current) => {
    return previous + current.likes;
  }, 0);
};

const favoriteBlog = (blogs) => {
  let result = blogs.reduce((previous, current) => {
    return previous.likes < current.likes ? current : previous;
  }, blogs[0]);

  return {
    title: result.title,
    author: result.author,
    likes: result.likes,
  };
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};
