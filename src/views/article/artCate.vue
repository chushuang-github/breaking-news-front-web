<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix header-box">
        <span>文章分类</span>
        <el-button type="primary" size="mini" @click="addFn">添加分类</el-button>
      </div>
      <el-table :data="cateList" style="width: 100%" border stripe>
        <el-table-column type="index" label="序号" width="100"></el-table-column>
        <el-table-column prop="cate_name" label="分类名称"></el-table-column>
        <el-table-column prop="cate_alias" label="分类别名"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button type="primary" size="mini" @click="editFn(scope.row)">修改</el-button>
            <el-button type="danger" size="mini" @click="deleteFn(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加文章分类"
      width="35%"
      :visible.sync="addVisible"
      @closed="handleClosed"
    >
      <el-form :model="addForm" :rules="addRules" ref="addRef" label-width="80px">
        <el-form-item label="分类名称" prop="cate_name">
          <el-input v-model="addForm.cate_name" minlength="1" maxlength="10"></el-input>
        </el-form-item>
        <el-form-item label="分类别名" prop="cate_alias">
          <el-input v-model="addForm.cate_alias" minlength="1" maxlength="15"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelFn">取 消</el-button>
        <el-button type="primary" @click="confirmFn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getArtCateListAPI, addArtCateAPI, updateArtCateAPI, deleteArtCateAPI } from '../../api'
export default {
  name: 'ArtCate',
  data () {
    return {
      cateList: [],
      addVisible: false,
      addForm: { // 添加表单的数据对象
        cate_name: '',
        cate_alias: ''
      },
      addRules: {
        cate_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { pattern: /^\S{1,10}$/, message: '分类名必须是1-10位的非空字符', trigger: 'blur' }
        ],
        cate_alias: [
          { required: true, message: '请输入分类别名', trigger: 'blur' },
          { pattern: /^[a-zA-Z0-9]{1,15}$/, message: '分类别名必须是1-15位的字母数字', trigger: 'blur' }
        ]
      },
      isEdit: false, // true是编辑，false是新增
      editId: '' // 编辑的id
    }
  },
  created () {
    this.getArtCateList()
  },
  methods: {
    // 获取文章分类列表
    async getArtCateList () {
      const { data: res } = await getArtCateListAPI()
      this.cateList = res.data
    },
    // 对话框关闭的回调
    handleClosed () {
      this.$refs.addRef.resetFields()
    },
    // 点击添加分类按钮
    addFn () {
      this.isEdit = false
      this.editId = ''
      this.addVisible = true
    },
    // 点击修改按钮
    // element-ui里面的dialog对话框在每次关闭的时候，都会将对话框在页面中卸载而不是隐藏
    // this.$refs.addRef.resetFields()：对该表单项进行重置，将其值重置为初始值(第一次渲染出来的初始设置的值)，并移除校验结果
    // 如果对话框还没有显示出来，就给对话框设置值，这样做表单的初始值就是第一次设置的值
    // 当再次重置表单的时候，会将表单重置为初始值，此时的初始值就是第一次设置的值，会导致resetFields不能清空表单
    // 注意：resetFields方法是将表单重置为初始值，初始值设置为空，调用resetFields方法的时候，就会有清空表单的效果
    editFn (row) {
      this.addVisible = true
      this.isEdit = true
      this.editId = row.id
      // 先让对话框出现，设置表单的每一项初始值都为空字符串，这样resetFields方法将表单设置为初始空值就是清空表单的效果
      this.$nextTick(() => {
        this.addForm.cate_name = row.cate_name
        this.addForm.cate_alias = row.cate_alias
      })
    },
    // 点击对话框取消按钮
    cancelFn () {
      this.addVisible = false
    },
    // 点击对话框确认按钮
    confirmFn () {
      this.$refs.addRef.validate(async valid => {
        if (!valid) return false
        if (!this.isEdit) {
          // 添加分类
          const { data: res } = await addArtCateAPI(this.addForm)
          if (res.code !== 0) return this.$message.error(res.message)
          this.$message.success(res.message)
        } else {
          // 修改分类
          const { data: res } = await updateArtCateAPI({ id: this.editId, ...this.addForm })
          if (res.code !== 0) return this.$message.error(res.message)
          this.$message.success(res.message)
        }
        // 重新请求列表数据
        this.getArtCateList()
        // 关闭对话框
        this.addVisible = false
      })
    },
    // 删除按钮
    deleteFn (row) {
      this.$confirm('您确认删除该分类吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await deleteArtCateAPI(row.id)
          if (res.code !== 0) return this.$message.error(res.message)
          this.$message.success(res.message)
          // 重新请求列表数据
          this.getArtCateList()
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="less" scoped>
.header-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
