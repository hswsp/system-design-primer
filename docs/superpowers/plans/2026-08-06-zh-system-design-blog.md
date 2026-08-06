# 中文版系统设计入门 GitHub Pages 博客 — 实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将 `README-zh-Hans.md` 的中文系统设计内容整理成基于 jekyll-gitbook remote theme 的 Jekyll + GitHub Pages 书站，部署到 `hswsp.github.io/system-design-primer/`。

**Architecture:** 在 `blog` 分支创建最小 Jekyll 站点：`_config.yml` 用 `remote_theme: sighingnow/jekyll-gitbook`（布局/样式自动拉取），`Gemfile` 供本地构建。将 `images/` 移动到 `assets/img/`，把 README 内容拆分为 `_pages/*.md` 章节文件，用 `collections.pages.sort_by: date` 控制阅读顺序。GitHub Pages 原生支持 remote theme，从 `blog` 分支直接构建，无需自定义 Actions。

**Tech Stack:** Jekyll, jekyll-gitbook (remote theme), GitHub Pages, Ruby + Bundler (本地构建)。

## Global Constraints

- 站点最终地址：`https://hswsp.github.io/system-design-primer/`（项目页，baseurl=`/system-design-primer`）。
- 部署源分支：`blog`（GitHub Pages 对该分支直接构建）。
- 语言：`lang` 相关配置按主题支持设置；文档正文为简体中文。
- 章节顺序：学习指引 → 如何处理 → 系统设计主题（17 篇）→ 系统设计面试题（8 篇）→ 面向对象设计（6 篇）。
- 解答内容：`solutions/` 下**有中文用中文，没中文用英文原文**，嵌入章节不跳走。
- 图片来源：从 `images/` 直接移动到 `assets/img/`，章节内路径同步更新。
- 每个章节文件在 `_pages/` 下，front matter 含 `title` 与递增 `date`（用于排序）。
- 不修改 `docs/superpowers/`（spec 与 plan 保留）。

---
### Task 1: 创建 `_config.yml` 与 `Gemfile`

**Files:**
- Create: `_config.yml`
- Create: `Gemfile`

**Interfaces:**
- Produces: `_config.yml`（`remote_theme`, title, baseurl, `_pages` collection, plugins）
- Produces: `Gemfile`（jekyll + 构建依赖）

- [ ] **Step 1: 创建 `_config.yml`**

```yaml
# Site settings
title: 系统设计入门
longtitle: 系统设计入门 - 中文版
author: hswsp
email:
description: >
  基于 system-design-primer 的系统设计入门中文书站。

version: 1.0
gitbook_version: 3.2.3

url: 'https://hswsp.github.io'
baseurl: '/system-design-primer'
rss: RSS

# Use jekyll-gitbook as remote theme
remote_theme: sighingnow/jekyll-gitbook

toc:
  enabled: true
  h_min: 1
  h_max: 3

favicon_path: /assets/gitbook/images/favicon.ico

# Markdown
markdown: kramdown
kramdown:
  auto_ids: true
  input: GFM
  math_engine: mathjax
  syntax_highlighter: rouge

syntax_highlighter_style: colorful
markdown_ext: markdown,mkdown,mkdn,mkd,md

# Permalinks
permalink: /:categories/:year-:month-:day-:title:output_ext

exclude:
  - _drafts
  - docs
  - README.md
  - README-zh-Hans.md
  - README-zh-TW.md
  - README-ja.md
  - TRANSLATIONS.md
  - CONTRIBUTING.md
  - LICENSE.txt
  - .gitattributes
  - generate-epub.sh
  - epub-metadata.yaml
  - .superpowers

collections:
  pages:
    output: true
    sort_by: date
    permalink: /:path/

ordered_collections:
  - pages

page_width: 800px

destination: ./_site
incremental: false
regenerate: true

plugins:
  - jekyll-feed
  - jekyll-readme-index
  - jemoji
```

- [ ] **Step 2: 创建 `Gemfile`**

```ruby
source "https://rubygems.org"
gem "jekyll"
gem 'jekyll-feed'
gem 'jekyll-readme-index'
gem 'jemoji'
gem 'webrick'
```

- [ ] **Step 3: 校验**

Run: `grep -nE "remote_theme|baseurl|sort_by" _config.yml`
Expected: `remote_theme: sighingnow/jekyll-gitbook`、`baseurl: /system-design-primer`、`sort_by: date`。

- [ ] **Step 4: 提交**

```bash
git add _config.yml Gemfile
git commit -m "feat: add jekyll-gitbook config and Gemfile"
```

---

### Task 2: 移动图片到 `assets/img/`

**Files:**
- Move: `images/` → `assets/img/`

**Interfaces:**
- Produces: `assets/img/` 含全部图片；旧 `images/` 移除

- [ ] **Step 1: 移动图片目录**

```bash
mkdir -p assets/img
cp -R images/. assets/img/
rm -rf images
```

- [ ] **Step 2: 校验无残留 `images/` 引用**

Run: `grep -rn "images/" README-zh-Hans.md | grep -v "assets/img" | head`
Expected: 无输出（章节生成时统一替换路径）。

- [ ] **Step 3: 提交**

```bash
git add -A
git commit -m "feat: move images to assets/img"
```

---

### Task 3: 第一章 + 第二章 章节

**Files:**
- Create: `_pages/01-xue-xi-zhi-yin.md`（第一章 学习指引）
- Create: `_pages/02-ru-he-chu-li-mian-shi-ti.md`（第二章 如何处理一个系统设计的面试题）

**Interfaces:**
- Consumes: `README-zh-Hans.md` 的 `## 学习指引`、`## 如何处理一个系统设计的面试题` 章节
- Consumes: Task 2 移动后的图片路径

- [ ] **Step 1: 创建第一章章节文件**

创建 `_pages/01-xue-xi-zhi-yin.md`：

```
---
title: 学习指引
author: hswsp
date: 2026-08-06 00:01:00
category: 学习指引
layout: post
---

<将 README-zh-Hans.md 中「## 学习指引」章节全部正文复制到此，保留 markdown 格式>
```

正文取自 `README-zh-Hans.md` 第 185 行「## 学习指引」起，至「## 如何处理一个系统设计的面试题」之前。注意：
- 图 `images/OfVllex.png` → `assets/img/OfVllex.png`。
- 移除指向 README 内部锚点的链接（如 `[系统设计主题](#系统设计主题的索引)`），改为纯文本。

- [ ] **Step 2: 创建第二章章节文件**

创建 `_pages/02-ru-he-chu-li-mian-shi-ti.md`：

```
---
title: 如何处理一个系统设计的面试题
author: hswsp
date: 2026-08-06 00:02:00
category: 学习指引
layout: post
---

<将「## 如何处理一个系统设计的面试题」章节全部正文复制到此>
```

正文含「第一步：描述使用场景」「第二步：创造一个高层级的设计」「第三步：设计核心组件」「第四步：扩展设计」「预估计算量」「相关资源和延伸阅读」。移除内部锚点链接，外部 URL 保留。

- [ ] **Step 3: 校验**

Run: `head -6 _pages/01-xue-xi-zhi-yin.md _pages/02-ru-he-chu-li-mian-shi-ti.md`
Expected: 每个文件前端有 `layout: post` 与 `title`。

- [ ] **Step 4: 提交**

```bash
git add _pages
git commit -m "feat: add chapters 1-2"
```

---

### Task 4: 系统设计主题章节（17 篇）

**Files:**
- Create: `_pages/03-*.md` 至 `_pages/19-*.md`（17 篇主题章节）

**Interfaces:**
- Consumes: `README-zh-Hans.md` 各 `##` 系统设计主题章节
- Consumes: Task 2 移动后的图片路径

- [ ] **Step 1: 生成 17 篇主题章节**

每一篇取自 `README-zh-Hans.md` 对应 `##` 章节，front matter 结构与 Task 3 一致，日期递增（`2026-08-06 00:03:00` 起）。章节与文件名映射：

| 序号 | README 标题 | 文件名 |
|------|-------------|--------|
| 3 | 系统设计主题：从这里开始 | `_pages/03-system-design-topics-intro.md` |
| 4 | 性能与可扩展性 | `_pages/04-performance-scalability.md` |
| 5 | 延迟与吞吐量 | `_pages/05-latency-throughput.md` |
| 6 | 可用性与一致性 | `_pages/06-availability-consistency.md` |
| 7 | 一致性模式 | `_pages/07-consistency-patterns.md` |
| 8 | 可用性模式 | `_pages/08-availability-patterns.md` |
| 9 | 域名系统 | `_pages/09-dns.md` |
| 10 | 内容分发网络（CDN） | `_pages/10-cdn.md` |
| 11 | 负载均衡器 | `_pages/11-load-balancer.md` |
| 12 | 反向代理（web 服务器） | `_pages/12-reverse-proxy.md` |
| 13 | 应用层 | `_pages/13-application-layer.md` |
| 14 | 数据库 | `_pages/14-database.md` |
| 15 | 缓存 | `_pages/15-cache.md` |
| 16 | 异步 | `_pages/16-asynchronism.md` |
| 17 | 通讯 | `_pages/17-communication.md` |
| 18 | 安全 | `_pages/18-security.md` |
| 19 | 附录 | `_pages/19-appendix.md` |

处理规则：
- 每篇 `title` 用 README 标题（如 `性能与可扩展性`），`category` 用 `系统设计主题`。
- 图片路径 `images/XXXX` → `assets/img/XXXX`。
- 移除指向 README 其他章节的内部锚点链接；外部 URL 与 `## 来源及延伸阅读` 保留。
- `附录` 章节包含「2 的次方表」「延迟数」「其它系统设计面试题」「真实架构」「公司工程博客」等子章节，全部收录。

- [ ] **Step 2: 校验章节数量**

Run: `ls _pages/0[3-9]-*.md _pages/1[0-9]-*.md | wc -l`
Expected: `17`。

- [ ] **Step 3: 提交**

```bash
git add _pages
git commit -m "feat: add 17 system design topic chapters"
```

---

### Task 5: 系统设计面试题章节（8 篇，嵌入 solution 内容）

**Files:**
- Create: `_pages/20-*.md` 至 `_pages/27-*.md`（8 篇）

**Interfaces:**
- Consumes: `README-zh-Hans.md` 的 `## 系统设计的面试题和解答` 下每道题对应的 `solutions/system_design/*/README*.md`
- Consumes: `solutions/` 目录；Task 2 移动后的图片路径

- [ ] **Step 1: 生成 8 篇面试题章节**

本题的解答内容**来自 `solutions/` 目录对应文件，嵌入章节**（不跳走）。语言规则：**有中文版用中文，无中文版用英文原文**。`category` 用 `系统设计面试题`。章节与文件映射：

| 序号 | 题目 | solution 文件 | 文件名 |
|------|------|---------------|--------|
| 20 | 设计 Pastebin.com (或 Bit.ly) | `solutions/system_design/pastebin/README-zh-Hans.md`（中文） | `_pages/20-pastebin.md` |
| 21 | 设计 Twitter 时间线和搜索 | `solutions/system_design/twitter/README.md` | `_pages/21-twitter.md` |
| 22 | 设计一个网页爬虫 | `solutions/system_design/web_crawler/README.md` | `_pages/22-web-crawler.md` |
| 23 | 设计 Mint.com | `solutions/system_design/mint/README.md` | `_pages/23-mint.md` |
| 24 | 为一个社交网络设计数据结构 | `solutions/system_design/social_graph/README.md` | `_pages/24-social-graph.md` |
| 25 | 为搜索引擎设计 key-value 储存 | `solutions/system_design/query_cache/README.md` | `_pages/25-query-cache.md` |
| 26 | 设计按类别分类的 Amazon 销售排名 | `solutions/system_design/sales_rank/README.md` | `_pages/26-sales-rank.md` |
| 27 | 在 AWS 上设计一个百万用户级别的系统 | `solutions/system_design/scaling_aws/README.md` | `_pages/27-scaling-aws.md` |

处理规则：
- `title` 用题目名（如 `设计 Pastebin.com (或 Bit.ly)`）。
- **正文 = 题目简介 + 对应 solution 文件全文**。solution 内图片 `images/XXXX` → `assets/img/XXXX`。
- 移除 solution 内指向其自身 README 的内部锚点链接；外部 URL 保留。

- [ ] **Step 2: 校验 8 篇文件存在**

Run: `ls _pages/2[0-7]-*.md | wc -l`
Expected: `8`。

- [ ] **Step 3: 提交**

```bash
git add _pages
git commit -m "feat: add 8 system design interview solution chapters"
```

---

### Task 6: 面向对象设计章节（6 篇，嵌入 solution 内容）

**Files:**
- Create: `_pages/28-*.md` 至 `_pages/33-*.md`（6 篇）

**Interfaces:**
- Consumes: `README-zh-Hans.md` 的 `## 面向对象设计的面试问题及解答` 下每道题对应的 `solutions/object_oriented_design/*/*.ipynb`
- Consumes: `solutions/object_oriented_design/` 目录

- [ ] **Step 1: 生成 6 篇面向对象设计章节**

解答为 `.ipynb`（Jupyter notebook）。提取其中**说明性 Markdown 单元格**为章节正文，**代码单元格保留为代码块**。`category` 用 `面向对象设计`。映射：

| 序号 | 题目 | solution 文件 | 文件名 |
|------|------|---------------|--------|
| 28 | 设计 hash map | `solutions/object_oriented_design/hash_table/hash_map.ipynb` | `_pages/28-hash-map.md` |
| 29 | 设计 LRU 缓存 | `solutions/object_oriented_design/lru_cache/lru_cache.ipynb` | `_pages/29-lru-cache.md` |
| 30 | 设计一个呼叫中心 | `solutions/object_oriented_design/call_center/call_center.ipynb` | `_pages/30-call-center.md` |
| 31 | 设计一副牌 | `solutions/object_oriented_design/deck_of_cards/deck_of_cards.ipynb` | `_pages/31-deck-of-cards.md` |
| 32 | 设计一个停车场 | `solutions/object_oriented_design/parking_lot/parking_lot.ipynb` | `_pages/32-parking-lot.md` |
| 33 | 设计一个聊天服务 | `solutions/object_oriented_design/online_chat/online_chat.ipynb` | `_pages/33-online-chat.md` |

- [ ] **Step 2: 校验 6 篇文件存在**

Run: `ls _pages/2[8-9]-*.md _pages/3[0-3]-*.md | wc -l`
Expected: `6`。

- [ ] **Step 3: 提交**

```bash
git add _pages
git commit -m "feat: add 6 object-oriented design solution chapters"
```

---

### Task 7: 创建首页与 404 页面

**Files:**
- Create: `index.md`（根首页，书首页）
- Create: `404.html`

**Interfaces:**
- Consumes: jekyll-gitbook 的 `_layouts/home.html`（由 remote theme 提供）
- Produces: 站点首页与 404 页

- [ ] **Step 1: 创建首页 `index.md`**

```markdown
---
layout: home
title: 系统设计入门
permalink: /
---

欢迎来到**系统设计入门**中文书站。本站在左侧目录中按章节呈现系统设计主题与面试题解答，点击任意章节开始阅读。
```

- [ ] **Step 2: 创建 `404.html`**

```html
---
layout: default
permalink: /404.html
---

<div class="book">
  <h1>404</h1>
  <p>页面不存在。<a href="{{ site.baseurl }}/">返回首页</a></p>
</div>
```

- [ ] **Step 3: 校验**

Run: `ls index.md 404.html`
Expected: 两个文件存在。

- [ ] **Step 4: 提交**

```bash
git add index.md 404.html
git commit -m "feat: add homepage and 404 page"
```

---

### Task 8: Docker/本地构建与预览验证

**Files:**
- None（验证任务）

**Interfaces:**
- Consumes: 全部已创建文件
- Produces: 构建成功的 `_site/`，可浏览器预览

- [ ] **Step 1: 本地构建**

在仓库根运行：

```bash
bundle install
bundle exec jekyll build
```

> 若系统 Ruby 版本过旧导致问题，改用 Docker：
> ```bash
> docker run --rm --volume="$PWD:/srv/jekyll:Z" -p 4000:4000 jekyll/jekyll:pages bundle exec jekyll serve
> ```

- [ ] **Step 2: 打开浏览器验证**

访问 `http://localhost:4000/system-design-primer/`。确认：
- 首页正常渲染，左侧目录显示全部 33 个章节。
- 章节按正确顺序排列，点击可打开，图片正常显示。
- 上一章/下一章导航正常。

- [ ] **Step 3: 修复构建错误（如有）**

若构建失败，根据报错修复（多为 front matter 或图片路径问题）。修复后回到 Step 1 重新构建。

- [ ] **Step 4: 提交修复**

```bash
git add -A
git commit -m "fix: resolve build issues found in local preview"
```

---

### Task 9: 推送 `blog` 分支并启用 GitHub Pages

**Files:**
- None（部署任务）

- [ ] **Step 1: 推送 `blog` 分支到 GitHub**

```bash
git push -u origin blog
```

- [ ] **Step 2: 在仓库 Settings 配置 Pages**

在 `https://github.com/hswsp/system-design-primer/settings/pages` 设置 Build and deployment 源为 `blog` 分支（`/` root）。

- [ ] **Step 3: 验证线上站点**

访问 `https://hswsp.github.io/system-design-primer/`，确认书站上线且内容完整。

---
