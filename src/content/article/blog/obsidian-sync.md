---
slug: obsidian-sync-blog
title: How I publish on my blog with Obsidian
pubDate: 2025-09-13
draft: false
description: ...without Obsidian Blog or Obsidian Sync
---

I set up this blog a long time ago, hoping it would push me to write more. It has not. But over time, I kept coming up with “blog ideas” and I remember writing being so much fun, so I decided to revisit the project and make publishing a little smoother.

When I first started with this blog, I wanted a statically built, JavaScript-free blog with no backend dependencies. I made that work using Markdown files as the content source and the Astro framework for static generation ([source code here](https://github.com/ozencb/blog.ozenc.dev)). All the content lives alongside the source code, which keeps things simple. Vercel watches the repo for changes and automatically deploys updates.

This setup works fine. I rarely go a day without access to my PC, and even if I do, writing or editing blog posts is never urgent. Still, I often find myself tinkering with new setups to solve problems that don’t really exist. So, here’s my “improved” version.

---

## Enter Obsidian

Since 2023, when I first set up my blog, Obsidian has become my only note-taking app. On my iOS devices and MacBook I pointed Obsidian to iCloud, so syncing between devices is seamless and free. I also set up a private GitHub repository for my vault with the [obsidian-git plugin](https://github.com/Vinzent03/obsidian-git) running on my PC for extra backup. Unfortunately, this plugin cannot be run on iOS devices since git cannot be easily installed on them. Solutions do exist, but they are finnicky.

Because Obsidian is always available on all my devices and works perfectly with Markdown, I thought I could use it for writing and publishing blog posts too? It could serve as the single source of truth for my writing, and then I’d just need a way to push posts into the blog repo. Obsidian has blogging and publishing features if you're willing to pay some money, but costs aside, using them would mean locking myself to a single platform.

---

## Automating the process

To make this work, I wrote a simple GitHub Action. It watches the `websites/blog.ozenc.dev` folder inside my Obsidian vault repo. When something changes, the workflow pushes updates into the blog repo, which then triggers the usual Astro build and deployment. If this whole thing works fine, I will probably use Obsidian as the primary source of data for my other statically built websites. At that point, I would just add a new folder within `websites` folder and add a new workflow for it to do its thing.

```
Obsidian --Sync--> Obsidian Vault Repo --Push--> Blog Repo --Deploy with Vercel--> blog.ozenc.dev
```

Here’s the workflow in full:

```yaml
# Pushes files from Obsidian vault to blog repo
name: Sync vault -> blog

on:
  push:
    # only run when blog notes change
    paths:
      - "websites/blog.ozenc.dev/**"

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout obsidian repo (source)
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Install rsync (for safe sync)
        run: sudo apt-get update && sudo apt-get install -y rsync

      - name: Clone target blog repo
        env:
          # create a fine grained PAT content write/read permissions, and set it as a secret on Obsidian vault repo
          TARGET_PAT: ${{ secrets.TARGET_REPO_PAT }}
        run: |
          # adjust target repo URL and branch
          git clone https://x-access-token:${TARGET_PAT}@github.com/ozencb/blog.ozenc.dev.git /tmp/astro
          cd /tmp/astro
          git checkout main

      - name: Sync vault to blog repo
        run: |
          # copy & delete to make destination mirror source subfolder
          rsync -av --delete --exclude=".git" ./websites/blog.ozenc.dev/ /tmp/astro/src/content/article/

      - name: Commit & push to blog repo
        run: |
          cd /tmp/astro
          git add src/content/article
          if git diff --staged --quiet; then
            echo "No content changes to push."
            exit 0
          fi
          git -c user.name="obsidian-sync-bot" -c user.email="obsidian-sync-bot@users.noreply.github.com" commit -m "Sync blog from obsidian: $GITHUB_SHA"
          git push origin main
```

And that is pretty much it. If anything under `websites/blog.ozenc.dev` changes, the workflow triggers automatically and pushes these changes to the blog repository, which also triggers its own workflow.

This works well, with some limitations:

- It still requires my PC to be on and Obsidian running so the obsidian-git plugin can commit changes.
- Some Obsidian specific markdown syntax (like backlinks, image references) is not compatible with Astro. I have to manually correct some of these.
- Everything is a bit asynchronous

another caveat that I won't likely face is:

- No one can contribute to articles through usual git processes, since my Vault is private and `articles` folder on `blog.ozenc.dev` repo gets replaced by the on in Obsidian vault every time.

---

## What’s next?

In the future, I want to remove my PC from the equation so updates can be pushed without Obsidian (and git plugin) running on it. A couple of ideas:

- **iCloud sync or Syncthing:** Use `rclone` on my home serer to pull vault files directly from iCloud to the server periodically OR use Syncthing to sync vault across devices (with [Synctrain](https://apps.apple.com/dk/app/synctrain/id6553985316) on iOS).
- **Push job:** Set up a file watcher or cron job to push updates to the vault repo.

I have access to the articles pretty much everywhere. Single app, no extra manual work, just writing (and waiting for the thing to trigger). Good enough
