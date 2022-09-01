<template>
  <div class="orders">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 搜索区域 -->
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" @clear="getOrdersList" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="getOrdersList"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="ordersData" style="width: 100%" border stripe>
        <el-table-column type="index" label="#" width="80">
        </el-table-column>
        <el-table-column prop="order_number" label="订单编号">
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="80">
        </el-table-column>
        <el-table-column label="是否付款" width="120">
          <template slot-scope="scope">
            <!-- <el-button type="success" plain v-if="scope.row.pay_status === '1'" size="mini"></el-button>
            <el-button type="danger" plain v-else size="mini">未付款</el-button> -->
            <el-button :type="scope.$index%2 === 0?'success':'danger'" plain size="mini">{{scope.$index%2 === 0?'已付款':'未付款'}}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="是否发货">
          <template slot-scope="scope">
            <el-switch :value="scope.row.is_send=='是'?true:false" @change="sendStatus(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="下单时间">
          <template slot-scope="scope">
            {{scope.row.create_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" @click="editAdd(scope.row)"></el-button>
            <el-button type="success" icon="el-icon-location-outline" @click="checkProgress(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[5, 8, 10, 15]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
    <!-- 修改地址 对话框 -->
    <el-dialog title="修改地址" :visible.sync="editAddVisible" width="50%">
      <el-form :model="editAddForm" :rules="editAddRules" ref="editAddForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="原地址">
          <el-input v-model="editAddForm.consignee_addr" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader v-model="editAddForm.address1" :options="cityOptions"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="editAddForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="CancelEditAdd">取 消</el-button>
        <el-button type="primary" @click="cofEditAdd">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 物流进度 对话框 -->
    <el-dialog title="物流进度" :visible.sync="checkProVisible" width="50%">
      <el-timeline :reverse="false">
        <el-timeline-item v-for="(item, index) in progressInfo" :key="index" :timestamp="item.time">
          {{item.context}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import { getOrders, checkOrdersInfo, checkPogress, editStatus } from '@/api/orders/orders.js'
import cityOptions from '@/assets/js/city_data2017_element.js'
export default {
  name: 'Orders',
  data() {
    return {
      // 订单列表请求参数
      queryInfo: {
        // 搜索框输入内容
        query: '',
        pagenum: 1,
        pagesize: 10,
        // 用户ID
        user_id: '',
        consignee_addr: ''
      },
      // 订单数据数组
      ordersData: [],
      total: 0,
      editAddVisible: false,
      editAddForm: {
        order_id: 0,
        consignee_addr: '',
        address1: [],
        address2: ''
      },
      editAddRules: {
        address1: [{ required: true, message: '请选择省市区县', trigger: 'blur' }],
        address2: [{ required: true, message: '请填写详细地址', trigger: 'blur' }]
      },
      cityOptions,
      checkProVisible: false,
      progressInfo: []
    }
  },
  created() {
    this.getOrdersList()
  },
  methods: {
    // 获取订单数据列表
    async getOrdersList() {
      const res = await getOrders(this.queryInfo)
      if (res.meta.status !== 200) {
        this.$message.error('获取订单列表失败')
      }
      this.ordersData = res.data.goods
      this.total = res.data.total
    },
    // 页码数量变化触发 事件
    handleSizeChange(newPagesize) {
      this.queryInfo.pagesize = newPagesize
      this.getOrdersList()
    },
    // 页码改变触发 事件
    handleCurrentChange(newPagenum) {
      this.queryInfo.pagenum = newPagenum
      this.getOrdersList()
    },
    // 修改地址按钮 事件
    async editAdd(row) {
      this.editAddForm.order_id = row.order_id
      const res = await checkOrdersInfo(this.editAddForm.order_id)
      this.editAddForm.consignee_addr = res.data.consignee_addr
      this.editAddVisible = true
    },
    // 取消按钮，取消修改
    CancelEditAdd() {
      this.$refs.editAddForm.resetFields()
      this.editAddVisible = false
    },
    // 确定按钮，修改地址
    cofEditAdd() {
      // 表单验证预处理
      this.$refs.editAddForm.validate(valid => {
        if (!valid) {
          this.$message.error('请输入地址')
          return
        }
        const ordersAdd = (this.editAddForm.address1 + this.editAddForm.address2).split(',').join('')
        this.editAddForm.consignee_addr = ordersAdd
        this.queryInfo.consignee_addr = ordersAdd
        this.editAddVisible = false
        this.getOrdersList()
      })
    },
    // 物流进度
    async checkProgress() {
      const res = await checkPogress()
      if (res.meta.status == 200) {
        this.checkProVisible = true
        this.progressInfo = res.data
      } else {
        this.$message.error('获取物流信息失败')
      }
    },
    // 发货状态修改
    async sendStatus(row) {
      let obj = row
      obj.is_send = row.is_send === '否' ? '1' : '0'
      const res = await editStatus(row.order_id, obj)
      if (res.meta.status == 201) {
        this.$message.success('状态修改成功')
      } else {
        this.$message.error('状态修改失败')
      }
      this.getOrdersList()
    }
  }
}
</script>

<style lang="less" scoped>
.orders {
  .el-table {
    margin-top: 15px;
  }
  .el-pagination {
    text-align: center;
  }
}
</style>