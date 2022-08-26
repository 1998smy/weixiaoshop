<template>
  <div class="goods_cate">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="content-card">
      <!-- 添加分类 -->
      <el-button type="primary" @click="addCate">添加分类</el-button>
      <!-- 表格 -->
      <tree-table :data="goodsCateList" :columns="columns" show-index index-text="#" border :selection-type="false" :expand-type="false" :show-row-hover="false" class="tree-table">
        <!-- 自定义列模板 -->
        <!-- 是否有效 -->
        <template slot="isOk" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color:#67C23A;font-size:16px"></i>
          <i class="el-icon-error" v-else style="color:red"></i>
        </template>
        <!-- 排序 -->
        <template slot="sort" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" @click="editCate(scope.row)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" @click=deleteCate(scope.row)>删除</el-button>
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[3,5,10,15]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加分类 对话框 -->
    <el-dialog title="添加分类" :visible.sync="addCateDigVisible" width="30%">
      <el-form ref="addCateForm" :rules="addCateRules" :model="addCateForm" label-width="80px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader v-model="selectedKeys" :options="parentCateList" :props="cascaderProps" @change="parentCateChange" clearable></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelCate">取 消</el-button>
        <el-button type="primary" @click="cofAddCate()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑分类 对话框 -->
    <el-dialog title="编辑分类" :visible.sync="editCateDigVisible" width="30%">
      <el-form ref="editCateForm" :rules="editCateRules" :model="editCateForm" label-width="80px">
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader v-model="selectedKeys" :options="parentCateList" :props="cascaderProps" @change="parentCateChange" clearable></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDigVisible = false">取 消</el-button>
        <el-button type="primary" @click="cofEditCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getGoodsCate, addGoodsCate, editGoodsCate, deleteGoodsCate } from '@/api/goods/cate.js'
import App from '@/App.vue'
export default {
  name: 'Goods_cate',
  data() {
    return {
      // 添加分类 对话框 是否展示
      addCateDigVisible: false,
      // 获取所有分类参数
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 10
      },
      // 所有分类数据列表
      goodsCateList: [],
      // 表格各列的数据
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name',
          width: '300px'
        },
        // 自定义列模板
        {
          label: '是否有效',
          prop: 'cat_deleted',
          minWidth: '200px',
          type: 'template',
          template: 'isOk'
        },
        {
          label: '排序',
          prop: 'cat_level',
          minWidth: '200px',
          type: 'template',
          template: 'sort'
        },
        {
          label: '操作',
          minWidth: '200px',
          type: 'template',
          template: 'opt'
        }
      ],
      // 数据总条数
      total: 0,
      // 添加分类 是否展示对话框
      addCateDigVisible: false,
      // 添加分类 表单数据
      addCateForm: {
        cat_pid: 0,
        cat_name: '',
        cat_level: 0
      },
      addCateRules: {
        cat_name: [{ required: true, message: '请输入分类名称', teigger: 'blur' }]
      },
      // 父级分类的列表
      parentCateList: [],
      // 选中的父级分类的id数组
      selectedKeys: [],
      // 级联选择器的配置对象
      cascaderProps: {
        // 任意选择一级
        checkStrictly: 'true',
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      editCateDigVisible: false,
      editCateForm: {
        cat_id: 0,
        cat_name: ''
      },
      editCateRules: {}
    }
  },
  created() {
    this.getAllCateList()
  },
  methods: {
    // 获取所有分类数据列表
    async getAllCateList() {
      const res = await getGoodsCate(this.queryInfo)
      if (res.meta.status !== 200) {
        this.$message.error('获取分类列表失败')
      }
      this.goodsCateList = res.data.result
      this.total = res.data.total
    },
    // 添加分类
    async addCate() {
      this.addCateDigVisible = true
      // 获取父级分类的数据列表
      const res = await getGoodsCate({ type: 2 })
      if (res.meta.status !== 200) {
        this.$message.error('获取父级分类列表失败')
      }
      this.parentCateList = res.data
      console.log(this.parentCateList)
    },
    // 取消按钮 重置事件
    cancelCate() {
      // 表单重置
      this.$refs.addCateForm.resetFields()
      this.addCateDigVisible = false
    },
    // 添加分类 确定按钮 请求添加事件
    async cofAddCate() {
      const res = await addGoodsCate(this.addCateForm)
      if (res.meta.status !== 201) {
        this.$message.error('添加分类失败')
      }
      this.addCateDigVisible = false
      // 表单重置
      this.$refs.addCateForm.resetFields()
      this.getAllCateList()
    },
    // 级联选择器的选择项变化触发函数
    parentCateChange() {
      if (this.selectedKeys.length > 0) {
        // 父级分类的id
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        // 当前分类的等级
        this.addCateForm.cat_level = this.selectedKeys.length
        return
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    // 编辑分类
    async editCate(data) {
      console.log(data)
      this.editCateDigVisible = true
      this.editCateForm.cat_name = data.cat_name
      this.editCateForm.cat_id = data.cat_id
      // 重新请求分类数据 展示在选择器中
      const cateres = await getGoodsCate({ type: 2 })
      if (cateres.meta.status !== 200) {
        this.$message.error('获取父级分类列表失败')
      }
      this.parentCateList = cateres.data
      // 请求修改分类
    },
    // 确认按钮 事件
    async cofEditCate() {
      const res = await editGoodsCate(this.editCateForm.cat_id, this.editCateForm.cat_name)
      if (res.meta.status !== 200) {
        this.$message.error('分类修改失败')
      }
      this.getAllCateList()
      this.editCateDigVisible = false
    },
    // 删除分类
    async deleteCate(data) {
      const deleteRes = await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (deleteRes !== 'confirm') {
        return this.$message.info('取消了删除')
      }
      // 发起删除分类请求
      const res = await deleteGoodsCate(data.cat_id)
      console.log(res)
      if (res.meta.status !== 200) {
        this.$message.error('删除分类失败')
      }
      this.getAllCateList()
    },
    // 页面展示数据 监听事件
    handleSizeChange(newpagesize) {
      this.queryInfo.pagesize = newpagesize
      this.getAllCateList()
    },
    // 页码 监听事件
    handleCurrentChange(newpagenum) {
      this.queryInfo.pagenum = newpagenum
      this.getAllCateList()
    }
  },
  components: { App }
}
</script>

<style lang="less" scoped>
.goods_cate {
  height: 100%;

  .tree-table {
    margin-top: 15px;
  }

  .el-cascader {
    width: 100%;
  }
  .el-pagination {
    text-align: center;
  }
}
</style>