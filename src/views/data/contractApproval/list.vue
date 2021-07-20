<template>
  <div>
    <div class="search_box" v-show="showSearch">
      <el-form :model="search" :inline="true">
        <el-form-item label="合约名称" prop="name">
          <el-input v-model="search.name" placeholder="请输入合约名称" />
        </el-form-item>
        <el-form-item label="数据集名称" prop="datasetNames">
          <el-input
            v-model="search.datasetNames"
            placeholder="请输入数据集名称"
          />
        </el-form-item>
        <el-form-item label="发起方" prop="dsName">
          <el-select v-model="search.dsId" clearable placeholder="请选择">
            <el-option
              v-for="item in dsList"
              :key="item.dsId"
              :label="item.dsName"
              :value="item.dsId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="操作状态">
          <el-select
            v-model="search.approveStatus"
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in datasetApproveStatusList"
              :key="item.value"
              :label="item.status"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="合约状态" prop="contractStatus">
          <el-select
            v-model="search.contractStatus"
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in contractStatusList"
              :key="item.value"
              :label="item.contractStatus"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="searchButton">
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="operation_btn" style="margin-top:20px;line-height: 36px">
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getContractApproveList"
        :columns="columns"
      ></right-toolbar>
    </div>
    <div class="main_content">
      <el-table
        :data="tableData"
        @sort-change="sortChange"
        :default-sort = "{prop: 'updateTime', order: 'descending'}"
        class="left-align-table"
        style="width: 100%;margin-top: 30px;"
      >
        <el-table-column prop="name" label="合约名称" v-if="columns[0].visible">
          <template slot-scope="scope">
            <span
              class="text_color"
              style="cursor:pointer;"
              @click="handleGoContract(scope.row)"
              >{{ scope.row.name }}</span
            >
          </template>
        </el-table-column>
        <el-table-column
          prop="appName"
          label="应用名称"
          v-if="columns[1].visible"
        />
        <el-table-column prop="dsName" label="发起方" v-if="columns[2].visible">
        </el-table-column>
        <el-table-column
          prop="datasetNames"
          label="数据集名称"
          v-if="columns[3].visible"
        >
          <template slot-scope="scope">
            {{ getdatasetNames(scope.row.datasetNames) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="totalAmount"
          label="使用次数"
          v-if="columns[4].visible"
        />
        <el-table-column
          prop="approveStatus"
          label="操作状态"
          v-if="columns[5].visible"
        >
          <template slot-scope="scope">
            {{ getApproveStatus(scope.row.approveStatus) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="contractStatus"
          label="合约状态"
          v-if="columns[6].visible"
        >
          <template slot-scope="scope">
            {{ getContractStatus(scope.row.contractStatus) }}
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="备注" v-if="columns[7].visible" />
        <el-table-column
          prop="updateTime"
          sortable="custom"
          label="更新时间"
          width="230"
          v-if="columns[8].visible"
        >
          <template slot-scope="scope">
            {{ formatTime(scope.row.updateTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" class-name="fixed-width" min-width="150">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              plain
              @click="handleViewCode(scope.row)"
              >查看算法</el-button
            >
            <el-button
              size="mini"
              type="primary"
              plain
              v-if="scope.row.approveStatus === 2"
              @click="handleApproval(scope.row, 4)"
              >撤销</el-button
            >
            <el-button
              size="mini"
              type="primary"
              plain
              v-if="scope.row.approveStatus === 1"
              @click="handleApproval(scope.row, 2)"
              >通过</el-button
            >
            <el-button
              size="mini"
              type="primary"
              plain
              v-if="scope.row.approveStatus === 1"
              @click="handleApproval(scope.row, 3)"
              >拒绝</el-button
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
        @pagination="getContractApproveList"
      />
    </div>
    <el-dialog
      title="算法详情"
      :visible.sync="codeDialogVisible"
      class="dialog-middle kernelDialog"
    >
      <div>
        <el-input type="textarea" :rows="15" v-model="code"></el-input>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  approveList,
  approveContract,
  getDataContractCode,
  getContractApprove,
  getDsList
} from "@/api/contract";
import { Base64 } from "js-base64";
export default {
  name: "ApprovalList",
  data() {
    return {
      search: {
        name: "",
        datasetNames: "",
        dsName: "",
        approveStatus: "",
        contractStatus: ""
      },
      pageNo: 1,
      pageSize: 10,
      total: 0,
      dsList: [],
      tableData: [],
      datasetApproveStatusList: [
        {
          value: 1,
          status: "待审批"
        },
        {
          value: 2,
          status: "审批通过"
        },
        {
          value: 3,
          status: "已拒绝"
        },
        {
          value: 4,
          status: "已撤销"
        },
        {
          value: 6,
          status: "无需操作"
        }
      ],
      contractStatusList: [
       
        {
          value: 2,
          contractStatus: "审批中"
        },
        {
          value: 3,
          contractStatus: "已通过"
        },
        {
          value: 4,
          contractStatus: "已拒绝"
        },
       
        {
          value: 6,
          contractStatus: "已撤销"
        }
      ],
      activeIndex: 0,
      codeDialogVisible: false,
      code: "",
      env: "",
      orderByColumn: "updateTime",
      isAsc: "desc",
      tabIndex: "",
      // 显示搜索条件
      showSearch: true,
      // 列信息
      columns: [
        { key: 0, label: `合约名称`, visible: true },
        { key: 1, label: `应用名称`, visible: true },
        { key: 2, label: `发起方`, visible: true },
        { key: 3, label: `数据集名称`, visible: true },
        { key: 4, label: `使用次数`, visible: true },
        { key: 5, label: `操作状态`, visible: true },
        { key: 6, label: `合约状态`, visible: true },
        { key: 7, label: `备注`, visible: true },
        { key: 8, label: `更新时间`, visible: true },
        { key: 9, label: `操作`, visible: true }
      ]
    };
  },
  mounted() {
    this.getContractApproveList();
    this.getDsList();
    this.getdatasetNames();
  },
  // filters: {
  //   analyzeDatasetNames(data) {
  //     let str = "";
  //     const datasetNames = JSON.parse(data);
  //     datasetNames.forEach((e, i) => {
  //       str += i === 0 ? "" + e : "," + e;
  //     });
  //     return str;
  //   }
  // },
  methods: {
    sortChange(data) {
      this.orderByColumn = data.prop;
      this.isAsc = data.order === "ascending" ? "asc" : "desc";
      this.getContractApproveList();
    },
    getContractApproveList() {
      let datasetNamesArr = [];
      if (this.search.datasetNames ==='') {
        datasetNamesArr = undefined;
        } else {
        datasetNamesArr[0]= this.search.datasetNames;
        datasetNamesArr = JSON.stringify(datasetNamesArr);
      }

      let params = {
        pageNum: this.pageNo,
        pageSize: this.pageSize,
        orderByColumn: this.orderByColumn ,
        isAsc: this.isAsc 
      };
      console.log(params);
      let data = {
         name: this.search.name|| undefined,
        datasetNames: datasetNamesArr|| undefined,
        creatorDsId: this.search.dsId|| undefined,
        approveStatus: this.search.approveStatus|| undefined,
        contractStatus: this.search.contractStatus===""?undefined:this.search.contractStatus,
      }
      getContractApprove(params,data).then(res => {
        if (res.code === 200) {
          this.tableData = res.rows;
          this.total = res.total;
        }
      });
    },
    getDsList() {
      getDsList().then(res => {
        if (res.code === 200) {
          this.dsList = res.data;
        }
      });
    },
    getdatasetNames(row) {
      if (row !== undefined) {
        let arr = JSON.parse(row);
        return arr.join(",");
      }
    },
    getApproveStatus(row) {
      switch (row) {
        case 1:
          return "待审批";
          break;
        case 2:
          return "审批通过";
          break;
        case 3:
          return "已拒绝";
          break;
        case 4:
          return "已撤销";
          break;
        case 5:
          return "被作废";
          break;
        case 6:
          return "无需操作";
          break;
      }
    },
    getContractStatus(row) {
      switch (row) {
        case 1:
          return "未提审";
          break;
        case 2:
          return "审批中";
          break;
        case 3:
          return "已通过";
          break;
        case 4:
          return "已拒绝";
          break;
        case 5:
          return "失效";
          break;
        case 6:
          return "已撤销";
          break;
        case 7:
          return "已删除";
          break;
      }
    },
    // handleTab(data, index){
    //   this.activeIndex = index
    //   this.tabIndex = data.id
    //   this.getContractApproveList(data.id)
    // },
    formatTime(time) {
      if (time) {
        var date = new Date(time + 8 * 3600 * 1000); // 增加8小时
        return date
          .toJSON()
          .substr(0, 19)
          .replace("T", " ");
      } else {
        return "-";
      }
    },
    handleSearch() {
      this.getContractApproveList();
    },
    handleReset() {
      this.search.name = "";
      this.search.datasetNames = "";
      this.search.dsName = "";
      this.search.approveStatus = "";
      this.search.contractStatus = "";

      this.getContractApproveList();
    },
    handleApproval(row, data) {
      this.$prompt("请输入备注", "", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        cancelButtonClass: "btn-custom-cancel",
        inputType: "textarea"
      })
        .then(({ value }) => {
          const params = {
            action: data,
            remark: value ? value : ""
          };
          const params1 = {
            contractId: row.contractId,
            action: data,
            remark: value ? value : ""
          };
          approveContract(
            params,
            row.contractId,
            Base64.encode(JSON.stringify(params1))
          ).then(res => {
            if (res.code === 200) {
              this.$message.success("操作成功！");
              this.getContractApproveList();
            }
          });
        })
        .catch(() => {});
    },
    handleViewCode(row) {
      getDataContractCode(row.contractId).then(res => {
        if (res.code === 200) {
          this.codeDialogVisible = true;
          this.code = res.data.code;
        }
      });
    },
    handleGoContract(row){
      this.$router.push({path:'/data/contractDetail',query:{id: row.contractId}})
    }
  }
};
</script>
<style lang="scss" >
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
</style>
