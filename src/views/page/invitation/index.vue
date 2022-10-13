<template>
  <div class="app-container">
    <div class="block">
      <el-row :gutter="20" style="margin-bottom: 10px">
        <el-col :span="6">
          <el-input
            v-model="listQuery.searchText"
            size="mini"
            placeholder="请输入内容"
          ></el-input>
        </el-col>
        <el-col :span="18">
          <el-date-picker
            v-model="rangeDate"
            size="mini"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="发布起始日期"
            end-placeholder="发布截至日期"
            value-format="yyyyMMddHHmmss"
            align="right"
          >
          </el-date-picker>
        </el-col>
      </el-row>
      <el-row :gutter="5" style="margin-bottom: 10px">
        <el-col :span="8">
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
        </el-col>
      </el-row>

      <!-- <el-row v-if="false">
        <el-col :span="24">
          <el-button
            v-permission="['*', 'comment:create']"
            type="success"
            size="mini"
            icon="el-icon-plus"
            @click.native="add"
          >
            {{ $t('button.add') }}
          </el-button>
        </el-col>
      </el-row> -->
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
      <el-table-column label="评论编号" width="80">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="内容">
        <template slot-scope="scope">
          {{ scope.row.content }}
        </template>
      </el-table-column>
      <el-table-column label="评论文章标题">
        <template slot-scope="scope">
          {{ scope.row.title ? scope.row.title : '标题' }}
        </template>
      </el-table-column>
      <el-table-column label="评论文章分类" width="120">
        <template slot-scope="scope">
          {{
            scope.row.articleType == 1
              ? '鱼友圈'
              : scope.row.articleType == 2
              ? '在线问诊'
              : scope.row.articleType == 3
              ? '拍卖资讯'
              : scope.row.articleType == 4
              ? '鲤道头条'
              : scope.row.articleType == 5
              ? '答鱼友问'
              : scope.row.articleType == 6
              ? '鲤道课堂'
              : '广告'
          }}
        </template>
      </el-table-column>
      <el-table-column label="用户头像/用户名">
        <template slot-scope="scope">
          <img
            :src="scope.row.userImgPath"
            style="width: 50px; border-radius: 50%"
          />
          {{ scope.row.userName }}
        </template>
      </el-table-column>
      <el-table-column label="状态" width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.isDelete === 0">已发布</span>
          <span v-else-if="scope.row.isDelete === 1">用户自己删除</span>
          <span v-else-if="scope.row.isDelete === 2">管理员删除</span>
        </template>
      </el-table-column>
      <el-table-column label="类型">
        <template slot-scope="scope">
          {{ scope.row.type === 1 ? '图文展示' : '视频播放' }}
        </template>
      </el-table-column>
      <el-table-column label="更新/发布日期">
        <template slot-scope="scope">
          {{ scope.row.createAt }}
        </template>
      </el-table-column>

      <el-table-column label="操作" width="280">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-upload2"
            :disabled="scope.row.isDelete != 0"
            @click.native="toppingBtn(scope.row.id)"
            >置顶</el-button
          >
          <el-button
            type="warning"
            size="mini"
            icon="el-icon-upload2"
            :disabled="scope.row.isDelete != 0"
            @click.native="updateTypeBtns(scope.row)"
            >修改
          </el-button>
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            :disabled="scope.row.isDelete != 0"
            @click.native="removeItem(scope.row.id)"
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
    <el-dialog
      title="温馨提示"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-radio-group v-model="amendChoice">
        <el-radio :label="1">鱼友圈</el-radio>
        <el-radio :label="2">在线问诊</el-radio>
      </el-radio-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="makeSureBtns">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getManagerList, deleteM, updateTop, updateType } from '@api/api'
export default {
  name: 'comment',
  data () {
    return {
      formVisible: false,
      formTitle: '添加评论',
      form: {
        id: '',
        content: '',
        img: ''
      },

      listQuery: {
        pageNum: 1,
        pageSize: 10,
        beginTime: '',
        endTime: '',
        searchText: ''
      },
      rangeDate: '',
      total: 0,
      list: null,
      listLoading: true,
      dialogVisible: false,
      selRow: {},
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick (picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      amendChoice: 1,
      amendId: ''
    }
  },
  computed: {
    rules () {
      return {
        content: [{ required: true, message: '内容不能为空', trigger: 'blur' }]
      }
    }
  },
  created () {
    this.init()
  },
  methods: {
    init () {
      try {
        this.fetchData()
      } catch (err) {
        console.log(err)
      }
    },
    fetchData () {
      this.listLoading = true
      const queryData = this.listQuery
      if (this.rangeDate) {
        queryData.beginTime = this.rangeDate[0]
        queryData.endTime = this.rangeDate[1]
      }
      getManagerList(queryData).then(({ data }) => {
        console.log(data.list)
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
      this.listQuery.beginTime = ''
      this.listQuery.endTime = undefined
      this.rangeDate = ''
      this.listQuery.pageNum = 1
      this.fetchData()
    },
    fetchNext () {
      this.listQuery.page = this.listQuery.page + 1
      this.fetchData()
    },
    fetchPrev () {
      this.listQuery.page = this.listQuery.page - 1
      this.fetchData()
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
    add () {
      this.$router.push({ path: '/comment/edit' })
    },
    removeItem (id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteM({ id }).then((response) => {
          const { code } = response
          if (code === '0') {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
            this.fetchData()
          }
        })
      })
    },
    toppingBtn (id) {
      this.$confirm('确定要置顶操作吗?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateTop({ id }).then((response) => {
          const { code } = response
          if (code === '0') {
            this.$message({
              message: '置顶操作成功',
              type: 'success'
            })
            this.fetchData()
          }
        })
      })
    },
    updateTypeBtns (item) {
      this.amendChoice = item.articleType
      this.amendId = item.id
      this.dialogVisible = true
    },
    makeSureBtns () {
      const param = {
        id: this.amendId,
        articleType: this.amendChoice
      }
      console.log('param', param)
      updateType(param).then((res) => {
        const { code } = res
        if (code === '0') {
          this.dialogVisible = false
          this.fetchData()
        }
      })
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
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
</style>
