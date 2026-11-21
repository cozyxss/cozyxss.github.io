import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";
import { feedPlugin } from "@11ty/eleventy-plugin-rss";

const slug = (s) =>
  String(s).toLowerCase()
    .replace(/ı/g, "i").replace(/ğ/g, "g").replace(/ü/g, "u")
    .replace(/ş/g, "s").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(feedPlugin, {
    type: "atom",
    outputPath: "/feed.xml",
    collection: { name: "posts", limit: 20 },
    metadata: {
      language: "en",
      title: "cozyxss",
      subtitle: "your friendly neighbourhood bug bounty hunter",
      base: "https://cozyxss.com/",
      author: { name: "cozyxss" },
    },
  });

  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/images": "images" });
  eleventyConfig.addPassthroughCopy({ "src/CNAME": "CNAME" });

  // All posts, newest first
  eleventyConfig.addCollection("posts", (api) =>
    api.getFilteredByGlob("src/posts/*.md").filter((p) => !p.data.draft).reverse()
  );

  // Categories: [{ name, slug, posts }]
  eleventyConfig.addCollection("categories", (api) => {
    const posts = api.getFilteredByGlob("src/posts/*.md").filter((p) => !p.data.draft).reverse();
    const map = new Map();
    for (const p of posts) {
      const c = p.data.category;
      if (!c) continue;
      if (!map.has(c)) map.set(c, { name: c, slug: slug(c), posts: [] });
      map.get(c).posts.push(p);
    }
    return [...map.values()];
  });

  // Tags: [{ name, slug, posts }]
  eleventyConfig.addCollection("tagList", (api) => {
    const posts = api.getFilteredByGlob("src/posts/*.md").filter((p) => !p.data.draft).reverse();
    const map = new Map();
    for (const p of posts) {
      for (const t of p.data.tags || []) {
        if (t === "posts") continue;
        if (!map.has(t)) map.set(t, { name: t, slug: slug(t), posts: [] });
        map.get(t).posts.push(p);
      }
    }
    return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
  });

  eleventyConfig.addFilter("slug2", slug);
  eleventyConfig.addFilter("pad", (n) => String(n ?? "").padStart(3, "0"));
  eleventyConfig.addFilter("readTime", (html) => {
    const words = String(html).replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 200));
  });
  eleventyConfig.addFilter("date", (d) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })
  );
  eleventyConfig.addFilter("isoDate", (d) => new Date(d).toISOString().slice(0, 10));
  eleventyConfig.addFilter("realTags", (tags) => (tags || []).filter((t) => t !== "posts"));

  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
