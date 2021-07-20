<template>
  <div>
    <div class="search_box" v-show="showSearch">
      <el-form :model="search" :inline="true">
        <el-form-item label="合约ID" prop="contractId">
          <el-input v-model="search.contractId" placeholder="请输入合约名称" />
        </el-form-item>
        <el-form-item label="任务ID" prop="taskId">
          <el-input
            v-model="search.taskId"
            placeholder="请输入数据集名称"
          />
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
        @queryTable="getEvidenceListFunc"
        :columns="columns"
      ></right-toolbar>
    </div>
    <div class="main_content">
      <el-table
        :data="tableData"
        @sort-change="sortChange"
        :default-sort = "{prop: 'createTime', order: 'descending'}"
        class="left-align-table"
        style="width: 100%;margin-top: 30px;"
      >
        <el-table-column prop="id" label="存证流水号" min-width="200" v-if="columns[0].visible"></el-table-column>
        <el-table-column
          prop="contractId"
          min-width="200"
          label="合约ID"
          v-if="columns[1].visible">
          <template slot-scope="scope">
            <span @click="handleGoContract(scope.row)">{{ scope.row.contractId }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="taskId"  min-width="200" label="任务ID" v-if="columns[2].visible"></el-table-column>
        <el-table-column
          min-width="200"
          prop="createTime"
          label="存证时间"
          v-if="columns[3].visible"
        >
          <template slot-scope="scope">
            {{ formatTime(scope.row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" class-name="fixed-width" min-width="100">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              plain
              @click="handleView(scope.row)"
            >查看内容</el-button>
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
        @pagination="getEvidenceListFunc"
      />
    </div>
    <el-dialog
      title="存证内容"
      :visible.sync="codeDialogVisible"
      class="dialog-middle kernelDialog"
    >
      <div>
        <el-input type="textarea" :rows="15" v-model="content"></el-input>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {getEvidenceList} from "@/api/evidence";
  export default {
    name: "EvidenceList",
    data() {
      return {
        search: {
          taskId: "",
          contractId: ""
        },
        pageNo: 1,
        pageSize: 10,
        total: 0,
        tableData: [],
        codeDialogVisible: false,
        orderByColumn: "createTime",
        isAsc: "desc",
        // 显示搜索条件
        showSearch: true,
        // 列信息
        columns: [
          { key: 0, label: `存证流水号`, visible: true },
          { key: 1, label: `合约ID`, visible: true },
          { key: 2, label: `任务ID`, visible: true },
          { key: 3, label: `存证时间`, visible: true },
        ],
        content:''
      };
    },
    mounted() {
      this.getEvidenceListFunc();
    },
    methods: {
      sortChange(data) {
        this.orderByColumn = data.prop;
        this.isAsc = data.order === "ascending" ? "asc" : "desc";
        this.getEvidenceListFunc();
      },
      getEvidenceListFunc() {
        let params = {
          pageNum: this.pageNo,
          pageSize: this.pageSize,
          orderByColumn: this.orderByColumn ,
          isAsc: this.isAsc,
          contractId: this.search.contractId|| undefined,
          taskId: this.search.taskId|| undefined,
        };
        getEvidenceList(params).then(res => {
          if (res.code === 200) {
            this.tableData = res.rows;
            this.total = res.total;
          }
        });
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
      handleSearch() {
        this.pageNo  = 1;
        this.getEvidenceListFunc();
      },
      handleReset() {
        this.search.contractId = "";
        this.search.taskId = "";
        this.getEvidenceListFunc();
      },
      handleView(row) {
        this.content = row.hash;
        this.codeDialogVisible = true;
      },
      handleGoContract(row){
        this.$router.push({path:'/data/contractDetail',query:{id: row.contractId}});
      }
    }
  };
</script>
