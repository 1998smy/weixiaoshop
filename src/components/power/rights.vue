<template>
  <div class="rights">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card content-card">
      <!-- 表格区域 -->
      <el-table :data="rightsData" stripe border class="rightsTable">
        <el-table-column type="index" label="#" width="120px">
        </el-table-column>
        <el-table-column prop="authName" label="权限名称">
        </el-table-column>
        <el-table-column prop="path" label="路径">
        </el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">等级一</el-tag>
            <el-tag type="success" v-else-if="scope.row.level === '1'">等级二</el-tag>
            <el-tag type="warning" v-else>等级三</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
import { getRightsList } from '@/api/power/rights.js'
export default {
  name: 'Rights',
  data() {
    return {
      // 所有权限列表数据
      rightsList: [],
      // 权限表格数据
      rightsData: []
    }
  },
  created() {
    this.getAllRights()
  },
  methods: {
    // 请求所有权限数据
    async getAllRights() {
      const res = await getRightsList('list')
      this.rightsData = res.data
    }
  }
}
</script>

<style lang="less" scoped>
.rights {
  padding: 10px;
  height: 100%;
  box-sizing: border-box;
  height: calc(100vh - 120px);
  .box-card {
    height: 100%;
    margin-top: 15px;
    padding: 10px;
    padding-right: 0;
    // overflow-y: scroll;
  }
}
</style>