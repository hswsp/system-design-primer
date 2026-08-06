# 中文版系统设计入门 GitHub Pages 博客 — 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 `README-zh-Hans.md` 的中文系统设计内容整理成基于 al-folio v1 主题的 Jekyll + GitHub Pages 博客，部署到 `hswsp.github.io/system-design-primer/`。

**Architecture:** 在 `blog` 分支引入 al-folio v1 thin-starter 骨架（`_config.yml`、`Gemfile`、`_pages`、`assets`、`.github/workflows/deploy.yml`），删除学术向页面，将 `images/` 移动到 `assets/img/`，把 README 内容拆分为 `_posts/` 文章。运行时应答（布局/样式）由 `al_folio_core` 等插件宝石提供，不复制 starter 的 `_layouts/_includes` 运行时文件。GitHub Actions 从 `blog` 分支构建，部署到 `gh-pages` 分支。

**Tech Stack:** Jekyll, al-folio v1 (al_folio_core gem), GitHub Pages, GitHub Actions, Docker (本地预览), Ruby 3.3.5。

## Global Constraints

- 站点最终地址：`https://hswsp.github.io/system-design-primer/`（项目页，baseurl=`/system-design-primer`）。
- 部署源分支：`blog`（GitHub Actions 触发分支改为 `blog`）。
- 语言：`lang: zh-CN`。
- 章节顺序：学习指引 → 如何处理 → 系统设计主题（17 篇）→ 系统设计面试题（8 篇）→ 面向对象设计（6 篇）。
- 解答内容：`solutions/` 下**有中文用中文，没中文用英文原文**，嵌入文章不跳走。
- 主题精简：删除学术向页面（Publications/CV/Projects/People/News/Books/Teaching/Repositories/Profiles）。
- 图片来源：从 `images/` 直接移动到 `assets/img/`，文章内路径同步更新。
- 所有文章 front matter 使用 `layout: post`，日期为 `2026-08-06`。
- 不修改 `docs/superpowers/`（spec 与 plan 保留）。

---
### Task 1: 引入 al-folio v1 starter 骨架到 `blog` 分支

**Files:**
- Copy: `_config.yml`, `Gemfile`, `Gemfile.lock`, `.github/workflows/deploy.yml`, `_pages/blog.md`, `assets/tailwind/app.css`, `assets/css/main.scss`, `404.md`, `robots.txt`（来源：`/tmp/alfolio/al-folio-main/`）

**Interfaces:**
- Produces: 站点骨架文件；后续任务依赖 `_config.yml`、`Gemfile`、`_pages/blog.md`、`.github/workflows/deploy.yml`

- [ ] **Step 1: 从 starter 拷贝核心骨架文件**

```bash
SRC=/tmp/alfolio/al-folio-main
DST=$PWD
mkdir -p "$DST/_pages" "$DST/assets/tailwind" "$DST/assets/css" "$DST/.github/workflows"
cp "$SRC/_config.yml" "$DST/_config.yml"
cp "$SRC/Gemfile" "$DST/Gemfile"
cp "$SRC/Gemfile.lock" "$DST/Gemfile.lock"
cp "$SRC/.github/workflows/deploy.yml" "$DST/.github/workflows/deploy.yml"
cp "$SRC/_pages/blog.md" "$DST/_pages/blog.md"
cp "$SRC/assets/tailwind/app.css" "$DST/assets/tailwind/app.css"
cp "$SRC/assets/css/main.scss" "$DST/assets/css/main.scss"
cp "$SRC/404.md" "$DST/404.md"
cp "$SRC/robots.txt" "$DST/robots.txt"
rm -f "$DST/_pages/blog.md"  # blog.md 在 Task 9 用精简单独重写，先删除避免误用
```

- [ ] **Step 2: 校验拷贝文件存在**

Run: `ls _config.yml Gemfile _pages assets/tailwind/app.css .github/workflows/deploy.yml`
Expected: 全部列出无 "No such file"。

- [ ] **Step 3: 提交**

```bash
git add _config.yml Gemfile Gemfile.lock _pages assets .github/workflows/deploy.yml 404.md robots.txt
git commit -m "feat: scaffold al-folio v1 starter into blog branch"
```

---

### Task 2: 配置 `_config.yml`（站点信息 + 精简插件）

**Files:**
- Modify: `_config.yml`
- Modify: `Gemfile`

**Interfaces:**
- Consumes: Task 1 拷贝的 `_config.yml`、`Gemfile`
- Produces: 配置好的站点（title/url/baseurl/lang/blog；禁用学术功能与相关插件）

- [ ] **Step 1: 更新站点基本信息**

编辑 `_config.yml`，将：
```yaml
title: 系统设计入门
first_name: 系统设计
middle_name: ""
last_name: 入门
description: 系统设计入门中文版 - 基于 system-design-primer 的开源教程博客。
footer_text: >
  Powered by <a href="https://jekyllrb.com/" target="_blank">Jekyll</a> with <a href="https://github.com/alshedivat/al-folio">al-folio</a> theme.
  Content based on <a href="https://github.com/hswsp/system-design-primer">system-design-primer</a>.
keywords: system-design, 系统设计, 面试, 教程
lang: zh-CN
url: https://hswsp.github.io
baseurl: /system-design-primer
blog_name: 系统设计入门
blog_description: 从零学习系统设计，涵盖系统设计面试题与解答。
icon: 📚
```

- [ ] **Step 2: 禁用学术功能并精简插件**

在 `_config.yml` 中：
- 将 `al_folio.features.cv.enabled` 设为 `false`；`al_folio.features.distill.enabled` 设为 `false`。
- 将 `collections:` 中 `books/news/projects/teachings` 全部移除（不使用）。
- 从 `plugins:` 列表移除学术相关插件：`jekyll/scholar`、`al_folio_cv`、`al_folio_distill`、`al_citations`、`jekyll-twitter-plugin`、`al_ext_posts`、`al_newsletter`、`al_marimo`、`al_charts`、`al_math`、`al_comments`、`jekyll-archives-v2`。保留：`al_folio_core`、`al_icons`、`al_search`、`al_img_tools`、`al_folio_upgrade`、`al_folio_bootstrap_compat`、`jekyll-feed`、`jekyll-sitemap`、`jekyll-toc`、`jekyll-paginate-v2`、`jemoji`、`jekyll-minifier`、`jekyll-terser` 等构建必需项。
- 将 `scholar:` 配置块注释掉。
- 将 `display_tags` 与 `display_categories` 清空为 `[]`。

同时从 `Gemfile` 移除对应的学术插件 gem 声明（`al_folio_cv`、`al_folio_distill`、`al_citations`、`jekyll-scholar`、`jekyll-twitter-plugin`、`al_ext_posts`、`al_newsletter`、`al_marimo`、`al_charts`、`al_math`、`al_comments`、`al_cookie`），并删除 `Gemfile.lock` 中对应条目（或删除 `Gemfile.lock` 让 `bundle install` 重新生成）。

- [ ] **Step 3: 校验配置**

Run: `grep -nE "^(url|baseurl|lang|blog_name|theme):" _config.yml`
Expected: `url: https://hswsp.github.io`、`baseurl: /system-design-primer`、`lang: zh-CN`、`theme: al_folio_core`。

- [ ] **Step 4: 提交**

```bash
git add _config.yml Gemfile Gemfile.lock
git commit -m "feat: configure site info and trim academic plugins"
```

---

### Task 3: 删除学术向页面与示例内容

**Files:**
- Delete: `_pages/about.md`, `_pages/about_einstein.md`, `_pages/cv.md`, `_pages/projects.md`, `_pages/news.md`, `_pages/books.md`, `_pages/teaching.md`, `_pages/publications.md`, `_pages/repositories.md`, `_pages/profiles.md`, `_pages/plugins.md`, `_pages/dropdown.md`, `_data/cv.yml`, `_data/repositories.yml`, `_data/venues.yml`, `_data/coauthors.yml`, `_data/citations.yml`, `_bibliography/`, `_projects/`, `_news/`, `_books/`, `_teachings/`, 示例 `_posts/*.md`

**Interfaces:**
- Consumes: Task 1 引入的 `_pages` 等
- Produces: 干净站点（仅保留 `_pages/blog.md` 与 404）

- [ ] **Step 1: 删除学术页面与示例内容目录**

```bash
rm -f _pages/about.md _pages/about_einstein.md _pages/cv.md _pages/projects.md \
      _pages/news.md _pages/books.md _pages/teaching.md _pages/publications.md \
      _pages/repositories.md _pages/profiles.md _pages/plugins.md _pages/dropdown.md
rm -rf _data _bibliography _projects _news _books _teachings
rm -rf _posts
```

- [ ] **Step 2: 校验**

Run: `ls _pages/ 2>/dev/null; echo "---"; ls _posts 2>/dev/null || echo "no _posts dir"`
Expected: `blog.md`（若存在）或空；`_posts` 不存在或为空。

- [ ] **Step 3: 提交**

```bash
git add -A
git commit -m "chore: remove academic pages and sample content"
```

---

### Task 4: 修改 deploy 工作流触发分支为 `blog`

**Files:**
- Modify: `.github/workflows/deploy.yml`

**Interfaces:**
- Consumes: Task 1 拷贝的 deploy.yml

- [ ] **Step 1: 将触发分支改为 `blog`**

将 `on.push.branches` 与 `on.pull_request.branches` 中的 `- master` / `- main` 改为 `- blog`。

- [ ] **Step 2: 校验**

Run: `grep -n "blog" .github/workflows/deploy.yml`
Expected: push 与 pull_request 的 branches 下各有一行 `- blog`。

- [ ] **Step 3: 提交**

```bash
git add .github/workflows/deploy.yml
git commit -m "feat: deploy on blog branch push"
```

---

### Task 5: 移动图片到 `assets/img/` 并更新引用

**Files:**
- Move: `images/` → `assets/img/`
- Modify: `README-zh-Hans.md`（图片路径待文章生成时更新）

**Interfaces:**
- Produces: `assets/img/` 含全部图片；旧 `images/` 移除
- Consumes: 原 `images/` 目录

- [ ] **Step 1: 移动图片目录**

```bash
mkdir -p assets/img
cp -R images/. assets/img/
rm -rf images
```

- [ ] **Step 2: 校验无残留 `images/` 引用**

Run: `grep -rn "images/" README-zh-Hans.md | grep -v "assets/img" | head`
Expected: 无输出（README 中 `images/XXXX` 将在后续文章生成时替换为 `assets/img/XXXX`）。

- [ ] **Step 3: 提交**

```bash
git add -A
git commit -m "feat: move images to assets/img"
```

---

### Task 6: 第一章 + 第二章 文章

**Files:**
- Create: `_posts/2026-08-06-01-xue-xi-zhi-yin.md`（第一章 学习指引）
- Create: `_posts/2026-08-06-02-ru-he-chu-li-mian-shi-ti.md`（第二章 如何处理一个系统设计的面试题）

**Interfaces:**
- Consumes: `README-zh-Hans.md` 的 `## 学习指引`、`## 如何处理一个系统设计的面试题` 章节
- Consumes: Task 5 移动后的图片路径

- [ ] **Step 1: 创建第一章文章**

创建 `_posts/2026-08-06-01-xue-xi-zhi-yin.md`：

```
---
layout: post
title: 学习指引
date: 2026-08-06 00:01:00
description: 基于面试时间线（短、中、长）的复习指南
---

<将 README-zh-Hans.md 中「## 学习指引」章节全部正文复制到此，保留 markdown 格式>
```

正文取自 `README-zh-Hans.md` 第 185 行「## 学习指引」起，至「## 如何处理一个系统设计的面试题」之前。注意：
- 图 `images/OfVllex.png` → `assets/img/OfVllex.png`。
- 移除指向 README 内部锚点的链接（如 `[系统设计主题](#系统设计主题的索引)`），改为纯文本。

- [ ] **Step 2: 创建第二章文章**

创建 `_posts/2026-08-06-02-ru-he-chu-li-mian-shi-ti.md`：

```
---
layout: post
title: 如何处理一个系统设计的面试题
date: 2026-08-06 00:02:00
description: 系统设计面试的开放式对话方法与四步流程
---

<将「## 如何处理一个系统设计的面试题」章节全部正文复制到此>
```

正文含「第一步：描述使用场景」「第二步：创造一个高层级的设计」「第三步：设计核心组件」「第四步：扩展设计」「预估计算量」「相关资源和延伸阅读」。移除内部锚点链接，外部 URL 保留。

- [ ] **Step 3: 校验**

Run: `head -6 _posts/2026-08-06-01-xue-xi-zhi-yin.md _posts/2026-08-06-02-ru-he-chu-li-mian-shi-ti.md`
Expected: 每个文件前端有 `layout: post`。

- [ ] **Step 4: 提交**

```bash
git add _posts
git commit -m "feat: add posts for chapters 1-2"
```

---

### Task 7: 系统设计主题文章（17 篇）

**Files:**
- Create: `_posts/2026-08-06-03-*.md` 至 `_posts/2026-08-06-19-*.md`（17 篇主题文章）

**Interfaces:**
- Consumes: `README-zh-Hans.md` 各 `##` 系统设计主题章节
- Consumes: Task 5 移动后的图片路径

- [ ] **Step 1: 生成 17 篇主题文章**

每一篇取自 `README-zh-Hans.md` 对应 `##` 章节，front matter 结构与 Task 6 一致，日期递增（`2026-08-06 00:03:00` 起）。章节与文件名映射：

| 序号 | README 标题 | 文件名 |
|------|-------------|--------|
| 3 | 系统设计主题：从这里开始 | `2026-08-06-03-system-design-topics-intro.md` |
| 4 | 性能与可扩展性 | `2026-08-06-04-performance-scalability.md` |
| 5 | 延迟与吞吐量 | `2026-08-06-05-latency-throughput.md` |
| 6 | 可用性与一致性 | `2026-08-06-06-availability-consistency.md` |
| 7 | 一致性模式 | `2026-08-06-07-consistency-patterns.md` |
| 8 | 可用性模式 | `2026-08-06-08-availability-patterns.md` |
| 9 | 域名系统 | `2026-08-06-09-dns.md` |
| 10 | 内容分发网络（CDN） | `2026-08-06-10-cdn.md` |
| 11 | 负载均衡器 | `2026-08-06-11-load-balancer.md` |
| 12 | 反向代理（web 服务器） | `2026-08-06-12-reverse-proxy.md` |
| 13 | 应用层 | `2026-08-06-13-application-layer.md` |
| 14 | 数据库 | `2026-08-06-14-database.md` |
| 15 | 缓存 | `2026-08-06-15-cache.md` |
| 16 | 异步 | `2026-08-06-16-asynchronism.md` |
| 17 | 通讯 | `2026-08-06-17-communication.md` |
| 18 | 安全 | `2026-08-06-18-security.md` |
| 19 | 附录 | `2026-08-06-19-appendix.md` |

处理规则：
- 每篇 `title` 用 README 标题（如 `性能与可扩展性`），保留 `##` 下所有子标题正文。
- 图片路径 `images/XXXX` → `assets/img/XXXX`。
- 移除指向 README 其他章节的内部锚点链接；外部 URL 与 `## 来源及延伸阅读` 保留。
- `附录` 章节包含「2 的次方表」「延迟数」「其它系统设计面试题」「真实架构」「公司工程博客」等子章节，全部收录。

- [ ] **Step 2: 校验文章数量**

Run: `ls _posts/*-0[3-9]-*.md _posts/*-1[0-9]-*.md | wc -l`
Expected: `17`。

- [ ] **Step 3: 提交**

```bash
git add _posts
git commit -m "feat: add 17 system design topic posts"
```

---

### Task 8: 系统设计面试题文章（8 篇，嵌入 solution 内容）

**Files:**
- Create: `_posts/2026-08-06-20-*.md` 至 `_posts/2026-08-06-27-*.md`（8 篇）

**Interfaces:**
- Consumes: `README-zh-Hans.md` 的 `## 系统设计的面试题和解答` 下每道题对应的 `solutions/system_design/*/README*.md`
- Consumes: `solutions/` 目录；Task 5 移动后的图片路径

- [ ] **Step 1: 生成 8 篇面试题文章**

本题的解答内容**来自 `solutions/` 目录对应文件，嵌入文章**（不跳走）。语言规则：**有中文版用中文，无中文版用英文原文**。章节与文件映射：

| 序号 | 题目 | solution 文件 | 文件名 |
|------|------|---------------|--------|
| 20 | 设计 Pastebin.com (或 Bit.ly) | `solutions/system_design/pastebin/README-zh-Hans.md`（中文） | `2026-08-06-20-pastebin.md` |
| 21 | 设计 Twitter 时间线和搜索 | `solutions/system_design/twitter/README.md` | `2026-08-06-21-twitter.md` |
| 22 | 设计一个网页爬虫 | `solutions/system_design/web_crawler/README.md` | `2026-08-06-22-web-crawler.md` |
| 23 | 设计 Mint.com | `solutions/system_design/mint/README.md` | `2026-08-06-23-mint.md` |
| 24 | 为一个社交网络设计数据结构 | `solutions/system_design/social_graph/README.md` | `2026-08-06-24-social-graph.md` |
| 25 | 为搜索引擎设计 key-value 储存 | `solutions/system_design/query_cache/README.md` | `2026-08-06-25-query-cache.md` |
| 26 | 设计按类别分类的 Amazon 销售排名 | `solutions/system_design/sales_rank/README.md` | `2026-08-06-26-sales-rank.md` |
| 27 | 在 AWS 上设计一个百万用户级别的系统 | `solutions/system_design/scaling_aws/README.md` | `2026-08-06-27-scaling-aws.md` |

处理规则：
- `title` 用题目名（如 `设计 Pastebin.com (或 Bit.ly)`）。
- **正文 = 题目简介 + 对应 solution 文件全文**。solution 内图片 `images/XXXX` → `assets/img/XXXX`。
- 移除 solution 内指向其自身 README 的内部锚点链接；外部 URL 保留。

- [ ] **Step 2: 校验 8 篇文件存在**

Run: `ls _posts/2026-08-06-2*-*.md | wc -l`
Expected: `8`。

- [ ] **Step 3: 提交**

```bash
git add _posts
git commit -m "feat: add 8 system design interview solution posts"
```

---

### Task 9: 面向对象设计文章（6 篇，嵌入 solution 内容）

**Files:**
- Create: `_posts/2026-08-06-28-*.md` 至 `_posts/2026-08-06-33-*.md`（6 篇）

**Interfaces:**
- Consumes: `README-zh-Hans.md` 的 `## 面向对象设计的面试问题及解答` 下每道题对应的 `solutions/object_oriented_design/*/*.ipynb`
- Consumes: `solutions/object_oriented_design/` 目录

- [ ] **Step 1: 生成 6 篇面向对象设计文章**

解答为 `.ipynb`（Jupyter notebook）。提取其中**说明性 Markdown 单元格**为文章正文，**代码单元格保留为代码块**。`title` 用题目名。映射：

| 序号 | 题目 | solution 文件 | 文件名 |
|------|------|---------------|--------|
| 28 | 设计 hash map | `solutions/object_oriented_design/hash_table/hash_map.ipynb` | `2026-08-06-28-hash-map.md` |
| 29 | 设计 LRU 缓存 | `solutions/object_oriented_design/lru_cache/lru_cache.ipynb` | `2026-08-06-29-lru-cache.md` |
| 30 | 设计一个呼叫中心 | `solutions/object_oriented_design/call_center/call_center.ipynb` | `2026-08-06-30-call-center.md` |
| 31 | 设计一副牌 | `solutions/object_oriented_design/deck_of_cards/deck_of_cards.ipynb` | `2026-08-06-31-deck-of-cards.md` |
| 32 | 设计一个停车场 | `solutions/object_oriented_design/parking_lot/parking_lot.ipynb` | `2026-08-06-32-parking-lot.md` |
| 33 | 设计一个聊天服务 | `solutions/object_oriented_design/online_chat/online_chat.ipynb` | `2026-08-06-33-online-chat.md` |

- [ ] **Step 2: 校验 6 篇文件存在**

Run: `ls _posts/2026-08-06-3*-*.md | wc -l`
Expected: `6`。

- [ ] **Step 3: 提交**

```bash
git add _posts
git commit -m "feat: add 6 object-oriented design solution posts"
```

---

### Task 10: 创建博客首页 `_pages/blog.md` 与精简 `about` 首页

**Files:**
- Create: `_pages/blog.md`（博客列表页，复用 al-folio 原版）
- Create: `index.html`（根首页，重定向或展示博客列表）

**Interfaces:**
- Consumes: al-folio starter 的 `_pages/blog.md` 模板（Task 1 已删除，需重新从 `/tmp/alfolio/al-folio-main/_pages/blog.md` 拷贝）
- Produces: 站点首页 / 博客列表页

- [ ] **Step 1: 拷贝博客列表页模板**

```bash
cp /tmp/alfolio/al-folio-main/_pages/blog.md _pages/blog.md
```

该文件 `permalink: /blog/`，`layout: default`，`pagination.enabled: true`，自动列出 `_posts/` 下所有文章。

- [ ] **Step 2: 创建根首页**

创建 `index.html`（在 Jekyll 站点根目录，`layout: default`），内容为指向博客列表的入口，或直接重定向到 `/blog/`。最简单方案：`index.html` 用 `_pages/blog.md` 相同逻辑，或设置 `_config.yml` 的 `permalink: /blog/:year/:title/` 并把 blog 作为首页。推荐：`index.html` 拷贝 `blog.md` 的正文并设置 `permalink: /`。

- [ ] **Step 3: 校验**

Run: `ls _pages/blog.md index.html`
Expected: 两个文件存在。

- [ ] **Step 4: 提交**

```bash
git add _pages/blog.md index.html
git commit -m "feat: add blog listing and homepage"
```

---

### Task 11: Docker 本地构建与预览验证

**Files:**
- None（验证任务）

**Interfaces:**
- Consumes: 全部已创建文件
- Produces: 构建成功的 `_site/`，可浏览器预览

- [ ] **Step 1: 用 Docker 构建站点**

al-folio 官方提供 Docker 镜像。在仓库根运行：

```bash
docker compose up --build
```

或（若 compose 配置不适用）：

```bash
docker run --rm --volume="$PWD:/srv/jekyll:Z" \
  -p 4000:4000 \
  amirpourmand/al-folio \
  bundle exec jekyll serve --drafts
```

- [ ] **Step 2: 打开浏览器验证**

访问 `http://localhost:4000`（或 Docker 映射端口）。确认：
- 首页 / 博客列表正常渲染。
- 各章节文章可点击打开，图片正常显示。
- 明暗模式切换正常。

- [ ] **Step 3: 修复构建错误（如有）**

若构建失败，根据报错修复（多为插件缺失或 front matter 问题）。修复后回到 Step 1 重新构建。

- [ ] **Step 4: 提交修复**

```bash
git add -A
git commit -m "fix: resolve build issues found in local preview"
```

---

### Task 12: 推送并触发 GitHub Actions 部署

**Files:**
- None（部署任务）

- [ ] **Step 1: 推送 `blog` 分支到 GitHub**

```bash
git push -u origin blog
```

- [ ] **Step 2: 在 GitHub Actions 查看部署**

打开 `https://github.com/hswsp/system-design-primer/actions`，确认 "Deploy site" 工作流在 `blog` 分支成功后自动构建并部署到 `gh-pages` 分支。

- [ ] **Step 3: 在仓库 Settings 设置 Pages 发布源**

在 `Settings → Pages` 中确保 Build and deployment 源为 `gh-pages` 分支（deploy 工作流会自动建该分支，无需手动改；若已有配置则确认指向 `gh-pages`）。

- [ ] **Step 4: 验证线上站点**

访问 `https://hswsp.github.io/system-design-primer/`，确认博客上线且内容完整。

---
