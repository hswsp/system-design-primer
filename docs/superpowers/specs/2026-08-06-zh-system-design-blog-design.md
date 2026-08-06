# 设计：将中文版 system-design-primer 做成 GitHub Pages 博客

## 目标

把 `README-zh-Hans.md`（简体中文版系统设计入门）的内容整理成一个 Jekyll + GitHub Pages 的中文博客，托管在用户的 `github.io` 上。博客内容以章节/文章形式组织，图片从仓库 `images/` 移动到站点的 `assets/img/`。

## 技术栈与托管

- **Jekyll + GitHub Pages**，GitHub 原生支持，零服务器。
- `blog` 分支为站点源码分支（已创建）。
- **主题：jekyll-gitbook**（[sighingnow/jekyll-gitbook](https://github.com/sighingnow/jekyll-gitbook)），适合书/文档站。作为 **remote theme** 使用：`_config.yml` 中写 `remote_theme: sighingnow/jekyll-gitbook`，布局/样式自动拉取，无需复制 `_layouts/`/`_includes/`/`assets/` 运行时文件。
- 章节用 `_pages` collection 组织（每章一个文件），`collections.pages.sort_by: date` 控制阅读顺序。
- 主题自带：左侧章节目录、上一章/下一章导航、全文搜索、TOC。

## 站点结构

```
_config.yml                 # remote_theme + 站点信息 + collections 配置（lang: zh-CN、baseurl）
Gemfile                     # 本地构建（jekyll + webrick）
_pages/*.md                 # 每章一个文件（书章节）
assets/img/                 # 从 images/ 移动过来的图片
404.html                    # 404 页面
docs/superpowers/specs/     # 本文档
```

## 部署

- GitHub Pages 原生支持 remote theme，从 `blog` 分支直接构建，无需自定义 Actions 工作流。
- 站点地址：`https://hswsp.github.io/system-design-primer/`（项目页，`baseurl: /system-design-primer`）。

## 章节划分（按原顺序，主题在前、例题在后）

来源：`README-zh-Hans.md`。**从「学习指引」开始**，「目的 / 抽认卡 / 贡献 / 索引」等前置内容不收录。

### 第一章 学习指引
- 来源：`## 学习指引`

### 第二章 如何处理一个系统设计的面试题
- 来源：`## 如何处理一个系统设计的面试题`

### 第三章 系统设计主题（每个主题一篇）
| 文章 | README 标题 |
|------|-------------|
| 从这里开始 | `## 系统设计主题：从这里开始` |
| 性能与可扩展性 | `## 性能与可扩展性` |
| 延迟与吞吐量 | `## 延迟与吞吐量` |
| 可用性与一致性 | `## 可用性与一致性` |
| 一致性模式 | `## 一致性模式` |
| 可用性模式 | `## 可用性模式` |
| 域名系统 | `## 域名系统` |
| 内容分发网络（CDN） | `## 内容分发网络（CDN）` |
| 负载均衡器 | `## 负载均衡器` |
| 反向代理（web 服务器） | `## 反向代理（web 服务器）` |
| 应用层 | `## 应用层` |
| 数据库 | `## 数据库` |
| 缓存 | `## 缓存` |
| 异步 | `## 异步` |
| 通讯 | `## 通讯` |
| 安全 | `## 安全` |
| 附录 | `## 附录` |

### 第四章 系统设计面试题（每道题一篇）
来源：`## 系统设计的面试题和解答`。每篇嵌入对应 `solutions/` 下的解答内容（**不跳走**）。
语言规则：**有中文用中文，没中文用英文原文**。

| 文章 | solution 文件 |
|------|---------------|
| 设计 Pastebin.com (或 Bit.ly) | `solutions/system_design/pastebin/README-zh-Hans.md`（中文） |
| 设计 Twitter 时间线和搜索 | `solutions/system_design/twitter/README.md` |
| 设计一个网页爬虫 | `solutions/system_design/web_crawler/README.md` |
| 设计 Mint.com | `solutions/system_design/mint/README.md` |
| 为一个社交网络设计数据结构 | `solutions/system_design/social_graph/README.md` |
| 为搜索引擎设计 key-value 储存 | `solutions/system_design/query_cache/README.md` |
| 设计按类别分类的 Amazon 销售排名 | `solutions/system_design/sales_rank/README.md` |
| 在 AWS 上设计一个百万用户级别的系统 | `solutions/system_design/scaling_aws/README.md` |

### 第五章 面向对象设计（每道题一篇）
来源：`## 面向对象设计的面试问题及解答`。每篇嵌入 `solutions/object_oriented_design/` 对应内容。

| 文章 | solution 文件 |
|------|---------------|
| 设计 hash map | `solutions/object_oriented_design/hash_table/hash_map.ipynb` |
| 设计 LRU 缓存 | `solutions/object_oriented_design/lru_cache/lru_cache.ipynb` |
| 设计一个呼叫中心 | `solutions/object_oriented_design/call_center/call_center.ipynb` |
| 设计一副牌 | `solutions/object_oriented_design/deck_of_cards/deck_of_cards.ipynb` |
| 设计一个停车场 | `solutions/object_oriented_design/parking_lot/parking_lot.ipynb` |
| 设计一个聊天服务 | `solutions/object_oriented_design/online_chat/online_chat.ipynb` |

> 注：面向对象设计的解答为 `.ipynb`（Jupyter notebook）格式。博客中需将其中的说明性 Markdown 内容提取为文章，代码块保留。

## 图片处理

- 将 `images/` 目录的所有图片**直接移动**到 `assets/img/`。
- 所有文章中的图片相对路径由 `images/XXXX.png` 更新为 `assets/img/XXXX.png`。

## 数据流 / 构建

1. 创建 `_config.yml`（remote_theme + 站点信息 + `_pages` collection 配置）与 `Gemfile`。
2. 将 README 内容拆分为 `_pages/*.md` 章节文件。
3. `bundle install` 后 `bundle exec jekyll serve` 本地预览。
4. 推送到 `blog` 分支，GitHub Pages 通过 remote theme 自动构建。

## 错误处理 / 边界

- 若某 solution 文件缺失，则只保留题目章节框架并注明「解答待补充」。
- `.ipynb` 内容提取时若遇代码执行单元，保留为代码块。
- 图片移动后需全局校验无残留 `images/` 引用。

## 测试

- `bundle exec jekyll build` 成功，无 Markdown 链接报错。
- `grep -r "images/" _pages/` 无残留旧路径引用。
- 本地 `jekyll serve` 打开首页可正常浏览各章节。