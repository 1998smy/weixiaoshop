<template>
  <div class="roles">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="content-card">
      <!-- 添加角色 -->
      <el-button type="primary" @click="addRoleDigVisible = true">添加角色</el-button>
      <!-- 表格区域 -->
      <el-table :data="rolesData" stripe style="width: 100%" border>
        <!-- 展开行 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- 一级 -->
            <el-row v-for="(item,i) in scope.row.children" :key="item.id" :class="['bdbottom','vcenter', i === 0 ? 'bdtop' :'']">
              <el-col :span="5">
                <el-tag closable @close="deleteRolesTags(scope.row,item.id)" class="rolesTag">{{ item.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
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
            <el-button type="primary" icon="el-icon-edit" @click="editRole(scope.row)">编辑</el-button>
            <el-button type="danger" @click="deteleRole(scope.row.id)">删除</el-button>
            <el-button type="warning" @click="showRightsDialog(scope.row)" icon="el-icon-setting">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色 对话框 -->
    <el-dialog title="添加角色" :visible.sync="addRoleDigVisible" @close="addRoleClosed" width="30%">
      <el-form ref="addRoleForm" :rules="addRoleRules" :model="addRoleForm" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleDigVisible = false">取 消</el-button>
        <el-button type="primary" @click="cofAddInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色 对话框 -->
    <el-dialog title="编辑角色" :visible.sync="editRoleDigVisible" width="30%">
      <el-form ref="editRoleForm" :rules="editRoleRules" :model="editRoleForm" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRoleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="editRoleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoleDigVisible = false">取 消</el-button>
        <el-button type="primary" @click="cofEditInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色权限 对话框 -->
    <el-dialog title="提示" @close="clearKeysData" :visible.sync="rightsDialogVisible" width="30%">
      <el-tree :data="rightsList" :props="defaultProps" :default-checked-keys="rightsKeys" ref="rigTree" show-checkbox node-key="id" default-expand-all></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rightsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getRightsList } from '@/api/power/rights.js'
import { getRolesList, deleteRoleRight, conRolesRights, addRole, editRole, deleteRole } from '@/api/power/roles.js'
export default {
  name: 'Roles',
  data() {
    return {
      // 所有角色列表(角色+权限)
      rolesData: [],
      // 展开行中 删除指定权限后的数组
      deleteTagsRoles: [],
      // 添加角色 对话框是否展示
      addRoleDigVisible: false,
      // 添加用户表单数据
      addRoleForm: {
        roleName: '',
        roleDesc: ''
      },
      addRoleRules: {
        roleName: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
      },
      // 编辑角色 对话框是否展示
      editRoleDigVisible: false,
      editRoleForm: {
        roleName: '',
        roleDesc: ''
      },
      editRoleRules: {
        roleName: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
      },
      editRoleId: 0,
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
    // 添加角色 表单重置事件
    addRoleClosed() {
      this.$refs.addRoleForm.resetFields()
      // this.addRoleForm = this.$options()
    },
    // 添加用户 确定按钮事件（请求添加角色）
    async cofAddInfo() {
      // 请求 添加用户信息
      const res = await addRole(this.addRoleForm)
      if (res.meta.status !== 201) {
        this.$message.error('添加角色失败')
      }
      this.addRoleDigVisible = false
      this.$message.success('添加角色成功')
      // 重新获取角色列表
      this.getALlRoles()
    },
    // 编辑角色
    editRole(role) {
      this.editRoleDigVisible = true
      this.editRoleId = role.id
      this.editRoleForm.roleName = role.roleName
      this.editRoleForm.roleDesc = role.roleDesc
    },
    // 确定按钮事件  编辑角色请求
    async cofEditInfo() {
      // 发起编辑请求
      const res = await editRole(this.editRoleId, this.editRoleForm)
      if (res.meta.status !== 200) {
        this.$message.error('修改角色失败')
      }
      this.editRoleDigVisible = false
      this.$message.success('修改角色成功')
      this.getALlRoles()
    },
    // 删除角色
    async deteleRole(id) {
      const deleteRes = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (deleteRes !== 'confirm') {
        return this.$message.info('取消了删除')
      }
      // 发起 删除请求
      const res = await deleteRole(id)
      if (res.meta.status !== 200) {
        this.$message.error('删除角色失败')
      }
      this.$message.success('删除角色成功')
      this.getALlRoles()
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
      // 请求删除指定权限
      const res = await deleteRoleRight(role.id, rightId)
      if (res.meta.status !== 200) {
        this.$message.error('权限取消失败')
      }
      this.$message.success('权限取消成功')

      // 如果二级权限下没有三级权限，则不展示该二级权限
      role.children = res.data
      this.getALlRoles()
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
      this.$message.success('权限更新成功')

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
</style>