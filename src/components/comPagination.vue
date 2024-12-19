<template>
  <el-pagination background v-model:page-size="pageOptions.pageSize" v-model:current-page="pageOptions.pageNum"
    @size-change="getData" @current-change="getData" :page-sizes="[10, 20, 30, 40]" :total="pageOptions.total"
    layout="total, sizes, prev, pager, next" />
</template>

<script setup>
import { defineEmits } from 'vue';
const emit = defineEmits(['getData']);
const props = defineProps({
  pageOptions: {
    type: Object,
    default: {
      pageSize: 10,
      pageNum: 1,
      total: 0
    }
  }
})

const getData = () => {
  emit('getData')
}
</script>

<style lang="less" scoped></style>