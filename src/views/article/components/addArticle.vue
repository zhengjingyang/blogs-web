<template>
  <el-container>
    <el-header>
      <el-input v-model="form.title" class="art-title" placeholder="请输入文章标题...."></el-input>
      <el-button type="primary" class="art-btn">保存</el-button>
    </el-header>
    <el-main>
      <el-row>
        <el-col :span="24">
          <div id="vditor"></div>
        </el-col>
        <!-- <el-col :sapn="12"></el-col> -->
      </el-row>
    </el-main>
  </el-container>
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

onMounted(() => {
  vditor.value = new Vditor('vditor', {
    height: '100%',
    width: '100%',
    "cache": {
      "enable": false
    },
    "mode": "sv",
    "preview": {
      "mode": "both"
    },
    value: '请在此处输入Markdown文本',
    // 设置工具栏中展示的工具
    toolbar: ["undo", "redo", "|", "emoji", "headings", "bold", "italic", "strike", "|", "line", "quote", "list", "ordered-list", "check", "outdent", "indent", "|", "code", "inline-code", "|", "upload", "link", "table", "|", "edit-mode", "both", "preview", "|", "code-theme", "content-theme", "|", "export", "br"],
    upload: {
      accept: 'image/*,.mp3, .wav, .rar',
      token: 'test',
      url: '/api/upload/editor',
      linkToImgUrl: '/api/upload/fetch',
      filename(name) {
        return name.replace(/[^(a-zA-Z0-9\u4e00-\u9fa5\.)]/g, '').
          replace(/[\?\\/:|<>\*\[\]\(\)\$%\{\}@~]/g, '').
          replace('/\\s/g', '')
      },
    },
    "outline": {
      "enable": true,
      "position": "right"
    },
    "counter": {
      "enable": true,
      "type": "text"
    },
    // 编辑器失去焦点后的回调函数
    blur(value) {
      console.log(value);

      // 保存文档....
      console.log('保存成功')
    }
  })
})

const { form, rules, typeOptions } = toRefs(data)
</script>

<style lang="less" scoped>
.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;

  .el-button {
    border: 1px solid #1d7dfa;
    border-radius: 2px;
    background-color: #1d7dfa;
    height: 32px;
    padding: 2px 16px;
    font-size: 14px;
    line-height: 22px;
  }
}

.el-main {
  padding: 0;
  height: calc(100vh - 60px);
}

.el-row {
  height: 100%;

  .el-col {
    height: 100%;
  }
}

/deep/.art-title {
  width: 70%;
  height: 60px;
  line-height: 60px;

  .el-input__wrapper {
    box-shadow: unset;
  }

  .el-input__inner {
    font-size: 24px;
    font-weight: 500;
    color: #000;
  }

}
</style>