<template>
  <div
    class="sidebar-logo-container"
    :class="{ collapse: collapse }"

  >
    <!-- <transition name="sidebarLogoFade">
      <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/">
          <div class="logo_img">
        <img src="@/assets/menu_bar.png" alt="">
      </div>
        <img v-if="logo" :src="logo" class="sidebar-logo">

        <h1 v-else class="sidebar-title" :style="{ color: sideTheme === 'theme-dark' ? variables.sidebarTitle : variables.sidebarLightTitle }">{{ title }} </h1>
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <img v-if="logo" :src="logo" class="sidebar-logo">
        <h1 class="sidebar-title" :style="{ color: sideTheme === 'theme-dark' ? variables.sidebarTitle : variables.sidebarLightTitle }">{{ title }} </h1>
      </router-link>
    </transition> -->
       <div class="HeaderMain_left">
        <img class="logo_img" :src="this.theme=='red-theme'?require('../../../assets/logo/logo-red.png'):require('../../../assets/logo/logo.png')" alt="">
    </div>
    <el-dropdown
      class="avatar-container right-menu-item hover-effect"
      trigger="click"
    >
      <div class="avatar-wrapper">
        <img :src="avatar" class="user-avatar" />
        <i class="el-icon-caret-bottom" />
      </div>
      <el-dropdown-menu slot="dropdown">
        <router-link to="/newProfile" target="_blank">
          <el-dropdown-item>个人中心</el-dropdown-item>
        </router-link>
         <el-dropdown-item @click.native="setting = true">
          <span>布局设置</span>
       </el-dropdown-item>
        <el-dropdown-item divided @click.native="logout">
          <span>退出登录</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import logoImg from "@/assets/menu_bar.png";
import variables from "@/styles/variables.scss";
import { mapGetters } from "vuex";

export default {
  name: "SidebarLogo",
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    ...mapGetters(["sidebar", "avatar", "device"]),
    setting: {
      get() {
        return this.$store.state.settings.showSettings;
      },
      set(val) {
        this.$store.dispatch("settings/changeSetting", {
          key: "showSettings",
          value: val
        });
      }
    },
    variables() {
      return variables;
    },
    sideTheme() {
      return this.$store.state.settings.sideTheme;
    },
    // getLogoImg(){
    //   // return `../../../assets/logo/${window.localStorage.getItem('theme') || theme}logo.png`
    //   return window.localStorage.getItem('theme')|| theme
    // },
    theme(){
      return this.$store.state.settings.theme
    }
  },
  data() {
    return {
      title: "华控清交 多方安全计算平台",
      logo: logoImg,
      // theme: this.$store.state.settings.theme
    };
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    async logout() {
      this.$confirm("确定注销并退出系统吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonClass: "btn-custom-cancel",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$store.dispatch("LogOut").then(() => {
          location.href = "/index";
        });
      });
    }
  },
  mounted() {
    document.getElementsByTagName('body')[0].className=this.theme
  }
};
</script>

<style lang="scss" scoped>
.sidebar-logo-container {
  display: flex;
  box-sizing: content-box;
  width: 100%;
  height: 50px;
  justify-content: space-between;
}
   .HeaderMain_left{
          display: flex;
          justify-content: flex-start;
          height: 50px;
          .logo_img{
            margin:9px 30px;
            width: 108px;
            height: 35px;
          }

        }

.avatar-container {
  margin-right: 30px;

  .avatar-wrapper {
    margin-top: 5px;
    right: 0;
    position: relative;

    .user-avatar {
      cursor: pointer;
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }

    .el-icon-caret-bottom {
      cursor: pointer;
      position: absolute;
      right: -20px;
      top: 15px;
      font-size: 14px;
      color:#fff;
    }
  }
}
</style>
