<template>
  <div class="new-profile-wrap">
    <right-panel v-if="showSettings">
      <settings />
    </right-panel>
    <logo :collapse="true"></logo>
    <div class="new-profile">
      <div>
        <h5 class="title">个人中心</h5>
        <div class="new-profile-center">
          <div class="profile-top">
            <div class="profile-avatar">
              <img :src="options.img" />
            </div>
            <div class="avatar-edit">
              <a href="javascript:;" @click="editCropper()">编辑头像</a>
            </div>
          </div>
          <div class="profile-bottom">
            <el-tabs tab-position="left" style="height: 340px;">
              <el-tab-pane class="basic" label="基本信息">
                <ul class="basic-info-text">
                  <li>
                    <span>用户名：</span><span>{{ user.nickName }}</span>
                  </li>
                  <li>
                    <span>真实姓名：</span><span>{{ user.userName }}</span>
                  </li>
                  <li>
                    <span>所属角色：</span
                    ><span
                      ><img
                        style="width:14px;"
                        src="../../../assets/images/role.svg"
                        alt=""
                      />{{ roleGroup }}</span
                    >
                  </li>
                  <li>
                    <span>所属部门：</span><span>{{ postGroup }}</span>
                  </li>
                  <li>
                    <span>手机：</span><span>{{ user.phonenumber }}</span>
                  </li>
                  <li>
                    <span>邮箱：</span><span>{{ user.email }}</span>
                  </li>
                </ul>
                <ul class="basic-info-edit">
                  <li>
                    <a href="javascript:;" @click="infoDialogVisible = true"
                      >修改资料</a
                    >
                  </li>
                  <li>
                    <a href="javascript:;" @click="passwordDialogVisible = true"
                      >修改密码</a
                    >
                  </li>
                </ul>
              </el-tab-pane>
              <el-tab-pane class="safe" label="安全设置">安全设置</el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </div>
    </div>
    <!--  <div class="new-profile flex">
      <div class="new-profile-left">
        <div class="new-profile-avatar">
          <img :src="avatar"/>
        </div>
        <div class="avatar-name">王小明</div>
        <div class="avatar-edit">编辑头像</div>
      </div>
      <div class="new-profile-right">
        <div class="new-profile-title">个人中心</div>
        <div class="basic-info">
          <el-menu :default-active="activeIndex" mode="horizontal" style="width: 75%;padding-left: 25px; position: relative;">
            <el-menu-item index="1">基本信息</el-menu-item>
            <div class="basic-info-edit">编辑</div>
          </el-menu>
          <ul class="basic-info-text">
            <li class="flex"><span>用户名：</span><span>王小明</span></li>
            <li class="flex"><span>真实姓名：</span><span>王小明</span></li>
            <li class="flex"><span>角色：</span><span>管理者 编辑者</span></li>
            <li class="flex"><span>分组：</span><span>产品1组 </span></li>
            <li class="flex"><span>手机：</span><span>1888888888</span></li>
            <li class="flex"><span>邮箱：</span><span>149123654@qq.com</span></li>
          </ul>
        </div>
        <div class="safe-setting">
          <el-menu :default-active="activeIndex" mode="horizontal" style="width: 75%;padding-left: 25px;">
            <el-menu-item index="1">安全设置</el-menu-item>
          </el-menu>
          <div class="safe-setting-btn">修改密码</div>
          <div class="safe-setting-btn">退出登录</div>
        </div>
      </div> -->
    <!-- </div> -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      class="dialog-big"
      append-to-body
      @opened="modalOpened"
      @close="closeDialog()"
    >
      <el-row>
        <el-col :xs="24" :md="12" :style="{ height: '350px' }">
          <vue-cropper
            ref="cropper"
            :img="options.img"
            :info="true"
            :autoCrop="options.autoCrop"
            :autoCropWidth="options.autoCropWidth"
            :autoCropHeight="options.autoCropHeight"
            :fixedBox="options.fixedBox"
            @realTime="realTime"
            v-if="visible"
          />
        </el-col>
        <el-col :xs="24" :md="12" :style="{ height: '350px' }">
          <div class="avatar-upload-preview">
            <img :src="previews.url" :style="previews.img" />
          </div>
        </el-col>
      </el-row>
      <br />
      <el-row>
        <el-col :lg="2" :md="2">
          <el-upload
            action="#"
            :http-request="requestUpload"
            :show-file-list="false"
            :before-upload="beforeUpload"
          >
            <el-button size="small">
              选择
              <i class="el-icon-upload el-icon--right"></i>
            </el-button>
          </el-upload>
        </el-col>
        <el-col :lg="{ span: 1, offset: 2 }" :md="2">
          <el-button
            icon="el-icon-plus"
            size="small"
            @click="changeScale(1)"
          ></el-button>
        </el-col>
        <el-col :lg="{ span: 1, offset: 1 }" :md="2">
          <el-button
            icon="el-icon-minus"
            size="small"
            @click="changeScale(-1)"
          ></el-button>
        </el-col>
        <el-col :lg="{ span: 1, offset: 1 }" :md="2">
          <el-button
            icon="el-icon-refresh-left"
            size="small"
            @click="rotateLeft()"
          ></el-button>
        </el-col>
        <el-col :lg="{ span: 1, offset: 1 }" :md="2">
          <el-button
            icon="el-icon-refresh-right"
            size="small"
            @click="rotateRight()"
          ></el-button>
        </el-col>
        <el-col :lg="{ span: 2, offset: 6 }" :md="2">
          <el-button type="primary" size="small" @click="uploadImg()"
            >提 交</el-button
          >
        </el-col>
      </el-row>
    </el-dialog>
    <el-dialog title="修改资料" :visible.sync="infoDialogVisible"  class="dialog-middle">
      <userInfo :user="user" @closeInfo="infoDialogVisible = false" />
    </el-dialog>
    <el-dialog
      title="修改密码"
      :visible.sync="passwordDialogVisible"
      class="dialog-middle"
    >
      <resetPwd :user="user" @closePassword="passwordDialogVisible = false" />
    </el-dialog>
  </div>
</template>
<script>
import Logo from "@/layout/components/Sidebar/Logo";
import store from "@/store";
import { VueCropper } from "vue-cropper";
import { uploadAvatar, getUserProfile } from "@/api/system/user";
import userInfo from "./profile/userInfo";
import resetPwd from "./profile/resetPwd";
import RightPanel from '@/components/RightPanel'
import { Settings } from '@/layout/components'
import { mapState } from 'vuex'

export default {
  name: "newProfile",
  components: {
    Logo,
    VueCropper,
    userInfo,
    resetPwd,
    RightPanel,
    Settings
  },
  data() {
    return {
      avatar: require("../../../assets/profle/avatar1.png"),
      // 是否显示弹出层
      open: false,
      // 是否显示cropper
      visible: false,
      // 弹出层标题
      title: "修改头像",
      options: {
        img: store.getters.avatar, //裁剪图片的地址
        autoCrop: true, // 是否默认生成截图框
        autoCropWidth: 200, // 默认生成截图框宽度
        autoCropHeight: 200, // 默认生成截图框高度
        fixedBox: true // 固定截图框大小 不允许改变
      },
      previews: {},
      user: {},
      roleGroup: "",
      postGroup: "",
      infoDialogVisible: false,
      passwordDialogVisible: false
    };
  },
  computed:{
    ...mapState({
      showSettings: state => state.settings.showSettings,
    }),
  },
  mounted() {
    this.getUser();
    // console.log(showSettings)
  },
  methods: {
    editCropper() {
      this.open = true;
    },
    // 打开弹出层结束时的回调
    modalOpened() {
      this.visible = true;
    },
    // 覆盖默认的上传行为
    requestUpload() {},
    // 向左旋转
    rotateLeft() {
      this.$refs.cropper.rotateLeft();
    },
    // 向右旋转
    rotateRight() {
      this.$refs.cropper.rotateRight();
    },
    // 图片缩放
    changeScale(num) {
      num = num || 1;
      this.$refs.cropper.changeScale(num);
    },
    // 上传预处理
    beforeUpload(file) {
      if (file.type.indexOf("image/") == -1) {
        this.msgError("文件格式错误，请上传图片类型,如：JPG，PNG后缀的文件。");
      } else {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.options.img = reader.result;
        };
      }
    },
    // 上传图片
    uploadImg() {
      this.$refs.cropper.getCropBlob(data => {
        let formData = new FormData();
        formData.append("avatarfile", data);
        uploadAvatar(formData).then(response => {
          this.open = false;
          this.options.img = response.imgUrl;
          store.commit("SET_AVATAR", this.options.img);
          this.msgSuccess("修改成功");
          this.visible = false;
        });
      });
    },
    // 实时预览
    realTime(data) {
      this.previews = data;
    },
    // 关闭窗口
    closeDialog() {
      this.options.img = store.getters.avatar;
      this.visible = false;
    },
    getUser() {
      getUserProfile().then(res => {
        console.log(res);
        this.user = res.data;
        this.roleGroup = res.roleGroup;
        this.postGroup = res.postGroup;
      });
    },
    closeDialogInfo() {}
  }
};
</script>
<style lang="scss" scoped>
.new-profile-wrap {
  height: 100%;
  .new-profile {
    display: flex;
    justify-content: center;
    align-items: center;
    background: url("../../../assets/images/bg02@2x.png") no-repeat center;
    background-size: 120% 120%;

    .title {
      font-size: 16px;
      font-weight: 400;
      color: #333333;
      margin: 40px 0 15px 0;
    }
    .new-profile-center {
      width: 849px;
      height: 737px;
      background-color: #fff;
      .profile-top {
        height: 286px;
        // background: url("../../../assets/images/bg01@2x.png") no-repeat center;
        background-size: 849px 286px;
        overflow: hidden;
        text-align: center;
        .profile-avatar {
          width: 109px;
          height: 108px;
          border-radius: 50%;
          background-color: #facd89;
          overflow: hidden;
          margin: 50px auto;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .avatar-edit {
          display: inline-block;
          width: 107px;
          height: 31px;
          line-height: 31px;
          // background: #3312af;
          border-radius: 8px;
          color: #fff;
        }
      }
      .profile-bottom {
        margin: 70px 100px;
        .basic-info-text {
          width: 80%;
          height: 197px;
          font-size: 16px;
          font-weight: 300;
          color: #333333;
          line-height: 26px;
        }
        .basic-info-text li{
          margin-bottom: 15px;
        }
        .basic-info-edit {
          width: 237px;
          margin-top: 77px;
          display: flex;
          justify-content: space-between;
          li {
            list-style: none;
            a {
              text-decoration: underline;
            }
          }
        }
      }
    }
  }
}
</style>
<style>
.el-tabs__item.is-left {
  margin-bottom: 240px;
}
.el-tabs__active-bar .is-left {
  transform: translateY(200px);
}
li {
  list-style: none;
}
</style>
