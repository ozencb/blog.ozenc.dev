---
slug: obsidian-sync-blog
title: How I publish on my blog with Obsidian
pubDate: 2025-09-13
draft: true
description: ... without Obsidian Blog or Obsidian Sync
---

I have set this blog up long time ago with the hope that it would push me to write more. It has not. But I kept coming up with "blog ideas" since I then, so I decided to revisit the project and improve things a bit for a smoother publishing experience.

Back then, I wanted to set up a statically built, JavaScript-free system without any backend dependencies. I achieved this by using Markdown files as the content source and Astro framework for static generation ([check the source code here](https://github.com/ozencb/blog.ozenc.dev)). All the content is co-located with the source code, making it easy to manage and deploy. Vercel watches the repo for changes and automatically deploys the updated site.

The main friction with this workflow is
