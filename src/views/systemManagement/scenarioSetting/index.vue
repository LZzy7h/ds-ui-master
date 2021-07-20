<template>
  <div>
    <div class="applicationScenarios">
      <el-card class="box-card">
        <h4>应用目录</h4>
        <div class="carditem" v-if="applicationScenariosList.length === 0">
          <el-input value="请添加应用目录" style="margin:10px 15px 10px 0" placeholder="请输入内容" />
          <el-button
            circle icon="el-icon-plus" @click="AddApplicationScenarios"
          ></el-button>
        </div>
        <div v-for="(item, index) in applicationScenariosList" :key="index" class="carditem">
          <el-input :value="item.categoryName" style="margin:10px 15px 10px 0" placeholder="请输入内容" />
           <el-button
              circle icon="el-icon-minus" @click="delApplicationScenarios(item)"
              ></el-button>
              <el-button
              circle icon="el-icon-plus" @click="AddApplicationScenarios"
              ></el-button>

        </div>
      </el-card>
      <el-card class="box-card">
        <h4>数据目录</h4>
        <div class="carditem" v-if="dataDirectory.length === 0">
          <el-input value="请添加数据目录" style="margin:10px 15px 10px 0" placeholder="请输入内容" />
          <el-button
            circle icon="el-icon-plus" @click="addDataDirectory"
          ></el-button>
        </div>
        <div v-for="(item, index) in dataDirectory" :key="index" class="carditem">
          <el-input :value="item.categoryName" style="margin:10px 15px 10px 0" placeholder="请输入内容" />
               <el-button
              circle icon="el-icon-minus" @click="delDataDirectory(item)"
              ></el-button>
              <el-button
              circle icon="el-icon-plus" @click="addDataDirectory"
              ></el-button>
        </div>
      </el-card>
    </div>
    <el-dialog
      class="scenarioSetting_dialog dialog-middle"
      title="场景名称"
      :visible.sync="dialogVisible"

    >
      <div class="scenarioSetting_dialog_input">
        <el-input v-model="scenarioSettingName" placeholder="请输入场景名称" ref="scenarioSettingName" @input="changeValue(scenarioSettingName)"/>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitScenarioSetting" style="width: 45%;">保存</el-button>
        <el-button @click="dialogVisible = false" style="width: 45%;">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      class="scenarioSetting_dialog dialog-middle"
      title="目录名称"
      :visible.sync="dialogVisible1"
      width="25%"
    >
      <div class="scenarioSetting_dialog_input">
        <el-input v-model="dataDirectoryName" placeholder="请输入目录名称" @input="changeValue(dataDirectoryName)"/>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitDataDirectory" style="width: 45%;">保存</el-button>
        <el-button @click="dialogVisible1 = false" style="width: 45%;">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getScenarioSetting, getOperatorDatasetCatalog, delScenarioSetting, addScenarioSetting, addDataDirectory, delDataDirectory } from '@/api/ScenarioSetting'

export default {
  name: 'ScenarioSetting',
  data() {
    return {
      applicationScenariosList: [],
      dataDirectory: [],
      dialogVisible: false,
      dialogVisible1: false,
      scenarioSettingName: '',
      dataDirectoryName: ''
    }
  },
  mounted() {
    this.getScenarioSetting()
    this.getDatasetCatalog()
  },
  methods: {
    // 获取场景列表
    getScenarioSetting() {
      getScenarioSetting().then((res) => {
        if (res.code === 200) {
          this.applicationScenariosList = res.data
        }
      })
    },
    // 获取数据目录
    getDatasetCatalog() {
      getOperatorDatasetCatalog().then((res) => {
        if (res.code === 200) {
          this.dataDirectory = res.data
        }
      })
    },
    delApplicationScenarios(row) {
      this.$confirm('此操作将永久删除该场景, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonClass: "btn-custom-cancel",
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const id = row.id
        delScenarioSetting(id).then((res) => {
          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.dialogVisible = false
            this.getScenarioSetting()
          }
        })
      }).catch(() => {})
    },
    AddApplicationScenarios() {
      this.scenarioSettingName = ''
      this.dialogVisible = true
    },
    submitScenarioSetting() {
      if (!this.scenarioSettingName) {
        this.$message.info('请填写应用目录名称！')
        return false
      }
      let data = {
        categoryName: this.scenarioSettingName
      }
      addScenarioSetting(data).then((res) => {
        if (res.code === 200) {
          this.$message.success('添加应用目录成功！')
          this.dialogVisible = false
          this.getScenarioSetting()
        }
      })
    },
    changeValue (data) {
        let leng = this.validateTextLength(data)
        if (leng > 15) {
          this.scenarioSettingName=data.slice(0,15)
          this.dataDirectoryName=data.slice(0,15)
          this.$message.info('请输入不超过15个字符！')
          }
      },
      validateTextLength (value) {
        // 中文、中文标点、全角字符按1长度，英文、英文符号、数字按1长度计算
        let cnReg = /([\u4e00-\u9fa5]|[\u3000-\u303F]|[\uFF00-\uFF60])/g
        let mat = value.match(cnReg)
        let length
        if (mat) {
          length = (mat.length + (value.length - mat.length) * 0.5)
          return length
        } else {
          return value.length
        }
      },
    delDataDirectory(row) {
      this.$confirm('此操作将永久删除该数据目录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        cancelButtonClass: "btn-custom-cancel",
        type: 'warning'
      }).then(() => {
        const id = row.id
        delDataDirectory(id).then((res) => {
          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.getDatasetCatalog()
          }
        })
      }).catch(() => {})
    },
    addDataDirectory() {
      this.dataDirectoryName = ''
      this.dialogVisible1 = true
    },
    submitDataDirectory() {
      if (!this.dataDirectoryName) {
        this.$message.info('请填写数据目录名称！')
        return false
      }
      const data = {
        categoryName: this.dataDirectoryName
      }
      addDataDirectory(data).then((res) => {
        if (res.code === 200) {
          this.$message.success('添加数据目录成功！')
          this.getDatasetCatalog()
          this.dialogVisible1 = false
        }
      })
    }
  }
}
</script>
<style lang="scss">
  .applicationScenarios{
    display: flex;
    justify-content: flex-start;
    .box-card{
      width: 475px;
      margin: 30px;
      h4{
        margin: 0;
      }
      .carditem{
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .addapplicationScenarios{
          cursor: pointer;
          display: block;
          width: 29px;
          height: 29px;
          border-radius: 50%;
          margin-left:8px;
        }
        .delapplicationScenarios{
          cursor: pointer;
          display: block;
          width: 29px;
          height: 29px;
          border-radius: 50%;
          margin-left:8px;
        }
      }

    }

  }
  .scenarioSetting_dialog{
    .scenarioSetting_dialog_input{
      margin: 0 20px;
      border-bottom: 1px solid #666666;
      .el-input__inner{
        border: none;

      }
    }
  }
</style>
