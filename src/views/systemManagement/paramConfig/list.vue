<template>
  <div class="paramsConfig">
    <div class="main_content">
      <el-table
        :data="tableData"
        class="left-align-table"
        style="width: 100%"
      >
        <el-table-column
          label="配置项"
          prop="configKey"
        />
        <el-table-column
          label="值"
          prop="val"
        />
        <el-table-column
          width="300"
          label="操作"
          class-name="fixed-width"
          align="center"
          prop="123"
        >
          <template slot-scope="scope">
            <el-button type="text"
                       size="small"
                       v-if="scope.row.canUpdate"
                       @click="edit(scope.row)">修改</el-button>
            <span v-if="!scope.row.canUpdate" >-</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      title=""
      :visible.sync="centerDialogVisible"
      class="dialog-small"
      center>
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="配置项">
          <span>{{form.configKey}}</span>
        </el-form-item>
        <el-form-item label="值">
          <el-input v-model="form.val"></el-input>
        </el-form-item>
      </el-form>
    <span>
      <el-button type="primary" @click="handleSubmitEdit">确 定</el-button>
      <el-button @click="centerDialogVisible = false">取 消</el-button>
    </span>
    </el-dialog>
  </div>
</template>
<script>
  import { getKv ,saveKv, updateKv, deleteKv } from '@/api/setting'
export default {
  name: 'ParamConfig',
  data() {
    return {
      tableData:[],
      form:{},
      centerDialogVisible:false
    }
  },
  mounted(){
    this.getKvFunc()
  },
  methods: {
    getKvFunc(){
      getKv().then((res) => {
        if (res.code === 200) {
          this.tableData = res.data
        }
      })
    },
    edit(row){
      this.form = row
      this.centerDialogVisible = true
    },
    handleSubmitEdit(){
      let data = {
        configKey: this.form.configKey,
        val: this.form.val,
        canDelete: false,
        remark: ''
      }
      updateKv(data).then((res) => {
        if (res.code === 200) {
          this.$message.success('修改成功！')
          this.centerDialogVisible = false
          this.getKvFunc()
        }
      })
    }
  }
}
</script>
<style lang="scss">
    .paramsConfig{
      margin: 20px 0;
    }
</style>
