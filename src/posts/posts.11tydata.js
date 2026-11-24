// Posts marked `draft: true` are not published (no page, not listed).
export default {
  layout: "post.njk",
  eleventyComputed: {
    permalink: (data) => (data.draft ? false : `/posts/${data.page.fileSlug}/`),
  },
};
