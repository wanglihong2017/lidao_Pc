<template>
  <div class="app-container">
    <div class="block">
      <!-- 搜索栏 start -->
      <!-- 搜索栏 start -->
      <!-- 搜索栏 start -->
      <el-row :gutter="20" remark="搜索栏">
        <el-col :span="4">
          <el-input
            v-model="listQuery.username"
            size="mini"
            placeholder="请输入帐号"
          ></el-input>
        </el-col>
        <el-col :span="20">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-search"
            @click.native="search"
          >
            搜索
          </el-button>
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-refresh"
            @click.native="reset"
          >
            重置
          </el-button>
          <el-button
            v-permission="['*', 'account:create']"
            type="success"
            size="mini"
            icon="el-icon-plus"
            @click.native="add"
          >
            添加
          </el-button>
        </el-col>
      </el-row>
      <!-- 搜索栏 end -->
      <!-- 搜索栏 end -->
      <!-- 搜索栏 end -->
      <!-- 编辑栏 start -->
      <!-- 编辑栏 start -->
      <!-- 编辑栏 start -->
      <!-- <el-row remark="编辑栏">
        <el-col :span="24">
          <el-button
            v-permission="['*', 'account:update']"
            type="primary"
            size="mini"
            icon="el-icon-edit"
            @click.native="edit"
          >
            {{ $t('button.edit') }}
          </el-button>
          <el-button
            v-permission="['*', 'account:delete']"
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click.native="remove"
          >
            {{ $t('button.delete') }}
          </el-button>
          <el-button
            v-permission="['*', 'role:update']"
            type="info"
            size="mini"
            icon="el-icon-s-operation"
            @click.native="openRole"
          >
            角色分配
          </el-button>
        </el-col>
      </el-row> -->
      <!-- 编辑栏 end -->
      <!-- 编辑栏 end -->
      <!-- 编辑栏 end -->
    </div>

    <!-- 账号列表 start -->
    <!-- 账号列表 start -->
    <!-- 账号列表 start -->
    <el-row remark="账号列表">
      <el-col :span="4">
        <el-tree
          class="input-tree"
          empty-text="暂无数据"
          :expand-on-click-node="false"
          :default-expand-all="true"
          :data="roleTree.data"
          :props="roleTree.defaultProps"
          @node-click="chooseRole"
        >
        </el-tree>
      </el-col>
      <el-col :span="20">
        <el-table
          v-loading="listLoading"
          :data="list"
          element-loading-text="Loading"
          border
          fit
          highlight-current-row
          @current-change="handleCurrentChange"
        >
          <el-table-column label="头像">
            <template slot-scope="scope">
              <img
                class="user-avatar"
                :src="scope.row.imgPath"
                :alt="scope.row.userName"
              />
            </template>
          </el-table-column>
          <el-table-column label="账号">
            <template slot-scope="scope">
              {{ scope.row.userName }}
            </template>
          </el-table-column>
          <!-- <el-table-column label="姓名">
            <template slot-scope="scope">
              {{ scope.row.username }}
            </template>
          </el-table-column> -->

          <el-table-column label="角色">
            <template slot-scope="scope">
              <span>{{ scope.row.roleName }}</span>
            </template>
          </el-table-column>

          <el-table-column label="创建时间" min-width="120px">
            <template slot-scope="scope">
              {{ scope.row.createAt }}
            </template>
          </el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.manIsEnable"
                :active-value="1"
                :inactive-value="0"
                @change="updateUserStatus(scope.row)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" min-width="150px">
            <template slot-scope="scope">
              <el-button
                v-permission="['*', 'account:list']"
                type="text"
                size="mini"
                icon="el-icon-edit"
                @click.native="editItem(scope.row)"
              >
                编辑
              </el-button>
              <el-button
                v-permission="['*', 'account:delete']"
                type="text"
                size="mini"
                icon="el-icon-delete"
                @click.native="removeItem(scope.row)"
              >
                删除
              </el-button>
              <!-- <el-button
                v-permission="['*', 'role:update']"
                type="text"
                size="mini"
                icon="el-icon-s-operation"
                @click.native="openRoleItem(scope.row)"
              >
                角色分配
              </el-button> -->
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :page-sizes="[10, 20, 50, 100, 500]"
          :page-size="listQuery.limit"
          :total="total"
          :current-page.sync="listQuery.page"
          @size-change="changeSize"
          @current-change="fetchPage"
          @prev-click="fetchPrev"
          @next-click="fetchNext"
        >
        </el-pagination>
      </el-col>
    </el-row>
    <!-- 账号列表 end -->
    <!-- 账号列表 end -->
    <!-- 账号列表 end -->

    <el-dialog
      :title="formTitle"
      :visible.sync="formVisible"
      width="70%"
      remark="弹出窗"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="120px"
        label-position="right"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item label="头像" prop="avatar">
              <el-upload
                class="avatar-uploader"
                :action="uploadUrl"
                :headers="uploadHeaders"
                :show-file-list="false"
                :on-success="handleUploadSuccess"
                :before-upload="beforeAvatarUpload"
                :data="{ token: token }"
              >
                <img v-if="form.avatar" :src="form.avatar" class="avatar" />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="账户" prop="username">
              <el-input v-model="form.username" minlength="1"></el-input>
            </el-form-item>
          </el-col>

          <!-- <el-col :span="12">
            <el-form-item label="性别">
              <el-radio-group v-model="form.sex">
                <el-radio :label="1">男</el-radio>
                <el-radio :label="2">女</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col> -->
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email"></el-input>
            </el-form-item>
          </el-col>
          <el-col v-show="isAdd" :span="12">
            <el-form-item label="密码" prop="password">
              <el-input v-model="form.password" type="password"></el-input>
            </el-form-item>
          </el-col>
          <el-col v-show="isAdd" :span="12">
            <el-form-item label="确认密码" prop="rePassword">
              <el-input v-model="form.rePassword" type="password"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属角色" prop="roleid">
              <treeselect
                v-if="treeselectOpts.length > 0"
                v-model="form.roleid"
                :options="treeselectOpts"
                placeholder="请选择所属角色"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否启用" prop="enabled">
              <el-switch v-model="form.enabled"></el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出生日期">
              <el-date-picker
                v-model="form.birthday"
                type="date"
                placeholder="选择日期"
                style="width: 100%"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button type="primary" @click="userAddBtns">确定</el-button
          >
          <el-button @click.native="formVisible = false">取消
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="角色分配" :visible.sync="roleDialog.visible" width="25%">
      <el-form>
        <el-row>
          <el-col :span="12">
            <el-tree
              ref="roleTree"
              :data="roleDialog.roles"
              show-checkbox
              node-key="id"
              :default-checked-keys="roleDialog.checkedRoleKeys"
              :props="roleDialog.defaultProps"
            >
            </el-tree>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button type="primary" @click="setRole">{{
            提交
          }}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { Loading } from 'element-ui'
import { getList, userAdd, remove, setRole, update } from '@/api/system/user'
import { parseTime } from '@/utils/index'
import { getToken } from '@/api/api'
import { roleTreeListByIdUser, roleOpts } from '@/api/system/role'
// 权限判断指令
export default {
  data () {
    return {
      uploadUrl: process.env.VUE_APP_UPLOAD_API, // 上传地址
      // 上传请求头部信息
      uploadHeaders: {
        // Authorization: getTokens()
      },
      loadingInstance: {}, // 上传时 loading对象
      roleDialog: {
        visible: false,
        roles: [],
        roleTree: [],
        checkedRoleKeys: [],
        defaultProps: {
          id: 'id',
          label: 'roleName',
          children: 'children'
        }
      },
      formVisible: false,
      formTitle: '添加用户',
      // 左侧角色列表树
      roleTree: {
        data: [],
        defaultProps: {
          children: 'children',
          label: 'roleName'
        }
      },
      isAdd: true,
      form: {
        avatar: '',
        id: '',
        username: '',
        birthday: '',
        sex: 1,
        email: '',
        password: '',
        rePassword: '',
        roleid: undefined,
        enabled: true
      },
      rules: {
        avatar: [{ required: true, message: '请上传头像', trigger: 'blur' }],
        username: [
          { required: true, message: '请输入登录账号', trigger: 'blur' },
          {
            min: 3,
            max: 20,
            message: '长度在 3 到 20 个字符',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入初始密码', trigger: 'blur' }
        ],
        rePassword: [
          { required: true, message: '请输入重复密码', trigger: 'blur' }
        ]
        // email: [{ required: true, message: '请输入email', trigger: 'blur' }]
      },
      listQuery: {
        searchText: '',
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      list: null,
      listLoading: true,
      selRow: {},
      token: ''
    }
  },
  filters: {
    statusFilter (status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    rolesFilter (roleid, roles) {
      const selects = roles.data.filter((el) => {
        return el.value === roleid
      })
      return selects[0].label
    }
  },
  computed: {
    treeselectOpts () {
      let opts = []
      try {
        opts = this.roleTree.data.map((el) => {
          return {
            id: el.id,
            label: el.roleName
          }
        })
      } catch (err) {
        opts = []
      }
      return opts
    }
  },
  created () {
    this.init()
    getToken().then((res) => {
      const { code, data } = res
      if (code === '0') {
        this.token = data
      }
    })
  },
  methods: {
    init () {
      roleOpts().then(({ data }) => {
        this.roleTree.data = data
      })
      this.fetchData()
    },
    /**
     * 获取列表
     */
    fetchData () {
      this.listLoading = true
      getList(this.listQuery).then(({ data }) => {
        this.list = data.list
        this.total = data.total
        this.listLoading = false
      })
    },
    search () {
      this.listQuery.page = 1
      this.fetchData()
    },
    reset () {
      this.listQuery.avatar = ''
      this.listQuery.username = ''
      this.listQuery.page = 1
      this.listQuery.enabled = ''
      this.listQuery.sex = ''
      this.fetchData()
    },
    handleFilter () {
      this.listQuery.page = 1
      this.getList()
    },
    handleClose () {},
    fetchNext () {
      this.listQuery.page = this.listQuery.page + 1
      // this.fetchData()
    },
    fetchPrev () {
      this.listQuery.page = this.listQuery.page - 1
      // this.fetchData()
    },
    fetchPage (page) {
      this.listQuery.page = page
      this.fetchData()
    },
    changeSize (limit) {
      this.listQuery.limit = limit
      this.fetchData()
    },
    handleCurrentChange (currentRow, oldCurrentRow) {
      this.selRow = currentRow
    },
    resetForm () {
      this.form = {
        avatar: '',
        id: '',
        username: '',
        birthday: '',
        sex: 1,
        email: '',
        password: '',
        rePassword: '',
        roleid: undefined,
        enabled: true
      }
    },
    add () {
      this.resetForm()
      this.formTitle = '添加用户'
      this.formVisible = true
      this.isAdd = true
    },
    updateUserStatus (record) {
      update({
        account_id: record.account_id,
        username: record.username,
        roles: record.roles,
        avatar: record.avatar,
        enabled: record.enabled
      })
        .then((response) => {
          this.$message({
            message: '提交成功',
            type: 'success'
          })
          this.fetchData()
        })
        .catch(() => {
          record.enabled = !record.enabled
        })
    },
    validPasswd () {
      if (!this.isAdd) {
        return true
      }

      if (this.form.password !== this.form.rePassword) {
        this.$message({
          message: '前后密码不一致',
          type: 'error'
        })
        return false
      }
      if (this.form.password === '' || this.form.rePassword === '') {
        this.$message({
          message: '密码不能为空',
          type: 'error'
        })
        return false
      }
      return true
    },
    /**
     * 保存用户
     */
    userAddBtns () {
      var self = this
      if (this.form.account_id) {
        update({
          // account_id: this.form.account_id,
          userName: this.form.username,
          imgPath: this.form.avatar,
          manPwd: this.form.password,
          manRoleId: this.form.roleid,
          avatar: this.form.avatar,
          manIsEnable: this.form.enabled ? 1 : 0,
          manEmail: this.form.email,
          manBirthday: this.form.birthday
        }).then((response) => {
          this.$message({
            message: '提交成功',
            type: 'success'
          })
          this.fetchData()
          this.formVisible = false
        })
      } else {
        this.$refs.form.validate((valid) => {
          if (valid) {
            const form = self.form
            if (this.validPasswd()) {
              form.birthday = parseTime(form.birthday, '{y}-{m}-{d}')
              form.createtime = parseTime(form.createtime)
              userAdd({
                userName: this.form.username,
                imgPath: this.form.avatar,
                manPwd: this.form.password,
                manRoleId: this.form.roleid,
                manIsEnable: this.form.enabled ? 1 : 0,
                manEmail: this.form.email,
                manBirthday: this.form.birthday
              }).then((response) => {
                this.$message({
                  message: '提交成功',
                  type: 'success'
                })
                this.fetchData()
                this.formVisible = false
              })
            }
          } else {
            return false
          }
        })
      }
    },
    editItem (record) {
      this.selRow = Object.assign({}, record)
      this.edit()
    },
    edit () {
      this.isAdd = false
      this.form = this.selRow
      this.form.roleid = this.selRow.roles[0]
      this.form.password = ''
      this.formTitle = '修改用户'
      this.formVisible = true
    },
    removeItem (record) {
      this.selRow = record
      this.$confirm('确定删除该记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        remove({ id: record.id })
          .then((response) => {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.fetchData()
          })
          .catch((err) => {
            this.$notify.error({
              title: '错误',
              message: err
            })
          })
      })
    },
    /**
     * 筛选角色
     */
    chooseRole (data, node) {
      console.log(data, node)
      this.listQuery.roleid = data.value
      this.search()
    },
    openRoleItem (record) {
      this.selRow = record
      this.openRole()
    },
    // openRole () {
    //   roleTreeListByIdUser(this.selRow.id).then((response) => {
    //     this.roleDialog.roles = response.data.treeData
    //     this.roleDialog.checkedRoleKeys = response.data.checkedIds
    //     this.roleDialog.visible = true
    //   })
    // },
    setRole () {
      var checkedRoleKeys = this.$refs.roleTree.getCheckedKeys()
      var roleIds = ''
      for (var index in checkedRoleKeys) {
        roleIds += checkedRoleKeys[index] + ','
      }
      var data = {
        userId: this.selRow.id,
        roleIds: roleIds
      }
      setRole(data).then((response) => {
        this.roleDialog.visible = false
        this.fetchData()
        this.$message({
          message: '提交成功',
          type: 'success'
        })
      })
    },
    /**
     * 上传文件前处理
     */
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    /**
     * 上传成功
     */
    handleUploadSuccess (res) {
      const url = 'http://files.q.lidaokoi.com/' + res.key
      this.form.avatar = url
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.app-container {
  margin: 10px 20px 10px;
}
.block {
  padding: 10px 0px;
}
.el-form-item {
  margin-bottom: 20px;
}
.flash-table-expand {
  font-size: 0;
}

.flash-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
.user {
  padding: 10px;
}
.user > strong {
  color: #777;
  font-size: 15px;
  font-weight: 400;
}

.user > small {
  color: #9e9e9e;
}

.user-content {
  box-shadow: 2px 2px 4px #edecec;
  min-height: 500px;
}

.user-content > .profile {
  background: #edecec;
  padding: 10px;
  height: 500px;
  width: 220px;
}
.user-content > .profile > img {
  width: 100%;
}
.user-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
}
.avatar-uploader {
  >>> .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  >>> .el-upload:hover {
    border-color: #409eff;
  }
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
  border-radius: 6px;
  cursor: pointer;
  margin: 10px;
  border: 1px dashed #d9d9d9;
}
.avatar {
  width: 100px;
  height: 100px;
  display: block;
}
</style>
