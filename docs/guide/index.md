# 介绍

LeagueTool 中文名暂译为《联盟小助手》，一款 League of Legends（英雄联盟）绿色插件，支持与 WeGame 同时使用，支持国服与外服。

## 绿色助手

- LeagueTool 不修改游戏文件，不读写客户端内存数据；
- LeagueTool 完全遵守《英雄联盟用户使用协议》；
- LeagueTool 不存在封号现象。

#### 待定功能：

- 自动寻找对局
- 自动接受对局
- 自动秒选英雄
- 自动禁用英雄
- 自动配置符文
- 自动配置召唤师技能
- 自动获取队友战绩
- 游戏开始获取敌方战绩
- ……

> 如果您有新的想法可以向我们分享，我们会视情况而采取您的想法。

## 下载

[点击跳转到下载页面](download)

## 实现原理

LeagueTool 使用
[HTML](https://developer.mozilla.org/zh-CN/docs/Glossary/HTML/) +
[CSS](https://developer.mozilla.org/zh-CN/docs/Glossary/CSS/) +
[JavaScript](https://developer.mozilla.org/zh-CN/docs/Glossary/JavaScript/) +
[Vue 3](https://staging-cn.vuejs.org/) +
[ELECTRON](https://www.electronjs.org/languages/zh-CN)
等技术开发。

通过调用 [League Client APIs](#什么是-league-client-api) 实现与客户端交互。

## 什么是 League Client API

> Riot Games 技术 - [英雄联盟客户端架构更新](https://technology.riotgames.com/news/architecture-league-client-update)

![](https://technology.riotgames.com/sites/default/files/articles/40/lcuheader3.png)
在 2016 年英雄联盟客户端迎来了新的架构，称之为 League Client Update（简称 LCU）。
新版架构可以分为底层和上层。

- 上层（LeagueClientUx.exe，LeagueClientUxRender.exe）基于 Chromium Embedded Framework （简称 CEF）主要用于显示界面并通过 RTMP 协议与底层进行通信。

- 底层（LeagueClient.exe）是一个 Server 与上层和服务器进行通信，同时会启动一个 HTTPS 的 Web Server 以供第三方程序来与之通信，这也是很多第三方程序获取到当前召唤师信息的方法。

![](https://static.developer.riotgames.com/img/docs/lol/lcu_architecture.png)

## 设计思路

监听客户端消息，处理对应事件。

## 免责声明

:::danger 免责声明
凡本软件提供的所有资源的版权，均归其版权所有人所有。用户若因本软件导致的任何法律争议及后果，均由用户自己负责，本软件不负任何责任。使用此软件即代表用户已知晓以上内容。
:::
