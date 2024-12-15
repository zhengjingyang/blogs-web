<template>
  <div class="container">
    <div class="query-container">
      <el-form :model="form" label-width="100px">
        <el-form-item label="分类名称">
          <el-input style="width: 200px;" v-model="form.name" placeholder="请输入分类名称" clearable />
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
      <el-table :data="tableData" border row-key="id">
        <el-table-column prop="id" label="ID" width="130"></el-table-column>
        <el-table-column prop="name" label="分类名称"></el-table-column>
        <el-table-column prop="type" label="分类类型">
          <template #default="scope">
            <span>{{ arrayTurnDict(typeOptions)[scope.row.type] }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="created_time" label="创建时间">
          <template #default="scope">
            <span>{{ dayjs(scope.row.created_time).format('YYYY-MM-DD HH:mm:ss') }}</span>
          </template>
        </el-table-column>
        <el-table-column center label="操作" width="180">
          <template #default="scope">
            <el-button type="primary" text @click="handleEdit(scope.row)">编辑</el-button>
            <el-button type="primary" text @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- <el-pagination background :page-sizes="[10, 20, 30, 40]" :pager-count="7" :total="500"
        layout="total, sizes, prev, pager, next" /> -->
    </div>
  </div>
  <addDialog ref="addDialogRef" :typeOptions="typeOptions" :tableData="tableData" @getData="getData" />
</template>

<script setup>
import { reactive, toRefs, ref, onMounted } from 'vue';
import addDialog from './components/addDialog.vue';
import { getArticleTypeList, deleteArticleType } from '@/api/article-type.js'
import dayjs from 'dayjs';
import { ElMessageBox, ElMessage } from 'element-plus';


const addDialogRef = ref(null);
const data = reactive({
  form: {
    name: '',
  },
  tableData: [],
  typeOptions: [
    { label: '顶部菜单', value: 'top' },
    { label: '侧边菜单', value: 'sub' },
  ]
});
const getData = async () => {
  const res = await getArticleTypeList(data.form)
  data.tableData = res
};
const arrayTurnDict = (array) => {
  const dict = {};
  array.forEach((item) => {
    dict[item['value']] = item.label;
  });
  return dict;
};
const handleAdd = () => {
  addDialogRef.value.show();
};
const handleEdit = (row) => {
  // console.log('编辑按钮被点击', row);
  addDialogRef.value.show(row);
};
const handleDelete = (row) => {
  // console.log('删除按钮被点击', row);
  ElMessageBox.confirm('确认是否删除分类？', '删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    deleteArticleType(row.id).then(() => {
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

const { form, tableData, typeOptions } = toRefs(data);
</script>

<style lang="less" scoped>
.el-form {
  display: flex;
}
</style>