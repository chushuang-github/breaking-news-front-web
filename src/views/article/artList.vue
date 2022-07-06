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
            <el-button type="primary" size="small" @click="initArtListFn">筛选</el-button>
            <el-button type="info" size="small" @click="resetListFn">重置</el-button>
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
      <el-table :data="artList" style="width: 100%;" border stripe>
        <el-table-column label="文章标题" prop="title">
          <template v-slot="scope">
            <el-link type="primary" @click="showDetailFn(scope.row.id)">{{ scope.row.title }}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="分类" prop="cate_name"></el-table-column>
        <el-table-column label="发表时间" prop="pub_date">
          <template v-slot="scope">
            <span>{{ scope.row.pub_date | formatDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="state"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="{ row }">
            <el-button type="danger" size="mini" @click="deleteFn(row.id)">删 除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChangeFn"
        @current-change="handleCurrentChangeFn"
        :current-page.sync="q.pagenum"
        :page-size.sync="q.pagesize"
        :page-sizes="[2, 3, 5, 10]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
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

    <!-- 查看文章详情的对话框 -->
    <el-dialog title="文章预览" :visible.sync="detailVisible" width="80%">
      <h1 class="title">{{ artDetail.title }}</h1>
      <div class="info">
        <span>作者：{{ artDetail.nickname || artDetail.username }}</span>
        <span>发布时间：{{ artDetail.pub_date | formatDate }}</span>
        <span>所属分类：{{ artDetail.cate_name }}</span>
        <span>状态：{{ artDetail.state }}</span>
      </div>
      <!-- 分割线 -->
      <el-divider></el-divider>
      <!-- 文章的封面 -->
      <img v-if="artDetail.cover_img" :src="baseURL + artDetail.cover_img" alt="" />
      <!-- 文章的详情 -->
      <div v-html="artDetail.content" class="detail-box"></div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getArtCateListAPI,
  uploadArticleAPI,
  getArticleListAPI,
  getArticleDetailAPI,
  deleteArticleAPI
} from '../../api'
import { baseURL } from '../../utils/request'
import defaultImage from '../../assets/images/cover.jpg'
export default {
  name: 'ArtList',
  data () {
    return {
      // 查询参数对象
      q: {
        pagenum: 1, // 默认拿第一页的数据
        pagesize: 2, // 获取的数据条数
        cate_id: '',
        state: ''
      },
      pubDialogVisible: false,
      cateList: [], // 文章分类
      artList: [], // 文章的列表数据
      total: 0, // 总数据条数
      artDetail: {}, // 文章详情
      detailVisible: false, // 文章详情对话框
      baseURL: baseURL,
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
    this.getArticleList()
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
    // 获取文章列表
    async getArticleList () {
      const { data: res } = await getArticleListAPI(this.q)
      this.artList = res.data
      this.total = res.total
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
        this.getArticleList()
      })
    },
    // 关闭对话框
    dialogCloseFn () {
      // 重置表单
      this.$refs.pubFormRef.resetFields()
      // 文章图片重置
      this.$refs.imgRef.setAttribute('src', defaultImage)
      this.pubForm.cover_img = null
    },
    // 分页大小发生变化
    handleSizeChangeFn (pagesize) {
      this.q.pagesize = pagesize
      this.q.pagenum = 1
      this.getArticleList()
    },
    // 分页当前页数发生变化
    handleCurrentChangeFn (pagenum) {
      this.q.pagenum = pagenum
      this.getArticleList()
    },
    // 筛选功能实现
    initArtListFn () {
      this.q.pagenum = 1
      this.q.pagesize = 2
      this.getArticleList()
    },
    // 重置功能实现
    resetListFn () {
      this.q.pagenum = 1
      this.q.pagesize = 2
      this.q.cate_id = ''
      this.q.state = ''
      this.getArticleList()
    },
    async showDetailFn (id) {
      const { data: res } = await getArticleDetailAPI(id)
      this.artDetail = res.data
      this.detailVisible = true
    },
    // 删除按钮
    async deleteFn (id) {
      const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult === 'cancel') return false
      const { data: res } = await deleteArticleAPI(id)
      if (res.code !== 0) return this.$message.error(res.message)
      this.$message.success(res.message)
      if (this.artList.length === 1 && this.q.pagenum > 1) {
        this.q.pagenum--
      }
      this.getArticleList()
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
// 分页器
.el-pagination {
  margin-top: 15px;
  display: flex;
  justify-content: flex-end;
}
// 文章详情
.title {
  font-size: 24px;
  text-align: center;
  font-weight: normal;
  color: #000;
  margin: 0 0 10px 0;
}
.info {
  font-size: 12px;
  span {
    margin-right: 20px;
  }
}
// 修改 dialog 内部元素的样式，需要添加样式穿透
::v-deep .detail-box {
  img {
    width: 500px;
  }
}
</style>
