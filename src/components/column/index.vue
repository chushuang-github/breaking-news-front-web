<template>
  <div class="column_pannel" id="column_show"></div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  name: 'Column',
  mounted () {
    this.columnChartFn()
  },
  methods: {
    // 设置底部柱状图
    columnChartFn () {
      const oColumn = echarts.init(document.getElementById('column_show'))
      const oColumnopt = {
        title: {
          text: '文章访问量',
          left: 'center',
          top: '10'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['奇趣事', '会生活', '爱旅行', '趣美味'],
          top: '40'
        },
        toolbox: {
          show: true,
          feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ['line', 'bar'] },
            restore: { show: true },
            saveAsImage: { show: true }
          }
        },
        xAxis: [
          {
            type: 'category',
            data: ['1月', '2月', '3月', '4月', '5月']
          }
        ],
        yAxis: [
          {
            name: '访问量',
            type: 'value'
          }
        ],
        series: [
          {
            name: '奇趣事',
            type: 'bar',
            barWidth: 20,
            areaStyle: { type: 'default' },
            itemStyle: {
              color: '#fd956a'
            },
            data: [800, 708, 920, 1090, 1200]
          },
          {
            name: '会生活',
            type: 'bar',
            barWidth: 20,
            areaStyle: { type: 'default' },
            itemStyle: {
              color: '#2bb6db'
            },
            data: [400, 468, 520, 690, 800]
          },
          {
            name: '爱旅行',
            type: 'bar',
            barWidth: 20,
            areaStyle: { type: 'default' },
            itemStyle: {
              color: '#13cfd5'
            },
            data: [500, 668, 520, 790, 900]
          },
          {
            name: '趣美味',
            type: 'bar',
            barWidth: 20,
            areaStyle: { type: 'default' },
            itemStyle: {
              color: '#00ce68'
            },
            data: [600, 508, 720, 890, 1000]
          }
        ],
        grid: {
          show: true,
          x: 50,
          x2: 30,
          y: 80,
          height: 260
        },
        dataZoom: [
          // 给x轴设置滚动条
          {
            start: 0, // 默认为0
            end: 100 - 1000 / 31, // 默认为100
            type: 'slider',
            show: true,
            xAxisIndex: [0],
            handleSize: 0, // 滑动条的 左右2个滑动条的大小
            height: 8, // 组件高度
            left: 45, // 左边的距离
            right: 50, // 右边的距离
            bottom: 26, // 右边的距离
            handleColor: '#ddd', // h滑动图标的颜色
            handleStyle: {
              borderColor: '#cacaca',
              borderWidth: '1',
              shadowBlur: 2,
              background: '#ddd',
              shadowColor: '#ddd'
            }
          }
        ]
      }
      oColumn.setOption(oColumnopt)
    }
  }
}
</script>
