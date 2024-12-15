<template>
  <el-dialog v-model="dialogVisible" title="新增" width="500" @close="handleClose">
    <!-- <span>This is a message</span> -->
    <div class="dialog-body">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="分类类型" prop="type">
          <el-select v-model="form.type">
            <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="父节点" prop="parentId">
          <el-tree-select v-model="form.parent_id" :data="transformData(tableData)" check-strictly
            :render-after-expand="true" :check-on-click-node="true" show-checkbox />
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="save">
          保存
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, toRefs, defineExpose, defineEmits } from 'vue';
import { ElMessage } from 'element-plus'
import { createArticleType, updateArticleType } from '@/api/article-type.js'
const formRef = ref(null)
const emit = defineEmits(['getData']);
const props = defineProps({
  typeOptions: {
    type: Array,
    default: []
  },
  tableData: {
    type: Array,
    default: []
  }
})
const data = reactive({
  dialogVisible: false,
  form: {
    id: null,
    name: '',
    type: 'top',
    parent_id: '',
  },
  rules: {
    name: [
      { required: true, message: '请输入名称', trigger: 'blur' },
    ]
  },
  treeSelectDefaultProps: {
    children: 'children',
    label: 'name',
    value: 'id',
  }
})
const show = (rowData) => {
  if (rowData) {
    for (let key in data.form) {
      data.form[key] = rowData[key] || ''
    }
  }

  dialogVisible.value = true
}
const save = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      // 表单验证通过，执行保存操作
      let params = JSON.parse(JSON.stringify(data.form))
      for (let key in params) {
        if (!params[key]) {
          delete params[key]
        }
      }
      if (params.id) {
        const res = await updateArticleType(params)
        console.log(res, 'res');
        ElMessage.success('编辑成功');
      } else {
        const res = await createArticleType(params)
        console.log(res, 'res');
        ElMessage.success('保存成功');
      }
      dialogVisible.value = false;
      emit('getData')
    } else {
      // 表单验证不通过，显示错误提示
      console.log('保存失败');
    }
  });
}

const handleClose = () => {
  data.form.parent_id = '';
  formRef.value.resetFields(); // 重置表单字段
}

const transformData = (data) => {
  return data.map(item => {
    let newItem = {
      label: item.name,
      value: item.id
    };

    if (item.children) {
      newItem.children = transformData(item.children);
    }

    return newItem;
  });
}

const { dialogVisible, form, rules, treeSelectDefaultProps } = toRefs(data)

defineExpose({ show, });
</script>


<style lang="less" scoped></style>