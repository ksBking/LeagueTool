import { defineConfig } from 'vitepress';

export default defineConfig({
  base: '/league-tool/',
  outDir: 'dist',
  lang: 'zh-CN',
  title: 'LeagueTool',
  titleTemplate: '英雄联盟小工具',
  description: '英雄联盟小工具',
  head: [['link', { rel: 'icon', href: '/favicon.ico', type: 'image/x-icon' }]],
  ignoreDeadLinks: false,

  themeConfig: {
    logo: '/img/logo.png',
    siteTitle: 'LeagueTool',
    outlineTitle: '当前页面',
    nav: [
      { text: '指南', link: '/guide/', activeMatch: '/guide/' },
      { text: '赞赏', link: '/sponsor/', activeMatch: '/sponsor/' },
      {
        text: '0.0.0',
        items: [
          { text: '更新日志', link: '/guide/' },
          { text: '下载地址', link: '/guide/download' },
        ],
      },
    ],
    socialLinks: [{ icon: 'github', link: 'https://github.com/ksBking/LeagueTool' }],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2022-present Bking',
    },
    sidebar: {
      '/guide/': [
        {
          text: '指南',
          collapsible: true,
          items: [
            { text: '首页', link: '/guide/' },
            { text: '下载', link: '/guide/download' },
          ],
        },
      ],
    },
    docFooter: {
      prev: '上一页',
      next: '下一页',
    },
  },
});
