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
    <!-- 编辑商品 对话框 -->
    <el-dialog title="添加商品" :visible.sync="editGoodsDigVisible" width="50%">
      <el-form ref="editGoodsForm" :rules="editGoodsRules" :model="editGoodsForm" label-width="110px">
        <el-form-item label="商品ID" prop="goods_id">
          <el-input v-model="editGoodsForm.goods_id" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="editGoodsForm.goods_name" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="商品价格(元)" prop="goods_price">
          <el-input v-model="editGoodsForm.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="商品数量" prop="goods_number">
          <el-input v-model="editGoodsForm.goods_number"></el-input>
        </el-form-item>
        <el-form-item label="商品重量" prop="goods_weight">
          <el-input v-model="editGoodsForm.goods_weight"></el-input>
        </el-form-item>
        <el-form-item label="商品介绍" prop="goods_introduce">
          <el-input v-model="editGoodsForm.goods_introduce"></el-input>
        </el-form-item>
        <el-form-item label="商品图片" prop="pics">
          <!-- <el-upload class="avatar-uploader" action="https://jsonplaceholder.typicode.com/posts/">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload> -->
        </el-form-item>
        <el-form-item label="商品参数" prop="attrs">
          <el-input v-model="editGoodsForm.attrs"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editGoodsDigVisible = false">取 消</el-button>
        <el-button type="primary" @click="confEditGoods">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getGoodsList, getGoodsById, deleteGoods } from '@/api/goods/list.js'
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
      goodsDataList: [],
      editGoodsDigVisible: false,
      editGoodsForm: {
        goods_id: 0,
        goods_name: '',
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_introduce: '',
        pics: '',
        attrs: ''
      },
      editGoodsRules: {
        goods_name: [{ required: true, message: '商品名称不能为空', trigger: 'blur' }],
        goods_price: [{ required: true, message: '商品价格不能为空', trigger: 'blur' }],
        goods_number: [{ required: true, message: '商品数量不能为空', trigger: 'blur' }],
        goods_weight: [{ required: true, message: '商品重量不能为空', trigger: 'blur' }]
      }
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
      const res = await getGoodsById(data.goods_id)
      this.editGoodsForm.goods_id = res.data.goods_id
      this.editGoodsForm.goods_name = res.data.goods_name
      this.editGoodsForm.goods_number = res.data.goods_number
      this.editGoodsForm.goods_price = res.data.goods_price
      this.editGoodsForm.goods_weight = res.data.goods_weight
      this.editGoodsForm.goods_weight = res.data.goods_weight
      // this.editGoodsForm.goods_introduce = res.data.goods_introduce
      // this.editGoodsForm.attrs = res.data.attrs
      // this.editGoodsForm.pics = res.data.pics

      this.editGoodsDigVisible = true
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
      console.log(res)
      if (res.meta.status !== 200) {
        this.$message.error('删除商品失败')
      }
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