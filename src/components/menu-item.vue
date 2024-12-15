<template>
  <el-sub-menu v-if="item.children" :index="item.index">
    <template #title>
      <el-icon>
        <Menu />
      </el-icon>
      <span>{{ item.title }}</span>
    </template>
    <menu-item v-for="subItem in item.children" :key="subItem.index" :item="subItem" />
  </el-sub-menu>
  <el-menu-item v-else :index="item.index" @click="handleClick(item)">
    <el-icon>
      <Menu />
    </el-icon>
    <span>{{ item.title }}</span>
  </el-menu-item>
</template>

<script setup>
import { Menu } from '@element-plus/icons-vue';
import { defineProps } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
});

const handleClick = (item) => {
  // 点击菜单时，跳转到对应的路由
  router.push(item.path);
};
</script>
