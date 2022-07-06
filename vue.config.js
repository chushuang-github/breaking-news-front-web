// 需要排除的包对象
let externals = {}
// 是否是生产环境
const isProduction = process.env.NODE_ENV === 'production'

// 如果是生产模式，打包的时候排除这些包不打包，使用CDN服务器引入这些包
// 前端项目中使用CDN好处：
// 1) 减少应用打包出来的包体积
// 2) 加快静态资源的访问-cdn服务器集群-就近返回
// 3) 利用浏览器缓存，不会变动的文件长期缓存
if (isProduction) {
  externals = {
    // '包名' : '在项目中引入的名字(项目中使用该包的变量名)'
    echarts: 'echarts',
    vue: 'Vue',
    'vue-router': 'VueRouter',
    vuex: 'Vuex',
    axios: 'axios',
    dayjs: 'dayjs',
    'element-ui': 'ELEMENT',
    'vue-quill-editor': 'VueQuillEditor',
    'vuex-persistedstate': 'createPersistedState'
  }
}

module.exports = {
  publicPath: isProduction ? './' : '/',
  configureWebpack: {
    // externals：配置哪些包是不用打包的 (这些包在public -> index.html使用CDN服务器进行引入)
    // 注意：一定要去修改掉引入Element-ui用的变量名，这里要匹配去替换 (因为cdn里的源代码配置在ELEMENT这个变量上)
    externals
  }
}
