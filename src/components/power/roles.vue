<template>
  <div class="roles">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card">
      <!-- 添加角色 -->
      <el-button type="primary">添加角色</el-button>
      <!-- 表格区域 -->
      <el-table :data="rolesData" stripe style="width: 100%" border class="roles-table">
        <el-table-column type="expand">
          <!-- 展开行 -->
          <template slot-scope="scope">
            <!-- 一级 -->
            <el-row v-for="(item,i) in scope.row.children" :key="item.id" :class="['bdbottom','vcenter', i === 0 ? 'bdtop' :'']">
              <el-col :span="5">
                <el-tag closable @close="deleteRolesTags(scope.row,item.id)" class="rolesTag">{{ item.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级和三级 -->
              <el-col :span="19">
                <!-- 二级 -->
                <el-row v-for="(item2,i2) in item.children" :key="item2.id" :class="['vcenter', i2 === 0 ? '' :'bdtop']">
                  <el-col :span="6">
                    <el-tag type="success" @close="deleteRolesTags(scope.row,item2.id)" closable class="rolesTag">{{ item2.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级 -->
                  <el-col :span="18">
                    <el-tag type="warning" @close="deleteRolesTags(scope.row,item3.id)" closable v-for="item3 in item2.children" :key="item3.id" class="rolesTag">{{ item3.authName }}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#" width="100px">
        </el-table-column>
        <el-table-column prop="roleName" label="角色名称">
        </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述">
        </el-table-column>
        <el-table-column prop="level" label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button type="danger">删除</el-button>
            <el-button type="warning" @click="showRightsDialog(scope.row)" icon="el-icon-setting">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配角色权限 对话框 -->
    <el-dialog title="提示" @close="clearKeysData" :visible.sync="rightsDialogVisible" width="30%">
      <el-tree :data="rightsList" :props="defaultProps" :default-checked-keys="rightsKeys" ref="rigTree" show-checkbox node-key="id" default-expand-all></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getRightsList } from '@/api/power/rights.js'
import { getRolesList, deleteRoleRight, conRolesRights } from '@/api/power/roles.js'
export default {
  name: 'Roles',
  data() {
    return {
      // 所有角色列表(角色+权限)
      rolesData: [],
      // 所有权限列表数据
      rightsList: [],
      // 分配权限 是否展示对话框
      rightsDialogVisible: false,
      // 树形控件的属性绑定对象
      defaultProps: {
        label: 'authName',
        children: 'children'
      },
      // 默认展开的权限的key数组
      rightsKeys: [],
      // 角色ID
      roleId: ''
    }
  },
  created() {
    this.getALlRoles()
  },
  methods: {
    // 获取所有角色列表(角色+权限)
    async getALlRoles() {
      const res = await getRolesList()
      this.rolesData = res.data
    },
    // 删除角色指定权限
    async deleteRolesTags(role, rightId) {
      const confirmRes = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmRes !== 'confirm') {
        return this.$message.info('取消了删除')
      }
      // 请求删除
      const res = await deleteRoleRight(role.id, rightId)
      console.log(res)
      if (res.meta.status === 200) {
        this.$message.success('权限取消成功')
        role.children = res.data
      }
    },
    // 展示 分配权限 对话框
    async showRightsDialog(role) {
      this.roleId = role.id
      // 请求所有权限列表
      const res = await getRightsList('tree')
      if (res.meta.status !== 200) {
        this.$message.error('获取权限数据失败')
      }
      this.rightsList = res.data

      // 调用 getDefKeys 递归函数，显示已有权限
      this.getDefKeys(role, this.rightsKeys)

      this.rightsDialogVisible = true
    },
    // 默认勾选角色已有的权限（三级）
    // 通过递归的形式，获取角色下所有的三级权限，并保存到 rightsKeys 数组中
    getDefKeys(node, arr) {
      // 如果当前node节点不包含 children，则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      // 递归继续调用 getDefKeys 函数，直到没有子节点为止
      node.children.forEach(item => {
        this.getDefKeys(item, arr)
      })
    },
    // 关闭 对话框时，清空权限数组
    clearKeysData() {
      this.rightsKeys = []
    },
    // 分配权限后 发起更新请求
    async confRights() {
      const keys = [...this.$refs.rigTree.getCheckedKeys(), ...this.$refs.rigTree.getHalfCheckedKeys()]
      const rids = keys.join(',')
      const res = await conRolesRights(this.roleId, rids)
      if (res.meta.status !== 200) {
        this.$message.error('权限更新失败')
      }
      this.rightsDialogVisible = false
      // 重新获取角色列表
      this.getALlRoles()
    }
  }
}
</script>

<style lang="less" scoped>
.roles {
  padding: 10px;
  height: 100%;
  width: 100%;

  .box-card {
    margin-top: 15px;
    padding: 10px;

    .roles-table {
      margin-top: 20px;

      .rolesTag {
        margin: 7px;
      }
      .bdbottom {
        border-bottom: 1px solid #eee;
      }
      .bdtop {
        border-top: 1px solid #eee;
      }
    }
  }
}
</style>