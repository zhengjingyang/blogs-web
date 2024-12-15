// src/store/index.ts

import { defineStore } from 'pinia'

// 定义store, myFirstStore是store的名称，该名称必须唯一，不可重复
export const useUserStore = defineStore('userStore', {
  state: () => {
    return {
      userInfo: sessionStorage.getItem('userInfo') ? JSON.parse(sessionStorage.getItem('userInfo')) : {},
      token: sessionStorage.getItem('token')? sessionStorage.getItem('token') : '',
    }
  },
  actions: {
    setUserInfo(userInfo) {
      this.userInfo = userInfo
    },
    setToken(token) {
      this.token = token
    },
  },
})
