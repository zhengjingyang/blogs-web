<template>
  <el-container>
    <el-header>
      <el-input v-model="formData.title" class="art-title" placeholder="请输入文章标题...."></el-input>

      <el-popover placement="bottom" :width="555" trigger="click">
        <template #reference>
          <!-- <el-button style="margin-right: 16px">Click to activate</el-button> -->
          <el-button type="primary" class="art-btn">保存</el-button>
        </template>
        <el-form :model="formData" :rules="rules" ref="formRef" label-width="80px">
          <el-form-item label="分类：" prop="type">
            <el-tree-select v-model="formData.type" :data="transformData(typeData)" check-strictly
              :render-after-expand="true" :check-on-click-node="false" show-checkbox :teleported="false"
              @change="selectChage" />
          </el-form-item>
          <el-form-item label="封面：">
            <el-upload accept=".jpg,.jpeg,.png,.gif,.JPG,.JPEG,.PBG,.GIF" class="avatar-uploader" action="#"
              :show-file-list="false" :before-upload="beforeAvatarUpload">
              <img v-if="formData.img" :src="formData.img" class="avatar" />
              <el-icon v-else class="avatar-uploader-icon">
                <Plus />
              </el-icon>
              <p v-show="!formData.img">上传封面</p>
            </el-upload>
          </el-form-item>
          <el-form-item label="摘要：" prop="described">
            <el-input type="textarea" v-model="formData.described" :autosize="{ minRows: 5, maxRows: 10 }"
              placeholder="请输入文章内容...."></el-input>
          </el-form-item>
        </el-form>
        <div class="footer">
          <el-button type="default">取消</el-button>
          <el-button type="primary" class="save-btn" @click="save">确定并发布</el-button>
        </div>
      </el-popover>
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
import { Plus } from '@element-plus/icons-vue'
import { getArticleTypeList } from '@/api/article-type.js'
import Compressor from 'compressorjs';
import { ElMessage } from 'element-plus'
import { uploadFile } from '@/api/file.js'
import { createArticle, updateArticle, getArticleDetail } from '@/api/article.js'
import { useRouter, useRoute } from 'vue-router'


const vditor = ref(null)
const formRef = ref(null)
const router = useRouter()
const route = useRoute()
const data = reactive({
  dialogVisible: true,
  formData: {
    id: '',
    title: '',
    content: '',
    type: '',
    type_name: '',
    described: '',
    img: ''
  },
  rules: {
    type: [
      { required: true, message: '请选择分类', trigger: 'change' },
    ],
    described: [
      { required: true, message: '请输入内容', trigger: 'blur' },
    ],
  },
  typeData: [],
  typeList: [],
})

const initVditor = (content) => {
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
    value: content || '请在此处输入Markdown文本',
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
      // console.log(value);
      // // 保存文档....
      // console.log('保存成功')
      data.formData.content = value
    }
  })
}
const getArticleTypeTree = async () => {
  const res = await getArticleTypeList()
  data.typeData = res
  data.typeList = treeTrunList(res)
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

const selectChage = () => {
  console.log(data.typeList);
  data.formData.type_name = data.typeList.find(item => item.id == data.formData.type).name
  // console.log(data.formData.type_name);
}

const treeTrunList = (array) => {
  let arr = []
  const traverse = (node) => {
    // console.log(node);
    node.forEach(item => {
      arr.push({
        id: item.id,
        name: item.name
      })
      if (item.children) {
        traverse(item.children)
      }
    })
  }
  traverse(array)
  return arr
}

const beforeAvatarUpload = (file) => {
  new Compressor(file, {
    quality: 0.6, // 设置质量参数
    async success(result) {
      // 转换 Blob 为 File 
      const compressedFile = new File([result], file.name, { type: result.type, });
      let res = await uploadFile({
        file: compressedFile,
      })
      // console.log(res);
      data.formData.img = res

    },
    error(err) {
      ElMessage.error('图片压缩失败: ' + err.message);
    },
  });
};

const save = async () => {
  if (!formData.value.title) {
    ElMessage.error('请输入文章标题');
    return;
  }
  formRef.value.validate(async (valid) => {
    if (valid) {
      // 表单验证通过，执行保存操作
      let params = JSON.parse(JSON.stringify(data.formData))
      for (let key in params) {
        if (!params[key]) {
          delete params[key]
        }
      }
      if (params.id) {
        const res = await updateArticle(params)
        console.log(res, 'res');
        ElMessage.success('编辑成功');
        router.push('/article')
      } else {
        const res = await createArticle(params)
        console.log(res, 'res');
        ElMessage.success('保存成功');
        router.push('/article')
      }
    } else {
      // 表单验证不通过，显示错误提示
      console.log('保存失败');
    }
  })
}

const getArticleDetailHandle = async (id) => {
  const res = await getArticleDetail(id)
  console.log(res);
  if (res && res.length > 0) {
    let obj = res[0]
    for (let key in data.formData) {
      if (obj[key]) {
        data.formData[key] = obj[key]
      }
    }
  }
  initVditor(data.formData.content)
}

onUnmounted(() => {
  vditor.value?.destroy()
})

onMounted(() => {

  getArticleTypeTree()
  if (route.query.id) {
    data.formData.id = route.query.id
    getArticleDetailHandle(route.query.id)
  } else {
    initVditor()
  }
})

const { formData, rules, typeData } = toRefs(data)
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

:deep(.art-title) {
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

:deep(.avatar-uploader) {
  .avatar {
    width: 192px;
    height: 128px;
    display: block;
  }

  .el-upload {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 192px;
    height: 128px;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    border: 1px dashed #dcdfe6;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
  }
}

.footer {
  display: flex;
  justify-content: flex-end;
}
</style>