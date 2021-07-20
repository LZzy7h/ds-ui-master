<template>
  <div class="mySql">
    <!-- 公共参数 -->
    <div>
      <div class="headerBox">
        <label style="color: #606266">公共参数：</label>
      </div>
      <div class="mySql_rowStyle">
        <el-form
          :inline="true"
          :model="publicData"
          :rules="publicDataRules"
          label-width="200px"
        >
          <el-form-item
            label="设置数据集名称:"
            prop="datasetName"
            v-if="!sampleId"
          >
            <el-input
              v-model="publicData.datasetName"
              placeholder="请输入数据集名称"
              class="width_250"
            ></el-input>
          </el-form-item>

          <el-form-item label="设置数据集标识:" prop="infoKey" v-if="!sampleId">
            <el-input
              v-model="publicData.infoKey"
              placeholder="请输入数据集标识"
              class="width_250"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="设置数据集类型:"
            prop="datasetType"
            v-if="!sampleId"
          >
            <el-select
              v-model="publicData.datasetType"
              placeholder="请选择数据集类型"
              class="width_250"
            >
              <el-option
                v-for="(item, index) in datasetTypeList"
                :key="index"
                :label="item.label"
                :value="item.label"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item
            label="数据集描述:"
            prop="datasetDescription"
            v-if="!sampleId"
          >
            <el-input
              v-model="publicData.datasetDescription"
              placeholder="请输入数据集描述"
              class="width_250"
            ></el-input>
          </el-form-item>

          <el-form-item label="父级字段:" prop="parentFields">
            <el-input
              v-model="publicData.parentFields"
              placeholder="回参字段的所有父级字段"
              class="width_250"
            ></el-input>
          </el-form-item>

          <el-form-item label="回参字段数据类型:" prop="respType">
            <el-select
              v-model="publicData.respType"
              placeholder="需要截取的回参字段数据类型"
              style="width: 250px"
            >
              <el-option
                v-for="(item, index) in respTypeList"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="默认值:" prop="defaultValue">
            <el-input
              v-model="publicData.defaultValue"
              placeholder="请输入数据集总默认值"
              class="width_250"
            ></el-input>
          </el-form-item>

          <!-- <el-form-item label="columnRespList:" prop="columnRespList">
                    <el-input  v-model="publicData.columnRespList" placeholder="例:[{'columnName':'totalAmount','columnDefaultValue':'0'}]"   class="width_250"></el-input>
                </el-form-item> -->
        </el-form>
      </div>
    </div>

    <!-- 回参字段 -->
    <div>
      <div class="headerBox">
        <label style="color: #606266">回参字段：</label>
      </div>

      <div class="mySql_rowStyle">
        <el-row v-for="(item, index) in columnRespList" :key="index">
            <!-- :rules="rules" -->
          <el-form
            :inline="true"
            :model="columnRespList[index]"
            ref="columnRespList"
            label-width="200px"
            size="small"
            :style="index == 0 ? 'margin-top:0' : ''"
          >
            <el-form-item
              label="回参字段名称:"
              prop="columnName"
              style="width: 500px"
            >
              <el-input v-model="columnRespList[index].columnName"></el-input>
            </el-form-item>
            <el-form-item
              label="回参字段默认值:"
              prop="columnDefaultValue"
              style="width: 500px"
            >
              <el-input
                v-model="columnRespList[index].columnDefaultValue"
              ></el-input>
            </el-form-item>
            <el-form-item style="width: 50px">
              <el-button
                v-if="index != 0"
                type="danger"
                @click="delColumnDefault(index)"
                >删除</el-button
              >
              <el-button
                v-if="index == 0"
                type="primary"
                @click="addColumnDefault"
                >添加</el-button
              >
            </el-form-item>
          </el-form>
        </el-row>
      </div>
    </div>

    <!-- 接口请求方式 -->
    <div>
      <div class="headerBox">
        <label for="" style="color: #606266">接口请求方式：</label>
        <el-select v-model="interfaceRequestMode" placeholder="接口请求方式：">
          <el-option
            v-for="(item, index) in interfaceRequestModeList"
            :key="index"
            :label="item.modeName"
            :value="item.modeValue"
          >
          </el-option>
        </el-select>
      </div>

      <div v-if="interfaceRequestMode === 0">
        <div class="mySql_rowStyle">
            <!-- :rules="rules" -->
          <el-form
            :inline="true"
            :model="header"
            label-width="200px"
          >
            <el-form-item label="API-URL：" style="width: 880px">
              <el-input v-model="header.apiUrl" style="width: 680px"></el-input>
            </el-form-item>
            <el-form-item label="请求方式:">
              <el-select
                v-model="header.method"
                placeholder="请选择"
              >
                <!-- @change="getMaterial" -->
                <el-option
                  v-for="(item, index) in urlMethodList"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>

        <!-- Header -->
        <div class="mySql_rowStyle">
          <el-row v-for="(item, index) in headerForms.items" :key="index">
              <!-- :rules="rules" -->
            <el-form
              :inline="true"
              :model="headerForms[index]"
              ref="headerForms"
              label-width="200px"
              size="small"
            >
              <el-form-item
                label="Header-Key:"
                prop="headerKey"
                style="width: 500px"
              >
                <el-input
                  v-model="headerForms.items[index].headerKey"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="Header-Value:"
                prop="headerValue"
                style="width: 500px"
              >
                <el-input
                  v-model="headerForms.items[index].headerValue"
                ></el-input>
              </el-form-item>
              <el-form-item style="width: 50px">
                <el-button
                  v-if="index != 0"
                  type="danger"
                  @click="del(index, 'header')"
                  >删除</el-button
                >
                <el-button
                  v-if="index == 0"
                  type="primary"
                  @click="addItem('header')"
                  >添加</el-button
                >
              </el-form-item>
            </el-form>
          </el-row>
        </div>

        <!-- Query -->
        <div class="mySql_rowStyle">
          <el-row v-for="(item, index) in queryForms.items" :key="index">
              <!-- :rules="rules" -->
            <el-form
              :inline="true"
              :model="queryForms.items[index]"
              ref="queryForms"
              label-width="200px"
              size="small"
            >
              <el-form-item
                label="Query-Key:"
                prop="queryKey"
                style="width: 500px"
              >
                <el-input v-model="queryForms.items[index].queryKey"></el-input>
              </el-form-item>
              <el-form-item
                label="Query-Value:"
                prop="queryValue"
                style="width: 500px"
              >
                <el-input
                  v-model="queryForms.items[index].queryValue"
                ></el-input>
              </el-form-item>
              <el-form-item style="width: 50px">
                <el-button
                  v-if="index != 0"
                  type="danger"
                  @click="del(index, 'query')"
                  >删除</el-button
                >
                <el-button
                  v-if="index == 0"
                  type="primary"
                  @click="addItem('query')"
                  >添加</el-button
                >
              </el-form-item>
            </el-form>
          </el-row>
        </div>

        <!-- Body -->
        <div class="mySql_rowStyle" v-if="header.method === 'POST'">
          <el-row v-for="(item, index) in bodyForms.items" :key="index">
              <!-- :rules="rules" -->
            <el-form
              :inline="true"
              :model="bodyForms.items[index]"
              ref="bodyForms"
              label-width="200px"
              size="small"
            >
              <el-form-item
                label="Body-Key:"
                prop="bodyKey"
                style="width: 500px"
              >
                <el-input v-model="bodyForms.items[index].bodyKey"></el-input>
              </el-form-item>
              <el-form-item
                label="Body-Value:"
                prop="bodyValue"
                style="width: 500px"
              >
                <el-input v-model="bodyForms.items[index].bodyValue"></el-input>
              </el-form-item>
              <el-form-item style="width: 50px">
                <el-button
                  v-if="index != 0"
                  type="danger"
                  @click="del(index, 'body')"
                  >删除</el-button
                >
                <el-button
                  v-if="index == 0"
                  type="primary"
                  @click="addItem('body')"
                  >添加</el-button
                >
              </el-form-item>
            </el-form>
          </el-row>
        </div>
      </div>

      <div v-if="interfaceRequestMode === 1">
        <div class="mySql_rowStyle">
          <el-input
            type="textarea"
            :rows="4"
            placeholder="请输入 curl Shell 命令, 例如：curl --request GET 'http://127.0.0.1:8080/yy/fl/gjj1?idCard=123445"
            v-model="curl"
            id="curlShellInput"
          >
          </el-input>
        </div>
      </div>
    </div>

    <div class="saveBtnBox">
      <el-button type="primary" class="saveBtnAttr" @click="saveBtn"
        >保存</el-button
      >
    </div>
  </div>
</template>
<script>
import { formalAPIDatasetSaving, sampleAPIDatasetSaving } from "@/api/dataSet";
import { parse } from "path-to-regexp";
export default {
  name: "generalApi",
  data() {
    return {
      header: { apiUrl: "", method: "GET" },
      headerForms: { items: [{}] },
      queryForms: { items: [{}] },
      bodyForms: { items: [{}] },
      columnRespList: [
        {
          columnName: "",
          columnDefaultValue: "",
        },
      ],
      interfaceRequestMode: 0,
      interfaceRequestModeList: [
        { modeName: "api参数方式", modeValue: 0 },
        { modeName: "curl shell命令", modeValue: 1 },
      ],
      urlMethodList: [
        { label: "Get方式", value: "GET" },
        { label: "Post方式", value: "POST" },
      ],
      // 公共字段
      publicData: {
        parentFields: "", // 回参字段的所有父级字段（默认null，多个以逗号隔开）
        respType: "", // 需要截取的回参字段数据类型：0-对象Bean；1-集合Array（默认0）
        infoKey: "",
        datasetName: "",
        datasetDescription: "",
        datasetType: "",
        defaultValue: "",
      },
      curl: null,
      respTypeList: [
        { label: "对象Bean", value: 0 },
        { label: "集合Array", value: 1 },
      ],
      publicDataRules: {
        respType: [
          {
            required: true,
            message: "需要截取的回参字段数据类型",
            trigger: "change",
          },
        ],
        infoKey: [
          { required: true, message: "请输入数据集标识", trigger: "blur" },
        ],
        datasetName: [
          { required: true, message: "请输入数据集名称", trigger: "blur" },
        ],
        datasetType: [
          {
            required: true,
            message: "需要截取的回参字段数据类型",
            trigger: "change",
          },
        ],
      },
      datasetTypeList: [
        { label: "Double" },
        { label: "Int32" },
        { label: "Int64" },
        { label: "String" },
      ],
      sampleId: null,
    };
  },
  mounted() {
    // 如果有id，说明是 sample
    this.sampleId = this.$route.query.id ? Number(this.$route.query.id) : null;
    // console.log(this.sampleId);
  },
  methods: {
    addItem(type) {
      let formName = type + "Forms";
      let formKey = type + "Key";
      let formValue = type + "Value";

      this[formName].items.push({
        [formKey]: "",
        [formValue]: "",
      });
    },
    addColumnDefault() {
      let child = {
        columnName: "",
        columnDefaultValue: "",
      };
      this.columnRespList.push(child);
    },
    del(index, type) {
      let formType = type + "Forms";
      this[formType].items.splice(index, 1);
    },
    delColumnDefault(index) {
      this.columnRespList.splice(index, 1);
    },
    checkObjectIsEmpty(obj) {
      let keyArray = Object.keys(obj);
      console.log(keyArray);
      console.log(keyArray.length);
      if (keyArray.length === 0) {
        return true;
      } else {
        return false;
      }
    },
    saveBtn() {
      // 校验表单
      if (this.publicData.respType === "") {
        this.$message.error("请填写回参字段数据类型");
        return;
      }
      if (!this.sampleId && this.publicData.infoKey === "") {
        this.$message.error("请填写数据集标识");
        return;
      }
      if (!this.sampleId && this.publicData.datasetName === "") {
        this.$message.error("请输入数据集名称");
        return;
      }
      if (!this.sampleId && !this.publicData.datasetType) {
        this.$message.error("请选择数据集类型");
        return;
      }
      if (
        !this.columnRespList[0].columnName ||
        !this.columnRespList[0].columnDefaultValue
      ) {
        this.$message.error("请至少填写一组回参字段信息");
        return;
      }

      // 接口请求方式：curl shell模式
      if (this.interfaceRequestMode === 1) {
        // 条件判断
        if (!this.curl) {
          this.$message.error("请输入命令");
          return;
        }

        // 构造传递参数
        let params = {
          ...this.publicData,
          reqType: this.interfaceRequestMode,
          columnRespList: this.columnRespList,

          urlApi: this.header.apiUrl,
          urlMethod: this.header.method, // method 需要传递，不然后台会报错：未知异常

          curl: this.curl,
          id: this.sampleId,
        };
        if (this.sampleId) {
          sampleAPIDatasetSaving(params).then((res) => {
            if (res.code === 0) {
              this.$message.success(res.msg);
            }
          });
        } else {
          formalAPIDatasetSaving(params).then((res) => {
            if (res.code === 0) {
              this.$message.success(res.msg);
            }
          });
        }
      }

      // 接口请求方式：API参数方式
      if (this.interfaceRequestMode === 0) {
        let urlHeaderHandler = {},
          urlQueryHandler = {},
          urlBodyHandler = {};

        for (let x of this.headerForms.items) {
          urlHeaderHandler[x.headerKey] = x.headerValue;
        }
        for (let x of this.queryForms.items) {
          urlQueryHandler[x.queryKey] = x.queryValue;
        }
        for (let x of this.bodyForms.items) {
          urlBodyHandler[x.bodyKey] = x.bodyValue;
        }

        // 构造传递参数
        let params = {
          ...this.publicData,
          reqType: this.interfaceRequestMode,
          columnRespList: this.columnRespList,

          urlApi: this.header.apiUrl,
          urlMethod: this.header.method,
          id: this.sampleId,

          urlHeader: urlHeaderHandler,
          urlQuery: urlQueryHandler,
          urlBody: this.header.method === "POST" ? urlBodyHandler : null,
        };
        // 防止给后台传递空数组
        // console.log("urlHeaderHandler:>>",urlHeaderHandler);
        // console.log("this.checkObjectIsEmpty(urlHeaderHandler) :>>", this.checkObjectIsEmpty(urlHeaderHandler) );
        // if (this.checkObjectIsEmpty(urlHeaderHandler) === false) {
        //   params.urlHeader = urlHeaderHandler;
        // }
        // if (this.checkObjectIsEmpty(urlQueryHandler) === false) {
        //   params.urlQuery = urlQueryHandler;
        // }
        // if (
        //   this.header.method === "POST" &&
        //   this.checkObjectIsEmpty(urlBodyHandler) === false
        // ) {
        //   params.urlBody = urlBodyHandler;
        // }
        if (this.sampleId) {
          sampleAPIDatasetSaving(params).then((res) => {
            if (res.code === 0) {
              this.$message.success(res.msg);
            }
            this.$router.push({path:'/data/dataSet'})
          });
        } else {
          formalAPIDatasetSaving(params).then((res) => {
            if (res.code === 0) {
              this.$message.success(res.msg);
            }
            this.$router.push({path:'/data/dataSet'})
          });
        }
      }
    //   console.log(this.publicData);
    },
  },
};
</script>
<style lang="scss">
.headerBox {
  margin: 20px;
}
.mySql {
  .mySql_header {
    margin: 20px;
    .el-button {
      margin-left: 20px;
    }
  }
  .mySql_rowStyle {
    margin-left: 20px;
    border-bottom: 1px solid #f4f4f4;
    .el-form {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      margin-top: 20px;
      .el-form-item {
        width: 40%;
      }
    }
  }
  .dialog_box {
    .el-form {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      margin-top: 20px;
      .el-form-item {
        width: 40%;
        margin: 0 3%;
      }
    }
  }
}
.formMySql {
  margin: 40px;
}
.saveBtnBox {
  display: flex;
  margin: 20px;
}
#curlShellInput {
  border: 1px solid white;
}
.width_250 {
  width: 250px;
}
</style>
