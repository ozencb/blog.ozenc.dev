---
slug: obsidian-sync-blog
title: How I publish on "blog.ozenc.dev" with Obsidian
pubDate: "2025-09-13"
draft: true
description: ... without Obsidian Blog or Obsidian Sync
---

I have set this blog up long time ago with the hope that it would push me to write more. It has not. But I kept coming up with "blog ideas" since I then, so I decided to revisit my blog project and improve things a bit for a smoother writing experience.

The backbone of this blog is an Astro project ([check the source code here](https://github.com/ozencb/blog.ozenc.dev)). Back then, I wanted to set up a statically built, JavaScript-free system without any backend dependencies. I achieved this by using Markdown files as the content source and Astro is perfect for this. All the content is co-located with the source code, making it easy to manage and deploy. Vercel watches the repo for changes and automatically deploys the updated site.
