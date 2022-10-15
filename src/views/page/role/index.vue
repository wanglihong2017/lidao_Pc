<template>
  <div class="app-container">
    <div class="block">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-input v-model="listQuery.searchText" size="mini" placeholder="请输入角色名称"></el-input>
        </el-col>
        <el-col :span="4">
          <el-input v-model="listQuery.searchText" size="mini" placeholder="请输入角色描述"></el-input>
        </el-col>
        <el-col :span="16">
          <el-button type="primary" size="mini" icon="el-icon-search" @click.native="search">
            搜索
          </el-button>
          <el-button type="primary" size="mini" icon="el-icon-refresh" @click.native="reset">
           重置
          </el-button>
        </el-col>
      </el-row>
      <br />
      <el-row>
        <el-col :span="24">
          <el-button
            type="success"
            size="mini"
            icon="el-icon-plus"
            @click.native="add"
          >
            添加
          </el-button>
          <!-- <el-button
            v-permission="['*', 'role:update']"
            type="primary"
            size="mini"
            icon="el-icon-edit"
            @click.native="edit"
          >
            {{ $t('button.edit') }}
          </el-button>
          <el-button
            v-permission="['*', 'role:delete']"
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click.native="remove"
          >
            {{ $t('button.delete') }}
          </el-button>
          <el-button
            v-permission="['*', 'role:update']"
            type="primary"
            size="mini"
            icon="el-icon-setting"
            @click.native="openPermissions"
          >
            权限配置
          </el-button> -->
        </el-col>
      </el-row>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      @current-change="handleCurrentChange"
    >
      <el-table-column label="名称">
        <template slot-scope="scope">
          {{ scope.row.roleName }}
        </template>
      </el-table-column>
      <el-table-column label="描述">
        <template slot-scope="scope">
          {{ scope.row.content }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="mini"
            icon="el-icon-edit"
            @click.native="editItem(scope.row)"
          >
            编辑
          </el-button>
          <el-button
            type="text"
            size="mini"
            icon="el-icon-delete"
            @click.native="removeItem(scope.row)"
          >
           删除
          </el-button>
          <el-button
            type="text"
            size="mini"
            icon="el-icon-setting"
            @click.native="openPermissionsItem(scope.row)"
          >
            权限配置
          </el-button>
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

    <el-dialog :title="formTitle" :visible.sync="formVisible" width="70%" remark="弹出窗">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="名称" prop="name">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="描述" prop="desc">
              <el-input v-model="form.desc"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button type="primary" @click="save">确定</el-button>
          <el-button @click.native="formVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="权限配置" :visible.sync="permissonVisible" width="25%">
      <el-form ref="form2">
        <el-row>
          <el-col :span="12">
            <el-tree
              ref="permissonTree"
              :data="permissions.data"
              show-checkbox
              default-expand-all
              node-key="id"
              :props="permissions.defaultProps"
            >
            </el-tree>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button type="primary" @click="savePermissions">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { remove, getList, save, update, updateRolePerms, getRolePermission } from '@/api/system/role'
export default {
  data () {
    return {
      formVisible: false,
      formTitle: '添加角色',
      permissonVisible: false,
      permissions: {
        data: [],
        defaultProps: {
          id: 'id',
          label: 'funName',
          children: 'children'
        }
      },
      form: {
        name: '', // 名称
        desc: '', // 描述
        pid: 0,
        id: '',
        version: '',
        deptName: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        desc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ]
      },
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        searchText: ''
      },
      total: 0,
      list: null,
      listLoading: true,
      selRow: {}
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
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      // getDeptList().then(response => {
      //   this.deptList = response.data
      // })
      this.fetchData()
    },
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
      this.listQuery.searchText = ''
      this.listQuery.pageNum = 1
      this.fetchData()
    },
    handleFilter () {
      this.getList()
    },
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
        name: '',
        desc: '',
        id: ''
      }
    },
    add () {
      this.resetForm()
      this.formTitle = '添加角色'
      this.formVisible = true
    },
    save () {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.form.role_id) {
            update({
              id: this.form.role_id,
              roleName: this.form.name,
              content: this.form.desc
            }).then(response => {
              this.$message({
                message: '编辑成功',
                type: 'success'
              })
              this.fetchData()
              this.formVisible = false
            })
          } else {
            save({
              roleName: this.form.name,
              content: this.form.desc
            }).then(response => {
              this.$message({
                message: '保存成功',
                type: 'success'
              })
              this.fetchData()
              this.formVisible = false
            })
          }
        } else {
          console.log('提交失败！！！')
          return false
        }
      })
    },
    editItem (record) {
      this.selRow = Object.assign({}, record)
      this.edit()
    },
    edit () {
      console.log('this.selRow', this.selRow)
      this.form = {
        name: this.selRow.roleName,
        desc: this.selRow.content,
        role_id: this.selRow.id
      }
      this.formTitle = '修改角色'
      this.formVisible = true
    },
    removeItem (record) {
      this.selRow = record
      this.remove()
    },
    remove () {
      const id = this.selRow.id
      this.$confirm('确定删除该记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          remove({ id: id })
            .then(response => {
              this.$message({
                message: '提交成功',
                type: 'success'
              })
              this.fetchData()
            })
            .catch(err => {
              this.$notify.error({
                title: '错误',
                message: err
              })
            })
        })
        .catch(() => {})
    },
    openPermissionsItem (record) {
      this.selRow = record
      console.log('record', record)
      this.openPermissions()
    },
    openPermissions () {
      this.permissonVisible = true
      getRolePermission(this.selRow.role_id).then(({ data }) => {
        console.log('data', data)
        this.permissions.data = data
        // const {
        //   role: { permissions: parsePerms }
        // } = data
        // const list = []
        const arr = data
        // if (parsePerms.indexOf('*') > -1) {
        //   arr = list.map(el => el)
        // } else {
        //   arr = list.filter(el => parsePerms.indexOf(el) > -1)
        // }
        console.log('arr', arr)
        this.$refs.permissonTree.setCheckedKeys(arr)
      })
    },
    savePermissions () {
      const checkedNodes = this.$refs.permissonTree.getCheckedNodes(true, false)
      const perms = []
      for (const index in checkedNodes) {
        perms.push(checkedNodes[index].id)
      }
      const data = {
        roleId: this.selRow.id,
        funIds: perms.toString()
      }
      updateRolePerms(data).then(response => {
        this.permissonVisible = false
        this.$message({
          message: '提交成功',
          type: 'success'
        })
      })
    }
  }
}

</script>
<style rel="stylesheet/scss" lang="scss" scoped>

</style>
