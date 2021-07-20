<template>
  <div class="participantsManagement">
    <div class="search_box" v-show="showSearch">
      <el-form :model="search"  :inline="true">
        <el-form-item label="数据服务标识符" prop="dsId">
          <el-input
            v-model="search.dsId"
            placeholder="请输入数据服务标识符"
          />
        </el-form-item>
        <el-form-item label="参与方名称" prop="dsName">
          <el-input
            v-model="search.dsName"
            placeholder="请输入参与方名称"
          />
        </el-form-item>
        <el-form-item label="所属角色" prop="roleType">
          <el-select
            v-model="search.roleType"
            clearable
            placeholder="请选择所属角色"
          >
            <el-option
              v-for="(item, index) in roleTypeList"
              :key="index"
              :label="item.label"
              :value="item.value"
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
      <el-button type="primary" @click="createDsName"
        >创建参与方</el-button
      >
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getParticipantsManagement"
        :columns="columns"
      ></right-toolbar>
    </div>
    <div class="main_content">
      <el-table :data="tableData" style="width: 100%" class="left-align-table">
        <el-table-column label="数据服务标识符" min-width="160" prop="dsId" v-if="columns[0].visible"/>
        <el-table-column label="参与方名称" min-width="160" prop="dsName" v-if="columns[1].visible"/>
        <!--<el-table-column label="所属角色" prop="roleTypeName" v-if="columns[2].visible"/>-->
        <!--<el-table-column label="密钥" prop="secretKey" v-if="columns[2].visible"/>-->
        <el-table-column label="备注" min-width="160" prop="comment" v-if="columns[2].visible"/>
        <el-table-column label="创建时间" min-width="160" prop="createTime" v-if="columns[3].visible">
               <template slot-scope="scope">
              {{scope.row.createTime}}
          </template>
        </el-table-column>
        <el-table-column label="操作员" min-width="160" prop="operator" v-if="columns[4].visible"/>
        <el-table-column label="操作" prop="123" min-width="150" class-name="fixed-width">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" plain @click.native.prevent="edit(scope.row)"
              >编辑</el-button
            >
            <el-button size="mini" type="danger" plain @click.native.prevent="del(scope.row)"
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
        @pagination="getParticipantsManagement"
      />
    </div>
    <el-dialog title="创建参与方" :visible.sync="dialogVisible" class="dialog-middle">
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="数据服务标识符" prop="dsId">
          <el-input v-model="form.dsId" />
        </el-form-item>
        <el-form-item label="参与方名称" prop="dsName">
          <el-input
            v-model="form.dsName"
            type="text"
            maxlength="15"
            show-word-limit
          />
        </el-form-item>
        <el-form-item label="所属角色" prop="roleTypeName">
          <el-select
            v-model="form.roleTypeName"
            style="width:100%;"
            multiple
            placeholder="请选择"
          >
            <el-option
              v-for="item in roleOption"
              :key="item.value"
              :label="item.label"
              :value="item.roleTypeName"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="form.comment"
            type="textarea"
            maxlength="50"
            show-word-limit
            :rows="2"
            placeholder="请输入内容"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addParticipantsManagement('form')"
          >确 定</el-button
        >
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog title="编辑参与方" :visible.sync="editdialogVisible" class="dialog-middle">
      <el-form
        ref="form"
        :model="editForm"
        :rules="rulesEdit"
        label-width="110px"
      >
        <el-form-item label="数据服务标识符" prop="dsId">
          <span>{{ editForm.dsId }}</span>
        </el-form-item>
        <el-form-item label="参与方名称" prop="dsName">
          <el-input v-model="editForm.dsName" />
        </el-form-item>
        <el-form-item label="所属角色" prop="roleTypeName">
          <el-select
            v-model="editForm.roleTypeName"
            style="width:100%;"
            multiple
            placeholder="请选择"
          >
            <el-option
              v-for="item in roleOption"
              :key="item.value"
              :label="item.label"
              :value="item.roleTypeName"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="editForm.comment"
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="editParticipantsManagement('form')"
          >确 定</el-button
        >
        <el-button @click="handelCancelEdit">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getParticipantsManagement1,
  addParticipantsManagement,
  delParticipantsManagement,
  editParticipantsManagement
} from "@/api/participantsManagement";
export default {
  name: "ParticipantsManagement",
  data() {
    var checkDsId = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入DSId"));
      }
      setTimeout(() => {
        if(this.dsIdArray.indexOf(value)!==-1){
          return callback(new Error("参与方DS_ID重复，请更换DS_ID"));
        }else{
          callback()
        }
      }, 1000);
    };
        var checkDsName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入参与方名称"));
      }
      setTimeout(() => {
        if(this.dsNameArray.indexOf(value)!==-1){
          return callback(new Error("参与方名称重复，请更换名称"));
        }else{
          callback()
        }
      }, 1000);
    };
    return {
      search: {
        dsId: "",
        dsName: "",
        roleType: ""
      },
      roleTypeList: [
        { label: "全部", value: "" },
        { label: "应用方", value: 2 },
        { label: "数据方", value: 4 }
      ],
      pageNo: 1,
      pageSize: 10,
      total: 0,
      tableData: [],
      dialogVisible: false,
      editdialogVisible: false,
      form: {
        dsId: "",
        dsName: "",
        roleTypeName: "",
        comment: ""
      },
      editForm: {},
      rules: {
        dsId: [
          {
            required: true,
            validator: checkDsId,
            trigger: "blur"
          }
        ],
        dsName: [
          { required: true, validator:checkDsName,trigger: "blur" }
        ],
        roleTypeName: [
          { required: true, message: "请选择所属角色", trigger: "blur" }
        ]
      },
          rulesEdit: {
        dsName: [
          { required: true,message: "请填写参与方名称",trigger: "blur" }
        ],
        roleTypeName: [
          { required: true, message: "请选择所属角色", trigger: "blur" }
        ]
      },
      //角色选择
      roleOption: [
        { value: 4, label: "数据方", roleTypeName: "数据方" },
        { value: 2, label: "应用方", roleTypeName: "应用方" }
      ],
      // 显示搜索条件
      showSearch: true,
      // 列信息
      columns: [
        { key: 0, label: `数据服务标识符`, visible: true },
        { key: 1, label: `参与方名称`, visible: true },
        // { key: 2, label: `所属角色`, visible: true },
        // { key: 2, label: `密钥`, visible: true },
        { key: 2, label: `备注`, visible: true },
        { key: 3, label: `创建时间`, visible: true },
        { key: 4, label: `操作员`, visible: true },
      ],
      dsIdArray: [],
      dsNameArray:[]
    };
  },
  mounted() {
    this.getParticipantsManagement();
  },
  methods: {
    getParticipantsManagement() {
      let data = {
        pageNum: this.pageNo,
        pageSize: this.pageSize,
        dsId: this.search.dsId ? this.search.dsId : undefined,
        dsName: this.search.dsName ? this.search.dsName : undefined,
        roleType: this.search.roleType ? this.search.roleType : undefined
      };
      getParticipantsManagement1(data).then(res => {
        if (res.code === 200) {
          this.tableData = res.rows;
          res.rows.map(el => {
            this.dsIdArray.push(el.dsId);
            this.dsNameArray.push(el.dsName);
          });
          this.total = res.total;
        }
      });
    },

    handleSearch() {
      this.getParticipantsManagement();
    },
    handleReset() {
      this.search.dsId = "";
      this.search.dsName = "";
      this.search.roleType = "";
      this.getParticipantsManagement();
    },
    createDsName() {
      this.dialogVisible = true;
      this.form.dsId = "";
      this.form.comment = "";
      this.form.dsName = "";
      this.form.roleTypeName = "";
    },
    addParticipantsManagement(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let roleTypeCodeList = [];
          this.form.roleTypeName.map(el => {
            if (el == "数据方") {
              roleTypeCodeList.push(4);
            } else if (el == "应用方") {
              roleTypeCodeList.push(2);
            }
            return roleTypeCodeList;
          });
          if (!this.form.dsId) {
            this.$message.info("请输入DS_ID");
            return false;
          } else if (!this.form.dsName) {
            this.$message.info("请输入参与方名称");
            return false;
          } else if (roleTypeCodeList.length === 0) {
            this.$message.info("请选择所属角色");
            return false;
          }
          const data = {
            dsId: this.form.dsId,
            roleTypeCodeList: roleTypeCodeList,
            comment: this.form.comment,
            dsName: this.form.dsName
          };
          addParticipantsManagement(data).then(res => {
            if (res.code === 200) {
              this.dialogVisible = false;
              this.$message({
                type: "success",
                message: "创建成功!"
              });
              this.getParticipantsManagement();
              this.dialogVisible = false;
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handelCancelEdit() {
      this.getParticipantsManagement();
      this.editdialogVisible = false;
    },
    edit(row) {
      this.editdialogVisible = true;
      this.editForm = row;
      const roleTypeName =
        this.editForm.roleTypeName && this.editForm.roleTypeName.split(",");
      this.editForm.roleTypeName = roleTypeName;
    },
    editParticipantsManagement(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let roleTypeCodeList = [];
          for (const key in this.editForm.roleTypeName) {
            let num = null;
            if (this.editForm.roleTypeName[key] == "数据方") {
              num = 4;
            } else if (this.editForm.roleTypeName[key] == "应用方") {
              num = 2;
            } else {
              num = Number(this.editForm.roleTypeName[key]);
            }
            roleTypeCodeList.push(num);
          }
          if (!this.editForm.dsId) {
            this.$message.info("请输入DS_ID");
            return false;
          } else if (!this.editForm.dsName) {
            this.$message.info("请输入参与方名称");
            return false;
          } else if (roleTypeCodeList.length === 0) {
            this.$message.info("请选择所属角色");
            return false;
          }
          let data = {
            dsId: this.editForm.dsId,
            roleTypeCodeList: roleTypeCodeList,
            comment: this.editForm.comment,
            dsName: this.editForm.dsName
          };
          editParticipantsManagement(data).then(res => {
            if (res.code === 200) {
              this.$message({
                type: "success",
                message: "操作成功！"
              });
              this.getParticipantsManagement();
              this.editdialogVisible = false;
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
       formatTime(time) {
        if (time) {
          var date = new Date(time + 8 * 3600 * 1000); // 增加8小时
          return date.toJSON().substr(0, 19).replace('T', ' ');
        } else {
          return '-'
        }
    },
    del(row) {
      this.$confirm("此操作将永久删除该参与方, 是否继续？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        cancelButtonClass: "btn-custom-cancel",
        type: "warning"
      })
        .then(() => {
          let id = row.dsId;
          delParticipantsManagement(id).then(res => {
            if (res.code === 200) {
              this.$message({
                type: "success",
                message: "删除成功！"
              });
            }
            this.dialogVisible1 = false;
            this.getParticipantsManagement();
          });
        })
        .catch(() => {
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.participantsManagement {
  .el-dialog__header {
    border-bottom: 1px solid #d8dbe0;
    padding: 0 20px;
    .el-dialog__title {
      display: block;
      width: 110px;
      height: 55px;
      line-height: 55px;
      text-align: center;
      border-bottom: 1px solid #4273da;
    }
  }
  .el-dialog__body {
    padding: 30px 31px 30px 37px;
  }
}
</style>
