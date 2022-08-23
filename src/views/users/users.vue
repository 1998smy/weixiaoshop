<template>
  <div class="users">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/login' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 表单区域 -->
    <el-form :inline="true" :model="queryInfo" class="demo-form-inline">
      <!-- 搜索框区域 -->
      <el-form-item>
        <el-input v-model="queryInfo.query" class="input-with-select" placeholder="请输入搜索内容">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addUser">添加用户</el-button>
      </el-form-item>
      <!-- 表格区域 -->
      <el-table :data="tableData" border style="width: 100%" class="user-table">
        <el-table-column type="index" label="#" width="50">
        </el-table-column>
        <el-table-column prop="username" label="姓名">
        </el-table-column>
        <el-table-column prop="email" label="邮箱">
        </el-table-column>
        <el-table-column prop="create_time" label="电话">
        </el-table-column>
        <el-table-column prop="role_name" label="角色">
        </el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" active-value="true" inactive-value="false">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button type="primary" @click="edit(scope.$index,scope.row)" icon="el-icon-edit" size="mini"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
            <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页栏 -->
      <el-pagination @size-change="handleSizeChange()" @current-change="handleCurrentChange()" :current-page="queryInfo.pagenum" :page-sizes="[1,2,5,10]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="totalList" class="users-pag">
      </el-pagination>
    </el-form>
  </div>
</template>

<script>
import { getUsersInfo } from '@/api/users/users.js'
export default {
  name: 'Users',
  data() {
    return {
      // 行内表单数据 请求数据时参数
      queryInfo: {
        query: '',
        // 当前页码
        pagenum: 1,
        // 每页显示条数
        pagesize: 2
      },
      // 表格数据
      tableData: [],
      // 数据总条数
      totalList: 0
    }
  },
  created() {
    this.getUsersList()
  },
  methods: {
    // axios 请求用户数据列表
    async getUsersList() {
      const { data: res } = await getUsersInfo(this.queryInfo.query, this.queryInfo.pagenum, this.queryInfo.pagesize)
      this.tableData = res.users
      console.log(this.tableData)
      console.log(res)
      this.totalList = res.total
    },
    // 新增新用户
    addUser() {},
    //
    handleSizeChange() {
      console.log('每页条数')
    },
    handleCurrentChange() {
      console.log('当前页:')
    }
  }
}
</script>

<style lang="less" scoped>
.users {
  padding: 10px;
  width: 100%;
  height: 100%;

  .demo-form-inline {
    margin-top: 15px;
    padding: 15px;
    background-color: #fff;
    box-shadow: 2px 2px 5px #ccc;

    .user-table {
      margin-bottom: 15px;
    }
    .users-pag {
      text-align: center;
    }
  }
}
</style>