<template>
  <div class="goods_list">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 搜索框区域 -->
      <el-row>
        <el-col :span="8">
          <el-input v-model="queryInfo.query" @clear="getAllGoods" class="input-with-select" placeholder="请输入内容" clearable>
            <el-button slot="append" icon="el-icon-search" @click="getAllGoods"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" class="addGoodsBtn" @click="addGoods">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="goodsDataList" stripe style="width: 100%" border>
        <el-table-column type="index" label="#" width="60">
        </el-table-column>
        <el-table-column prop="goods_name" label="商品名称">
        </el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="120px">
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="120px">
        </el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="160px">
          <template slot-scope="scope">
            {{scope.row.add_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" @click="editGoods(scope.row)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" @click="deleteGoods(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[5,10,15,20]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total" background>
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getGoodsList, deleteGoods } from '@/api/goods/list.js'
export default {
  name: 'Goods_list',
  data() {
    return {
      // 商品列表查询参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      // 商品表格数据
      goodsDataList: []
    }
  },
  created() {
    this.getAllGoods()
  },
  methods: {
    // 获取全部商品列表
    async getAllGoods() {
      const res = await getGoodsList(this.queryInfo)
      this.goodsDataList = res.data.goods
      this.total = res.data.total
    },
    // 添加商品 事件
    addGoods() {
      this.$router.push('/home/goods/add')
    },
    // 编辑商品
    async editGoods(data) {
      this.$router.push('/home/goods/edit')
      window.sessionStorage.setItem('goodsId', data.goods_id)
    },
    // 编辑商品 确定按钮点击事件
    confEditGoods() {},
    // 删除商品
    async deleteGoods(data) {
      const deleteRes = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (deleteRes !== 'confirm') {
        return this.$message.info('取消了删除')
      }
      const res = await deleteGoods(data.goods_id)
      if (res.meta.status !== 200) {
        this.$message.error('删除商品失败')
      }
      this.$message.success('删除商品成功')
      this.getAllGoods()
    },
    // 监听页面数量变化事件
    handleSizeChange(newpagesize) {
      this.queryInfo.pagesize = newpagesize
      this.getAllGoods()
    },
    // 监听 页码数变化事件
    handleCurrentChange(newpagenum) {
      this.queryInfo.pagenum = newpagenum
      this.getAllGoods()
    }
  }
}
</script>

<style lang="less" scoped>
.goods_list {
  height: 100%;

  .el-card {
    .el-row {
      margin-bottom: 15px;

      .el-button {
        margin-left: 15px;
      }
    }

    .el-pagination {
      text-align: center;
    }
  }
}
</style>