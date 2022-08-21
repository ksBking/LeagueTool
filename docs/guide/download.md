# 下载

## 版本：v{{data['version']}}

<ul>
  <li v-for="(item, index) in data['download']" :key="index">
    <a :href="item['url']" target="_blank">{{ item['name'] }}</a>
  </li>
</ul>

<script setup>
import data from '../updates/latest.json';
</script>
