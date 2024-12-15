<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <div class="logo">
          <h1>zheng's Blogs</h1>
        </div>
        <div class="user">
          <!-- <div class="user-img">
            <img src="" alt="">
          </div> -->
          <div class="user-name">
            <span>admin</span>
          </div>
        </div>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu default-active="1">
            <menu-item v-for="item in menuData" :key="item.index" :item="item" />
          </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import MenuItem from './menu-item.vue'
import { reactive, toRefs } from 'vue';
const data = reactive({
  menuData: [
    {
      index: '1',
      icon: 'icon-menu',
      title: '首页',
      path: '/home',
    },
    {
      index: '2',
      icon: 'Setting',
      title: '分类管理',
      path: '/article-type'
    },
    {
      index: '3',
      icon: 'Setting',
      title: '系统管理',
      children: [
        {
          index: '3-1',
          title: 'item one',
        },
        {
          index: '3-2',
          title: 'item two',
        },
      ],
    }
  ]
})


const { menuData } = toRefs(data)
</script>

<style lang="less" scoped>
.el-header {
  display: flex;
  justify-content: space-between;
  background-color: #1f72dc;
  height: 50px;
  line-height: 50px;
  padding: 0 30px;
  color: #fff;
}

.el-menu {
  background-color: #191a23;
  height: calc(100vh - 50px);

  li {
    background-color: #191a23;
  }

  .el-menu-item {
    color: #fff;

    &:hover {
      background-color: #2d8cf0;
    }
  }

  .is-active {
    background-color: #2d8cf0;
  }

  /deep/.el-sub-menu__title {
    color: #fff;

    &:hover {
      background-color: #2d8cf0;
    }
  }
}

.el-main {
  padding: 8px 12px;
  // background: linear-gradient(180deg, #d8e9fb, #fff 20%);
  background-color: #f3f3f3;
}
</style>
