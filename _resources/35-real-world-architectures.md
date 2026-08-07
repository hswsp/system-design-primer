---
title: 真实架构
author: hswsp
date: 2026-08-07 00:00:00
category: 更多资源
layout: post
---

## 真实架构

> 关于现实中真实的系统是怎么设计的文章。

<p align="center">
  <img src="{{ site.baseurl }}/assets/img/TcUo2fw.png">
  <br/>
  <strong><a href="https://www.infoq.com/presentations/Twitter-Timeline-Scalability">Source: Twitter timelines at scale</a></strong>
</p>

**不要专注于以下文章的细节，专注于以下方面：**

* 发现这些文章中的共同的原则、技术和模式。
* 学习每个组件解决哪些问题，什么情况下使用，什么情况下不适用
* 复习学过的文章

| 类型              | 系统                                       | 引用                                       |
| --------------- | ---------------------------------------- | ---------------------------------------- |
| Data processing | **MapReduce** - Google的分布式数据处理 | [research.google.com](http://static.googleusercontent.com/media/research.google.com/zh-CN/us/archive/mapreduce-osdi04.pdf) |
| Data processing | **Spark** - Databricks 的分布式数据处理 | [slideshare.net](http://www.slideshare.net/AGrishchenko/apache-spark-architecture) |
| Data processing | **Storm** - Twitter 的分布式数据处理 | [slideshare.net](http://www.slideshare.net/previa/storm-16094009) |
|                 |                                          |                                          |
| Data store      | **Bigtable** - Google 的列式数据库 | [harvard.edu](http://www.read.seas.harvard.edu/~kohler/class/cs239-w08/chang06bigtable.pdf) |
| Data store      | **HBase** - Bigtable 的开源实现 | [slideshare.net](http://www.slideshare.net/alexbaranau/intro-to-hbase) |
| Data store      | **Cassandra** - Facebook 的列式数据库 | [slideshare.net](http://www.slideshare.net/planetcassandra/cassandra-introduction-features-30103666) |
| Data store      | **DynamoDB** - Amazon 的文档数据库 | [harvard.edu](http://www.read.seas.harvard.edu/~kohler/class/cs239-w08/decandia07dynamo.pdf) |
| Data store      | **MongoDB** - 文档数据库 | [slideshare.net](http://www.slideshare.net/mdirolf/introduction-to-mongodb) |
| Data store      | **Spanner** - Google 的全球分布数据库 | [research.google.com](http://research.google.com/archive/spanner-osdi2012.pdf) |
| Data store      | **Memcached** - 分布式内存缓存系统 | [slideshare.net](http://www.slideshare.net/oemebamo/introduction-to-memcached) |
| Data store      | **Redis** - 能够持久化及具有值类型的分布式内存缓存系统 | [slideshare.net](http://www.slideshare.net/dvirsky/introduction-to-redis) |
|                 |                                          |                                          |
| File system     | **Google File System (GFS)** - 分布式文件系统 | [research.google.com](http://static.googleusercontent.com/media/research.google.com/zh-CN/us/archive/gfs-sosp2003.pdf) |
| File system     | **Hadoop File System (HDFS)** - GFS 的开源实现 | [apache.org](https://hadoop.apache.org/docs/r1.2.1/hdfs_design.html) |
|                 |                                          |                                          |
| Misc            | **Chubby** - Google 的分布式系统的低耦合锁服务 | [research.google.com](http://static.googleusercontent.com/external_content/untrusted_dlcp/research.google.com/en/us/archive/chubby-osdi06.pdf) |
| Misc            | **Dapper** - 分布式系统跟踪基础设施 | [research.google.com](http://static.googleusercontent.com/media/research.google.com/en//pubs/archive/36356.pdf) |
| Misc            | **Kafka** - LinkedIn 的发布订阅消息系统 | [slideshare.net](http://www.slideshare.net/mumrah/kafka-talk-tri-hug) |
| Misc            | **Zookeeper** - 集中的基础架构和协调服务 | [slideshare.net](http://www.slideshare.net/sauravhaloi/introduction-to-apache-zookeeper) |
|                 | 添加更多                      | 贡献              |