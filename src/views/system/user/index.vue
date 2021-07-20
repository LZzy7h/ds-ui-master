<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--用户数据-->
      <el-col :span="23" :xs="24">
        <div class="search_box" v-show="showSearch">
          <el-form
            :model="queryParams"
            ref="queryForm"
            :inline="true"
            label-width="68px"
          >
            <el-form-item label="用户名称" prop="userName">
              <el-input
                v-model="queryParams.userName"
                placeholder="请输入用户名称"
                clearable
                style="width: 200px"
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
            <el-form-item label="角色" prop="role">
              <el-input
                v-model="queryParams.role"
                placeholder="请输入角色"
                clearable
                style="width: 200px"
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
            <el-form-item label="分组" prop="postId">
              <el-select
                v-model="queryParams.postId"
                placeholder="分组"
                clearable
                style="width: 200px"
              >
                <el-option
                  v-for="item in postOptions"
                  :key="item.postId"
                  :label="item.postName"
                  :value="item.postId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-select
                v-model="queryParams.status"
                placeholder="用户状态"
                clearable
                style="width: 200px"
              >
                <el-option
                  v-for="dict in statusOptions"
                  :key="dict.dictValue"
                  :label="dict.dictLabel"
                  :value="dict.dictValue"
                />
              </el-select>
            </el-form-item>
            <el-form-item class="searchButton">
              <el-button type="primary" @click="handleQuery">搜索</el-button>
              <el-button @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="operation_btn" style="margin-top:20px;line-height: 36px">
          <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
              <el-button
                type="primary"
                @click="handleAdd"
                v-hasPermi="['system:user:add']"
                >新增</el-button
              >
            </el-col>
            <el-col :span="1.5">
              <el-button
                :disabled="single"
                @click="handleUpdate"
                v-hasPermi="['system:user:edit']"
                >修改</el-button
              >
            </el-col>
            <el-col :span="1.5">
              <el-button
                :disabled="multiple"
                @click="handleDelete"
                v-hasPermi="['system:user:remove']"
                >删除</el-button
              >
            </el-col>
            <!--<el-col :span="1.5">-->
            <!--<el-button-->
            <!--size="mini"-->
            <!--@click="handleImport"-->
            <!--v-hasPermi="['system:user:import']"-->
            <!--&gt;导入</el-button>-->
            <!--</el-col>-->
            <!--<el-col :span="1.5">-->
              <!--<el-button-->
                <!--@click="handleExport"-->
                <!--v-hasPermi="['system:user:export']"-->
                <!--&gt;导出</el-button-->
              <!--&gt;-->
            <!--</el-col>-->
            <right-toolbar
              :mr7="true"
              :showSearch.sync="showSearch"
              @queryTable="getList"
              :columns="columns"
            ></right-toolbar>
          </el-row>
        </div>
        <div class="main_content">
          <el-table
            v-loading="loading"
            :data="userList"
            @selection-change="handleSelectionChange"
            class="left-align-table"
          >
            <el-table-column type="selection" width="50" />
            <el-table-column
              label="用户编号"
              key="userId"
              prop="userId"
              v-if="columns[0].visible"
            />
            <el-table-column
              label="用户名称"
              key="userName"
              prop="userName"
              v-if="columns[1].visible"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="角色"
              key="roleIds"
              v-if="columns[3].visible"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <span>{{ filterRoleName(scope.row.roles) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="分组"
              key="postIds"
              v-if="columns[7].visible"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <span>{{ filterPostName(scope.row.posts) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="真实姓名"
              key="nickName"
              prop="nickName"
              v-if="columns[2].visible"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              label="手机号码"
              key="phonenumber"
              prop="phonenumber"
              v-if="columns[4].visible"
              width="120"
            />
            <el-table-column
              label="状态"
              key="status"
              v-if="columns[5].visible"
            >
              <template slot-scope="scope">
                <el-switch
                  v-model="scope.row.status"
                  active-value="0"
                  inactive-value="1"
                  @change="handleStatusChange(scope.row)"
                ></el-switch>
              </template>
            </el-table-column>
            <el-table-column
              label="备注"
              key="remark"
              prop="remark"
              v-if="columns[8].visible"
            ></el-table-column>
            <el-table-column
              label="创建时间"
              prop="createTime"
              v-if="columns[6].visible"
            >
              <template slot-scope="scope">
                <span>{{ parseTime(scope.row.createTime) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              width="210"
              class-name="small-padding fixed-width"
            >
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  plain
                  @click="handleUpdate(scope.row)"
                  v-hasPermi="['system:user:edit']"
                  >修改</el-button
                >
                <el-button
                  v-if="scope.row.userId !== 1"
                  size="mini"
                  type="danger"
                  plain
                  @click="handleDelete(scope.row)"
                  v-hasPermi="['system:user:remove']"
                  >删除</el-button
                >
                <el-button
                  size="mini"
                  type="primary"
                  plain
                  @click="handleResetPwd(scope.row)"
                  v-hasPermi="['system:user:resetPwd']"
                  >重置</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </el-col>
    </el-row>

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog
      :title="title"
      :visible.sync="open"
      class="dialog-big"
      append-to-body
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item
              v-if="form.userId == undefined"
              label="用户名称"
              prop="userName"
            >
              <el-input v-model="form.userName" placeholder="请输入用户名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              v-if="form.userId == undefined"
              label="用户密码"
              prop="password"
            >
              <el-input
                v-model="form.password"
                placeholder="请输入用户密码"
                type="password"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>

        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="真实姓名" prop="nickName">
              <el-input v-model="form.nickName" placeholder="请输入用户昵称" />
            </el-form-item>
          </el-col>
              <el-col :span="12">
            <el-form-item label="状态">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in statusOptions"
                  :key="dict.dictValue"
                  :label="dict.dictValue"
                  >{{ dict.dictLabel }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="归属类型">
              <el-radio-group v-model="AttributionStatus" @change="handleChangeRadio">
                <el-radio label="0">内部</el-radio>
                <el-radio label="1">外部</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
           <el-form-item label="归属机构" prop="dsId" v-if="AttributionStatus==1">
            <el-select v-model="form.dsId" clearable  placeholder="请选择"  style="width:100%">
              <el-option
                v-for="(item, index) in userCorpList"
                :key="index"
                :label="item.dsNameText"
                :value="item.dsId">
              </el-option>
            </el-select>
           </el-form-item>
          </el-col>
               <el-col :span="12">
            <el-form-item label="角色" prop="roleIds">
              <el-select
                v-model="form.roleIds"
                multiple
                placeholder="请选择"
                style="width:100%"
              >
                <el-option
                  v-for="item in roleOptions"
                  :key="item.roleId"
                  :label="item.roleName"
                  :value="item.roleId"
                  :disabled="item.status == 1"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分组">
              <el-select
                v-model="form.postIds"
                multiple
                placeholder="请选择"
                style="width:100%"
              >
                <el-option
                  v-for="item in postOptions"
                  :key="item.postId"
                  :label="item.postName"
                  :value="item.postId"
                  :disabled="item.status == 1"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号码" prop="phonenumber">
              <el-input
                v-model="form.phonenumber"
                placeholder="请输入手机号码"
                maxlength="11"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input
                v-model="form.email"
                placeholder="请输入邮箱"
                maxlength="50"
              />
            </el-form-item>
          </el-col>

        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="备注">
              <el-input
                v-model="form.remark"
                type="textarea"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 用户导入对话框 -->
    <el-dialog
      :title="upload.title"
      :visible.sync="upload.open"
      class="dialog-middle"
      append-to-body
    >
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <div class="el-upload__tip" slot="tip">
          <el-checkbox
            v-model="upload.updateSupport"
          />是否更新已经存在的用户数据
          <el-link type="info" style="font-size:12px" @click="importTemplate"
            >下载模板</el-link
          >
        </div>
        <div class="el-upload__tip" style="color:red" slot="tip">
          提示：仅允许导入“xls”或“xlsx”格式文件！
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  listUser,
  getUser,
  delUser,
  addUser,
  updateUser,
  resetUserPwd,
  changeUserStatus
} from "@/api/system/user";
import { getToken } from "@/utils/auth";
import { treeselect } from "@/api/system/dept";
import Treeselect from "@riophae/vue-treeselect";
import { getOperatorParticipantsManagement } from '@/api/participantsManagement'
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "User",
  components: { Treeselect },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 用户表格数据
      userList: null,
      // 弹出层标题
      title: "",
      // 部门树选项
      deptOptions: undefined,
      // 是否显示弹出层
      open: false,
      // 部门名称
      deptName: undefined,
      // 默认密码
      initPassword: undefined,
      // 日期范围
      dateRange: [],
      // 状态数据字典
      statusOptions: [],
      // 性别状态字典
      sexOptions: [],
      // 岗位选项
      postOptions: [],
      // 角色选项
      roleOptions: [],
      // 表单参数
      form: {},
      defaultProps: {
        children: "children",
        label: "label"
      },
      userCorpList:[],
      AttributionTypeOptions: {},
      // 用户导入参数
      upload: {
        // 是否显示弹出层（用户导入）
        open: false,
        // 弹出层标题（用户导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/system/user/importData"
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userName: undefined,
        role: undefined,
        status: undefined,
        postId: undefined
      },
      // 列信息
      columns: [
        { key: 0, label: `用户编号`, visible: false },
        { key: 1, label: `用户名称`, visible: true },
        { key: 2, label: `用户昵称`, visible: true },
        { key: 3, label: `角色`, visible: true },
        { key: 4, label: `手机号码`, visible: false },
        { key: 5, label: `状态`, visible: true },
        { key: 6, label: `创建时间`, visible: true },
        { key: 7, label: `分组`, visible: true },
        { key: 8, label: `备注`, visible: true }
      ],
      // 表单校验
      rules: {
        userName: [
          { required: true, message: "用户名称不能为空", trigger: "blur" }
        ],
        nickName: [
          { required: true, message: "用户昵称不能为空", trigger: "blur" }
        ],
          dsId: [
          { required: true, message: "归属机构不能为空", trigger: "blur" }
        ],
        password: [
          { required: true, message: "用户密码不能为空", trigger: "blur" }
        ],
        roleIds: [{ required: true, message: "角色不能为空", trigger: "blur" }],
        email: [
          {
            type: "email",
            message: "'请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        phonenumber: [
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ]
      },
      userId: undefined,
      AttributionStatus:'0'
    };
  },
  watch: {
    // 根据名称筛选部门树
    deptName(val) {
      this.$refs.tree.filter(val);
    }
  },
  created() {
    this.getList();
    this.getPostsList();
    this.getDicts("sys_normal_disable").then(response => {
      this.statusOptions = response.data;
    });
    this.getDicts("sys_user_sex").then(response => {
      this.sexOptions = response.data;
    });
    this.getConfigKey("sys.user.initPassword").then(response => {
      // this.initPassword = response.msg;
      this.initPassword = "";
    });
  },
  methods: {
    handleChangeRadio(data){
      const userId = this.userId || '';
      getUser(userId, {type:data}).then(response => {
        this.postOptions = response.posts;
        this.roleOptions = response.roles;
      });
    },
    filterPostName(data) {
      let str = "";
      data.forEach((e, i) => {
        str += e.postName + " ";
      });
      return str;
    },
    filterRoleName(data) {
      let str = "";
      data.forEach((e, i) => {
        str += e.roleName + " ";
      });
      return str;
    },
    /** 查询用户列表 */
    getList() {
      this.loading = true;
      listUser(this.addDateRange(this.queryParams, this.dateRange)).then(
        response => {
          this.userList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.deptId = data.id;
      this.getList();
    },
    // 用户状态修改
    handleStatusChange(row) {
      let text = row.status === "0" ? "启用" : "停用";
      this.$confirm(
        '确认要"' + text + '""' + row.userName + '"用户吗?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          cancelButtonClass: "btn-custom-cancel",
          type: "warning"
        }
      )
        .then(function() {
          return changeUserStatus(row.userId, row.status);
        })
        .then(() => {
          this.msgSuccess(text + "成功");
        })
        .catch(function() {
          row.status = row.status === "0" ? "1" : "0";
        });
    },
    consumerGetUserCorp(){
      getOperatorParticipantsManagement().then((res)=>{
        if(res.code === 200){
          let arr = []
          res.data.forEach((e) => {
            if (e.roleType !== 1) {
              e.dsNameText = `${e.dsName}（${e.dsId}）`
              arr.push(e)
            }
          })
          this.userCorpList = arr
        }
      })
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        userId: undefined,
        deptId: undefined,
        userName: undefined,
        nickName: undefined,
        password: undefined,
        phonenumber: undefined,
        email: undefined,
        sex: undefined,
        status: "0",
        remark: undefined,
        postIds: [],
        roleIds: [],
        dsId: undefined
      };
      this.AttributionStatus = '0'
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.page = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.userId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 获取分组 */
    getPostsList() {
      getUser().then(response => {
        this.postOptions = response.posts;
        this.roleOptions = response.roles;
      });
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.consumerGetUserCorp();

      getUser().then(response => {
        this.postOptions = response.posts;
        this.roleOptions = response.roles;
        this.open = true;
        this.title = "添加用户";
        this.form.password = this.initPassword;
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      // console.log(row);
      this.reset();
      const userId = row.userId || this.ids;
      this.userId = row.userId || this.ids;
      getUser(userId).then(response => {
        this.consumerGetUserCorp();
        this.form = response.data;
        this.postOptions = response.posts;
        this.roleOptions = response.roles;
        this.form.postIds = response.postIds;
        this.form.roleIds = response.roleIds;
        this.AttributionStatus = response.data.roles[0].roleType===2
        || response.data.roles[0].roleType===4
        || response.data.roles[0].roleType===6
          ? '1' : '0'
        this.open = true;
        this.title = "修改用户";
        this.form.password = "";
      });
    },
    /** 重置密码按钮操作 */
    handleResetPwd(row) {
      this.$prompt('请输入"' + row.userName + '"的新密码', "重置密码", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        cancelButtonClass: "btn-custom-cancel"
      })
        .then(({ value }) => {
          resetUserPwd(row.userId, value).then(response => {
            this.msgSuccess("修改成功，新密码是：" + value);
          });
        })
        .catch(() => {});
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.userId != undefined) {
            if(this.AttributionStatus==0){
              this.form.dsId = null;
            }
            // console.log(this.form);
            updateUser(this.form).then(response => {
              // console.log(response);
              this.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addUser(this.form).then(response => {
              this.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const userIds = row.userId || this.ids;
      const userName = row.userName;
      this.$confirm(
        '是否确认删除用户名称为"' + userName + '"的数据项?',
        "警告",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          cancelButtonClass: "btn-custom-cancel",
          type: "warning"
        }
      )
        .then(function() {
          return delUser(userIds);
        })
        .then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download(
        "system/user/export",
        {
          ...this.queryParams
        },
        `user_${new Date().getTime()}.xlsx`
      );
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "用户导入";
      this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
      this.download(
        "system/user/importTemplate",
        {
          ...this.queryParams
        },
        `user_${new Date().getTime()}.xlsx`
      );
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$alert(response.msg, "导入结果", { dangerouslyUseHTMLString: true });
      this.getList();
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    }
  }
};
</script>
<style lang="scss">
.el-col-23 {
  width: 100%;
}
</style>
