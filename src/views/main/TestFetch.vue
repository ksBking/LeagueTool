<template>
  <div>
    Test
    <button>test</button>
    <div>
      <p>程序流程：</p>
      <ol>
        <li>检查更新</li>
        <ul>
          <li>如果 失败 => 退出</li>
          <li>如果 有新版本 => 下载安装并重启</li>
          <li>如果 无新版本 => 第二步</li>
        </ul>
        <li>监听客户端</li>
        <ul>
          <li>如果 客户端未启动 => 继续等待</li>
          <li>如果 客户端退出 => 继续等待</li>
          <li>如果 客户端存在 => 第三步</li>
        </ul>
        <li>监听客户端事件</li>
        <ol>
          <li>事件：无（主页页面）</li>
          <li>事件：房间内</li>
          <li>事件：队列中</li>
          <li>事件：找到对局 - 可以自动接受对局</li>
          <li>事件：英雄选择 - 可以查看队友战绩</li>
          <li>事件：游戏开始 - 关闭窗口，等待加载完成</li>
          <li>事件：游戏加载完成 - 可以查看敌方战绩</li>
          <li>事件：游戏结束 - 显示窗口</li>
        </ol>
      </ol>
    </div>
    {{ sleep }}
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  async setup() {
    const sleep = await new Promise<string>(resolve => setTimeout(() => resolve('123'), 5000));
    return {
      sleep,
    };
  },
});
</script>
