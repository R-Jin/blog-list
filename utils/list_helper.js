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

const mostBlogs = (blogs) => {
  const authors = {};

  blogs.forEach((blog) => {
    if (blog.author in authors) {
      ++authors[blog.author];
    } else {
      authors[blog.author] = 1;
    }
  });

  let mostBlogs = null;

  for (let author in authors) {
    if (mostBlogs === null || mostBlogs.blogs < authors[author]) {
      mostBlogs = { author, blogs: authors[author] };
    }
  }

  return mostBlogs;
};

const mostLikes = (blogs) => {
  const authors = {};

  blogs.forEach((blog) => {
    if (blog.author in authors) {
      authors[blog.author] += blog.likes;
    } else {
      authors[blog.author] = blog.likes;
    }
  });
  let mostLikes = null;

  for (let author in authors) {
    if (mostLikes === null || mostLikes.likes < authors[author]) {
      mostLikes = { author, likes: authors[author] };
    }
  }

  return mostLikes;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
