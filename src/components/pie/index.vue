<template>
  <div class="gragh_pannel" id="pie_show"></div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  name: 'Pie',
  mounted () {
    this.picChartFn()
  },
  methods: {
    // 设置饼状图
    picChartFn () {
      const oPie = echarts.init(document.getElementById('pie_show'))
      const oPieopt = {
        title: {
          top: 10,
          text: '分类文章数量比',
          x: 'center'
        },
        tooltip: {
          trigger: 'item', // 在图形上才会触发提示
          formatter: '{a} <br/>{b} : {c} ({d}%)' // 提示的文字显示的格式
          // a: 系列名
          // b: 数据名
          // c: 数值
          // d: 百分比 (只有饼状图生效)
        },
        color: ['#5885e8', '#13cfd5', '#00ce68', '#ff9565'], // 系列颜色
        legend: {
          // 图例组件
          x: 'center',
          top: 65,
          data: ['奇趣事', '会生活', '爱旅行', '趣美味'] // 每个部分对应的数据名(要和series里name对应)
        },
        toolbox: {
          // 工具箱
          show: true,
          x: 'center',
          top: 35,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: {
              show: true,
              type: ['pie', 'funnel'],
              option: {
                funnel: {
                  x: '25%',
                  width: '50%',
                  funnelAlign: 'left',
                  max: 1548
                }
              }
            },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: ['45%', '60%'],
            center: ['50%', '65%'],
            data: [
              { value: 300, name: '奇趣事' },
              { value: 100, name: '会生活' },
              { value: 260, name: '爱旅行' },
              { value: 180, name: '趣美味' }
            ]
          }
        ]
      }
      oPie.setOption(oPieopt)
    }
  }
}
</script>
