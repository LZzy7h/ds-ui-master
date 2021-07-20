<template>
  <div class="userManagement">
    <div class="search_box">
      <div class="search_box_items">
        <span>用户名:</span>
        <el-input v-model="search.userName" placeholder="请输入内容" />
      </div>
      <div class="search_box_items search_center" @click="handleSearch">
        <i class="el-icon-search" />
      </div>
      <div class="search_box_items search_center">
        <el-button type="text" @click="handleReset">重置</el-button>
      </div>
    </div>
    <div class="operation_btn">
      <el-button type="primary" @click="addUser">创建用户</el-button>
    </div>
    <div class="main_content">

      <el-table
        :data="tableData"
        style="width: 100%"
      >
        <el-table-column
          label="用户名"
          prop="userName"
        />
        <el-table-column
          label="创建时间"
          prop="createTime"
        />
        <el-table-column
          label="备注"
          prop="comment"
        />
        <el-table-column
          label="操作"
          class-name="fixed-width"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click.native.prevent="editPassword(scope.row)"
              >修改密码</el-button
            >
            <el-button
              type="text"
              size="small"
              v-if="false"
              @click.native.prevent="permissionsManagement(scope.row)"
              >权限管理</el-button
            >
            <el-button
              type="text"
              size="small"
              v-if="scope.row.userName !== 'admin'"
              @click.native.prevent="deleteUser(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      title="创建用户"
      :visible.sync="addUserDialogVisible"
     class="dialog-middle"
    >
      <el-form class="dia"
        ref="addForm"
        :model="addForm"
        :rules="rules"
        label-position="right"
        label-width="80px"
      >
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="addForm.userName" />
        </el-form-item>
        <el-form-item label="设置密码" prop="pass">
          <el-input v-model="addForm.pass" show-password />
        </el-form-item>
        <el-form-item label="重复密码" prop="repeatPass">
          <el-input v-model="addForm.repeatPass" show-password />
        </el-form-item>
        <el-form-item label="备注" prop="comment">
          <el-input
            maxlength="50"
            show-word-limit
            v-model="addForm.comment"
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addUserDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUserSubmit('addForm')"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      title="修改密码"
      :visible.sync="editPasDialogVisible"
     class="dialog-middle"
    >
      <el-form
        ref="editPasForm"
        :model="editPasForm"
        :rules="editRules"
        label-position="right"
        label-width="100px"
      >
        <el-form-item label="用户名">
          <span>{{ editPasForm.userName }}</span>
        </el-form-item>
        <el-form-item label="原密码" prop="oldPass">
          <el-input v-model="editPasForm.oldPass" show-password />
        </el-form-item>
        <el-form-item label="原密码" prop="password">
          <el-input v-model="editPasForm.password" show-password />
        </el-form-item>
         <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="editPasForm.newPassword" show-password />
        </el-form-item>

        <el-form-item label="重复新密码" prop="checkNewPassword">
          <el-input v-model="editPasForm.checkNewPassword" show-password />

        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editPasDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editPasswordSubmit('editPasForm')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="权限管理"
      :visible.sync="permissionsDialogVisible"
     class="dialog-middle"
    >
      <el-form
        ref="form"
        :model="permissionsForm"
        label-width="100px"
      >
        <el-form-item label="用户名">
          <el-input v-model="permissionsForm.val" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="permissionsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="permissionsManagementSubmit"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>

import { getUserList, updatePassword, createUser, deleteUser } from "@/api/user";


export default {
  name: "UserManagement",
  data() {
    //用户名验证
    var checkUsername = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("用户名不能为空"));
      }
      setTimeout(() => {
        this.tableData.forEach(el => {
          if (el.userName == value) {
            callback(new Error("用户名不可重复!"));
          } else {
            callback();
          }
        });
      }, 0);
    };
    //密码验证
    var checkPass = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("密码不能为空"));
      }
      setTimeout(() => {
        const pattern =  /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{8,20}$/;

        if (!pattern.test(value)) {
          callback("需包含字母，数字和特殊字符中至少两种，长度为8～20位");
        } else {
          callback();
        }
      }, 0);
    };
    //重复密码验证
    var checkRepeatPass = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("密码不能为空"));
      }
      setTimeout(() => {
        if (value !== this.addForm.pass) {
          callback("两次密码不一致！");
        } else {
          callback();
        }
      }, 0);
    };
    //编辑重复密码验证
        var checkEditRepeatPass = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("密码不能为空"));
      }
      setTimeout(() => {
        if (value !== this.editPasForm.newPassword) {
          callback("两次密码不一致！");
        } else {
          callback();
        }
      }, 0);
    };
    //原密码验证
    var checkOldPass = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("密码不能为空"));
      }
      setTimeout(() => {
        if (value !== this.old) {
          callback("原密码错误！");
        } else {
          callback();
        }
      }, 0);
    };
    return {
      search: {
        userName: ""
      },
      tableData: [
        {
          id: 123
        }
      ],
      addUserDialogVisible: false,
      editPasDialogVisible: false,
      permissionsDialogVisible: false,
      addForm: {
        userName: "",
        pass: "",
        comment: "",
        repeatPass: ""
      },
      //表单校验 用户名 字母数字符号不可重复  密码 字母数字符号 8-20位
      rules: {
        userName: [
          { required: true, validator: checkUsername, trigger: "blur" }
        ],
        pass: [{ required: true, validator: checkPass, trigger: "blur" }],
        repeatPass: [
          {
            required: true,
            validator: checkRepeatPass,
            trigger: "blur"
          }
        ]

      },

      editPasForm: {
        userName: "",
         password:'',
        newPassword:'',
        checkNewPassword:''

      },
      //修改密码表单校验
      editRules: {
        password: [{ required: true, validator: checkOldPass, trigger: "blur" }],
        newPassword: [
          {
            required: true,
            validator: checkPass,
            trigger: "blur"
          }
        ],
        checkNewPassword:[{
            required: true,
            validator: checkEditRepeatPass,
            trigger: "blur"
          }]
      },
      permissionsForm: {
        val: ""
      }
    };
  },
  mounted() {
    this.getUsers();
  },
  methods: {
    getUsers() {
      let data = {
        userName: this.search.userName ? this.search.userName : undefined
      };
      getUserList(data).then(res => {
        if (res.code === 200) {
          this.tableData = res.data;
        }
      });
    },
    addUser() {
      this.addForm.userName = "";
      this.addForm.pass = "";
      this.addForm.comment = "";
      this.addForm.repeatPass = "";
      this.addUserDialogVisible = true;

    },
    handleSearch() {
      this.getUsers();
    },
    handleReset() {
      this.search.userName = "";
      this.getUsers();
    },
    addUserSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let data = {
            userName: this.addForm.userName,
            pass: this.addForm.pass,
            organization: '',
            comment: this.addForm.comment,
          };


          createUser(data).then(res => {
            if (res.code === 200) {
              this.$message({
                type: "success",
                message: "创建成功!"
              });
              this.getUsers();
              this.addUserDialogVisible = false;
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    editPassword(row) {
      this.editPasForm={}
      this.old = row.pass;
      this.editPasDialogVisible = true;
      this.editPasForm.userName = row.userName;
      this.editPasForm["uid"] = row.uid;
    },
    editPasswordSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          updatePassword(this.editPasForm).then(res => {
            if (res.code === 200) {
              this.$message({
                type: "success",
                message: "创建成功!"
              });
              this.getUsers();
              this.editPasDialogVisible = false;
            } else {
              alert("提交出错！");
              return false;
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });

    },
    permissionsManagement() {
      this.permissionsDialogVisible = true;
    },
    permissionsManagementSubmit() {
      this.permissionsDialogVisible = false;
    },
    deleteUser(row) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonClass: "btn-custom-cancel",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          const id = row.uid;
          deleteUser(id).then(res => {
            if (res.code === 200) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.getUsers();
            }
          });
        })
        .catch(() => {});
    }
  }
};
</script>
<style lang='scss'>
.el-dialog .el-dialog__body .el-form-item__label{
  padding-right:8px;
}
</style>
