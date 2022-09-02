<template>
  <div class="reports">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 为 ECharts 准备一个定义了宽高的 DOM -->
      <div id="main" style="width: 100%;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { getEchartsData } from '@/api/reports/reports.js'
import _ from 'lodash'
export default {
  name: 'Reports',
  data() {
    return {
      // 图表数据
      options: {
        // 标题
        title: {
          text: '用户来源',
          left: '40%'
        },
        // 图例
        legend: {
          right: '4%'
        },
        // 提示框
        tooltip: {
          // 坐标轴触发
          trigger: 'axis',
          // 坐标轴指示器配置项
          axisPointer: {
            // 十字准星指示器
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        // 直角坐标系内绘图网格
        grid: {
          // 离容器左侧的距离
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        // X轴数据
        xAxis: [
          {
            // 坐标轴两边留白策略
            boundaryGap: false
          }
        ],
        // Y轴数据
        yAxis: [
          {
            // 坐标轴类型  数值轴
            type: 'value'
          }
        ]
      }
    }
  },
  created() {},
  async mounted() {
    // 基于准备好的dom，初始化 echarts实例
    var myChart = echarts.init(document.getElementById('main'))

    // 获取报表数据
    const res = await getEchartsData()
    if (res.meta.status !== 200) {
      this.$message.error('图表数据获取失败')
    }

    // 准备图表的配置项和数据
    // 使用 merge 将 两组数据合并
    const result = _.merge(res.data, this.options)

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(result)
  },
  methods: {}
}
</script>

<style lang="less" scoped>
</style>