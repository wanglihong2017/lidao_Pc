<template>
  <div class="app-container">
    <div class="block">
      <el-row>
        <el-col :span="24">
          <!-- <el-button
            type="success"
            size="mini"
            icon="el-icon-plus"
            @click.native="add">
            添加
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
      <el-table-column label="ID" width="100px">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="关键字">
        <template slot-scope="scope">
          {{ scope.row.userName }}
        </template>
      </el-table-column>
       <el-table-column label="头像">
        <template slot-scope="scope">
           <div class="img_box">
             <img :src="scope.row.imgPath" alt="" />
           </div>
        </template>
      </el-table-column>
       <el-table-column label="联系方式">
        <template slot-scope="scope">
          {{ scope.row.userPhone }}
        </template>
      </el-table-column>
      <el-table-column label="类型">
        <template slot-scope="scope">
          {{ scope.row.userType==1?'普通用户': scope.row.userType==2?'专家':'客服'}}
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
            <el-form-item label="类型" prop="userType">
              <!-- <el-input v-model="form.userType" minlength="1" placeholder="请输入关键字"></el-input> -->
              <el-radio-group v-model="form.userType">
                <el-radio :label="1">普通用户</el-radio>
                <el-radio :label="2">专家</el-radio>
                <el-radio :label="3">客服</el-radio>
              </el-radio-group>
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
import { fishFriendsList, fishFriendsupdateType } from '@/api/system/user.js'
export default {
  name: 'userType',
  data () {
    return {
      formVisible: false,
      formTitle: '修改鱼友类型',
      form: {
        userType: 1,
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
        userType: [{ required: true, message: '请选择', trigger: 'blur' }]
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
        userType: ''
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
    save () {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.form.keyword_id) {
            fishFriendsupdateType({
              id: this.form.keyword_id,
              userType: this.form.userType
            }).then(response => {
              this.$message({
                message: '编辑成功',
                type: 'success'
              })
              this.fetchData()
              this.formVisible = false
            })
          }
        }
      })
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
      this.form.userType = this.selRow.userType
      this.form.keyword_id = this.selRow.id
      this.formTitle = '修改鱼友类型'
      this.formVisible = true
    }
  }
}

</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.img_box {
  width: 70px;
  height: 70px;
  img{
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
}
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
