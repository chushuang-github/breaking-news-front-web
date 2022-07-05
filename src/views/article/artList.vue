<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>文章列表</span>
      </div>
      <!-- 搜索区域 -->
      <div class="search-box">
        <el-form :inline="true" :model="q">
          <el-form-item label="文章分类">
            <el-select
              v-model="q.cate_id"
              placeholder="请选择分类"
              size="small"
            >
              <el-option
                v-for="item in cateList"
                :key="item.id"
                :label="item.cate_name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="发布状态" style="margin-left: 15px">
            <el-select v-model="q.state" placeholder="请选择状态" size="small">
              <el-option label="已发布" value="已发布"></el-option>
              <el-option label="草稿" value="草稿"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small">筛选</el-button>
            <el-button type="info" size="small">重置</el-button>
          </el-form-item>
        </el-form>
        <!-- 发表文章的按钮 -->
        <el-button
          type="primary"
          size="small"
          class="btn-pub"
          @click="showPubDialogFn"
        >
          发表文章
        </el-button>
      </div>

      <!-- 文章表格区域 -->

      <!-- 分页区域 -->
    </el-card>

    <!-- 发表文章的Dialog对话框 -->
    <el-dialog
      title="发表文章"
      :visible.sync="pubDialogVisible"
      fullscreen
      :before-close="handleClose"
      @close="dialogCloseFn"
    >
      <!-- 发布文章的对话框 -->
      <el-form
        :model="pubForm"
        :rules="pubFormRules"
        ref="pubFormRef"
        label-width="100px"
      >
        <el-form-item label="文章标题" prop="title">
          <el-input v-model="pubForm.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="文章分类" prop="cate_id">
          <el-select
            v-model="pubForm.cate_id"
            placeholder="请选择分类"
            style="width: 100%"
          >
            <el-option
              v-for="item in cateList"
              :key="item.id"
              :label="item.cate_name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="文章内容" prop="content">
          <!-- 富文本编辑器 -->
          <quill-editor v-model="pubForm.content" @change="contentChangeFn"></quill-editor>
        </el-form-item>
        <el-form-item label="文章封面" prop="cover_img">
          <img src="../../assets/images/cover.jpg" class="cover-img" ref="imgRef" alt="" />
          <br />
          <input type="file" style="display: none;" accept="image/*" ref="iptFileRef" @change="onCoverChangeFn" />
          <el-button type="text" @click="chooseImgFn">+ 选择封面</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="pubArticleFn('已发布')">发布</el-button>
          <el-button type="info" @click="pubArticleFn('草稿')">存为草稿</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getArtCateListAPI, uploadArticleAPI } from '../../api'
import defaultImage from '../../assets/images/cover.jpg'
export default {
  name: 'ArtList',
  data () {
    return {
      // 查询参数对象
      q: {
        pagenum: 1,
        pagesize: 2,
        cate_id: '',
        state: ''
      },
      pubDialogVisible: false,
      cateList: [], // 文章分类
      pubForm: {
        // 表单的数据对象
        title: '',
        cate_id: '',
        content: '', // 文章的内容
        cover_img: '', // 文章封面(保存的是一个文件，接口需要的是文件)
        state: '' // 文章的发布状态，可选值有两个：草稿、已发布
      },
      pubFormRules: {
        // 表单的验证规则对象
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          { min: 1, max: 30, message: '文章标题的长度为1-30个字符', trigger: 'blur' }
        ],
        cate_id: [
          { required: true, message: '请选择文章标题', trigger: 'change' }
        ],
        content: [
          { required: true, message: '请输入文章内容' }
        ],
        cover_img: [
          { required: true, message: '请选择封面' }
        ]
      }
    }
  },
  created () {
    this.getArtCateList()
  },
  methods: {
    // 富文本编辑器内容改变了，触发此事件方法
    contentChangeFn () {
      this.$refs.pubFormRef.validateField('content')
    },
    // 获取文章分类
    async getArtCateList () {
      const { data: res } = await getArtCateListAPI()
      this.cateList = res.data
    },
    // 发表文章按钮的点击事件
    showPubDialogFn () {
      this.pubDialogVisible = true
    },
    // 发布文章对话框关闭前的回调
    async handleClose (done) {
      const confirmResult = await this.$confirm(
        '操作将导致文章信息丢失，是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch((err) => err)
      if (confirmResult === 'cancel') return
      done()
    },
    // 点击选择封面按钮
    chooseImgFn () {
      this.$refs.iptFileRef.click()
    },
    onCoverChangeFn (e) {
      const files = e.target.files
      if (files.length === 0) {
        return false
      } else {
        this.pubForm.cover_img = files[0]
        const url = URL.createObjectURL(files[0])
        this.$refs.imgRef.setAttribute('src', url)
      }
      this.$refs.pubFormRef.validateField('cover_img')
    },
    // 发布 or 存为草稿
    async pubArticleFn (state) {
      this.pubForm.state = state
      this.$refs.pubFormRef.validate(async valid => {
        if (!valid) return false
        const formData = new FormData()
        for (const key in this.pubForm) {
          formData.append(key, this.pubForm[key])
        }
        const { data: res } = await uploadArticleAPI(formData)
        if (res.code !== 0) return this.$message.error(res.message)
        this.$message.success(res.message)
        // 关闭对话框
        this.pubDialogVisible = false
      })
    },
    // 关闭对话框
    dialogCloseFn () {
      // 重置表单
      this.$refs.pubFormRef.resetFields()
      // 文章图片重置
      this.$refs.imgRef.setAttribute('src', defaultImage)
      this.pubForm.cover_img = null
    }
  }
}
</script>

<style lang="less" scoped>
.search-box {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  .btn-pub {
    margin-top: 5px;
  }
}
// 富文本编辑器
::v-deep .ql-editor {
  min-height: 300px;
}
// 设置图片封面的宽高
.cover-img {
  width: 400px;
  height: 280px;
  object-fit: cover;
}
</style>
