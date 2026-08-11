---
title: 附录
author: hswsp
date: 2026-08-06 00:19:00
category: 系统设计主题
layout: home
---

一些时候你会被要求做出保守估计。比如，你可能需要估计从磁盘中生成 100 张图片的缩略图需要的时间或者一个数据结构需要多少的内存。**2 的次方表**和**每个开发者都需要知道的一些时间数据**（译注：OSChina 上有这篇文章的[译文](https://www.oschina.net/news/30009/every-programmer-should-know)）都是一些很方便的参考资料。

### 2 的次方表

```
Power           Exact Value         Approx Value        Bytes
---------------------------------------------------------------
7                             128
8                             256
10                           1024   1 thousand           1 KB
16                         65,536                       64 KB
20                      1,048,576   1 million            1 MB
30                  1,073,741,824   1 billion            1 GB
32                  4,294,967,296                        4 GB
40              1,099,511,627,776   1 trillion           1 TB
```

#### 来源及延伸阅读

* [2 的次方](https://en.wikipedia.org/wiki/Power_of_two)

### 每个程序员都应该知道的延迟数

```
Latency Comparison Numbers
--------------------------
L1 cache reference                           0.5 ns
Branch mispredict                            5   ns
L2 cache reference                           7   ns                      14x L1 cache
Mutex lock/unlock                           25   ns
Main memory reference                      100   ns                      20x L2 cache, 200x L1 cache
Compress 1K bytes with Zippy            10,000   ns       10 us
Send 1 KB bytes over 1 Gbps network     10,000   ns       10 us
Read 4 KB randomly from SSD*           150,000   ns      150 us          ~1GB/sec SSD
Read 1 MB sequentially from memory     250,000   ns      250 us
Round trip within same datacenter      500,000   ns      500 us
Read 1 MB sequentially from SSD*     1,000,000   ns    1,000 us    1 ms  ~1GB/sec SSD, 4X memory
Disk seek                           10,000,000   ns   10,000 us   10 ms  20x datacenter roundtrip
Read 1 MB sequentially from 1 Gbps  10,000,000   ns   10,000 us   10 ms  40x memory, 10X SSD
Read 1 MB sequentially from disk    30,000,000   ns   30,000 us   30 ms 120x memory, 30X SSD
Send packet CA->Netherlands->CA    150,000,000   ns  150,000 us  150 ms

Notes
-----
1 ns = 10^-9 seconds
1 us = 10^-6 seconds = 1,000 ns
1 ms = 10^-3 seconds = 1,000 us = 1,000,000 ns
```

基于上述数字的指标：
* 从磁盘以 30 MB/s 的速度顺序读取
* 以 100 MB/s 从 1 Gbps 的以太网顺序读取
* 从 SSD 以 1 GB/s 的速度读取
* 以 4 GB/s 的速度从主存读取
* 每秒能绕地球 6-7 圈
* 数据中心内每秒有 2,000 次往返

#### 延迟数可视化

![](https://camo.githubusercontent.com/77f72259e1eb58596b564d1ad823af1853bc60a3/687474703a2f2f692e696d6775722e636f6d2f6b307431652e706e67)

#### 来源及延伸阅读

* [每个程序员都应该知道的延迟数 — 1](https://gist.github.com/jboner/2841832)
* [每个程序员都应该知道的延迟数 — 2](https://gist.github.com/hellerbarde/2843375)
* [关于建设大型分布式系统的的设计方案、课程和建议](http://www.cs.cornell.edu/projects/ladis2009/talks/dean-keynote-ladis2009.pdf)
* [关于建设大型可拓展分布式系统的软件工程咨询](https://static.googleusercontent.com/media/research.google.com/en//people/jeff/stanford-295-talk.pdf)

#### 核心延迟数量级（2024 年前后典型硬件）

| 操作                        | 延迟量级           | 直观类比    |
| ----------------------------- | -------------------- | ------------- |
| L1 缓存访问                 |  **~1 ns**                   | 1 秒        |
| 分支预测失败                | \~3 ns          | 3 秒        |
| L2 缓存访问                 | \~4 ns          | 4 秒        |
| 互斥锁解锁                  | \~25 ns         | 25 秒       |
| L3 缓存访问                 | \~40 ns         | 40 秒       |
| 主存访问（DRAM）            |  **~100 ns**                   | 100 秒      |
| RDMA 跨机房读               | \~500 ns        | 8 分20秒    |
| NVMe SSD 随机读             |  **~10 μs**                   | 约 2.8 小时 |
| SATA SSD 随机读             | \~100 μs       | 约 1.2 天   |
| 同一 AZ 内网络往返（RTT）   |  **~500 μs**                   | 约 5.8 天   |
| 顺序读取 1 MB 内存          | \~1 ms          | 约 12 天    |
| 顺序读取 1 MB SSD           | \~2 ms          | 约 24 天    |
| 跨 AZ 网络 RTT（同 Region） |  **~1-2 ms**                   | 约 1 个月   |
| 跨 Region 网络 RTT（国内）  |  **~30-50 ms**                   | 约 1-2 年   |
| 跨大洲网络 RTT（中美）      |  **~150-200 ms**                   | 约 5-7 年   |
| 磁盘寻道（HDD）             | \~3-10 ms       | -           |
| 顺序读 1 MB HDD             | \~30 ms         | -           |
| 物理机冷启动（容器/VM）     | \~100 ms - 数秒 | -           |


> 💡 记忆口诀：**ns 级看缓存，μs 级看 SSD，ms 级看网络，百 ms 级看出去**（跨城/跨洲）。


##### 几个反直觉但极其重要的推论

**1. 一次跨 Region 的网络调用 ≈ 读 1 MB 内存的 200 倍**

这就是为什么"把数据放到离计算更近的地方"（缓存、CDN、本地副本）永远是性价比最高的优化。

**2. 缓存命中 vs 未命中差距悬殊**

* L1 命中 \~1 ns，主存访问 \~100 ns → **差 100 倍**
* 本地缓存命中 \~100 ns，跨 Region DB 查询 \~50 ms → **差 500,000 倍**

这就是缓存层（Redis/local cache/CDN）为什么能扛住高并发的根本原因。

**3. SSD 不是内存**

很多工程师以为"上了 SSD 就快了"，但 SSD 随机读（\~10 μs）比内存访问（\~100 ns）**慢 100 倍**。LSM-tree 类存储引擎（RocksDB/Cassandra）拼命做 compaction 和 cache，本质就是在和这个差距搏斗。

**4. 网络永远比你想的贵**

同 AZ 一次 RTT \~0.5 ms，看着不多，但在一次请求里串行调用 20 个下游服务，光网络等待就吃掉 10 ms——这在延迟敏感场景（如推荐系统、交易链路）就是 P99 劣化的元凶。**批量化、并行化、就近化**是三大解药。

##### 怎么用这张表做架构决策

* **P99 优化**：先问"这次请求走了几次跨 AZ / 跨 Region 调用？"——每多一跳就是 1-50 ms 的硬成本
* **缓存设计**：缓存命中率掉 1%，可能等价于后端 QPS 涨数倍（取决于回源链路的延迟倍数）
* **超时与重试**：下游超时阈值应参考其依赖链的总延迟上限，而不是拍脑袋设 3s/5s
* **容量规划**：用"QPS × 平均延迟"估算并发连接数和线程池大小

#### AI 时代每个工程师应该知道的数字

传统 Jeff Dean 表仍然有效（L1 \~0.5ns、主存 \~100ns、同 IDC 网络往返 \~0.5ms、跨洲 \~150ms），但**在 AI 系统里做心智估算，还需要下面这组**：

| 维度 | 数量级                                                               | 工程含义                                                |
| ------ | ---------------------------------------------------------------------- | --------------------------------------------------------- |
| **单条乘法能量**     | \~1 pJ                                                            | 计算本身几乎"免费"                                      |
| **HBM→计算单元 数据搬运能量**     | \~1000 pJ（计算的 1000 倍）                                       | 数据搬运才是真瓶颈                                      |
| **Batch size 对能耗的摊薄**     | 能耗 ≈ 1000 pJ / batch\_size                                     | batch\=1 时最坏，batch\=1000 时摊薄到接近计算成本 |
| **KV Cache 的本质**     | 避免重复搬运历史 token 的 HBM→计算 开销                             | 推理为什么要 KV Cache：不是算法巧思，是带宽经济         |
| **低精度量化的收益**     | FP16→INT8 数据搬运量减半                                            | 直接砍掉一半 HBM 带宽压力                               |
| **万卡训练的通信墙**     | 从 500 卡扩到 10000 卡，单卡有效带宽显著衰减                         | 规模扩展是非线性的，通信拓扑决定上限                    |
| **训练 vs 推理的延迟容忍度**     | 训练慢一点只是实验晚结束；推理多 100ms 直接影响用户体验和 Agent 效率 | 这就是为什么 Jeff 说"推理硬件是下一个关键战场"          |

##### 很多"模型问题"本质是"数据 I/O 问题"

Jeff 在访谈中点破：**训练时分批、用大 batch size，看似是模型训练策略，本质是系统层的 I/O 优化**。如果你遇到"模型收敛慢"或"GPU 利用率上不去"，第一反应应该是查数据管道和 HBM 带宽占用，而不是调模型结构。

##### Batching 与低延迟的根本矛盾

Batch 越大，单 token 的能耗成本越低——但**用户感知的延迟越高**。这就是大模型推理服务最核心的权衡：

* **离线批处理场景**（日志分析、夜间摘要）：尽可能加大 batch，摊薄能耗
* **在线交互 / Agent 场景**：batch 必须小，但为了不让数据搬运成本爆炸，就必须靠**专用推理硬件 + 低精度 + KV Cache + 量化**把这 1000 倍的差距硬压下去

> ⚠️ 这也是为什么 Jeff 判断"推理硬件是下一个关键战场"——训练可以忍受延迟，推理不能。

##### 为什么 AI 竞争正从"算力"转向"数据移动"

从 Google TPU 到 DeepSeek MLA，看似一个在芯片层一个在模型层，共同指向同一件事：**谁能减少数据搬运、让数据近搬/少搬/搬得更小，谁就能在推理成本和毛利上胜出**。

TPU 的第一性原理计算就是个经典例子：2013 年 Jeff 算出"如果大量用户每天用 3 分钟语音识别，服务器规模就要翻倍"，通用 CPU 堆不动，于是 TPU 砍掉所有非必要能力，专攻低精度稠密线性代数，拿到 **30-80 倍的能效优势**。

##### 长上下文的真正瓶颈

Jeff 在访谈里说，AI 系统的进步越来越依赖"模型之外的一切"——**检索、记忆、工具调用**，他称之为"上下文工程"。为什么？因为：

* 模型参数常住 HBM，搬一次贵 1000 倍
* 所以与其把整个世界塞进参数，不如**让模型在推理时按需从外部检索**——检索一次的成本，远低于把全部知识常驻 HBM 的成本
* 这就是 RAG、长上下文、Agent 记忆系统的物理经济基础
