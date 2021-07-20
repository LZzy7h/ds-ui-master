<template>
  <div class="editContract">
    <div
      class="contract_box"
      style="border-top-right-radius: 0;border-top-left-radius: 0;"
    >
      <div class="param_box mb20">
        <div class="param_box_label">应用名称：</div>
        <div style="position:relative;">
          <el-select
            v-model="applicationId"
            clearable
            style="width: 300px"
            @change="visible.applicationIdVisible = false"
          >
            <el-option
              v-for="item in appTableData"
              :key="item.id"
              :label="item.appName"
              :value="item.id"
            >
            </el-option>
          </el-select>
          <transition
            enter-active-class="animate__fadeInDown"
            leave-active-class="animate__fadeOut"
          >
            <p
              v-show="visible.applicationIdVisible"
              class="tips animate__animated"
            >
              应用名称不可为空
            </p>
          </transition>
        </div>
      </div>
         <div>
        <span
          style="font-size: 14px;
    font-weight: 400;
    color: #999999;"
        >
          明密文混合计算
        </span>
        <el-switch v-model="HybridComputing"> </el-switch>
      </div>
      <div class="param_box mb20">
        <div class="param_box_label">任务类型：</div>
        <div style="position:relative;">
          <el-select
            v-model="taskType"
            style="width: 300px"
            clearable :disabled="HybridComputing"
            @change="changeTask"
          >
            <el-option
              v-for="(item, index) in taskOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <transition
            enter-active-class="animate__fadeInDown"
            leave-active-class="animate__fadeOut"
          >
            <p v-show="visible.taskTypeVisible" class="tips animate__animated">
              任务类型不可为空
            </p>
          </transition>
        </div>
      </div>
      <div class="param_box mb20">
        <div class="param_box_label">合约名称：</div>
        <div style="position:relative;">
          <el-input
            v-model="name"
            style="width:300px"
            maxlength="15"
            show-word-limit
            placeholder="请输入合约名称"
            @blur="check(name)"
          />
          <transition
            enter-active-class="animate__fadeInDown"
            leave-active-class="animate__fadeOut"
          >
            <p v-show="visible.nameVisible" class="tips animate__animated">
              合约名称不可为空
            </p>
          </transition>
        </div>
      </div>
      <div class="param_box mb20">
        <div class="param_box_label">合约描述：</div>
        <div style="position:relative;">
          <el-input
            v-model="description"
            type="textarea"
            style="width:400px"
            @blur="checkDescription(description)"
            :rows="5"
            maxlength="100"
            show-word-limit
            placeholder="请输入内容"
          />
          <transition
            enter-active-class="animate__fadeInDown"
            leave-active-class="animate__fadeOut"
          >
            <p
              v-show="visible.descriptionVisible"
              class="tips desTip animate__animated"
            >
              合约描述不可为空
            </p>
          </transition>
        </div>
      </div>
    </div>
    <div class="contract_box">
      <div class="contract_box_item_title">
        输入参数：
        <el-button type="primary" class="addButton" @click="handleAddDs"
          ><i class="el-icon-plus"></i
        ></el-button>
      </div>
      <div v-if="taskType === '2pc'">
        <div
          class="paramBox"
          v-for="(item, index) in datasetList"
          :key="index + item"
        >
          <div class="param_box">
            <div class="param_box_label">变量名:</div>
            <div style="position:relative;">
              <el-input
                v-model="item.name"
                style="width:200px;margin-top:5px"
                @blur="doTip(item, index)"
                type="text"
                maxlength="15"
                show-word-limit
                placeholder=""
              />
              <transition
                enter-active-class="animate__fadeInDown"
                leave-active-class="animate__fadeOut"
              >
                <p v-show="item.inputsVisible" class="tips animate__animated">
                  参数不可为空，必须以字母开头，并选取数据集
                </p>
              </transition>
            </div>
          </div>
          <el-button
            style="margin-right:20px;margin-left:45px;"
            type="primary"
            @click="handleSelectData(index)"
            >选取数据集</el-button
          >
          <div class="param_box">
            <div class="param_box_label">数据集:</div>
            <el-input
              v-model="item.resourceUrl"
              :disabled="true"
              style="width:200px;margin-top:5px"
              placeholder=""
            />
          </div>
          <div class="param_box" style="margin-left:20px;">
            <div class="param_box_label">角色:</div>
            <div style="position:relative;">
              <el-select
                v-model="item.roleType"
                style="width: 200px;"
                @change="changeRole(item.roleType, index)"
                clearable
              >
                <el-option
                  v-for="(item, index) in roleOptions"
                  :key="index"
                  :label="item.roleName"
                  :value="item.value"
                >
                </el-option>
              </el-select>
              <transition
                enter-active-class="animate__fadeInDown"
                leave-active-class="animate__fadeOut"
              >
                <p v-show="item.roleVisible" class="tips animate__animated">
                  请选择角色
                </p>
              </transition>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <div class="paramBox" v-for="(item, index) in datasetList" :key="index">
          <div class="param_box">
            <div class="param_box_label">变量名:</div>
            <div style="position:relative;">
              <el-input
                v-model="item.name"
                @blur="doTip(item, index)"
                type="text"
                maxlength="15"
                show-word-limit
                style="width:200px;margin-top:5px"
                placeholder=""
              />
              <transition
                enter-active-class="animate__fadeInDown"
                leave-active-class="animate__fadeOut"
              >
                <p v-show="item.inputsVisible" class="tips animate__animated">
                  参数不可为空，必须以字母开头，并选取数据集
                </p>
              </transition>
            </div>
          </div>
          <el-button
            style="margin-right:20px;margin-left:45px;"
            type="primary"
            @click="handleSelectData(index)"
            >选取数据集</el-button
          >
          <div class="param_box">
            <div class="param_box_label">数据集:</div>
            <el-input
              v-model="item.resourceUrl"
              :disabled="true"
              style="width:200px;margin-top:5px"
              placeholder=""
            />
          </div>

          <el-button
            type="primary"
            style="margin-left:20px"
            v-if="datasetList.length > 1"
            @click="handleDelectDataset(index)"
            >删除</el-button
          >
        </div>
      </div>
      <div
        style="height: 1px; width: 100%; background: #EBECEE;margin-bottom: 20px;"
      ></div>
      <div style="font-size: 18px;">
        输出参数：
        <el-button type="primary" class="addButton" @click="handleAddDs"
          ><i class="el-icon-plus"></i
        ></el-button>
      </div>
      <div class="paramBox" v-for="(item, index) in dsList" :key="item + index">
        <div class="param_box">
          <div class="param_box_label">变量名:</div>
          <div style="position:relative;">
            <el-input
              v-model="item.name"
              style="width:200px;margin-top:5px"
              type="text"
              @blur="doTipOut(item, index)"
              maxlength="15"
              show-word-limit
              placeholder=""
            />
            <transition
              enter-active-class="animate__fadeInDown"
              leave-active-class="animate__fadeOut"
            >
              <p v-show="item.outputsVisible" class="tips animate__animated">
                不可为空且必须以字母开头
              </p>
            </transition>
          </div>
        </div>
        <div class="param_box" style="margin-left: 45px;">
          <div class="param_box_label">结果存储在:</div>
          <el-select
            v-model="item.outputDsId"
            clearable
            placeholder=""
            style="width: 332px;"
          >
            <el-option
              v-for="item in resultDsIdList"
              :key="item.dsId"
              :label="item.dsName + ' (' + item.dsId + ')'"
              :value="item.dsId"
            ></el-option>
          </el-select>
        </div>

        <el-button
          type="primary"
          style="margin-left:20px"
          v-if="dsList.length > 1"
          @click="handleDelectDs(index)"
          >删除</el-button
        >
      </div>
      <div class="paramBox align">
        <div class="param_box mb20">
          <div class="param_box_label">结果Api输出方式：</div>
          <el-select
            v-model="apiInfo.apiMethod"
            style="width:200px;margin-right:45px;"
            :disabled="!checked"
          >
            <el-option
              v-for="item in urlMethodList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <div class="param_box mb20">
          <div class="param_box_label">结果Api输出地址：</div>
          <el-input
            v-model="apiInfo.apiUrl"
            :disabled="!checked"
            style="width:337px;margin-right:20px;"
          />
        </div>

        <div style="height:50px;">
          <el-checkbox class="api" v-model="checked"
            >是否通过Http输出</el-checkbox
          >
        </div>
      </div>
    </div>
    <div class="contract_box">
      <div class="contract_box_item_title">算法源码：</div>
      <div>
        <div class="flex" style=" align-items: flex-end;">
          <div class="param_box">
            <div class="param_box_label">应用目录:</div>
            <el-select
              v-model="algorithmSearch.scenarioId"
              clearable
              filterable
              style="width: 220px;margin-right: 34px;"
              @change="getAlgorithmListFunc"
            >
              <el-option
                v-for="item in applicationScenariosList"
                :key="item.id"
                :label="item.categoryName"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </div>
          <div class="param_box">
            <div class="param_box_label">算法名:</div>
            <el-select
              v-model="algorithm.name"
              style="width: 220px;margin-right: 20px;"
              clearable
              filterable
              @change="handleGetAlgorithm"
              placeholder=""
            >
              <el-option
                v-for="item in algorithmData"
                :key="item.id"
                :label="item.algorithmName"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <div style="position:relative;margin-top: 10px;">
          <el-input
            v-model="code"
            :disabled="!code"
            type="textarea"
            style="width:475px"
            :rows="10"
            @change="handleGetCode"
          />
          <transition
            enter-active-class="animate__fadeInDown"
            leave-active-class="animate__fadeOut"
          >
            <p v-show="visible.algorithmVisible" class="tips animate__animated">
              请选择算法并提取代码！
            </p>
          </transition>
        </div>
      </div>
      <div class="param_box" style="margin-top: 25px;">
        <div class="param_box_label">算法描述：</div>
        <div style="position:relative;">
          <el-input
            type="textarea"
            style="width:400px"
            v-model="algorithmDescription"
            :rows="5"
          >
          </el-input>
        </div>
      </div>
      <div class="param_box" style="margin-top: 25px;">
        <div class="param_box_label">申请用量：</div>
        <div style="position:relative;">
          <el-input
            v-model.number="amount"
            onkeyup="value=value.replace(/[^\d]/g,'')"
            @blur="doNumber(amount)"
            style="width:200px"
            placeholder=""
          />次
          <transition
            enter-active-class="animate__fadeInDown"
            leave-active-class="animate__fadeOut"
          >
            <p v-show="visible.amountVisible" class="tips animate__animated">
              请输入正整数，且最大不超过十位
            </p>
          </transition>
        </div>
      </div>
    </div>
    <div style="margin-top:20px;padding-bottom:50px;">
      <el-button type="primary" @click="handleCreate">确定</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>
    <el-dialog
      title="数据集"
      :visible.sync="centerDialogVisible"
      class="contract-list-wrap dialog-big"
      center
    >
      <div class="search_box_1">
        <div>
          <span>数据目录：</span>
          <el-select
            v-model="dataSearch.catalogId"
            clearable
            @change="getDataSetList"
            placeholder="请选择"
          >
            <el-option
              v-for="item in datasetCatalogList"
              :key="item.id"
              :label="item.categoryName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </div>
      </div>
      <el-table
        :data="tableData"
        border
        ref="multipleTable"
        @select="select"
        @row-click="rowClick"
        @selection-change="handleSelectionChange"
        style="width: 100%"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column prop="resourceName" label="数据集名称">
        </el-table-column>
        <el-table-column prop="resourceUrl" label="数据集地址">
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSubmitDataset">确 定</el-button>
        <el-button @click="centerDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";

import { HeaderMain } from "@/layout/components";
import { getAppDataUrl } from "@/api/dataSet";
import {
  getDatasetCatalog,
  getScenarioSettingForConsole
} from "@/api/ScenarioSetting";
import { getAlgorithmList } from "@/api/algorithm";
import { getAppList } from "@/api/myApp";
import {
  getContractDetails,
  createContract,
  getContractCode
} from "@/api/contract";
import { getResultTargetDsList } from "@/api/participantsManagement";
let flag = true;
export default {
  components: {
    HeaderMain
  },
  data() {
    return {
      checked: null,
      name: "",
      description: "",
      amount: "",
      taskType: "",
      HybridComputing: false,
      roleType: "",
      roleOptions: [
        {
          value: 1,
          roleName: "client"
        },
        {
          value: 2,
          roleName: "server"
        }
      ],
      applicationId: "",
      algorithmDescription: "",
      dataSearch: {
        catalogId: ""
      },
      algorithmSearch: {
        scenarioId: ""
      },
      tableData: [],
      datasetCatalogList: [],
      applicationScenariosList: [],
      multipleSelection: "",
      centerDialogVisible: false,
      datasetList: [
        {
          name: "",
          dsId: "",
          dataSetCode: "",
          resourceName: "",
          resourceUrl: "",
          inputsVisible: false,
          roleVisible: false
        }
      ],
      dsList: [{ name: "", outputDsId: "", outputsVisible: false }],
      index: -1,
      algorithm: {},
      algorithmData: [],
      appTableData: [],
      //任务类型
      taskOptions: [
        {
          value: "ss4",
          label: "SS4"
        },
        {
          value: "2pc",
          label: "2PC"
        },
        // {
        //   value: "homo",
        //   label: "HOMO"
        // }
      ],
      algorithmId: "",
      code: "",
      defaultDsId: "",
      operatorDsIds: [],
      resultDsIdList: [],
      id: this.$route.query.id,
      apiInfo: {
        apiUrl: "",
        apiMethod: ""
      },
      urlMethodList: [
        {
          value: "post",
          label: "post"
        },
        {
          value: "get",
          label: "get"
        }
      ],
      //验证
      visible: {
        taskTypeVisible: false,

        nameVisible: false,
        descriptionVisible: false,
        applicationIdVisible: false,
        amountVisible: false,
        algorithmVisible: false
      }
    };
  },
  mounted() {
    this.getScenarioSetting();
    this.getApps();
    this.getResultTargetDsListFunc();
    this.getContractDetailsFunc();
    this.getAlgorithmListFunc();
  },
    watch:{
    HybridComputing(newH){
      this.taskType=newH ? "" : "ss4"
    }
  },
  methods: {
    changeTask() {
      if (this.taskType === "2pc") {
        this.datasetList = [
          {
            name: "",
            dsId: "",
            dataSetCode: "",
            resourceName: "",
            resourceUrl: "",
            inputsVisible: false,
            roleVisible: false,
            roleType: ""
          },
          {
            name: "",
            dsId: "",
            dataSetCode: "",
            resourceName: "",
            resourceUrl: "",
            inputsVisible: false,
            roleVisible: false,
            roleType: ""
          }
        ];
        this.visible.taskTypeVisible = false;
      } else if (this.taskType === "") {
        this.visible.taskTypeVisible = true;
      } else {
        this.datasetList = [
          {
            name: "",
            dsId: "",
            dataSetCode: "",
            resourceName: "",
            resourceUrl: "",
            inputsVisible: false
          }
        ];
        this.visible.taskTypeVisible = false;
      }
    },
    //单选功能
    select(selection, row) {
      this.$refs.multipleTable.clearSelection();
      if (selection.length == 0) return;
      this.$refs.multipleTable.toggleRowSelection(row, true);
    },
    selectionChange(val) {
      this.selectData = val;
    },
    rowClick(row, column) {
      const selectData = this.selectData;
      this.$refs.multipleTable.clearSelection();
      if (selectData.length == 1) {
        selectData.forEach(item => {
          // 判断 如果当前的一行被勾选, 再次点击的时候就会取消选中
          if (item == row) {
            this.$refs.multipleTable.toggleRowSelection(row, false);
          }
          // 不然就让当前的一行勾选
          else {
            this.$refs.multipleTable.toggleRowSelection(row, true);
          }
        });
      } else {
        this.$refs.multipleTable.toggleRowSelection(row, true);
      }
    },
    // 合约详情
    getContractDetailsFunc() {
      getContractDetails(this.id).then(res => {
        if (res.code === 200) {
          this.name = res.data.name;
          this.description = res.data.description;
          this.amount = res.data.totalAmount;
          this.applicationId = res.data.applicationId;
          this.HybridComputing = res.data.isGemini==1?true:false;
          this.taskType = res.data.taskType;
          this.datasetList = res.data.inputs;
          this.dsList = res.data.outputs;
          this.description = res.data.description;
          if (res.data.apiInfo.apiUrl === "") {
            this.checked = false;
          } else {
            this.checked = true;
            this.apiInfo = res.data.apiInfo;
          }
          this.getContractCodeFunc(res.data.contractId);
        }
      });
    },
    // 合约算法
    getContractCodeFunc(id) {
      getContractCode(id).then(res => {
        if (res.code === 200) {
          this.code = res.data.code;
          this.algorithm.senarioId = res.data.senarioId;
          this.algorithm.name = res.data.name;
          this.algorithm.code = res.data.code;
          this.algorithm.description = res.data.description;
          this.algorithmDescription = res.data.description;
        }
      });
    },
    // 应用列表
    getApps() {
      let data = {
        pageNum: 1,
        pageSize: 999
      };
      getAppList(data).then(res => {
        if (res.code === 200) {
          this.appTableData = res.rows;
        }
      });
    },
    getResultTargetDsListFunc() {
      getResultTargetDsList().then(res => {
        if (res.code === 200) {
          this.resultDsIdList = res.data;
          this.resultDsIdList.forEach(e => {
            if (e.roleType === 2) {
              this.defaultDsId = e.dsId;
              this.dsList.forEach(v => {
                v.outputDsId = e.dsId;
              });
            }
          });
        }
      });
    },
    // 获取数据列表
    getDataSetList() {
      let params = {
        catalogId: this.dataSearch.catalogId
          ? this.dataSearch.catalogId
          : undefined,
        sourceType: this.HybridComputing?"1,3":undefined

      };
      getAppDataUrl(params).then(res => {
        if (res.code === 200) {
          this.tableData = res.data;
        }
      });
    },
    // 获取数据目录
    getDatasetCatalogFuc() {
      getDatasetCatalog().then(res => {
        if (res.code === 200) {
          this.datasetCatalogList = res.data;
          this.datasetCatalogList.unshift({ categoryName: "全部", id: "" });
        }
      });
    },
    // 获取场景列表
    getScenarioSetting() {
      getScenarioSettingForConsole().then(res => {
        if (res.code === 200) {
          this.applicationScenariosList = res.data;
          this.applicationScenariosList.unshift({
            categoryName: "全部",
            id: ""
          });
        }
      });
    },
    // 获取算法列表
    getAlgorithmListFunc() {
      let data = {
        scenarioId: this.algorithmSearch.scenarioId
          ? Number(this.algorithmSearch.scenarioId)
          : undefined,
        pageNum: 1,
        pageSize: 999
      };
      getAlgorithmList(data).then(res => {
        if (res.code === 200) {
          this.algorithmData = res.rows;

          this.algorithmId = "";
        }
      });
    },
    // 提取代码
    handleGetAlgorithm() {
      this.algorithmData.forEach(e => {
        if (this.algorithm.name === e.id) {
          this.algorithm.senarioId = e.scenarioId;
          this.algorithm.name = e.algorithmName;
          this.algorithm.code = e.content;
          this.algorithm.description = e.comment;
          this.algorithmDescription = e.comment;
          this.code = e.content;
        }
      });
      this.visible.algorithmVisible = false;
    },

    handleSubmitDataset() {
      this.datasetList[
        this.currentData
      ].resourceUrl = this.multipleSelection[0].resourceUrl;
      this.datasetList[this.currentData].dsId = this.multipleSelection[0].dsId;
      this.datasetList[
        this.currentData
      ].dataSetCode = this.multipleSelection[0].dataSetCode;
      this.datasetList[
        this.currentData
      ].resourceName = this.multipleSelection[0].resourceName;
      this.multipleSelection = [];
      this.currentData = "";
      this.centerDialogVisible = false;
    },
    handleSelectData(index) {
      this.getDatasetCatalogFuc();
      this.getDataSetList();
      this.centerDialogVisible = true;
      this.currentData = index;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleAddDataset() {
      let obj = {
        name: "",
        dsId: "",
        dataSetCode: "",
        resourceName: "",
        resourceUrl: "",
        inputsVisible: false
      };
      this.datasetList.push(obj);
    },
    handleDelectDataset(index) {
      this.datasetList.splice(index, 1);
    },
    handleAddDs() {
      let obj = {
        name: "",
        outputDsId: this.defaultDsId,
        outputsVisible: false
      };
      this.dsList.push(obj);
    },
    handleDelectDs(index) {
      this.dsList.splice(index, 1);
    },
    handleGetCode() {
      this.algorithm.code = this.code;
    },
    cancel() {
      this.$router.push({ path: "/application/contractManagement" });
    },
    verificationFunc(data) {
      flag=true
      let obj = {
        taskType: "任务类型",

        name: "合约名称",
        description: "合约描述",
        applicationId: "应用",
        amount: "申请用量",
        inputs: "输入参数",
        outputs: "输出参数",
        algorithm: "算法"
      };
      for (let x in data) {
        if (typeof data[x] === "string" || typeof data[x] === "number") {
          if (data[x] === "" || data[x] === 0) {
            if (obj[x] === "任务类型") {
              Object.keys(this.visible).forEach(el => {
                if (el == `${x}Visible`) {
                  this.visible[el] = true;
                } else {
                  this.visible[el] = false;
                }
              });

              flag = false;
              break;
            } else {
              // this.$message.info("请输入" + obj[x]);
              Object.keys(this.visible).forEach(el => {
                if (el == `${x}Visible`) {
                  this.visible[el] = true;
                } else {
                  this.visible[el] = false;
                }
              });
              flag = false;
              break;
            }
          }
        } else {
          if (data[x] instanceof Array) {
            if (obj[x] === "输入参数") {
              this.datasetList.forEach(el => {
                el.inputsVisible = false;
                el.roleVisible = false;
              });
              if (this.taskType === "2pc") {
                data[x].forEach((el, index) => {
                  if (!el.name || !el.resourceUrl) {
                    this.datasetList[index].inputsVisible = true;
                    flag = false;
                  } else if (!el.roleType) {
                    this.datasetList[index].roleVisible = true;
                    flag = false;
                  }
                });
              } else {
                data[x].forEach((el, index) => {
                  if (!el.name || !el.resourceUrl) {
                    this.datasetList[index].inputsVisible = true;
                    flag = false;
                  }
                });
              }
            } else {
              this.dsList.forEach(el => {
                el.outputsVisible = false;
              });
              data[x].forEach((el, index) => {
                if (!el.name) {
                  this.dsList[index].outputsVisible = true;
                  flag = false;
                }
              });
            }
          } else {
            if (!data[x].code) {
              // this.$message.info("请选择算法！");
              this.visibleAll();
              this.visible.algorithmVisible = true;
              flag = false;
              break;
            }
          }
        }
      }
      return flag;
    },
    //根据id获取名称
    getAppName(id) {
      let name = "";
      this.appTableData.forEach(e => {
        if (e.id === id) {
          name = e.appName;
        }
      });
      return name;
    },
    handleCreate() {
      let formData = new FormData();
      let data = {
        applicationId: this.applicationId,
        applicationName: this.getAppName(this.applicationId),
        name: this.name,
        description: this.description,
        taskType: this.taskType,

        inputs: this.datasetList,
        outputs: this.dsList,
        algorithm: this.algorithm,
        amount: Number(this.amount)
      };
      if (!this.verificationFunc(data)) return false;
      data.apiInfo = this.apiInfo;
      data.isGemini=this.HybridComputing?1:0
      data.operatorDsIds = this.operatorDsIds;
      data.id = this.id;
      formData.append("data", JSON.stringify(data));
      formData.append("file", this.file);
      createContract(formData).then(res => {
        if (res.code === 200) {
          this.$message.success("操作成功！");
          this.$router.push({ path: "/application/contractManagement" });
        }
      });
    },
    doTip(item, ind) {
      const reg = /^[a-zA-Z]/;
      if (!reg.test(item.name)) {
        this.datasetList.forEach((el, index) => {
          if (ind == index) {
            el.inputsVisible = true;
          }
        });
      } else {
        this.datasetList.forEach((el, index) => {
          if (ind == index) {
            el.inputsVisible = false;
          }
        });
      }
    },
    doTipOut(item, ind) {
      const reg = /^[a-zA-Z]/;
      if (!reg.test(item.name)) {
        this.dsList.forEach((el, index) => {
          if (ind == index) {
            el.outputsVisible = true;
          }
        });
      } else {
        this.dsList.forEach((el, index) => {
          if (ind == index) {
            el.outputsVisible = false;
          }
        });
      }
    },
    doNumber(value) {
      const reg = /^\d{1,10}$/;
      value = Number(value);
      if (reg.test(value)) {
        flag = true;
        this.visible.amountVisible = false;
      } else {
        flag = false;
        this.visible.amountVisible = true;
      }
    },
    visibleAll() {
      Object.keys(this.visible).forEach(el => {
        this.visible[el] = false;
      });
    },
    check(data) {
      if (data) {
        this.visible.nameVisible = false;
      } else {
        this.visible.nameVisible = true;
      }
    },
    checkDescription(data) {
      if (data) {
        this.visible.descriptionVisible = false;
      } else {
        this.visible.descriptionVisible = true;
      }
    },
    changeRole(value, index) {
      if (value) {
        this.datasetList.forEach((el, ind) => {
          if (ind == index) {
            el.roleVisible = false;
          }
        });
      } else {
        this.datasetList.forEach((el, ind) => {
          if (ind == index) {
            el.roleVisible = true;
          }
        });
      }
    }
  }
};
</script>
<style lang="scss">
.paramBox {
  display: flex;
  justify-content: flex-start;
  align-items: flex-end;
  margin-bottom: 23px;
}
.main_content_item1 {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  margin-bottom: 30px;
}
.images_dialog {
  .el-dialog__header {
    // border-bottom:1px solid #D8DBE0;
    padding: 0 20px;
    .el-dialog__title {
      display: block;
      // width: 110px;
      height: 0;
      line-height: 0;
      // text-align: center;
      // border-bottom:1px solid #4273DA;
    }
    .el-dialog__headerbtn {
      top: 10px;
      right: 10px;
    }
  }
  .el-dialog__body {
    padding: 0;
  }
}
.tips {
  position: absolute;
  left: 5px;
  top: 30px;
  font-size: 12px;
  color: red;
  width: 255px;
}
.desTip {
  top: 110px;
}
.animate__animated {
  animation-duration: 0.5s;
}
.addButton {
  width: 26px;
  height: 41px;
  border-radius: 50%;
  i {
    margin-left: -7px;
  }
}
</style>
