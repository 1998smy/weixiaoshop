<template>
  <div class="home">
    <el-container class="home-container">
      <!-- 头部导航栏 -->
      <el-header class="home-header">
        <div class="home-left">
          <img src="../../assets/heima.png" alt="">
          <span>电商后台管理系统</span>
        </div>
        <div class="home-right">
          <img src="../../assets/manager.jpg" alt="">
          <span>{{ username }}，您好</span>
          <el-button type="info" size="mini" round @click="loginOut">退出</el-button>
        </div>
      </el-header>
      <el-container class="main-container">
        <!-- 左侧菜单栏 -->
        <el-aside :width="isCollapse ? '64px': '200px'">
          <!-- 折叠菜单按钮 -->
          <div class="toggle-button" @click="foldChange"> | | |</div>
          <!-- 导航菜单 -->
          <el-menu class="el-menu-vertical-demo" :default-active="defaultAct" :collapse="isCollapse" router unique-opened :collapse-transition="false" @select="acticeMenu" background-color="#323743" text-color="#fff" active-text-color="#409EFF">
            <el-submenu :index="item.id + ''" v-for="item in menusLists" :key="item.id">
              <template slot="title">
                <i :class="iconsObj[item.id]"></i>
                <span slot="title">{{item.authName}}</span>
              </template>
              <el-menu-item :index="'/home/'+ subItem.path" v-for="subItem in item.children" :key="subItem.id">
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span slot="title">{{subItem.authName}}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <!-- 右侧主体栏 -->
        <el-main style="background-color: #E9EEF3;">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { getMenus } from '@/api/home/home.js'
export default {
  name: 'Home',
  data() {
    return {
      username: '',
      // 左侧菜单数据列表
      menusLists: [],
      iconsObj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      // 当前激活菜单的 index
      defaultAct: '',
      // 是否折叠侧边栏
      isCollapse: false
    }
  },
  created() {
    this.getMenuList()
    this.username = window.sessionStorage.getItem('username')
    if (window.location.href.split('#')[1] == ('/home/goods/add' || '/home/goods/edit')) {
      this.defaultAct = '/home/goods'
    } else {
      this.defaultAct = window.location.href.split('#')[1]
    }
  },
  methods: {
    // 退出事件
    async loginOut() {
      const deleteRes = await this.$confirm('是否退出首页, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (deleteRes !== 'confirm') {
        return this.$message.info('取消了删除')
      }

      window.sessionStorage.removeItem('token')
      window.sessionStorage.removeItem('username')
      this.$message.success('退出成功')
      this.$router.push('/login')
    },
    // 获取左侧菜单栏
    async getMenuList() {
      const { data: res } = await getMenus()
      this.menusLists = res
    },
    // 点击按钮 折叠菜单事件
    foldChange() {
      this.isCollapse = !this.isCollapse
    },
    // 菜单激活事件
    acticeMenu(index, indexPath) {
      this.defaultAct = index
    }
  }
}
</script>

<style lang="less" scoped>
.home {
  height: 100vh;
  background-color: rgb(55, 61, 63);

  .home-container {
    height: 100%;

    .home-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 65px;
      .home-left {
        display: flex;
        align-items: center;
        img {
          width: 40px;
          height: 40px;
        }
        span {
          margin-left: 15px;
          color: #fff;
          font-weight: 600;
          font-size: 20px;
        }
      }
      .home-right {
        display: flex;
        align-items: center;

        img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
        }
        span {
          margin-left: 15px;
          margin-right: 15px;
          color: #fff;
        }
      }
    }
    .main-container {
      max-height: 100%;
      height: calc(100% - 60px);
      .el-aside {
        height: calc(100% - 0px);
      }
    }

    .toggle-button {
      height: 24px;
      background-color: #4a5064;
      color: #fff;
      text-align: center;
      font-size: 10px;
      line-height: 24px;
      cursor: pointer;
    }
    .iconfont {
      margin-right: 10px;
    }
    .el-menu {
      border: 0;
    }
  }
}
</style>