// Turkish posts. Same file name as the English post in src/posts/ so the TR/EN switch finds it.
export default {
  layout: "post.njk",
  eleventyComputed: {
    permalink: (data) => (data.draft ? false : `/tr/posts/${data.page.fileSlug}/`),
  },
};
