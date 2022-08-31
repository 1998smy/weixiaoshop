<template>
  <div class="goods_params">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片吗区域 -->
    <el-card>
      <!-- 警告框 -->
      <el-alert title="注意：只允许为第三级分类设置相关参数！" :closable="false" type="warning" show-icon>
      </el-alert>
      <!-- 选择商品分类 -->
      <el-row class="row-card">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 级联选择器 -->
          <el-cascader v-model="seletedCatekeys" :options="goodsCatesList" :props="seletedCateProps" @change="handleChange"></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" :disabled="isDisabled" @click="addParamsVisible=true">添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyTabsData" style="width: 100%">
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" @close="closeTags(i,scope.row)" closable class="table-tag">{{item}}</el-tag>
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showNewTags(scope.row)">添加新参数</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#" width="180">
            </el-table-column>
            <el-table-column prop="attr_name" label="参数名称" width="180">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit" @click="editParams(scope.row.attr_id)">编辑</el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteparams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" :disabled="isDisabled" @click="addParamsVisible=true">添加属性</el-button>
          <!-- 静态属性表格 -->
          <el-table :data="onlyTabsDatd" style="width: 100%">
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <el-tag v-for="(item,i) in scope.row.attr_vals" :key="i" @close="closeTags(i,scope.row)" closable class="table-tag">{{item}}</el-tag>
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showNewTags(scope.row)">添加新参数</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#" width="180">
            </el-table-column>
            <el-table-column prop="attr_name" label="属性名称" width="180">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit" @click="editParams(scope.row.attr_id)">编辑</el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteparams(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加 动态参数/静态属性对话框 -->
    <el-dialog :title="'添加' + titleText " :visible.sync="addParamsVisible" @close="addDigClosed" width="50%">
      <el-form ref="addParamsForm" :model="addParamsForm" :rules="addParamsRules" label-width="80px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="paramsDigVisible = false">取 消</el-button>
        <el-button type="primary" @click="cofAddParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改参数 对话框 -->
    <el-dialog :title="'修改' + titleText " :visible.sync="editParamsVisible" @close="editDigClosed" width="50%">
      <el-form ref="editParamsForm" :model="editParamsForm" :rules="editParamsRules" label-width="80px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editParamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editParamsVisible = false">取 消</el-button>
        <el-button type="primary" @click="conEditParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getGoodsCate } from '@/api/goods/cate.js'
import { getCateAttributes, addParams, getParamsById, editParams, deleteParams } from '@/api/goods/params.js'
export default {
  name: 'Goods_params',
  data() {
    return {
      // 所有商品分类
      goodsCatesList: [],
      // 级联选择器双向绑定的数组
      seletedCatekeys: [],
      // 级联选择器的配置
      seletedCateProps: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 标签页 默认选中标签
      activeName: 'many',
      // 按钮 是否禁用
      isDisabled: false,
      manyTabsData: [],
      onlyTabsDatd: [],
      // 控制按钮与文本框的切换显示
      inputVisible: false,
      // 文本框的内容
      inputValue: '',
      // 添加参数
      addParamsVisible: false,
      addParamsForm: {
        attr_name: ''
      },
      addParamsRules: {
        attr_name: [{ required: true, message: '请输入参数名称', trigger: 'blur' }]
      },
      // 修改参数
      editParamsVisible: false,
      editParamsForm: {
        attrId: 0,
        attr_name: ''
      },
      editParamsRules: {
        attr_name: [{ required: true, message: '请输入参数名称', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getGoodsCateList()
  },
  methods: {
    // 获取所有商品分类
    async getGoodsCateList() {
      const res = await getGoodsCate()
      if (res.meta.status !== 200) {
        this.$message.error('获取商品分类失败')
      }
      this.goodsCatesList = res.data
    },
    // 级联选择器选中触发函数
    handleChange() {
      if (this.seletedCatekeys.length !== 3) {
        this.seletedCatekeys = []
        this.isDisabled = true
        return
      }
      this.getCateParamsList()
    },
    // Tabs 标签页点击事件的处理函数
    handleClick() {
      this.getCateParamsList()
    },
    // 获取 分类参数列表
    async getCateParamsList() {
      const res = await getCateAttributes(this.cateId, this.activeName)
      if (res.meta.status !== 200) {
        this.$message.error('获取参数列表失败')
      }

      // 将 attr_vals 字符串转为 数组
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
        item.inputVisible = false
        item.inputValue = ''
      })
      if (this.activeName === 'many') {
        this.manyTabsData = res.data
      } else {
        this.onlyTabsDatd = res.data
      }
    },
    // 添加新标签参数
    showNewTags(row) {
      row.inputVisible = true
      // 让文本框自动获取焦点
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 文本框失去焦点/按下enter键 触发事件
    handleInputConfirm(row) {
      // 判断输入的字符串长度是否为0
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      // 将输入的内容 添加到 attr_vals 中
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false

      // 将新输入的参数项 添加到数据库中
      this.saveNewTagsParams(row)
    },
    // 请求 保存 先标签参数
    async saveNewTagsParams(row) {
      // 将添加的标签 存到数据库中
      const res = await editParams(this.cateId, row.attr_id, row.attr_name, row.attr_sel, row.attr_vals.join(' '))
      if (res.meta.status !== 200) {
        this.$message.error('参数项更新失败')
      }
      this.$message.success('参数项更新成功')
    },
    // 删除标签参数 事件
    closeTags(i, row) {
      row.attr_vals.splice(i, 1)
      this.saveNewTagsParams(row)
    },
    // 添加参数 表单重置事件
    addDigClosed() {
      this.$refs.addParamsForm.resetFields()
    },
    // 确认按钮 添加参数/属性
    cofAddParams() {
      // 表单数据预处理
      this.$refs.addParamsForm.validate(async valid => {
        if (!valid) {
          return
        }
        const res = await addParams(this.cateId, this.addParamsForm.attr_name, this.activeName)
        if (res.meta.status !== 201) {
          this.$message.error('添加参数失败')
        }
        this.$message.success('添加参数成功')
        this.getCateParamsList()
        this.addParamsVisible = false
      })
    },
    // 修改参数 按钮
    async editParams(id) {
      this.editParamsVisible = true
      // 根据 id查询参数列表
      const res = await getParamsById(this.cateId, id, this.activeName)
      this.editParamsForm.attr_name = res.data.attr_name
      this.editParamsForm.attrId = id
    },
    // 修改参数 表单重置事件
    editDigClosed() {
      this.$refs.editParamsForm.resetFields()
    },
    // 确定 修改参数/属性
    async conEditParams() {
      // 请求 修改参数
      const res = await editParams(this.cateId, this.editParamsForm.attrId, this.editParamsForm.attr_name, this.activeName)
      if (res.meta.status !== 200) {
        this.$message.error('修改参数失败')
      }
      this.$message.success('修改参数成功')
      this.getCateParamsList()
      this.editParamsVisible = false
    },
    // 删除参数
    async deleteparams(attrId) {
      const res = await deleteParams(this.cateId, attrId)
      if (res.meta.status !== 200) {
        this.$message.error('删除参数失败')
      }
      this.$message.success('删除参数成功')
      this.getCateParamsList()
    }
  },
  computed: {
    // 获取 当前选中的分类id
    cateId() {
      if (this.seletedCatekeys.length === 3) {
        return this.seletedCatekeys[2]
      }
      return null
    },
    titleText() {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    }
  }
}
</script>

<style lang="less" scoped>
.goods_params {
  .row-card {
    margin: 15px 0;
  }

  .table-tag {
    margin: 10px;
  }
  .input-new-tag {
    width: 120px;
  }
}
</style>