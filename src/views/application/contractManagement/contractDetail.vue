<template>
  <div style="background: #fff;">
    <div class="main_content" style="padding-top: 40px;">
      <el-form ref="form" label-width="120px">
        <el-form-item label="合约ID">
          <span class="pl15">{{ contractDetail.contractId }}</span>
        </el-form-item>
        <el-form-item label="合约名称">
          <span class="pl15">{{ contractDetail.name }}</span>
        </el-form-item>
        <el-form-item label="合约状态">
          <span class="pl15">{{ contractDetail.status | formatStatus }}</span>
        </el-form-item>
        <el-form-item label="算法名称">
          <a
            class="pl15"
            @click="codeDialogVisible = true"
            style="text-decoration:underline;"
            >{{ contractDetail.algorithmName }}</a
          >
        </el-form-item>
        <el-form-item label="创建时间">
          <span class="pl15">{{ contractDetail.createTime | formatTime }}</span>
        </el-form-item>
        <el-form-item label="更新时间">
          <span class="pl15">{{ contractDetail.updateTime | formatTime }}</span>
        </el-form-item>
        <el-form-item label="合约描述">
          <span class="pl15">{{ contractDetail.description }}</span>
        </el-form-item>
        <el-form-item label="数据来源">
          <div v-for="item in contractDetail.dataSources" :key="item.dsId">
            <el-table
              class="pl15"
              :data="item.inputs"
              border
              style="width: 50%"
              :header-cell-style="cellStyle"
              :header-row-class-name="item.dataApprvStatus | filterClassName"
            >
              <el-table-column :label="item.dsName + ' (' + item.dsId + ')'">
                <el-table-column
                  :label="
                    getApproveStatus(item.dataApprvStatus) +
                      (item.remark || '-')
                  "
                >
                  <el-table-column prop="resourceName" label="数据集名称">
                  </el-table-column>
                  <el-table-column prop="resourceUrl" label="数据集地址">
                  </el-table-column>
                  <el-table-column prop="name" label="输入参数">
                  </el-table-column>
                  <el-table-column prop="roleType" label="角色">
                    <template slot-scope="scope">
                      <span>{{scope.row === 1? 'client' : scope.row === 2?'server' : '-'}}</span>
                    </template>
                  </el-table-column>
                </el-table-column>
              </el-table-column>
            </el-table>
          </div>
        </el-form-item>
        <el-form-item label="结果存储">
          <div v-for="item in contractDetail.results" :key="item.dsId">
            <el-table
              class="pl15"
              :data="item.outputs"
              border
              style="width: 50%"
              :header-cell-style="cellStyle"
              :header-row-class-name="tableRowClassName"
            >
              <el-table-column
                :label="item.dsName + ' (' + (item.dsId || '-') + ')'"
                style="background-color:red;"
              >
                <el-table-column prop="name" label="结果变量名称">
                </el-table-column>
                <el-table-column prop="outputDsId" label="数据服务标识符">
                </el-table-column>
              </el-table-column>
            </el-table>
          </div>
        </el-form-item>
        <el-form-item label="申请用量">
          <span class="pl15">{{ contractDetail.totalAmount }}次</span>
        </el-form-item>
        <el-form-item label="剩余用量">
          <span class="pl15">{{ contractDetail.leftAmount }}次</span>
        </el-form-item>
        <el-form-item label="已执行任务">
          <el-table class="pl15" :data="tableData" border style="width: 80%">
            <el-table-column prop="contractExecutionId" label="执行流水号">
            </el-table-column>
            <el-table-column prop="startTime" label="创建时间">
              <template slot-scope="scope">
                {{ scope.row.startTime | formatExecutionTime }}
              </template>
            </el-table-column>
            <el-table-column prop="taskStatus" label="状态">
              <template slot-scope="scope">
                {{ scope.row.taskStatus | formatExecutionStatus }}
              </template>
            </el-table-column>
            <el-table-column
              prop=""
              width="180"
              class-name="fixed-width"
              label="操作"
            >
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="small"
                  v-if="scope.row.taskStatus === 2"
                  @click="handleSeeResult(scope.row)"
                  >查看结果</el-button
                >
                <el-button
                  type="text"
                  size="small"
                  v-if="scope.row.taskStatus === 1"
                  >-</el-button
                >
                <el-button
                  type="text"
                  size="small"
                  v-if="scope.row.taskStatus === 3"
                  @click="handleSeeReason(scope.row)"
                  >查看原因</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <div style="text-align: right; width: 80%;margin-top: 15px;">
            <pagination
              v-show="total > 0"
              :total="total"
              :page.sync="pageNo"
              :limit.sync="pageSize"
              @pagination="getExecutionRecordListFunc"
            />
          </div>
        </el-form-item>
        <el-form-item label="更新时间">
          <span v-if="contractDetail.updateTime">{{
            contractDetail.updateTime | formatTime
          }}</span>
          <span v-if="!contractDetail.updateTime">-</span>
        </el-form-item>
        <el-form-item label="合约描述">
          <span>{{ contractDetail.description }}</span>
        </el-form-item>
        <el-form-item label="结果api输出地址">
          <span>{{
            contractDetail.apiInfo == "" ? contractDetail.apiInfo.apiUrl : "-"
          }}</span>
        </el-form-item>
        <el-form-item label="结果api输出方式">
          <span>{{
            contractDetail.apiInfo == ""
              ? contractDetail.apiInfo.apiMethod
              : "-"
          }}</span>
        </el-form-item>
      </el-form>
      <el-dialog
        title=""
        :visible.sync="centerDialogVisible"
        class="dialog-middle"
        center
      >
        <el-table :data="resultData" border style="width: 100%">
          <el-table-column prop="name" label="结果变量名" />
          <el-table-column
            prop=""
            class-name="fixed-width"
            width="180"
            label="操作"
          >
            <template slot-scope="scope">
              <a
                @click="
                  download(
                    downloadUrl + scope.row.id,
                    {},
                    scope.row.name + '.csv',
                    'get'
                  )
                "
              >
                <el-button type="text" size="small">下载结果</el-button>
              </a>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
      <el-dialog
        title=""
        :visible.sync="failReasonDialogVisible"
        class="dialog-big"
        center
      >
        <div>
          {{ failReason }}
        </div>
      </el-dialog>
    </div>
    <el-dialog
      title="算法详情"
      :visible.sync="codeDialogVisible"
      class="dialog-middle kernelDialog"
    >
      <div>
        <el-input
          type="textarea"
          :rows="15"
          v-model="contractDetail.algorithmCode"
        ></el-input>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";
import { getContractDetails } from "@/api/contract";
import {
  getExecutionRecordListForConsole,
  queryFailReason
} from "@/api/executionRecord";

export default {
  name: "ContractDetail",
  data() {
    return {
      contractDetail: "",
      id: this.$route.query.id,
      tableData: [],
      resultData: [],
      downloadUrl: "/console/dataConsumerContractExecutionResult/download/",
      centerDialogVisible: false,
      failReasonDialogVisible: false,
      failReason: "",
      pageNo: 1,
      total: 0,
      pageSize: 10,
      codeDialogVisible: false
    };
  },
  mounted() {
    this.getContractDetailsFunc();
    this.getExecutionRecordListFunc();
    // this.getApi()
  },
  filters: {
    formatStatus(status) {
      let index = Number(status) - 1;
      let statusList = [
        "未提审",
        "审核中",
        "已通过",
        "已拒绝",
        "失效",
        "已撤销",
        "已删除"
      ];
      return statusList[index];
    },
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
    formatExecutionTime(time) {
      if (time) {
        var date = new Date(time + 8 * 3600 * 1000); // 增加8小时
        return date
          .toJSON()
          .substr(0, 19)
          .replace("T", " ");
      }
    },
    formatExecutionStatus(status) {
      let statusArr = ["运行中", "成功", "失败"];
      let index = Number(status) - 1;
      return statusArr[index];
    },
    filterClassName(status) {
      if (status === 1) {
        return "commentColorYellow";
      } else if (status === 2) {
        return "commentColor";
      } else {
        return "commentColorRed";
      }
    }
  },
  methods: {
    getContractDetailsFunc() {
      getContractDetails(this.id).then(res => {
        if (res.code === 200) {
          this.contractDetail = res.data;
        }
      });
    },
    getExecutionRecordListFunc() {
      let data = {
        contractId: this.id,
        pageNum: this.pageNo,
        pageSize: 10
      };
      getExecutionRecordListForConsole(data).then(res => {
        if (res.code === 200) {
          this.tableData = res.rows;
          this.total = res.total;
        }
      });
    },
    handleCurrentChange(index) {
      this.pageNo = index;
      this.getExecutionRecordListFunc();
    },

    handleSeeResult(row) {
      this.resultData = [];
      if (row.executionResults) {
        this.resultData = row.executionResults;
        this.centerDialogVisible = true;
      } else {
        this.$message.info("暂无结果！");
        return false;
      }
    },
    handleSeeReason(data) {
      queryFailReason({ contractExecutionId: data.contractExecutionId }).then(
        res => {
          if (res.code === 200) {
            this.failReason = res.data;
            this.failReasonDialogVisible = true;
          }
        }
      );
    },
    getApproveStatus(row) {
      if (row !== undefined) {
        switch (row) {
          case 0:
            return "未提审";
            break;
          case 1:
            return "待审批";
            break;
          case 2:
            return "已通过:";
            break;
          case 3:
            return "已拒绝:";
            break;
          case 4:
            return "已撤销:";
            break;
          case 5:
            return "被作废";
            break;
          case 6:
            return "无需操作";
            break;
        }
      } else {
        return "-";
      }
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 0) {
        return "titleBg";
      }
    },
    cellStyle({ row, rowIndex }) {
      if (rowIndex === 0) {
        return "background:#F3F5FC !important;";
      }
    }
  }
};
</script>
