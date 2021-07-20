<template>
  <div class="statisticsReport">
    <div class="statisticsReport_top">
      <el-card
        shadow="hover"
        style="width:30%;height: 23vw;margin:40px 0;"
      >
        <percentDataset :data="percentDatasetData" />
      </el-card>
      <el-card
        shadow="hover"
        style="width:30%;height: 23vw;margin:40px 0;"
      >
        <div class="report percentScenario">
          <percentScenario :data="percentScenarioData" />
        </div>
      </el-card>
      <el-card
        shadow="hover"
        style="width:30%;height: 23vw;margin:40px 0;"
      >
        <div class="report reportColumnlist">
          <reportColumnlist :data="reportColumnlistData" />
        </div>
      </el-card>
    </div>
    <el-card class="statisticsReport_bottom" shadow="never" style="padding:10px;">
      <h4>数据集使用统计</h4>
      <el-form :model="search" :inline="true">
        <el-form-item label="数据集名称" prop="datasetName">
          <el-input
            v-model="search.datasetName"
            placeholder="请输入数据集名称"
            style="width: 240px"
            @keyup.enter.native="handleSearch"
          />
        </el-form-item>
        <el-form-item label="数据提供方" prop="dsId">
          <el-select
            v-model="search.dsId"
            placeholder="数据提供方"
            clearable
            style="width: 240px"
          >
            <el-option
              v-for="(item, index) in userCorpList"
              :key="index"
              :label="item.dsName"
              :value="item.dsId"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="searchButton">
          <el-button
            type="primary"
            @click="handleSearch"
            >搜索</el-button
          >
          <el-button @click="handleReset"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
      <el-table
        :data="tableData"
        :default-sort="{ prop: 'userCounts', order: 'descending' }"
        border
        style="width: 100%;"
        @sort-change="tableSortChange"
      >
        <el-table-column prop="datasetName" label="数据集名称">
        </el-table-column>
        <el-table-column prop="dsName" label="数据提供方"> </el-table-column>
        <el-table-column
          prop="userCounts"
          label="引用计数"
          sortable="custom"
        ></el-table-column>
        <!--<el-table-column-->
          <!--prop="executeCounts"-->
          <!--label="读取次数"-->
          <!--sortable="custom"-->
        <!--&gt;-->
        <!--</el-table-column>-->
      </el-table>
      <div class="pagination-wrap" v-if="total">
     <pagination
      v-show="total>0"
      :total="total"
      :page.sync="pageNum"
      :limit.sync="pageSize"
      @pagination="getDatasetReportList"
    />
      </div>
    </el-card>
  </div>
</template>
<script>
import percentDataset from "./percentDataset";
import percentScenario from "./percentScenario";
import reportColumnlist from "./reportColumnlist";
import { getStatisticsReport, getDatasetReport } from "@/api/statisticsReport";
import { getParticipantsManagement } from "@/api/participantsManagement";

export default {
  name: "StatisticsReport",
  components: {
    percentDataset,
    percentScenario,
    reportColumnlist
  },
  data() {
    return {
      tableData: [],
      percentDatasetData: [],
      percentScenarioData: [],
      reportColumnlistData: [],
      total: 0,
      pageNum: 1,
      pageSize: 10,
      search: {
        datasetName: "",
        dsId: ""
      },
      userCorpList: [],
      sort: {
        SortColumn: "userCounts",
        sortAsc: false
      },
      sortColumn: ""
    };
  },
  mounted() {
    this.getData();
    this.getDatasetReportList();
    this.operatorGetUserCorp();
  },
  methods: {
    getData() {
      let params = {
        pageNo: this.pageNo,
        pageSize: this.pageSize
      };
      getStatisticsReport(params).then(res => {
        if (res.code === 200) {
          this.percentDatasetData = res.data.percentDataset;
          this.percentScenarioData = res.data.percentScenario;
          this.reportColumnlistData = res.data.reportColumnlist;
        }
      });
    },
    getDatasetReportList() {
      let params = {
        pageNum: this.pageNum,
        pageSize: this.pageSize,

        ...this.sort,
        ...(this.search.datasetName
          ? {
              datasetName: this.search.datasetName
            }
          : null),
        ...(this.search.dsId
          ? {
              dsId: this.search.dsId
            }
          : null)
      };
      getDatasetReport(params).then(res => {
        if(res.code==200){
          this.tableData = res.rows;
          this.total = res.total;
        }
      });
    },
    tableSortChange(obj) {
      if (obj.order === null) {
        this.sort.sortAsc === false
          ? (obj.order = "ascending")
          : (obj.order = "descending");
        this.sort.SortColumn = obj.prop;
        this.sort.sortAsc = !this.sort.sortAsc;
        obj.column.order = obj.order;
      } else
      if (obj.order === "descending") {
        this.sort.SortColumn = obj.prop;
        this.sort.sortAsc = false;
      } else {
        this.sort.SortColumn = obj.prop;
        this.sort.sortAsc = true;
      }
      this.getDatasetReportList();
    },
    handleSearch() {
      this.getDatasetReportList();
    },
    handleReset() {
      this.search.datasetName = "";
      this.search.dsId = "";
      this.getDatasetReportList();

    },
    operatorGetUserCorp() {

      getParticipantsManagement().then(res => {
        if (res.code === 200){
          this.userCorpList = res.data;
        }
      });
    }
  }
};
</script>
<style lang="scss">
.statisticsReport_top {
  display: flex;
  justify-content: space-between;
  .el-card__body {
    height: 100%;
  }
  .report {
    width: 100%;
    height: 100%;
  }
}
.statisticsReport_bottom {
  h4 {
    font-weight: bold;
    font-size: 18px;
  }
  .pagination-wrap {
    padding-bottom: 40px;
  }
}
.search_box {
  .search_box_items {
    display: flex;
    margin-left: 0;
    margin-right: 20px;
  }
}
</style>
