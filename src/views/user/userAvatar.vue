<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>更换头像</span>
    </div>
    <div>
      <!-- 图片，用来展示用户选择的头像 -->
      <img v-if="!avatar" class="the_img" src="../../assets/images/avatar.jpg" alt="" />
      <img v-else class="the_img" :src="this.avatar" alt="">

      <!-- 按钮区域 -->
      <div class="btn-box">
        <input
          type="file"
          accept="image/*"
          style="display: none"
          ref="iptRef"
          @change="onFileChange"
        />
        <el-button type="primary" icon="el-icon-plus" @click="chooseImg">
          选择图片
        </el-button>
        <el-button
          type="success"
          icon="el-icon-upload"
          :disabled="avatar === ''"
          @click="uploadFn"
        >
          上传头像
        </el-button>
      </div>
    </div>
  </el-card>
</template>

<script>
import { updateUserAvatarAPI } from '../../api'
export default {
  name: 'UserAvatar',
  data () {
    return {
      avatar: ''
    }
  },
  methods: {
    chooseImg () {
      this.$refs.iptRef.click()
    },
    onFileChange (e) {
      const files = e.target.files
      if (files.length === 0) {
        return false
      } else {
        // 使用FileReader来读取选择的前端文件，转换为base64字符串，给img标签渲染
        // 1) 创建 FileReader 对象
        const fr = new FileReader()
        // 2) 调用 readAsDataURL 函数，读取文件内容
        fr.readAsDataURL(files[0])
        // 3) 监听 fr 的 onload 事件
        fr.onload = (e) => {
          // 4) 通过e.target.result获取到读取的结果，值是字符串(base64 格式的字符串)
          this.avatar = e.target.result
        }
      }
    },
    async uploadFn () {
      const { data: res } = await updateUserAvatarAPI(this.avatar)
      if (res.code !== 0) return this.$message.error(res.message)
      this.$message.success(res.message)
      this.$store.dispatch('initUserInfo')
    }
  }
}
</script>

<style lang="less" scoped>
.btn-box {
  margin-top: 10px;
}
.preview {
  object-fit: cover;
}
.the_img {
  width: 350px;
  height: 350px;
}
</style>
