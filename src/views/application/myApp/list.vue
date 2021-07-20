<template>
  <!-- <div class="myApp tree-content flex"> -->
  <div class="myApp">
    <!-- <div class="tree-content-left">
      <el-input
        placeholder="请输入目录名称"
        prefix-icon="el-icon-search"
        style="margin-bottom: 25px;"
        v-model="filterText">
      </el-input>
      <el-tree
        class="filter-tree"
        :data="applicationScenariosList"
        :props="defaultProps"
        default-expand-all
        :expand-on-click-node="false"
        @node-click="handleNodeClick"
        :filter-node-method="filterNode"
        ref="tree">
      </el-tree>
    </div> -->
    <!-- <div class="tree-content-right"> -->
    <div>
      <!-- <div class="search_box tree_search_box" v-show="showSearch"> -->
      <div class="search_box" v-show="showSearch">
        <el-form :model="search" :inline="true">
          <el-form-item label="应用目录" prop="scenarioName" style="width: 250px">
            <treeselect
              :options="applicationScenariosList"
              v-model="search.scenarioId"
              :normalizer="normalizer"
              placeholder="应用目录"
            >
            </treeselect>
          </el-form-item>
          <el-form-item label="应用名称" prop="appName">
            <el-input v-model="search.appName" placeholder="请输入应用名称" />
          </el-form-item>
          <el-form-item class="searchButton">
            <el-button type="primary" @click="handleSearch">搜索</el-button>
            <el-button @click="handleReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="operation_btn" style="margin-top:20px;line-height: 36px;margin-right: 20px;margin-left: 20px;">
        <el-button type="primary" @click="addMyApp">创建应用</el-button>
        <right-toolbar
          :showSearch.sync="showSearch"
          @queryTable="getApps"
          :columns="columns"
        ></right-toolbar>
      </div>
      <div class="main_content tree_main_content">
        <el-table
          id="table1"
          :data="tableData"
          @sort-change="sortChange"
          style="width: 100%"
        >
          <el-table-column type="expand">
            <template slot-scope="props">
              <el-table
                id="table2"
                :data="props.row.children ? props.row.children : []"
                style="width: 100%"
              >
                <el-table-column label="" width="50" prop="" />
                <el-table-column type="expand">
                  <template slot-scope="props">
                    <div class="dataset_kernel">
                      <ul>
                        <li>
                          <h5
                            style="margin:0;font-weight:500;color:#000000;font-size:14px;"
                          >
                            数据集
                          </h5>
                          <div
                            style="margin:5px;"
                            v-for="(item, index) in props.row.datasetApproveList"
                            :key="index"
                          >
                            <el-tag size="medium">{{ item.datasetName }}</el-tag>
                            <el-tag size="medium">{{ item.providerName }}</el-tag>
                            <el-tag size="medium">{{
                              item.status | formatStatus
                              }}</el-tag>
                          </div>
                        </li>
                        <li>
                          <h5
                            style="margin:0;font-weight:500;color:#000000;font-size:14px;"
                          >
                            算法
                          </h5>
                          <div style="margin:5px;cursor: pointer">
                            <el-tag
                              size="medium"
                              @click="kernelView(props.row.contractId)"
                            >{{ props.row.algorithmName }}</el-tag
                            >
                          </div>
                        </li>
                      </ul>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="合约名称" width="500" prop="name">
                  <template slot-scope="prop">
                  <span
                    style="color: #3668D5; cursor: pointer"
                    @click="handleGoContractDetail(prop.row)"
                  >{{ prop.row.name }}</span
                  >
                  </template>
                </el-table-column>
                <el-table-column label="审批状态" width="100" prop="">
                  <template slot-scope="prop">
                    {{ prop.row.status | formatContractStatus }}
                  </template>
                </el-table-column>
                <el-table-column label="执行次数" prop="totalAmount" />
              </el-table>
            </template>
          </el-table-column>
          <el-table-column
            label="应用名称"
            prop="appName"
            min-width="160"
            v-if="columns[0].visible"
          />
          <el-table-column
            label="应用目录"
            min-width="160"
            prop="scenarioName"
            v-if="columns[1].visible"
          />
          <el-table-column
            label="描述"
            min-width="160"
            prop="description"
            v-if="columns[2].visible"
          />
          <el-table-column
            label="创建时间"
            min-width="160"
            sortable="custom"
            prop="createTimeText"
            v-if="columns[3].visible"
          />
          <el-table-column label="操作" class-name="fixed-width" min-width="200">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                plain
                @click.native.prevent="editApp(scope.row)"
              >编辑</el-button
              >
              <el-button
                size="mini"
                type="primary"
                plain
                @click.native.prevent="createCantret(scope.row)"
              >创建合约</el-button
              >

              <el-button
                size="mini"
                type="danger"
                plain
                @click.native.prevent="deleteRow(scope.row)"
              >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination-wrap" v-if="total">
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="pageNo"
          :limit.sync="pageSize"
          @pagination="getApps"
        />
      </div>
    </div>
    <el-dialog
      title="创建应用"
      :visible.sync="dialogVisible"
      class="dialog-middle"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="应用名称:" prop="appName">
          <el-input v-model="form.appName" />
        </el-form-item>
        <el-form-item label="应用目录:" prop="scenarioId">
          <treeselect
            :options="applicationScenariosList"
            v-model="form.scenarioId"
            :searchable="false"
            :normalizer="normalizer"
            @select="handelSelectScenario"
            placeholder="请选择"
          >
          </treeselect>
        </el-form-item>
        <el-form-item label="描述:" prop="description">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="4"
            placeholder="请输入内容"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addMyAppSubmit('form')"
          >确 定</el-button
        >
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="编辑应用"
      :visible.sync="editDialogVisible"
      class="dialog-middle"
    >
      <el-form ref="form" :model="editForm" label-width="100px">
        <el-form-item label="应用名称:">
          <el-input v-model="editForm.appName" :disabled="editFlag" />
        </el-form-item>
        <el-form-item label="应用目录:">
          <treeselect
            :options="applicationScenariosList"
            v-model="editForm.scenarioId"
            :searchable="false"
            :normalizer="normalizer"
            @select="handelSelectScenario1"
            placeholder="请选择"
          >
          </treeselect>
        </el-form-item>
        <el-form-item label="描述:">
          <el-input
            v-model="editForm.description"
            type="textarea"
            :rows="4"
            placeholder="请输入内容"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editMyAppSubmit">确 定</el-button>
        <el-button @click="handelCancel">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      class="kernelDialog dialog-middle"
      title="算法详情"
      :visible.sync="kernelDialogVisible"
    >
      <div style="height:100%">
        <div style="margin:10px 0">
          <span>描述:</span>
          <span>{{ description == null ? "暂无" : description }}</span>
        </div>
        <div style="height:90%">
          <span style="display:block;margin: 10px 0">代码:</span>
          <el-input
            style="height:100%"
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="textarea"
          >
          </el-input>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  createApp,
  getAppList,
  delApp,
  editApp,
  getContractListOfApp
} from "@/api/myApp";
import { getScenarioSettingForConsole } from "@/api/ScenarioSetting";
import { getContractCode } from "@/api/contract";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  name: "MyApp",
  components: { Treeselect },
  data() {
    return {
      search: {
        appName: "",
        scenarioId: 0
      },
      contractStatusList: [],
      tableData: [],
      tableData1: [],
      form: {
        appName: "",
        description: "",
        scenarioName: ""
      },
      editForm: {},
      editFlag: false,
      dialogVisible: false,
      editDialogVisible: false,
      applicationScenariosList: [{
        id: 0,
        upperId: 0,
        categoryName: "全部",
        childrenScenario:[]
      }], //场景列表
      pageNo: 1,
      pageSize: 10,
      total: 0,
      rules: {
        appName: [
          { required: true, message: "请输入应用名称", trigger: "blur" },
          { max: 15, message: "15个字符以内", trigger: "blur" }
        ],
        scenarioName: [
          { required: true, message: "请选择应用目录", trigger: "blur" }
        ],
        description: [
          { required: true, message: "请输入描述", trigger: "blur" },
          { max: 100, message: "100个字符以内", trigger: "blur" }
        ]
      },
      kernelDialogVisible: false,
      textarea: "",
      // 显示搜索条件
      showSearch: true,
      // 列信息
      columns: [
        { key: 0, label: `应用名称`, visible: true },
        { key: 1, label: `应用目录`, visible: true },
        { key: 2, label: `描述`, visible: true },
        { key: 3, label: `创建时间`, visible: true }
      ],
      orderByColumn: "",
      isAsc: "",
      description: "",
      filterText:'',
      defaultProps: {
        label: 'categoryName',
        children: 'childrenScenario',
      },
      normalizer(node) {
        return {
          id: node.id,
          label: node.categoryName,
          children: node.childrenScenario,
        }
      }
    };
  },
  mounted() {
    this.getApps();
    this.getScenarioSetting();
  },
  filters: {
    formatStatus(status){
      let statusList = ["待审批", "审批通过", "已拒绝","已撤销","被作废","无需操作"];
      let index = Number(status)-1
      console.log(status)
      console.log(index)
      console.log(statusList[index])
      console.log(statusList[0])
      return statusList[index]
    },
    formatContractStatus(status){
      let statusArr = ['未提审','审批中','已通过','已拒绝','失效','已撤销','已删除']
      let index = Number(status)-1
      return statusArr[index]
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  methods: {
    handelSelectScenario(node){
      this.form.scenarioName = node.categoryName
    },
    handelSelectScenario1(node){
      this.editForm.scenarioName = node.categoryName
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.categoryName.indexOf(value) !== -1;
    },
    handleNodeClick(data) {
      this.search.scenarioId = data.id;
      this.getApps()
    },
    sortChange(data) {
      this.orderByColumn = data.prop;
      this.isAsc = data.order === "ascending" ? "asc" : "desc";
      this.getApps();
    },
    // 获取场景列表
    getScenarioSetting() {
      getScenarioSettingForConsole().then(res => {
        if (res.code === 200) {
          this.applicationScenariosList[0].childrenScenario = res.data
        }
      });
    },
    getApps() {
      let data = {
        pageNum: this.pageNo,
        pageSize: this.pageSize,
        appName: this.search.appName || undefined,
        scenarioId: this.search.scenarioId || undefined,
        orderByColumn: this.orderByColumn || undefined,
        isAsc: this.isAsc || undefined
      };
      getAppList(data).then(res => {
        if (res.code === 200 && res.rows.length > 0) {
          res.rows.forEach(e => {
            this.handelExpand(res.rows, e);
          });
          this.total = res.total;
        } else {
          this.tableData = [];
          this.total = 0;
        }
      });
    },
    handelExpand(data, row) {
      getContractListOfApp(row.id).then(res => {
        if (res.code === 200) {
          data.forEach(e => {
            if (e.createTime) {
              const createT = new Date(e.createTime);
              const createTMonth =
                createT.getMonth() < 9
                  ? "0" + (createT.getMonth() + 1)
                  : createT.getMonth() + 1;
              const createTDay =
                createT.getDate() < 10
                  ? "0" + createT.getDate()
                  : createT.getDate();
              const createTHours =
                createT.getHours() < 10
                  ? "0" + createT.getHours()
                  : createT.getHours();
              const createTMinutes =
                createT.getMinutes() < 10
                  ? "0" + createT.getMinutes()
                  : createT.getMinutes();
              const createTSeconds =
                createT.getSeconds() < 10
                  ? "0" + createT.getSeconds()
                  : createT.getSeconds();
              e.createTimeText = `${createT.getFullYear()}-${createTMonth}-${createTDay} ${createTHours}:${createTMinutes}:${createTSeconds}`;
            }
            if (e.id === row.id) {
              e.children = res.data;
              e.editFlag = e.children.some(el => {
                return el.status === 3;
              });
            }
          });
          this.tableData = data;
        }
      });
    },
    handleGoContractDetail(row) {
      this.$router.push({
        path: "/application/contractDetail",
        query: { id: row.contractId }
      });
    },

    handleSearch() {
      this.getApps();
    },
    handleReset() {
      this.search.scenarioId = 0;
      this.search.appName = "";
      this.getApps();
    },
    kernelView(id) {
      getContractCode(id).then(res => {
        if (res.code === 200) {
          this.textarea = res.data.code;
          this.description = res.data.description;
          this.kernelDialogVisible = true;
        }
      });
    },
    createCantret(row) {
      this.$router.push({
        path: "/application/createContract",
        query: { id: row.id }
      });
    },
    addMyApp() {
      this.form.appName = "";
      this.form.description = "";
      this.form.scenarioName = "";
      this.form.scenarioId = 0;
      this.dialogVisible = true;
    },
    addMyAppSubmit(formName) {
      if (!this.form.scenarioId) {
        this.$message.error('请选择应用目录！')
        return false;
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          let data = {
            appName: this.form.appName,
            scenarioId: this.form.scenarioId,
            scenarioName: this.form.scenarioName,
            description: this.form.description
          };
          createApp(data).then(res => {
            if (res.code === 200) {
              this.$message({
                type: "success",
                message: "创建成功!"
              });
              this.dialogVisible = false;
              this.getApps();
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    deleteRow(row) {
    this.$confirm('此操作将永久删除该应用, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonClass: "btn-custom-cancel",
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
       delApp(row.id).then(res => {
        if (res.code === 200) {
          this.$message.success("删除成功！");
          this.getApps();
        }
      })
      }).catch(() => {})

    },
    editApp(row) {
      this.editDialogVisible = true;
      this.editForm = row;
      this.editForm.scenarioId = row.scenarioId;
      this.editForm.scenarioName = row.scenarioName;
      this.editFlag = row.editFlag;
    },
    editMyAppSubmit() {
      if (!this.editForm.scenarioId) {
        this.$message.error('请选择应用目录！')
        return false;
      }
      let data = {
        id: this.editForm.id,
        scenarioId: this.editForm.scenarioId,
        scenarioName: this.editForm.scenarioName,
        description: this.editForm.description,
        appName: this.editFlag ? undefined : this.editForm.appName
      };
      editApp(data).then(res => {
        if (res.code === 200) {
          this.$message.success("操作成功！");
          this.editDialogVisible = false;
          this.getApps();
        }
      });
    },
    handelCancel() {
      this.getApps();
      this.editDialogVisible = false;
    }
  }
};
</script>
<style lang="scss" scoped></style>
<style lang="scss">
.myApp {
  .el-table__header-wrapper {
    tr {
      .cell {
        color: #000000;
        font-weight: 500;
      }
    }
  }
  #table1 {
    .el-table__header-wrapper {
      tr {
        th {
          background-color: #fff !important;
        }
      }
    }
    .el-table__body {
      tr {
        td {
          /*background-color: #F7F9FD!important;*/
        }
      }
    }
    .el-table__expanded-cell[class*="cell"] {
      padding: 0 !important;
    }
    #table2 {
      background-color: #fff !important;
      .el-table__header-wrapper {
        tr {
          th {
            background-color: #fff !important;
          }
        }
      }
      .el-table__body {
        tr {
          td {
            background-color: #fff !important;
          }
        }
      }
      .dataset_kernel {
        background-color: #fff;
        padding: 10px 0;
        ul {
          margin: 0 30px;
        }
      }
    }
  }
}
</style>
<style lang="scss">
.myApp {
  .el-table__header-wrapper {
    tr {
      .cell {
        color: #000000;
        font-weight: 500;
      }
    }
  }
  #table1 {
    .el-table__header-wrapper {
      tr {
        th {
          background-color: #fff !important;
        }
      }
    }
    .el-table__body {
      tr {
        td {
          /*background-color: #F7F9FD!important;*/
        }
      }
    }
    .el-table__expanded-cell[class*="cell"] {
      padding: 0 !important;
    }
    #table2 {
      background-color: #fff !important;
      .el-table__header-wrapper {
        tr {
          th {
            background-color: #fff !important;
          }
        }
      }
      .el-table__body {
        tr {
          td {
            background-color: #fff !important;
          }
        }
      }
      .dataset_kernel {
        background-color: #fff;
        padding: 10px 0;
        ul {
          margin: 0 30px;
        }
      }
    }
  }
  .kernelDialog {
    .el-dialog {
      height: 100%;
      margin: 0 !important;
      left: auto;
      right: 0 !important;
      position: absolute;
    }
    .el-dialog__body {
      height: calc(100% - 55px);
      .el-textarea__inner {
        height: 100%;
      }
    }
  }
}
</style>
