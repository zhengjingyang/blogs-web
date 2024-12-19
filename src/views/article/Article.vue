<template>
  <div class="container">
    <div class="query-container">
      <el-form :model="form" label-width="100px">
        <el-form-item label="文章名称">
          <el-input style="width: 200px;" v-model="form.title" placeholder="请输入文章名称" clearable />
        </el-form-item>
        <el-form-item label="分类名称">
          <el-input style="width: 200px;" v-model="form.type" placeholder="请输入分类名称" clearable />
        </el-form-item>
        <el-form-item label-width="30px">
          <el-button type="primary" @click="getData">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="operation-container">
      <el-button type="primary" @click="handleAdd">新增</el-button>
    </div>
    <div class="table-container">
      <el-table :data="tableData" stripe border max-height="630">
        <el-table-column prop="id" label="ID" width="130"></el-table-column>
        <el-table-column prop="title" label="文章名称"></el-table-column>
        <el-table-column prop="type_name" label="分类"></el-table-column>
        <el-table-column prop="created_time" label="创建时间">
          <template #default="scope">
            <span>{{ dayjs(scope.row.created_time).format('YYYY-MM-DD HH:mm:ss') }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="180">
          <template #default="scope">
            <el-button type="primary" text @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="primary" text @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <comPagination :pageOptions="pageOptions" @getData="getData" />
    </div>
  </div>
</template>

<script setup>
import { reactive, toRefs, ref, onMounted } from 'vue';
import { getArticleList, deleteArticle } from '@/api/article.js'
import dayjs from 'dayjs';
import { ElMessageBox, ElMessage } from 'element-plus';
import { useRouter } from 'vue-router'
import comPagination from '@/components/comPagination.vue';

const router = useRouter()
const data = reactive({
  form: {
    title: '',
    type: '',
  },
  tableData: [],
  pageOptions: {
    pageSize: 10,
    pageNum: 1,
    total: 0
  },
});
const getData = async () => {
  const res = await getArticleList({
    pageSize: data.pageOptions.pageSize,
    pageNum: data.pageOptions.pageNum,
    ...data.form
  })
  // console.log(res, 'res');
  data.pageOptions.total = res.totalCount
  data.tableData = res.list
};
const handleAdd = () => {
  router.push('/add-article')
};
const handleEdit = (row) => {
  router.push('/add-article?id=' + row.id)
};
const handleDelete = (row) => {
  // console.log('删除按钮被点击', row);
  ElMessageBox.confirm('确认是否删除分类？', '删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    deleteArticle(row.id).then(() => {
      ElMessage.success('删除成功')
      getData()
    })
  }).catch(() => {
    console.log('取消删除');
  });


};


onMounted(() => {
  getData()
});

const { form, tableData, pageOptions } = toRefs(data);
</script>

<style lang="less" scoped>
.el-form {
  display: flex;
}
</style>