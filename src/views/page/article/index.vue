<template>
  <div class="app-container">
    <div class="block">
      <el-row :gutter="20" style="margin-bottom: 10px">
        <el-col :span="6">
          <el-input v-model="listQuery.title" size="mini" placeholder="标题"></el-input>
        </el-col>
        <el-col :span="6">
          <el-select v-model="listQuery.category_id" placeholder="请选择所属类目" size="mini" style="width: 100%;">
            <el-option v-for="item in categoryOpts" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="8">
          <el-date-picker
            v-model="rangeDate"
            size="mini"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="至"
            start-placeholder="发布起始日期"
            end-placeholder="发布截至日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            align="right"
          >
          </el-date-picker>
        </el-col>
      </el-row>
      <el-row :gutter="5" style="margin-bottom: 10px">
        <el-col :span="8">
          <el-button type="primary" size="mini" icon="el-icon-search" @click.native="search">
            搜索
          </el-button>
          <el-button type="primary" size="mini" icon="el-icon-refresh" @click.native="reset">
           重置
          </el-button>
          <el-button
            type="success"
            size="mini"
            icon="el-icon-plus"
            @click.native="add"
          >
           添加
          </el-button>
        </el-col>
      </el-row>

      <!-- <el-row>
        <el-col :span="24">
          <el-button
            v-permission="['*', 'article:create']"
            type="success"
            size="mini"
            icon="el-icon-plus"
            @click.native="add"
          >
            {{ $t('button.add') }}
          </el-button>
          <el-button
            v-permission="['/cms/articleEdit']"
            type="primary"
            size="mini"
            icon="el-icon-edit"
            @click.native="edit"
          >
            {{ $t('button.edit') }}
          </el-button>
          <el-button
            v-permission="['/article/remove']"
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click.native="remove"
          >
            {{ $t('button.delete') }}
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
      <el-table-column label="编号ID">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="标题">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
       <el-table-column label="内容">
        <template slot-scope="scope">
          {{ scope.row.content }}
        </template>
      </el-table-column>
      <el-table-column label="更新/发布日期">
        <template slot-scope="scope">
          {{ scope.row.createAt }}
        </template>
      </el-table-column>
      <el-table-column label="封面图">
        <template slot-scope="scope">
          <img :src="scope.row.imgPath" style="width:80px;" />
        </template>
      </el-table-column>
      <el-table-column label="状态" width="180">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.isDelete"
            :active-value="1"
            :inactive-value="0"
            active-text="开启"
            inactive-text="关闭"
            @change="switchType(scope.row)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="类型">
        <template slot-scope="scope">
           {{scope.row.imgType===1?'图片':'视频'}}
        </template>
      </el-table-column>
      <el-table-column label="所属板块">
        <template slot-scope="scope">
         {{ scope.row.articleType === 3 ? '拍卖资讯' : scope.row.articleType === 4?'鲤道头条': scope.row.articleType === 5?'答鱼友问':'鲤道课堂' }}
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <div>
            <el-button
              v-if="scope.row.channel === 2"
              type="text"
              size="mini"
              icon="el-icon-edit"
              @click.native="editItem(scope.row)"
            >
              {{ $t('button.edit') }}
            </el-button>
          </div>
          <div>
            <el-button
              type="text"
              size="mini"
              icon="el-icon-delete"
              @click.native="removeItem(scope.row)"
            >
              删除
            </el-button>
          </div>
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
  </div>
</template>

<script>
import { remove, getList, save } from '@/api/system/article'

export default {
  data () {
    return {
      categoryOpts: [],
      formVisible: false,
      formTitle: '添加文章',
      deptList: [],
      isAdd: true,
      form: {
        id: '',
        title: '',
        img: ''
      },

      listQuery: {
        pageNum: 1,
        pageSize: 20,
        searchText: '',
        beginTime: '',
        endTime: '',
        category_id: '',
        articleType: ''
      },
      rangeDate: undefined,
      total: 0,
      list: null,
      listLoading: true,
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
      }
    }
  },
  computed: {
    rules () {
      return {
        title: [{ required: true, message: '标题不能为空', trigger: 'blur' }]
      }
    }
  },
  created () {
    this.init()
  },
  methods: {
    async init () {
      this.fetchData()
    },
    fetchData () {
      this.listLoading = true
      const queryData = this.listQuery
      queryData.beginTime = (this.rangeDate && this.rangeDate[0]) || ''
      queryData.endTime = (this.rangeDate && this.rangeDate[1]) || ''
      getList(queryData).then(({ data }) => {
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
      this.listQuery.searchText = ''
      this.listQuery.beginTime = ''
      this.listQuery.endTime = ''
      this.listQuery.category_id = ''
      this.rangeDate = ''
      this.listQuery.pageNum = 1
      this.fetchData()
    },
    handleFilter () {
      this.listQuery.pageNum = 1
      this.getList()
    },
    handleClose () {},
    fetchNext () {
      this.listQuery.pageNum = this.listQuery.pageNum + 1
      this.fetchData()
    },
    fetchPrev () {
      this.listQuery.pageNum = this.listQuery.pageNum - 1
      this.fetchData()
    },
    fetchPage (page) {
      this.listQuery.pageNum = page
      this.fetchData()
    },
    changeSize (limit) {
      this.listQuery.pageSize = limit
      this.fetchData()
    },
    handleCurrentChange (currentRow, oldCurrentRow) {
      this.selRow = currentRow
    },
    add () {
      this.$router.push({ path: '/article/edit' })
    },
    checkSel () {
      if (this.selRow && this.selRow.article_id) {
        return true
      }
      this.$message({
        message: this.$t('common.mustSelectOne'),
        type: 'warning'
      })
      return false
    },
    /**
     * 草稿/发布 开关
     */
    switchType (record) {
      save({
        title: record.title,
        category_id: record.category_id,
        pic_url: record.pic_url,
        type: record.type,
        article_id: record.article_id,
        status: record.status
      })
        .then(response => {
          this.$message({
            message: this.$t('common.optionSuccess'),
            type: 'success'
          })
          this.fetchData()
        })
        .catch(() => {
          record.status = record.status === 'draft' ? 'publish' : 'draft'
        })
    },
    editItem (record) {
      this.selRow = record
      this.edit()
    },
    edit () {
      if (this.checkSel()) {
        this.$router.push({
          path: '/article/edit',
          query: {
            article_id: this.selRow.article_id
          }
        })
      }
    },
    removeItem (record) {
      this.selRow = record
      this.remove()
    },
    remove () {
      if (this.checkSel()) {
        const id = this.selRow.article_id

        this.$confirm(this.$t('common.deleteConfirm'), this.$t('common.tooltip'), {
          confirmButtonText: this.$t('button.submit'),
          cancelButtonText: this.$t('button.cancel'),
          type: 'warning'
        })
          .then(() => {
            remove(id).then(response => {
              this.$message({
                message: this.$t('common.optionSuccess'),
                type: 'success'
              })
              this.fetchData()
            })
          })
          .catch(() => {})
      }
    }
  }
}

</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
