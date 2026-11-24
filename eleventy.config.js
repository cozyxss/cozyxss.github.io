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

  // Posts per language: English in src/posts/, Turkish in src/tr/posts/ (same file names)
  const globs = { en: "src/posts/*.md", tr: "src/tr/posts/*.md" };
  const live = (api, lang) => api.getFilteredByGlob(globs[lang]).filter((p) => !p.data.draft);

  for (const lang of ["en", "tr"]) {
    const sfx = lang === "en" ? "" : "_tr";

    // All posts, newest first
    eleventyConfig.addCollection("posts" + sfx, (api) => live(api, lang).reverse());

    // Tags: [{ name, slug, posts }]
    eleventyConfig.addCollection("tagList" + sfx, (api) => {
      const map = new Map();
      for (const p of live(api, lang).reverse()) {
        for (const t of p.data.tags || []) {
          if (t === "posts") continue;
          if (!map.has(t)) map.set(t, { name: t, slug: slug(t), posts: [] });
          map.get(t).posts.push(p);
        }
      }
      return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
    });

    // Web vulnerability series: [{ name, slug, posts }], posts in part order (00, 01, ...)
    eleventyConfig.addCollection("seriesList" + sfx, (api) => {
      const map = new Map();
      for (const p of live(api, lang)) {
        const s = p.data.series;
        if (!s) continue;
        if (!map.has(s)) map.set(s, { name: s, slug: slug(s), posts: [] });
        map.get(s).posts.push(p);
      }
      for (const v of map.values()) v.posts.sort((a, b) => (a.data.part ?? 0) - (b.data.part ?? 0));
      return [...map.values()];
    });

    // Burp notes: posts tagged "burp", newest first
    eleventyConfig.addCollection("burp" + sfx, (api) =>
      live(api, lang).filter((p) => (p.data.tags || []).includes("burp")).reverse()
    );
  }

  eleventyConfig.addFilter("slug2", slug);
  eleventyConfig.addFilter("head", (arr, n) => (arr || []).slice(0, n));
  eleventyConfig.addFilter("reverse", (arr) => [...(arr || [])].reverse());
  eleventyConfig.addFilter("pad2", (n) => String(n ?? 0).padStart(2, "0"));
  eleventyConfig.addFilter("pad", (n) => String(n ?? "").padStart(3, "0"));
  eleventyConfig.addFilter("readTime", (html) => {
    const words = String(html).replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 200));
  });
  eleventyConfig.addFilter("date", (d, locale = "en-US") =>
    new Date(d).toLocaleDateString(locale, { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })
  );
  // Pick a collection for the current language: coll(collections, "posts", "tr") -> collections.posts_tr
  eleventyConfig.addFilter("coll", (all, name, lang) => all[lang === "tr" ? name + "_tr" : name] || []);
  // URL of the same page in the other language
  eleventyConfig.addFilter("altUrl", (url, lang) =>
    lang === "tr" ? (url.replace(/^\/tr(\/|$)/, "/") || "/") : "/tr" + url
  );
  eleventyConfig.addFilter("isoDate", (d) => new Date(d).toISOString().slice(0, 10));
  eleventyConfig.addFilter("realTags", (tags) => (tags || []).filter((t) => t !== "posts"));

  return {
    dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
