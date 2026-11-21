# cozyxss.com

```
> your friendly neighbourhood bug bounty hunter
```

Source of my blog at **[cozyxss.com](https://cozyxss.com)**: PortSwigger lab walkthroughs, CTF writeups, bug bounty notes and the lessons that came with them.

## Stack

- [Eleventy](https://www.11ty.dev/) static site, deployed to GitHub Pages with GitHub Actions
- Phosphor terminal theme with a light "paper" mode, built from scratch
- Self-hosted fonts (IBM Plex Mono, Space Mono, VT323), no trackers
- Comments via [giscus](https://giscus.app) (GitHub Discussions), claps via [applause-button](https://applause-button.com)

## Writing a post

Add a Markdown file to `src/posts/`, named with the date:

```
src/posts/2026-12-01-lab-name.md
```

Front matter (see `post-template.md`):

```yaml
---
no: 1                          # shown as 001
title: "PortSwigger Lab: ..."
summary: "One or two sentences for the home page."
category: LessonLearned        # new categories appear in the menu automatically
tags: [authentication, portswigger]
cover: /images/001/cover.png   # optional
---
```

Images go in `src/images/<post-no>/`. Push to `main` and the site rebuilds in under a minute.

## Run locally

```bash
npm install
npm start   # http://localhost:8080
```

## Disclosure

Bug bounty findings are published only after they are fixed and the program allows disclosure.

## Contact

Comments on any post, or find me on [X](https://x.com/cozyxss) · [Medium](https://medium.com/@cozyxss) · [LinkedIn](https://linkedin.com/in/bbetulkaya)
