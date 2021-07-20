<template>
  <div>
    <!-- 搜索 -->
    <div class="search_box" v-show="showSearch">
      <el-form :model="search" :inline="true">
        <el-form-item label="数据库名称" prop="dbName">
          <el-input v-model="search.dbName"></el-input>
        </el-form-item>
        <el-form-item label="数据库类型" prop="dbType">
          <el-select v-model="search.dbType" clearable placeholder="请选择">
            <el-option
              v-for="item in dbTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="IP地址" prop="dbHost">
          <el-input v-model="search.dbHost"></el-input>
        </el-form-item>
        <el-form-item label="修改时间" prop="updateTime">
          <el-date-picker
            v-model="search.updateTime"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item class="searchButton">
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 操作 -->
    <div class="operation_btn" style="margin-top:20px;line-height: 36px">
      <el-button type="primary" style="margin-left:30px;" @click="addMysql">添加数据库</el-button>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getAllDB"
        :columns="columns"
      ></right-toolbar>
    </div>
    <!-- 数据库表 -->
    <div class="main_content">
      <el-table
        :data="dbList"
        @sort-change="sortChange"
        class="left-align-table"
        style="width: 100%;margin-top: 30px;"
      >
        <el-table-column prop="dbHost" label="IP地址" v-if="columns[4].visible"/>
        <el-table-column prop="dbType" label="数据库类型" v-if="columns[1].visible">
          <template slot-scope="scope">
            {{formatType(scope.row.dbType)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="modifyTime"
          sortable="custom"
          label="修改时间"
          min-width="160"
          v-if="columns[2].visible"
        >
          <template slot-scope="scope">
            {{formatTime(scope.row.modifyTime)}}
          </template>
        </el-table-column>
        <el-table-column prop="dbName" label="数据库名称" v-if="columns[0].visible"/>
        <el-table-column prop="comment" label="备注" v-if="columns[3].visible"/>
        <el-table-column label="操作" class-name="fixed-width" min-width="150" v-if="columns[5].visible">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              plain
              @click="handelEditDB(scope.row)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="primary"
              plain
              @click="handelDeleteDB(scope.row)"
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
        @pagination="getAllDB"/>
    </div>
    <!-- 添加数据库弹框 -->
    <el-dialog
      :title="dialogTitle"
      class="dialog_box dialog-big"
      :visible.sync="dialogVisible"
      :show-close="false"
    >
      <el-form ref="addMySqlForm" :rules="rules" :model="addMySqlForm">
        <el-form-item>
          <div class="param_box">
            <span class="param_box_label">请选择数据库:</span>
            <el-select v-model="addMySqlForm.dbType" style="width:100%" placeholder="请选择">
              <el-option
                v-for="item in dbTypeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
        </el-form-item>
        <el-form-item>
          <div class="param_box">
            <span class="param_box_label">请选择数据库版本:</span>
            <el-select
              v-model="mySqlNum"
              style="width:100%"
              placeholder="请选择"
            >
              <el-option value="5.0+">5.0+</el-option>
            </el-select>
          </div>
        </el-form-item>
        <el-form-item prop="dbUserName" v-if="addMySqlForm.dbType !== 3">
          <div class="param_box">
            <span class="param_box_label">用户名:</span>
            <el-input
              v-model="addMySqlForm.dbUserName"
              placeholder="请输入内容"
            ></el-input>
          </div>
        </el-form-item>
        <el-form-item v-if="addMySqlForm.dbType === 3">
          <div class="param_box">
            <span class="param_box_label">用户名:</span>
            <el-input
              v-model="addMySqlForm.dbUserName"
              placeholder="请输入内容"
            ></el-input>
          </div>
        </el-form-item>
        <el-form-item prop="dbUserPassword" v-if="addMySqlForm.dbType !== 3">
          <div class="param_box">
            <span class="param_box_label">密码:</span>
            <el-input
              v-model="addMySqlForm.dbUserPassword"
              show-password
              placeholder="请输入内容"
            ></el-input>
          </div>
        </el-form-item>
        <el-form-item v-if="addMySqlForm.dbType === 3">
          <div class="param_box">
            <span class="param_box_label">密码:</span>
            <el-input
              v-model="addMySqlForm.dbUserPassword"
              show-password
              placeholder="请输入内容"
            ></el-input>
          </div>
        </el-form-item>
        <el-form-item prop="dbHost" style="margin-top:8px;">
          <div class="param_box">
            <span class="param_box_label">IP地址:</span>
            <el-input
              v-model="addMySqlForm.dbHost"
              placeholder="请输入内容"
            ></el-input>
          </div>
        </el-form-item>
        <el-form-item prop="dbPort" style="margin-top:8px;">
          <div class="param_box">
            <span class="param_box_label">端口:</span>
            <el-input
              v-model="addMySqlForm.dbPort"
              placeholder="请输入内容"
            ></el-input>
          </div>
        </el-form-item>
        <el-form-item prop="dbName" style="margin-top:8px;" v-if="addMySqlForm.dbType !== 3">
          <div class="param_box">
            <span class="param_box_label">数据库名:</span>
            <el-input
              v-model="addMySqlForm.dbName"
              placeholder="请输入内容"
            ></el-input>
          </div>
        </el-form-item>
        <el-form-item style="margin-top:8px;" v-if="addMySqlForm.dbType === 3">
          <div class="param_box">
            <span class="param_box_label">数据库名:</span>
            <el-input
              v-model="addMySqlForm.dbName"
              placeholder="请输入内容"
            ></el-input>
          </div>
        </el-form-item>
        <el-form-item prop="urlParam" style="margin-top:8px;" v-if="addMySqlForm.dbType === 3">
          <div class="param_box">
            <span class="param_box_label">URL参数:</span>
            <el-input
              v-model="addMySqlForm.urlParam"
              placeholder="请输入内容"
            ></el-input>
          </div>
        </el-form-item>
        <el-form-item style="margin-top:8px;">
          <div class="param_box">
            <span class="param_box_label">schema（可选）:</span>
            <el-input
              v-model="addMySqlForm.dbSchema"
              placeholder="请输入内容"
            ></el-input>
          </div>
        </el-form-item>
        <el-form-item style="margin-top:8px;">
          <div class="param_box">
            <span class="param_box_label">备注:</span>
            <el-input
              v-model="addMySqlForm.comment"
              placeholder="请输入内容"
            ></el-input>
          </div>
        </el-form-item>
        <el-form-item v-if="addMySqlForm.dbType === 3">
          <div class="param_box" style="margin-top: 40px;">
            <span class="param_box_label">启用Kerberos：</span>
            <el-radio-group v-model="addMySqlForm.enableKerberos">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </div>
        </el-form-item>
        <el-form-item v-if="addMySqlForm.enableKerberos === 1">
          <div class="param_box KerberosFile">
            <el-upload
              class="upload-demo"
              action=""
              :on-change="handleChange"
              :on-remove="onRemove"
              :auto-upload="false"
              :limit="1"
              ref="input"
              accept=".conf"
              :file-list="fileList"
            >
              <div>
                <el-button class="upload_file" slot="trigger" >点击此处上传的Kerberos conf文件，文件大小不超过100M</el-button>
              </div>
            </el-upload>
            <div v-if="!conf"><i class="el-icon-document" style="margin-right: 7px;"></i>{{confName}}</div>
          </div>
        </el-form-item>
        <el-form-item v-if="addMySqlForm.enableKerberos === 1">
          <div class="param_box KerberosFile">
            <el-upload
              class="upload-demo"
              action=""
              :on-change="handleChange1"
              :on-remove="onRemove1"
              :auto-upload="false"
              :limit="1"
              ref="input1"
              accept=".keytab"
              :file-list="fileList1"
            >
              <div>
                <el-button class="upload_file" slot="trigger" >点击此处上传的Kerberos keytab文件，文件大小不超过100M</el-button>
              </div>
            </el-upload>
            <div v-if="!keytab"><i class="el-icon-document" style="margin-right: 7px;"></i>{{keytabName}}</div>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSubmit('addMySqlForm')">确 定</el-button>
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  addDB,
  getAllDB,
  getDBType,
  deleteDB,
  getDBDetail,
  editDB
} from "@/api/dataSet";
export default {
  name: "dataBaseManagement",
  props: ['catalogId'],
  data() {
    return {
      dialogVisible: false,
      mySql: "mySql",
      mySqlNum: "5.0+",
      formMySql: {},
      addMySqlForm: {
        dbUserName: "",
        dbUserPassword: "",
        dbHost: "",
        dbPort: "",
        dbName: "",
        dbType: 0,
        urlParam: '',
        enableKerberos: 0,
        dbSchema: "",
        comment:"",
      },
      dbList: [],
      dbVal: "",
      tableList: [],
      tableVal: "",
      rules: {
        dbUserName: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        dbUserPassword: [{ required: true, message: "请输入密码", trigger: "blur" }],
        dbHost: [{ required: true, message: "请输入IP地址", trigger: "blur" }],
        dbPort: [{ required: true, message: "请输入端口", trigger: "blur" }],
        dbName: [{ required: true, message: "请输入数据库名", trigger: "blur" }],
        urlParam: [{ required: true, message: "请输入URL参数", trigger: "blur" }],
      },
      search: {
        dbName: "",
        dbType: "",
        dbHost: "",
        updateTime: "",
      },
      // 显示搜索条件
      showSearch: true,
      // 列信息
      columns: [
        { key: 0, label: `数据库名称`, visible: true },
        { key: 1, label: `类型`, visible: true },
        { key: 2, label: `修改时间`, visible: true },
        { key: 3, label: `备注`, visible: true },
        { key: 4, label: `IP`, visible: true },
        { key: 5, label: `操作`, visible: true },
      ],
      dbTypeList:[],
      dbIPList:[],
      fileList:[],
      fileList1:[],
      keytab:'',
      conf:'',
      dialogTitle:'',
      keytabName:'',
      confName:'',
      pageNo:1,
      pageSize:10,
      total:0,
    };
  },
  mounted() {
    this.getAllDB();
    this.getDBTypeFunc();
  },
  methods: {
    getAllDB() {
      console.log(this.search.updateTime)
      let params = {
        dbName: this.search.dbName || undefined,
        dbType: this.search.dbType === '' ? undefined : this.search.dbType,
        dbHost: this.search.dbHost || undefined,
        'params[beginTime]': this.search.updateTime ? this.formatTime(Date.parse(this.search.updateTime[0])) : undefined,
        'params[endTime]': this.search.updateTime ? this.formatTime(Date.parse(this.search.updateTime[1])) : undefined,
        pageNum: this.pageNo,
        pageSize: this.pageSize,
      };
      getAllDB(params).then(res => {
        if (res.code === 200) {
          this.dbList = res.rows;
          this.total = res.total
        }
      });
},
    handleChange(file, fileList){
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        this.$message.error("上传文件大小不能超过 10MB!");
        this.fileList = [];
        return false;
      }
      this.conf = file.raw;
    },
    onRemove(){
      this.fileList = [];
      this.conf = '';
    },
    handleChange1(file, fileList){
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        this.$message.error("上传文件大小不能超过 10MB!");
        this.fileList1 = [];
        return false;
      }
      this.keytab = file.raw;
    },
    onRemove1(){
      this.fileList1 = [];
      this.keytab = '';
    },
    getDBTypeFunc(){
      getDBType().then((res) => {
        if (res.code === 200) {
          this.dbTypeList = res.data
        }
      })
    },
    addMysql() {
      this.addMySqlForm.dbUserName = "";
      this.addMySqlForm.dbUserPassword = "";
      this.addMySqlForm.dbHost = "";
      this.addMySqlForm.dbPort = "";
      this.addMySqlForm.dbName = "";
      this.addMySqlForm.urlParam = "";
      this.addMySqlForm.schema = "";
      this.addMySqlForm.comment = "";
      this.addMySqlForm.enableKerberos = 0;
      this.addMySqlForm.dbType = 0;
      this.keytab = '';
      this.conf = '';
      this.fileList = [];
      this.fileList1 = [];
      this.dialogTitle = '添加数据库'
      this.dialogVisible = true;
    },
    handelEditDB(row){
      getDBDetail({id:row.id}).then((res) => {
        if(res.code === 200){
          this.dialogTitle = '编辑数据库';
          this.addMySqlForm.dbUserName = res.data.dbUserName;
          this.addMySqlForm.dbUserPassword = res.data.dbUserPassword;
          this.addMySqlForm.dbHost = res.data.dbHost;
          this.addMySqlForm.dbPort = res.data.dbPort;
          this.addMySqlForm.dbName = res.data.dbName;
          this.addMySqlForm.urlParam = res.data.urlParam;
          this.addMySqlForm.enableKerberos = res.data.enableKerberos;
          this.addMySqlForm.dbType = res.data.dbType;
          this.addMySqlForm.dbSchema = res.data.dbSchema;
          this.addMySqlForm.comment = res.data.comment;
          this.addMySqlForm.id = res.data.id;
          this.keytabName = res.data.keytabFile;
          this.confName = res.data.confFile;
          this.dialogVisible = true;
        }
      })
    },
    //删除数据库
    handelDeleteDB(row) {
      this.$confirm('此操作将删除该数据库, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        cancelButtonClass: "btn-custom-cancel",
        type: 'warning'
      }).then(() => {
        deleteDB(row.id).then((res) => {
          if (res.code === 200) {
            this.$message.success("操作成功！");
            this.getAllDB();
          }
        })
      }).catch(() => {

      });
    },
    //添加数据库
    onSubmit(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          let formData = new FormData();
          formData.append("data", JSON.stringify(this.addMySqlForm));
          formData.append("conf", this.conf);
          formData.append("keytab", this.keytab);
          if (this.addMySqlForm.id) {
            editDB(formData).then(res => {
              if (res.code === 200) {
                this.$message({
                  message: "修改成功！",
                  type: "success"
                });
                this.dialogVisible = false;
                this.getAllDB();
              }
            });
          } else {
            addDB(formData).then(res => {
              if (res.code === 200) {
                this.$message({
                  message: "添加成功！",
                  type: "success"
                });
                this.dialogVisible = false;
                this.getAllDB();
              }
            });
          }
        } else {
          this.$message({
            message: red.code
          });
          console.log("error submit!!");
          return false;
        }
      });
    },
    sortChange(data) {
      this.orderByColumn = data.prop;
      this.isAsc = data.order === "ascending" ? "asc" : "desc";
      this.getAllDB();
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
    formatType(type){
      let typeList = [{id:0,name:"mySql"}, {id:2,name:"DB2"}, {id:3,name:"hive"}]
      let typeObj = typeList.find(e => {
        return e.id === type
      })
      return typeObj.name
    },
    handleSearch() {
      this.getAllDB();
    },
    handleReset() {
      this.search.dbName = "";
      this.search.dbType = "";
      this.search.dbHost = "";
      this.search.updateTime = "";
      this.getAllDB();
    },
  }
};
</script>
<style lang="scss" >
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
  .KerberosFile{
    margin-top: 25px;
    .el-button.upload_file{
      width: 310px;
      height: 100px;
      white-space: initial;
    }
  }
</style>

