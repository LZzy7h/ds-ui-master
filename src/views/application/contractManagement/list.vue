<template>
  <div>
    <div class="search_box" v-show="showSearch">
      <el-form :model="search" :inline="true" >
        <el-form-item label="合约名称" prop="name">
          <el-input
            v-model="search.name"
            placeholder="请输入合约名称"
          />
        </el-form-item>
        <el-form-item label="应用名称" prop="appName">
          <el-input
            v-model="search.appName"
            placeholder="请输入应用名称"
          />
        </el-form-item>
        <el-form-item label="合约状态" prop="status">
          <el-select
            v-model="search.status"
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in contractStatusList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
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
    </div>
    <div class="operation_btn" style="margin-top:20px;line-height: 36px">
      <el-button type="primary" @click="addContract">创建合约</el-button>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getContractListFunc" :columns="columns"></right-toolbar>
    </div>
    <div class="main_content">
      <el-table :data="tableData" class="left-align-table" @sort-change="sortChange" style="width: 100%">
        <el-table-column
          prop="contractId"
          label="合约ID"
          v-if="columns[0].visible"
          width="200" />
        <el-table-column
          prop="name"
          label="合约名称"
          min-width="160"
          v-if="columns[1].visible"
        />
        <el-table-column
          prop="appName"
          label="应用名称"
          min-width="160"
          v-if="columns[2].visible"
         />
        <el-table-column
          prop="status"
          label="合约状态"
          width="100"
          v-if="columns[3].visible"
        >
          <template slot-scope="scope">
            {{ formatStatus(scope.row.status) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="totalAmount"
          label="总用量"
          sortable="custom"
          width="100"
          v-if="columns[4].visible"
        />
        <el-table-column
          prop="leftAmount"
          label="剩余用量"
          sortable="custom"
          width="100"
          v-if="columns[5].visible"
        />
        <el-table-column
          prop="createTime"
          label="创建时间"
          sortable="custom"
          min-width="160"
          v-if="columns[6].visible"
        >
          <template slot-scope="scope">
            {{ formatTime(scope.row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" class-name="fixed-width" min-width="300">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              plain
              v-if="scope.row.status ===1"
              @click="contractEdit(scope.row)"
              >编辑</el-button
            >
            <el-button size="mini" type="primary" plain @click="runContract(scope.row)"
              v-if="scope.row.status === 3"
              >执行合约</el-button
            >
            <el-button
              size="mini"
              type="primary"
              plain
              @click="contractDetails(scope.row)"
              >详情</el-button
            >
            <el-button
              size="mini"
              type="primary"
              plain
              v-if="scope.row.status === 1"
              @click="approvalContract(scope.row)"
              >提交送审</el-button
            >
            <el-button
              size="mini"
              type="danger"
              plain
              v-if="scope.row.status === 1"
              @click="deleteContract(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-wrap" v-if="total">
       <pagination
      v-show="total>0"
      :total="total"
      :page.sync="pageNo"
      :limit.sync="pageSize"
      @pagination="getContractListFunc"
    />
    </div>
  </div>
</template>
<script>
import {
  getContractList,
  executeContract,
  submitApproval,
  deleteApproval
} from "@/api/contract";
export default {
  name: "ContractManagement",
  data() {
    return {
      search: {
        name: '',
        appName: '',
        status: ''
      },
      contractStatusList: [
        { name: "未提交", id: "1" },
        { name: "审批中", id: "2" },
        { name: "已通过", id: "3" },
        { name: "已拒绝", id: "4" },
        { name: "已撤销", id: "6" }
      ],
      tableData: [],
      pageNo: 1,
      pageSize: 10,
      total: 0,
         // 显示搜索条件
      showSearch: true,
      // 列信息
      columns: [
        { key: 0, label: `合约ID`, visible: true },
        { key: 1, label: `合约名称`, visible: true },
        { key: 2, label: `应用名称`, visible: true },
        { key: 3, label: `合约状态`, visible: true },
        { key: 4, label: `总用量`, visible: true },
        { key: 5, label: `剩余用量`, visible: true },
        { key: 6, label: `创建时间`, visible: true },
      ],
      orderByColumn:'',
      isAsc: ''
    };
  },
  computed: {
    key() {
      return this.$route.path;
    }
  },

  mounted() {
    this.getContractListFunc();
  },
  methods: {
    sortChange(data){
      this.orderByColumn = data.prop
      this.isAsc = data.order === 'ascending' ? 'asc' : 'desc'
      this.getContractListFunc()
    },
    getContractListFunc() {
      let data = {
        pageNum: this.pageNo,
        pageSize: this.pageSize,
        orderByColumn: this.orderByColumn || undefined,
        isAsc: this.isAsc || undefined
      }
      let dataVal = {
 appName: this.search.appName|| undefined,
        name: this.search.name|| undefined,
        status: this.search.status|| undefined,
      }
      getContractList(data,dataVal).then((res) => {
        if(res.code === 200){
          this.tableData = res.rows
          this.total = res.total
        }
      });
    },
  handleSearch(){
      this.getContractListFunc()
    },
    handleReset() {
      this.search.appName = "";
      this.search.name = "";
      this.search.status = "";

      this.getContractListFunc()
    },
    addContract() {
      this.$router.push({ path: "/application/createContract" });
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
    formatStatus(status) {
      let index = Number(status) - 1;
      let statusList = ["未提审","审批中","已通过","已拒绝","失效","已撤销","已删除"]
      return statusList[index];
    },
    contractEdit(row) {
      this.$router.push({
        path: "/application/editContract",
        query: { id: row.contractId }
      });
    },
    contractDetails(row) {
      this.$router.push({
        path: "/application/contractDetail",
        query: { id: row.contractId }
      });
    },
    runContract(data) {
      executeContract(data.contractId).then(res => {
        if (res.code === 200) {
          this.$message.success("操作成功！");
          this.getContractListFunc();
        }
      });
    },
    approvalContract(data) {
        //       this.$prompt('请输入申请用量', {
        //   confirmButtonText: '确定',
        //   cancelButtonText: '取消',
        //   inputPattern:  /^\d{1,10}$/,
        //   inputErrorMessage: '用量仅支持整数'
        // }).then(({ value }) => {
        //   console.log(value);
        //   this.$message({
        //     type: 'success',
        //     message: '申请用量：' + value
        //   });
        // }).catch(() => {
        //   this.$message({
        //     type: 'info',
        //     message: '取消输入'
        //   });
        // });
      submitApproval(data.contractId).then(res => {
        if (res.code === 200) {
          this.$message.success("操作成功！");
          this.getContractListFunc();
        }
      });
    },
    deleteContract(data) {
      this.$confirm('确定删除此合约吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonClass: "btn-custom-cancel",
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteApproval(data.contractId).then(res => {
          if (res.code === 200) {
            this.$message.success("删除成功！");
            this.getContractListFunc();
          }
        });
      })
    }
  }
};
</script>
