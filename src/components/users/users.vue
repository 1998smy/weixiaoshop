<template>
  <div class="users">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/login' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 表单区域 -->
    <el-card class="box-card">
      <el-form :inline="true" :model="queryInfo" class="demo-form-inline">
        <!-- 搜索框区域 -->
        <el-form-item>
          <el-input v-model="queryInfo.query" class="input-with-select" clearable @clear="getUsersList" placeholder="请输入搜索内容">
            <el-button slot="append" icon="el-icon-search" @click="searchInfo(queryInfo.query)"></el-button>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addUserFormVisible=true">添加用户</el-button>
        </el-form-item>
        <!-- 表格区域 -->
        <el-table :data="tableData" border style="width: 100%" class="user-table">
          <el-table-column type="index" label="#" width="50">
          </el-table-column>
          <el-table-column prop="username" label="姓名">
          </el-table-column>
          <el-table-column prop="email" label="邮箱">
          </el-table-column>
          <el-table-column prop="mobile" label="电话">
          </el-table-column>
          <el-table-column prop="role_name" label="角色">
          </el-table-column>
          <el-table-column prop="mg_state" label="状态">
            <!-- 作用域插槽 -->
            <template slot-scope="scope">
              <el-switch v-model="scope.row.mg_state" @change="stateChange(scope.row)" active-value="true" inactive-value="false">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="300">
            <template slot-scope="scope">
              <!-- 修改用户信息 -->
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="editInfo(scope.row.id)"></el-button>
              <!-- 删除用户信息 -->
              <el-button type="danger" @click="deleteUser(scope.row.id)" icon="el-icon-delete" size="mini"></el-button>
              <!-- 分配角色 -->
              <el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
                <el-button type="warning" @click="setRole(scope.row)" icon="el-icon-setting" size="mini"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页栏 -->
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum" :page-sizes="[1,2,5,10]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="totalList" class="users-pag">
        </el-pagination>
      </el-form>
    </el-card>
    <!-- 添加用户对话框  一定要放在 页面最下方-->
    <el-dialog title="添加用户" :close="addUsersClosed" :visible.sync="addUserFormVisible" width="30%">
      <el-form ref="addUserForm" :model="addUserForm" :rules="addRules" class="demo-ruleForm dialog-form" label-width="65px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="addUserForm.phone"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addUserFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog title="修改用户" :close="editUsersClosed" :visible.sync="editUserVisible" width="30%">
      <el-form ref="editUserForm" :model="editUserForm" :rules="editRules" class="demo-ruleForm dialog-form" label-width="65px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editUserForm.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="editUserForm.phone"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editUserVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色对话框 -->
    <el-dialog title="分配角色" @closed="clearSetRole" :visible.sync="setRoleVisible" width="30%">
      <div>
        <p>当前的用户：{{ userInfo.username }}</p>
        <p>当前的角色：{{ userInfo.role_name }}</p>
        <p>
          分配新角色：
          <el-select v-model="selectedRoleId" placeholder="请选择角色">
            <el-option v-for="item in roleList" :key="item.id" :label="item.roleName" :value="item.id">
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveSetRoleId">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getUsersInfo, getUsersState, addUser, searchUserInfo, editUserInfo, deleteUser, setUserRole } from '@/api/users/users.js'
import { getRolesList } from '@/api/power/roles.js'
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
      totalList: 0,
      // 新增按钮 是否展示对话框
      addUserFormVisible: false,
      // 新增用户信息 表单数据
      addUserForm: {
        username: '',
        password: '',
        email: '',
        phone: ''
      },
      // 新增用户信息 验证规则
      addRules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' },
          { type: 'email', message: '请输入合法的邮箱地址', trigger: ['blur', 'change'] }
        ],
        phone: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/, message: '请输入合法的手机号', trigger: 'change' }
        ]
      },
      // 修改用户是否展示对话框
      editUserVisible: false,
      // 修改用户 数据
      editUserForm: {
        username: '',
        email: '',
        phone: '',
        id: 0
      },
      editRules: {
        email: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' },
          { type: 'email', message: '请输入合法的邮箱地址', trigger: ['blur', 'change'] }
        ],
        phone: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          { pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/, message: '请输入合法的手机号', trigger: 'change' }
        ]
      },
      // 分配角色 是否展示对话框
      setRoleVisible: false,
      // 要分配角色的信息
      userInfo: {},
      // 所有角色列表数据
      roleList: [],
      // 被选中的角色ID
      selectedRoleId: ''
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
      // console.log(this.tableData)
      // console.log(res)
      this.totalList = res.total
    },
    // 搜索框 搜索事件
    async searchInfo(query) {
      const { data: res } = await getUsersInfo(query, this.queryInfo.pagenum, this.queryInfo.pagesize)
      this.tableData = res.users
      this.totalList = res.total
    },
    // 添加用户的表单重置事件
    addUsersClosed() {
      // 重置表单
      this.$refs.addUserForm.resetFields()
    },
    // 添加用户 确定事件
    addUser() {
      this.$refs.addUserForm.validate(async vaild => {
        if (!vaild) return
        // 发起 添加用户请求
        const res = await addUser(this.addUserForm)
        if (res.meta.status !== 200) {
          this.$message.error('添加用户失败')
        }
        this.addUserFormVisible = false
        // 重新调用 获取用户列表数据
        this.getUsersList()
      })
    },
    // 监听 状态改变事件
    async stateChange(userinfo) {
      const res = await getUsersState(userinfo.id, userinfo.mg_state)
      console.log(res)
      if (res.meta.status !== 200) {
        this.$message.error('用户状态修改失败')
      }

      this.getUsersList()
    },
    // 修改用户事件(根据id查询数据)
    async editInfo(id) {
      this.editUserVisible = true

      // 根据id 查询用户信息
      const res = await searchUserInfo(id)
      if (res.meta.status !== 200) {
        this.$message.error('查询用户失败')
      }
      console.log(res)
      this.editUserForm.username = res.data.username
      this.editUserForm.email = res.data.email
      this.editUserForm.phone = res.data.mobile
      this.editUserForm.id = res.data.id
    },
    // 编辑用户的表单重置事件
    editUsersClosed() {
      this.$refs.editUserForm.resetFields()
    },
    // 确定 修改用户
    editUser() {
      this.$refs.editUserForm.validate(async vaild => {
        if (!vaild) return
        // 发起 修改用户请求
        const res = await editUserInfo(this.editUserForm.id, this.editUserForm.email, this.editUserForm.phone)
        if (res.meta.status !== 200) {
          this.$message.error('添加用户失败')
        }
        this.editUserVisible = false
        this.getUsersList()
      })
    },
    // 删除用户
    async deleteUser(id) {
      const confirmRes = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmRes !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      const deleteRes = await deleteUser(id)
      if (deleteRes.meta.status !== 200) {
        this.$message.error('删除用户失败')
      }
      this.$message.success('删除用户成功')
      this.getUsersList()
    },
    // 分配角色
    async setRole(userInfo) {
      this.userInfo = userInfo
      this.setRoleVisible = true

      // 获取所有角色数据
      const roleRes = await getRolesList()
      this.roleList = roleRes.data
    },
    // 点击 确定按钮，分配角色
    async saveSetRoleId() {
      if (!this.selectedRoleId) {
        this.$message.error('请选择要分配的角色')
      }
      // 发起 分配角色请求
      const res = await setUserRole(this.userInfo.id, this.selectedRoleId)
      console.log(res)
      if (res.meta.status !== 200) {
        this.$message.error('设置角色失败')
      }
      this.setRoleVisible = false
      // 重新获取列表
      this.getUsersList()
    },
    // 监听 分配角色对话框关闭事件
    clearSetRole() {
      // 清除 角色ID 和 角色信息
      this.selectedRoleId = ''
      this.userInfo = {}
    },
    // 监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      // 重新请求数据
      this.queryInfo.pagesize = newSize
      this.getUsersList()
    },
    // 监听 pagenum 改变的事件
    handleCurrentChange(newPage) {
      // 重新请求数据
      this.queryInfo.pagenum = newPage
      this.getUsersList()
    }
  }
}
</script>

<style lang="less" scoped>
.users {
  padding: 10px;
  width: 100%;
  height: 100%;

  .box-card {
    margin-top: 15px;
    .demo-form-inline {
      .user-table {
        margin-bottom: 15px;
      }
      .users-pag {
        text-align: center;
      }
    }
    .dialog-form {
      .el-form-item__content {
        margin-left: 0;
      }
    }
  }
}
</style>