<template>
  <el-dialog v-model="dialogVisible" title="添加文章" @close="close" style="height: 100%;margin:0" width="100%">
    <el-row :gutter="16">
      <el-col :span="12">
        <div id="vditor"></div>
      </el-col>
      <el-col :sapn="12"></el-col>
    </el-row>
    <template #footer>
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="save">保存</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, toRefs } from 'vue';
import Vditor from 'vditor'
import 'vditor/dist/index.css'

const vditor = ref(null)
const data = reactive({
  dialogVisible: true,
  form: {
    title: '',
    type: '',
    content: ''
  },
  rules: {
    title: [
      { required: true, message: '请输入标题', trigger: 'blur' },
    ],
    type: [
      { required: true, message: '请选择分类', trigger: 'change' },
    ],
    content: [
      { required: true, message: '请输入内容', trigger: 'blur' },
    ],
  },
  typeOptions: [
    { label: '分类1', value: '1' },
    { label: '分类2', value: '2' },
    { label: '分类3', value: '3' },
  ],
})
const close = () => {
  // data.dialogVisible = false
}
const save = () => {
  console.log('保存')
}

onMounted(() => {
  vditor.value = new Vditor('vditor', {
    height: '500px',
    width: '100%',
    value: '请在此处输入Markdown文本',
    // 设置工具栏中展示的工具
    toolbar: ['emoji', 'br', 'bold', '|', 'line', 'quote', 'list', 'check'],
    // 编辑器失去焦点后的回调函数
    blur(value) {
      // 保存文档....
      console.log('保存成功')
    }
  })
})

const { dialogVisible, form, rules, typeOptions } = toRefs(data)
</script>

<style lang="less" scoped></style>