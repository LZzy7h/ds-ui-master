<template>
  <div class="applicationList">
    <div class="search_box" v-show="showSearch">
      <el-form :model="search" :inline="true" >
        <el-form-item label="目录名称" prop="appName">
          <el-input
            v-model="search.categoryName"
            placeholder="请输入目录名称"
            style="width: 240px"
          />
        </el-form-item>
        <el-form-item class="searchButton">
          <el-button
            type="primary"
            @click="getScenarioSetting"
          >搜索</el-button
          >
          <el-button
            @click="handleReset"
          >重置</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="operation_btn" style="margin-top:20px;line-height: 36px">
      <el-button type="primary" @click="addCategory(0)">新增</el-button>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getScenarioSetting"></right-toolbar>
    </div>
    <div class="main_content category">
      <el-table
        :data="tableData"
        style="width: 100%;margin-bottom: 20px;"
        row-key="id"
        default-expand-all
        :tree-props="{children: 'childrenScenario', hasChildren: 'hasChildren'}">
        <el-table-column
          prop="categoryName"
          label="目录名称">
        </el-table-column>
        <el-table-column
          prop="sort"
          label="排序">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建日期">
        </el-table-column>
        <el-table-column
          prop=""
          label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" plain @click="updateCategory(1, scope.row)">修改</el-button>
            <el-button size="mini" type="primary" plain @click="addCategory(0, scope.row)">新增</el-button>
            <el-button size="mini" type="danger" plain @click="deleteCategory(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      class="scenarioSetting_dialog dialog-middle"
      :title="dialogTitle"
      :visible.sync="dialogVisible">
      <el-form :model="form">
        <el-form-item label="上级节点" prop="upperId">
          <treeselect
            :options="option"
            v-model="form.upperId"
            :searchable="false"
            :normalizer="normalizer"
            placeholder="上级节点"
          >
          </treeselect>
        </el-form-item>
        <el-form-item label="节点名称" prop="categoryName">
          <el-input
            v-model="form.categoryName"
            placeholder="请输入节点名称"
          />
        </el-form-item>
        <el-form-item label="显示排序" prop="sort">
          <el-input-number v-model="form.sort" :min="0"></el-input-number>
        </el-form-item>
        <el-form-item class="searchButton">
          <el-button type="primary" @click="handelSave" style="width: 45%;">保存</el-button>
          <el-button @click="dialogVisible = false" style="width: 45%;">取 消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
  import { getScenarioSetting, addScenarioSetting, delScenarioSetting, updateScenarioSetting } from '@/api/ScenarioSetting'
  import Treeselect from "@riophae/vue-treeselect";
  import "@riophae/vue-treeselect/dist/vue-treeselect.css";
  export default {
    name: 'ScenarioSetting',
    components: { Treeselect },
    data() {
      return {
        search: {
          categoryName: ''
        },
        form:{
          upperId:0,
          categoryName:'',
          sort:0
        },
        option:[{
          id: 0,
          upperId: 0,
          categoryName: "全部",
          childrenScenario:[]
        }],
        showSearch:true,
        dialogVisible: false,
        tableData: [],
        dialogTitle: '新增节点',
        normalizer(node) {
          return {
            id: node.id,
            label: node.categoryName,
            children: node.childrenScenario,
          }
        },
        isAdd: true
      }
    },
    mounted(){
      this.getScenarioSetting()
    },
    methods: {
      getScenarioSetting(){
        let data = {
          categoryName: this.search.categoryName || undefined
        }
        getScenarioSetting(data).then((res) => {
          if (res.code === 200) {
            this.tableData = res.data
            this.option[0].childrenScenario = res.data
          }
        })
      },
      resetForm(){
        this.form.upperId = 0;
        this.form.categoryName = '';
        this.form.sort = 0;
      },
      handleReset(){
        this.search.categoryName = ''
        this.getScenarioSetting()
      },
      addCategory(flag, data){
        this.resetForm()
        this.dialogVisible = true;
        this.dialogTitle = flag ? '修改节点' : '新增节点';
        this.isAdd = !flag;
        if (data) this.form.upperId = data.id;
      },
      updateCategory(flag, data){
        this.resetForm()
        this.dialogVisible = true;
        this.dialogTitle = flag ? '修改节点' : '新增节点';
        this.isAdd = !flag;
        if (data){
          this.form.id = data.id;
          this.form.upperId = data.upperId;
          this.form.categoryName = data.categoryName;
          this.form.sort = data.sort;
        }
      },
      deleteCategory(row){
        this.$confirm('确认删除本节点?', '', {
          confirmButtonText: '确定',
          cancelButtonClass: "btn-custom-cancel",
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delScenarioSetting(row.id).then((res) => {
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
      handelSave(){

        if (this.isAdd) {
          addScenarioSetting(this.form).then((res) => {
            if (res.code === 200) {
              this.$message.success('添加应用目录成功！')
              this.dialogVisible = false
              this.getScenarioSetting()
            }
          })
        } else {
          updateScenarioSetting(this.form).then((res) => {
            if (res.code === 200) {
              this.$message.success('修改应用目录成功！')
              this.dialogVisible = false
              this.getScenarioSetting()
            }
          })
        }
      }
    }
  }
</script>
<style lang="scss">
  .tree-title{
    width: 100%;
    height: 50px;
    line-height: 50px;
    color: #999999;
    font-size: 14px;
    font-weight: 400;
    border-bottom: 1px solid #EBE9F3;
    span{
      width: 25%;
    }
  }
  .scenarioSetting-tree-node{
    width: 100%;
    span{
      width: 25%;
      font-size: 14px;
      color: #606266;
    }
  }
  .scenarioSetting-tree{
    .el-tree-node__content{
      border-bottom: 1px solid #EBE9F3;
      height: 60px;
      line-height: 60px;
    }
  }

</style>
