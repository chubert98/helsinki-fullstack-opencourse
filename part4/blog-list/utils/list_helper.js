const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  let total = 0
  blogs.forEach(blog => {
    total += blog.likes
  });
  return blogs.length === 0 ? 0 : blogs.length === 1 ? blogs[0].likes : total
}

const favoriteBlog = (blogs) => {
  let favorite = blogs.reduce((max, blog) => max.likes > blog.likes ? max : blog)
  return favorite
}

const mostBlogs = (blogs) => {
  let authors = _.mapValues(_.groupBy(blogs,'author'), _.size)
  let mostauthor = _.maxBy(Object.keys(authors), key => authors[key])
  let most = { author: mostauthor, blogs: authors[mostauthor]}
  return most
}

const mostLikes = (blogs) => {
  let authors = _.mapValues(_.groupBy(blogs,'author'), (group) => _.reduce(group, (sum, item) => sum + item.likes, 0))
  let mostauthor = _.maxBy(Object.keys(authors), key => authors[key])
  let most = { author: mostauthor, blogs: authors[mostauthor]}
  return most
}

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes }
