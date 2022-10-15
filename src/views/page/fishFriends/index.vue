<template>
  <div class="app-container">
    <div class="block">
      <!-- <el-row :gutter="20">
        <el-col :span="6">
          <el-input v-model="listQuery.title" size="mini" placeholder="标题"></el-input>
        </el-col>
        <el-col :span="18">
          <el-button type="primary" size="mini" icon="el-icon-search" @click.native="search">
            {{ $t('button.search') }}
          </el-button>
          <el-button type="primary" size="mini" icon="el-icon-refresh" @click.native="reset">
            {{ $t('button.reset') }}
          </el-button>
        </el-col>
      </el-row> -->

      <el-row>
        <el-col :span="24">
          <el-button
            type="success"
            size="mini"
            icon="el-icon-plus"
            @click.native="add">
            添加
          </el-button>
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
      <el-table-column label="ID">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="关键字">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="发布日期">
        <template slot-scope="scope">
          {{ scope.row.createAt }}
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
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      background
      layout="total, sizes, prev, pager, next, jumper"
      :page-sizes="[10, 20, 50, 100, 500]"
      :page-size="listQuery.pageSize"
      :total="total"
      :current-page.sync="listQuery.pageNum"
      @size-change="changeSize"
      @current-change="fetchPage"
      @prev-click="fetchPrev"
      @next-click="fetchNext"
    >
    </el-pagination>

    <el-dialog :title="formTitle" :visible.sync="formVisible" width="70%" remark="编辑弹窗">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="24">
            <!-- <el-form-item label="展示位置" prop="position">
              <el-select v-model="form.position" placeholder="请选择位置">
                <el-option v-for="item in positionOpts" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item> -->
          </el-col>
          <el-col :span="12">
            <el-form-item label="标题" prop="keyword">
              <el-input v-model="form.keyword" minlength="1" placeholder="请输入关键字"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button type="primary" @click="save">提交</el-button>
          <el-button @click.native="formVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { keyworDelete, fishFriendsList, keyworAdd } from '@/api/system/user.js'
export default {
  name: 'keyword',
  data () {
    return {
      formVisible: false,
      formTitle: '添加搜索关键字',
      form: {
        keyword: '',
        keyword_id: ''
      },
      listQuery: {
        pageNum: 1,
        pageSize: 20
      },
      list: null,
      total: 0,
      listLoading: true,
      selRow: {}
    }
  },
  filters: {
    positionFilter (position, opts) {
      const pos = opts.filter(el => el.value === position)
      return pos.length > 0 ? pos[0].label : ''
    }
  },
  computed: {
    rules () {
      return {
        keyword: [{ required: true, message: '关键字不能为空', trigger: 'blur' }]
      }
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      this.fetchData()
    },
    fetchData () {
      this.listLoading = true
      fishFriendsList(this.listQuery).then(({ data }) => {
        this.list = data.list
        this.total = data.total
        this.listLoading = false
      })
    },
    search () {
      this.listQuery.pageNum = 1
      this.fetchData()
    },
    reset () {
      this.listQuery.name = ''
      this.listQuery.pageNum = 1
      this.fetchData()
    },
    // handleFilter () {
    //   this.getKeywordList()
    // },
    handleCurrentChange (currentRow, oldCurrentRow) {
      this.selRow = currentRow
    },
    resetForm () {
      this.form = {
        keyword: ''
      }
    },
    fetchNext () {
      this.listQuery.pageNum = this.listQuery.pageNum + 1
      this.fetchData()
    },
    fetchPrev () {
      this.listQuery.pageNum = this.listQuery.pageNum - 1
      this.fetchData()
    },
    fetchPage (pageNum) {
      this.listQuery.pageNum = pageNum
      this.fetchData()
    },
    changeSize (pageSize) {
      this.listQuery.pageSize = pageSize
      this.fetchData()
    },
    add () {
      this.resetForm()
      this.formTitle = '添加搜索关键字'
      this.formVisible = true
    },
    save () {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.form.keyword_id) {
            keyworAdd({
              id: this.form.keyword_id,
              name: this.form.keyword
            }).then(response => {
              this.$message({
                message: '编辑成功',
                type: 'success'
              })
              this.fetchData()
              this.formVisible = false
            })
          } else {
            keyworAdd({
              keyword_id: this.form.keyword_id || '',
              name: this.form.keyword
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
          return false
        }
      })
    },
    removeItem (record) {
      this.selRow = record
      this.remove()
    },
    remove () {
      // eslint-disable-next-line camelcase
      const keyword_id = this.selRow.id
      this.$confirm('你确定删除该记录吗', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          keyworDelete({ id: keyword_id }).then(response => {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.fetchData()
          })
        })
        .catch(() => {})
    },

    // this.$message({
    //   message: this.$t('common.optionSuccess'),
    //   type: 'success'
    // })
    editItem (record) {
      this.selRow = Object.assign({}, record)
      console.log('this.selRow', this.selRow)
      this.edit()
    },
    edit () {
      this.form.keyword = this.selRow.name
      this.form.keyword_id = this.selRow.id
      this.formTitle = '修改搜索关键字'
      this.formVisible = true
    }
  }
}

</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.advert-uploader {
  >>> .el-upload {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    &:hover {
      border-color: #409eff;
    }
  }
  >>> .el-upload-dragger {
    width: auto;
    min-width: 360px;
  }
  .img {
    height: 100%;
  }
}
</style>
