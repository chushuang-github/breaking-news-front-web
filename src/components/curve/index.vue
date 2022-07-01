<template>
  <div class="gragh_pannel" id="curve_show"></div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  name: 'Curve',
  mounted () {
    this.setCurveChartFn()
  },
  methods: {
    setCurveChartFn () {
      // 初始化echarts实例
      const curveChart = echarts.init(document.getElementById('curve_show'))

      // 绘制图表
      const aListAll = [
        { count: 36, date: '2019-04-13' },
        { count: 52, date: '2019-04-14' },
        { count: 78, date: '2019-04-15' },
        { count: 85, date: '2019-04-16' },
        { count: 65, date: '2019-04-17' },
        { count: 72, date: '2019-04-18' },
        { count: 88, date: '2019-04-19' },
        { count: 64, date: '2019-04-20' },
        { count: 72, date: '2019-04-21' },
        { count: 90, date: '2019-04-22' },
        { count: 96, date: '2019-04-23' },
        { count: 100, date: '2019-04-24' },
        { count: 102, date: '2019-04-25' },
        { count: 110, date: '2019-04-26' },
        { count: 123, date: '2019-04-27' },
        { count: 100, date: '2019-04-28' },
        { count: 132, date: '2019-04-29' },
        { count: 146, date: '2019-04-30' },
        { count: 200, date: '2019-05-01' },
        { count: 180, date: '2019-05-02' },
        { count: 163, date: '2019-05-03' },
        { count: 110, date: '2019-05-04' },
        { count: 80, date: '2019-05-05' },
        { count: 82, date: '2019-05-06' },
        { count: 70, date: '2019-05-07' },
        { count: 65, date: '2019-05-08' },
        { count: 54, date: '2019-05-09' },
        { count: 40, date: '2019-05-10' },
        { count: 45, date: '2019-05-11' },
        { count: 38, date: '2019-05-12' }
      ]

      // 但是图标要求直接给数字的值, 所以要把对象的值取出来形成2个只有值的数组
      const aCount = []
      const aDate = []

      for (let i = 0; i < aListAll.length; i++) {
        aCount.push(aListAll[i].count)
        aDate.push(aListAll[i].date)
      }

      // 面积图的echarts配置项(参考文档复制)
      const chartopt = {
        title: {
          text: '月新增文章数', // 标题
          left: 'center', // 位置居中
          top: '10' // 标题距离容器顶部px
        },
        tooltip: {
          // 提示框组件
          trigger: 'axis' // 坐标轴触发(鼠标放在坐标轴就能出提示框)
        },
        legend: {
          // 图例组件(每种颜色的意思)
          data: ['新增文章'], // 图例文字解释(要和series里name对应)
          top: '40' // 距离容器顶部px
        },
        toolbox: {
          // 工具栏
          show: true, // 要显示
          feature: {
            // 各工具配置项
            mark: { show: true }, // 辅助线开关
            dataView: { show: true, readOnly: false }, // 数据视图工具，可以展现当前图表所用的数据，编辑后可以动态更新。
            magicType: { show: true, type: ['line', 'bar'] }, // 动态类型切换
            restore: { show: true }, // 配置项还原
            saveAsImage: { show: true } // 点击保存下载图片
          }
        },
        xAxis: [
          // 水平轴显示
          {
            name: '日',
            type: 'category',
            boundaryGap: false, // 坐标轴两边留白策略 (不留白)
            data: aDate // 水平轴上的数字数据 (时间)
          }
        ],
        yAxis: [
          // 垂直轴显示
          {
            name: '月新增文章数',
            type: 'value' // 以series里的data值做划分段
          }
        ],
        series: [
          // 系列(控制图表类型和数据)
          {
            name: '新增文章',
            type: 'line', // 折线图
            smooth: true, // 是否平滑视觉引导线，默认不平滑，可以设置成 true 平滑显示
            areaStyle: { type: 'default' }, // 区域填充样式。设置后显示成区域面积图。
            itemStyle: { color: '#f80', lineStyle: { color: '#f80' } }, // 折线拐点标志的样式。
            data: aCount // 真正数据源(用下标和x轴数组对应)
          }
        ],
        grid: {
          // 直角坐标系内绘图网格
          show: true,
          x: 50, // grid 组件离容器偏移量, 左侧
          x2: 50, // 右侧
          y: 80, // 上
          height: 220 // 高度
        }
      }

      curveChart.setOption(chartopt)
    }
  }
}
</script>
