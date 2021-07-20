<template>
  <div class="edit-algorithm">
    <div class="main_content" style="border-top-right-radius: 0;border-top-left-radius: 0;padding-left: 35px;">
      <div class="param_box pt30">
        <div class="param_box_label">选择算法文件：</div>
        <el-upload
          action=""
          class="upload-demo"
          ref="upload"
           accept=".py,.pyw,.ipynb,.pxd,.pyx"
          :on-change="handleChange"
          :auto-upload="false"
          :limit="1"
        >
          <el-button size="small" type="primary">选择文件</el-button>
        </el-upload>
      </div>
      <div slot="tip" class="el-upload__tip">
        建议：先在指定的Jupyter编程环境中联调完成后，再提交算法源码
        <a
          style="color: #3668D5;margin-left: 5px;"
          :href="ideUrl"
          target="_blank"
          >跳转至DS节点Jupyter</a
        >
      </div>
      <div class="param_box pt30" style="position:relative;">
        <div class="param_box_label">算法源码：</div>
        <el-input
          type="textarea"
          :rows="15"
          :disabled="!content"
           @input="checkContent(content)"
          v-model="content"
          style="width: 50%"
        ></el-input>
         <transition
          enter-active-class="animate__fadeInDown"
          leave-active-class="animate__fadeOut"
        >
          <p
            v-show="visible.algcodeVisible"
            class="tips animate__animated"
            style="left:70px;top: 24px;"
          >
            请选择算法源码！
          </p>
        </transition>
      </div>
      <div class="param_box pt30">
        <div class="param_box_label">算法名称：</div>
        <div style="position:relative;">

        <el-input v-model="algorithmName"  maxlength="15"
            @blur="check(algorithmName)"
            show-word-limit style="width: 300px"></el-input>
         <transition
            enter-active-class="animate__fadeInDown"
            leave-active-class="animate__fadeOut"
          >
            <p v-show="visible.algVisible" class="tips animate__animated">
              算法名称不可为空
            </p>
          </transition>
        </div>
      </div>
              <div class="param_box pt30">
        <span class="param_box_label">算法描述：</span>
        <div style="position:relative;">

 <el-input
            type="textarea"
            placeholder="请输入内容"
            style="width:300px"
            v-model="comment"
            :rows="5"
          >
          </el-input>

        </div>
      </div>
      <div class="param_box pt30">
        <div class="param_box_label">应用目录：</div>
        <div style="position:relative;">
        <el-select
          v-model="scenarioId"
          placeholder="请选择"  @change="checkscenarioId(scenarioId)" clearable
          style="width: 300px"
        >
          <el-option
            v-for="(item, index) in applicationScenariosList"
            :key="index"
            :label="item.categoryName"
            :value="item.id"
          >
          </el-option>
        </el-select>
           <transition
            enter-active-class="animate__fadeInDown"
            leave-active-class="animate__fadeOut"
          >
            <p
              v-show="visible.scenarioIdVisible"
              class="tips animate__animated"
            >
              请选择应用目录
            </p>
          </transition>
        </div>
      </div>
    </div>
    <div style="margin-top: 20px; margin-left: 40%;margin-bottom: 100px;">
      <el-button type="primary" @click="handleSubmit">提交</el-button>
      <el-button @click="handleCancel">取消</el-button>
    </div>
  </div>
</template>
<script>
import { getScenarioSettingForConsole } from "@/api/ScenarioSetting";
import { updateAlgorithm } from "@/api/algorithm";
import { getKv } from "@/api/setting";
export default {
  name: "ContractManagement",
  data() {
    return {
      tableData: [],
      applicationScenariosList: [],
      algorithmName: window.localStorage.getItem("checkedAlgorithm")
        ? JSON.parse(window.localStorage.getItem("checkedAlgorithm"))
            .algorithmName
        : "",
      scenarioId: window.localStorage.getItem("checkedAlgorithm")
        ? JSON.parse(window.localStorage.getItem("checkedAlgorithm")).scenarioId
        : "",
      content: window.localStorage.getItem("checkedAlgorithm")
        ? JSON.parse(window.localStorage.getItem("checkedAlgorithm")).content
        : "",
      comment: window.localStorage.getItem("checkedAlgorithm")
        ? JSON.parse(window.localStorage.getItem("checkedAlgorithm")).comment
        : "",
      id: window.localStorage.getItem("checkedAlgorithm")
        ? JSON.parse(window.localStorage.getItem("checkedAlgorithm")).id
        : "",
      ideUrl: "",
          visible: {
        algVisible: false,
        scenarioIdVisible: false,
        algcodeVisible: false
      }
    };
  },
  mounted() {
    this.getScenarioSetting();
    this.getKvFunc();
  },
    watch: {
    content(newV, oldV) {
      if (newV) {
        this.visible.algcodeVisible = false;
      } else {
        this.visible.algcodeVisible = true;
      }
    }
  },
  methods: {
    getKvFunc() {
      getKv().then(res => {
        if (res.code === 200) {
          res.data.forEach(e => {
            if (e.configKey === "JUPYTER_LAB_URL") {
              this.ideUrl = e.val;
            }
          });
        }
      });
    },
    handleChange(file) {
      let name = file.name;
      this.algorithmName = name.substring(name.lastIndexOf("."), -1);
      let reader = new FileReader();
      if (typeof FileReader === "undefined") {
        this.$message({
          type: "info",
          message: "您的浏览器不支持文件读取。"
        });
        return;
      }
      reader.readAsText(file.raw, "utf-8");
      var _this = this;
      reader.onload = function(e) {
        _this.content = e.target.result;
      };
    },
    // 获取场景列表
    getScenarioSetting() {
      getScenarioSettingForConsole().then(res => {
        if (res.code === 200) {
          this.applicationScenariosList = res.data;
        }
      });
    },
    handleSubmit() {
      let data = {
        scenarioId: this.scenarioId,
        algorithmName: this.algorithmName,
        content: this.content,
        comment: this.comment,
        id: this.id
      };
      if (this.content === "") {
        this.visible.algcodeVisible = true;
        // this.$message.info('请上传算法源码！')
        return false;
      } else if (this.algorithmName === "") {
        // this.$message.info('请输入算法名称！')
        this.visibleAll();
        this.visible.algVisible = true;
        return false;
      } else if (this.scenarioId === "") {
        // this.$message.info('请选择应用目录！')
        this.visibleAll();
        this.visible.scenarioIdVisible = true;
        return false;
      }
      updateAlgorithm(data).then(res => {
        if (res.code === 200) {
          this.$message.success("修改成功！");
          window.localStorage.removeItem("checkedAlgorithm");
          setTimeout(() => {
            this.$router.push({ path: "/application/algorithm" });
          }, 300);
        }
      });
    },
    handleCancel() {
      window.localStorage.removeItem("checkedAlgorithm");
      setTimeout(() => {
        this.$router.push({ path: "/application/algorithm" });
      }, 300);
    },
    check(data) {
      if (data) {
        this.visible.algVisible = false;
      } else {
        this.visible.algVisible = true;
      }
    },
    checkContent(data) {
      if (data) {
        this.visible.algcodeVisible = false;
      } else {
        this.visible.algcodeVisible = true;
      }
    },
    checkscenarioId(data) {
      if (data) {
        this.visible.scenarioIdVisible = false;
      } else {
        this.visible.scenarioIdVisible = true;
      }
    },
    visibleAll() {
      this.visible.algVisible = false;
      this.visible.scenarioIdVisible = false;
      this.visible.algcodeVisible = false;
    }
  }
};
</script>
<style scoped>
.algorithm_content {
  margin-left: 20px;
}
.algorithm_item {
  padding-top: 50px;
}
.tips {
  position: absolute;
  left: 5px;
  top: 30px;
  font-size: 12px;
  color: red;
  width: 255px;
}

.animate__animated {
  animation-duration: 0.5s;
}
.pt30{
  padding-top: 30px;
}
</style>
