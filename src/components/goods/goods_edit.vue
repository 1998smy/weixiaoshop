<template>
  <div class="goods-edit">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品编辑</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="content-card">
      <!-- 返回箭头 -->
      <el-page-header @back="goBack" content="">
      </el-page-header>
      <!-- 警告条 -->
      <el-alert title="编辑商品信息" type="info" center show-icon>
      </el-alert>
      <!-- 步骤条 -->
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 表单区域 -->
      <el-form ref="editGoodsForm" :model="editGoodsForm" :rules="editGoodsRules" label-position="top" label-width="100px">
        <!-- 标签页 -->
        <el-tabs v-model="activeIndex" :before-leave="beforeTabLeave" @tab-click="tabClicked" tab-position="left">
          <el-tab-pane label="基本信息" name="0">
            <!-- 表单输入框区域 -->
            <el-form-item label="商品信息" prop="goods_name">
              <el-input v-model="editGoodsForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="editGoodsForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="editGoodsForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="editGoodsForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader v-model="editGoodsForm.goods_cat" :options="goodsCateList" :props="cateProps" @change="selectedChange" clearable>
              </el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="item in manyTabData" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="cb" v-for="(cb,i) in item.attr_vals" :key="i" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyTabData" :key="item.attr_id">
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload class="upload-demo" :action="uploadUrl" :on-preview="handlePreview" :file-list="editGoodsForm.pics" :on-remove="handleRemove" :on-success="handleSuccess" list-type="picture" :headers="headersObj">
              <el-button size="small" type="primary">点击上传</el-button>
              {{ editGoodsForm.pics}}
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="editGoodsForm.goods_introduce">
            </quill-editor>
            <el-button type="primary" @click="editGoods" class="editGoodsBtn">确认修改</el-button>
          </el-tab-pane>
        </el-tabs>

      </el-form>
    </el-card>
  </div>
</template>

<script>
import { getGoodsById, editGoods, deleteGoods } from '@/api/goods/list.js'
import { getGoodsCate } from '@/api/goods/cate.js'
import { getCateAttributes } from '@/api/goods/params.js'
import _ from 'lodash'
export default {
  name: 'Goods-edit',
  data() {
    return {
      activeIndex: 0,
      editGoodsForm: {},
      editGoodsRules: {
        goods_name: [{ required: true, message: '商品名称不能为空', trigger: 'blur' }],
        goods_price: [{ required: true, message: '商品价格不能为空', trigger: 'blur' }],
        goods_number: [{ required: true, message: '商品数量不能为空', trigger: 'blur' }],
        goods_weight: [{ required: true, message: '商品重量不能为空', trigger: 'blur' }],
        goods_cat: [{ required: true, message: '请选择商品分类', trigger: 'blur' }]
      },
      // 商品分类数据
      goodsCateList: [],
      // 级联选择器的配置项
      cateProps: {
        expandTrigger: 'hover',
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      manyTabData: [],
      onlyTabData: [],
      // 上传图片的url地址
      uploadUrl: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 图片上传组件的headers 请求头对象
      headersObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 预览图片地址
      previewPath: '',
      picVisible: false
    }
  },
  created() {
    this.getGoodsById()
    this.getCateList()
  },
  methods: {
    // 根据id 查询商品
    async getGoodsById() {
      const goodsid = window.sessionStorage.getItem('goodsId')
      const res = await getGoodsById(goodsid)
      res.data.goods_cat = res.data.goods_cat.split(',').map(item => {
        return Number(item)
      })
      res.data.pics = res.data.pics.map(item => {
        return { url: item.pics_sma_url }
      })
      this.editGoodsForm = res.data
      console.log(res)
    },
    // 获取所有商品分类列表
    async getCateList() {
      const res = await getGoodsCate()
      if (res.meta.status !== 200) {
        this.$message.error('获取所有商品分类失败')
      }
      this.goodsCateList = res.data
    },
    // 级联选择器中选择改变 触发事件
    selectedChange() {
      // 只能选择三级，不能选择一级和二级
      if (this.editGoodsForm.goods_cat.length !== 3) {
        this.editGoodsForm.goods_cat = []
      }
    },
    // 标签页离开时，触发这个函数
    beforeTabLeave(activeName, oldActiveName) {
      if (oldActiveName === '0' && this.editGoodsForm.goods_cat.length !== 3) {
        this.$message.error('请选择商品分类')
        return false
      }
    },
    // 标签页被选中时触发
    async tabClicked() {
      // 商品参数
      if (this.activeIndex === '1') {
        const res = await getCateAttributes(this.cateId, 'many')
        if (res.meta.status !== 200) {
          this.$message.error('商品参数获取失败')
        }
        // 将 attr_vals 字符串转换成 数组
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(',')
        })
        this.manyTabData = res.data
      }
      // 商品属性
      if (this.activeIndex === '2') {
        const res = await getCateAttributes(this.cateId, 'only')
        if (res.meta.status !== 200) {
          this.$message.error('商品参数获取失败')
        }
        this.onlyTabData = res.data
      }
    },
    // 处理图片预览效果
    handlePreview(file) {
      this.previewPath = file.response.data.url
      this.picVisible = true
    },
    // 处理移出图片的操作
    handleRemove(file, fileList) {
      console.log('file', file)
      console.log('fileList', fileList)
      const detPicsInfo = file.response.data.tmp_path
      const i = this.editGoodsForm.pics.findIndex(x => x.pic === detPicsInfo)
      this.editGoodsForm.pics.splice(i, 1)
    },
    // 图片上传成功的函数
    handleSuccess(response) {
      console.log(response)
      const picInfo = { url: response.data.url, name: response.data.tmp_path }
      this.editGoodsForm.pics.push(picInfo)
    },
    // 确认 提交编辑商品
    editGoods() {
      this.$refs.editGoodsForm.validate(async vaild => {
        if (!vaild) {
          return this.$message.error('请填写必要的表单项！')
        }

        // 执行深拷贝
        const form = _.cloneDeep(this.editGoodsForm)
        // 将 goods_cat 数组转换成 字符串
        form.goods_cat = form.goods_cat.join(',')

        // 处理动态参数
        this.manyTabData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.editGoodsForm.attrs.push(newInfo)
        })

        // 处理静态属性
        this.onlyTabData.forEach(item => {
          const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals }
          this.editGoodsForm.attrs.push(newInfo)
        })
        form.attrs = this.editGoodsForm.attrs

        // 编辑商品请求
        const res = await editGoods(this.cateId, form)
        if (res.meta.status !== 200) {
          this.$message.error('商品修改失败')
        }
        this.$message.success('商品修改成功')

        // 删除原有商品
        const goodsid = window.sessionStorage.getItem('goodsId')
        await deleteGoods(goodsid)

        this.$router.push('/home/goods')
      })
    }
  },
  computed: {
    // 计算三级分类id
    cateId() {
      if (this.editGoodsForm.goods_cat.length === 3) {
        return this.editGoodsForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>

<style lang="less" scoped>
.goods-edit {
  .el-checkbox {
    margin: 0 10px 15px 0 !important;
  }
  .editGoodsBtn {
    margin-top: 10px;
  }
}
</style>