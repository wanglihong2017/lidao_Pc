<template>
  <div class="app-container">
    <div class="block">
      <el-row :gutter="20">
        <el-col :span="6">
          <!-- <el-select v-model="listQuery.position" placeholder="请选择广告类别" size="mini" style="width: 100%;">
            <el-option v-for="item in positionOpts" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select> -->
          <el-input v-model="listQuery.searchText" placeholder="请输入内容"></el-input>
        </el-col>
        <el-col :span="18">
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
          {{ scope.row.userId }}
        </template>
      </el-table-column>
      <el-table-column label="标题">
        <template slot-scope="scope">
          {{ scope.row.title }}
        </template>
      </el-table-column>
      <el-table-column label="内容">
        <template slot-scope="scope">
          {{ scope.row.content}}
        </template>
      </el-table-column>

      <el-table-column label="类型">
        <template slot-scope="scope">
          {{ scope.row.imgType === 1 ? '图片' : '视频' }}
        </template>
      </el-table-column>
      <!-- <el-table-column label="链接/编号ID">
        <template slot-scope="scope">
          {{ scope.row.link | linkFilter(scope.row.type) }}
        </template>
      </el-table-column> -->
      <el-table-column label="状态" width="180">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.isDelete"
            :active-value="1"
            :inactive-value="0"
            active-text="开启"
            disabled
            inactive-text="关闭"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="广告图" min-width="200">
        <template slot-scope="scope">
          <img :src="scope.row.imgPath" style="width: auto;height: auto;max-height: 80px;" />
        </template>
      </el-table-column>
      <el-table-column label="发布日期">
        <template slot-scope="scope">
          {{ scope.row.createAt }}
        </template>
      </el-table-column>
      <!-- <el-table-column label="更新日期">
        <template slot-scope="scope">
          {{ scope.row.updated_at }}
        </template>
      </el-table-column> -->

      <!-- <el-table-column label="位置图示">
        <template slot-scope="scope">
          <el-image
            v-if="scope.row.position === 1"
            class="table-img-tips"
            src="/img/home_banner.png"
            alt="1-首页-展示banner"
            :preview-src-list="['/img/home_banner.png']"
          />
          <el-image
            v-else-if="scope.row.position === 2"
            class="table-img-tips"
            src="/img/home_icon_bottom_adv.jpg"
            alt="2-首页-icon下方"
            :preview-src-list="['/img/home_icon_bottom_adv.jpg']"
          />
          <el-image
            v-else-if="scope.row.position === 3"
            class="table-img-tips"
            src="/img/home_block5_area.png"
            alt="3-首页-固定5个/板块"
            :preview-src-list="['/img/home_block5_area.png']"
          />
          <el-image
            v-else-if="scope.row.position === 4"
            class="table-img-tips"
            src="/img/home_bottom.png"
            alt="4-首页-底部banner"
            :preview-src-list="['/img/home_bottom.png']"
          />
          <el-image
            v-else-if="scope.row.position === 5"
            class="table-img-tips"
            src="/img/home_popup.png"
            alt="5-首页-弹窗广告"
            :preview-src-list="['/img/home_popup.png']"
          />
          <el-image
            v-else-if="scope.row.position === 6"
            class="table-img-tips"
            src="/img/center_adv.png"
            alt="6-个人中心-展示banner"
            :preview-src-list="['/img/center_adv.png']"
          />
          <el-image
            v-else-if="scope.row.position === 7"
            class="table-img-tips"
            src="/img/article_banner.png"
            alt="7-信息类型列表-展示banner"
            :preview-src-list="['/img/article_banner.png']"
          />
          <el-image
            v-else-if="scope.row.position === 8"
            class="table-img-tips"
            src="/img/question_banner.png"
            alt="8-鱼友提问-展示banner"
            :preview-src-list="['/img/question_banner.png']"
          />
          <el-image
            v-else-if="scope.row.position === 9"
            class="table-img-tips"
            src="/img/search_banner.png"
            alt="9-搜索页-展示banner"
            :preview-src-list="['/img/search_banner.png']"
          />
          <el-image
            v-else-if="scope.row.position === 10"
            class="table-img-tips"
            src="/img/media_banner.png"
            alt="10-视频类型列表-展示banner"
            :preview-src-list="['/img/media_banner.png']"
          />
          <el-image
            v-else-if="scope.row.position === 11"
            class="table-img-tips"
            src="/img/home_icon_bottom_text.png"
            alt="11-首页-文字轮播"
            :preview-src-list="['/img/home_icon_bottom_text.png']"
          />
        </template>
      </el-table-column> -->
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
          <el-col :span="12">
            <!-- <el-form-item label="展示位置" prop="position">
              <el-select v-model="form.position" placeholder="请选择位置" style="width: 250px;">
                <el-option v-for="item in positionOpts" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
              <el-popover placement="top-end" width="200" trigger="hover">
                <i slot="reference" class="el-icon-question" style="font-size: 18px;" />
                <img v-if="form.position === 1" class="img-tips" src="/img/home_banner.png" alt="1-首页-展示banner" />
                <img
                  v-else-if="form.position === 2"
                  class="img-tips"
                  src="/img/home_icon_bottom_adv.jpg"
                  alt="2-首页-icon下方"
                />
                <img
                  v-else-if="form.position === 3"
                  class="img-tips"
                  src="/img/home_block5_area.png"
                  alt="3-首页-固定5个/板块"
                />
                <img
                  v-else-if="form.position === 4"
                  class="img-tips"
                  src="/img/home_bottom.png"
                  alt="4-首页-底部banner"
                />
                <img v-else-if="form.position === 5" class="img-tips" src="/img/home_popup.png" alt="5-首页-弹窗广告" />
                <img
                  v-else-if="form.position === 6"
                  class="img-tips"
                  src="/img/center_adv.png"
                  alt="6-个人中心-展示banner"
                />
                <img
                  v-else-if="form.position === 7"
                  class="img-tips"
                  src="/img/article_banner.png"
                  alt="7-信息类型列表-展示banner"
                />
                <img
                  v-else-if="form.position === 8"
                  class="img-tips"
                  src="/img/question_banner.png"
                  alt="8-鱼友提问-展示banner"
                />
                <img
                  v-else-if="form.position === 9"
                  class="img-tips"
                  src="/img/search_banner.png"
                  alt="9-搜索页-展示banner"
                />
                <img
                  v-else-if="form.position === 10"
                  class="img-tips"
                  src="/img/media_banner.png"
                  alt="10-视频类型列表-展示banner"
                />
                <img
                  v-else-if="form.position === 11"
                  class="img-tips"
                  src="/img/home_icon_bottom_text.png"
                  alt="11-首页-文字轮播"
                />
              </el-popover>
            </el-form-item> -->
          </el-col>
          <el-col :span="24">
            <el-form-item label="广告图片" prop="pic_url">
              <el-upload
                class="advert-uploader"
                drag
                :multiple="false"
                :action="uploadUrl"
                :headers="uploadHeaders"
                :show-file-list="false"
                 :before-upload="beforeAvatarUpload"
                :on-success="handleUploadSuccess"
                :data="{ token: token }"
              >
                <img v-if="form.imgPath" :src="form.imgPath" class="img" />
                <template v-else>
                  <i class="el-icon-upload"></i>
                  <div class="el-upload__text">上传图片</div>
                </template>
              </el-upload>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="标题" prop="title">
              <el-input v-model="form.title" minlength="1"></el-input>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="链接/编号ID" prop="link">
              <el-input v-model="form.link" minlength="1"></el-input>
              <div style="font-size: 13px; color: #999; height: 24px; line-height:24px;">
                *请填写对应文章/视频的编号ID
              </div>
              <div style="font-size: 13px; color: #999; height: 24px; line-height:24px;">
                *请填写需要跳转的链接，注意需要通过校验
              </div>
            </el-form-item>
          </el-col> -->
          <template>
            <el-col :span="24">
              <el-form-item label="内容" prop="content">
                <el-input v-model="form.content" type="textarea" :rows="2"> </el-input>
              </el-form-item>
            </el-col>
          </template>
          <el-col :span="12">
            <el-form-item label="类型" prop="type">
              <el-radio-group v-model="form.imgType">
                <el-radio :label="1">图片</el-radio>
                <el-radio :label="2">视频</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态" prop="isDelete">
              <!-- <el-radio-group v-model="form.isDelete">
                <el-radio :label="1">关闭</el-radio>
                <el-radio :label="0">开启</el-radio>
              </el-radio-group> -->
               <el-switch
                v-model="form.isDelete"
                :active-value="1"
                :inactive-value="0"
                active-text="开启"
                inactive-text="关闭"
                >
              </el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button type="primary" @click="save">确定</el-button>
          <el-button @click.native="formVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { remove, getList, save, update } from '@/api/system/advert'
import { getToken } from '@/api/api'
import { Loading } from 'element-ui'
import util from '@/libs/util'
export default {
  data () {
    return {
      positionOpts: [],
      uploadUrl: process.env.VUE_APP_UPLOAD_API, // 上传地址
      // 上传请求头部信息
      uploadHeaders: {
        // Authorization: getToken()
      },

      loadingInstance: {},
      formVisible: false,
      formTitle: '添加广告',
      deptList: [],
      userId: '',
      form: {
        title: '',
        imgPath: '',
        isDelete: 1,
        content: '',
        id: '',
        articleType: '7',
        imgType: 1 // 跳转类型 1:文章 2:视频 3:外链
      },
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        searchText: ''
      },
      list: null,
      total: 0,
      listLoading: true,
      selRow: {},
      token: ''
    }
  },
  filters: {
    positionFilter (position, opts) {
      const pos = opts.filter(el => el.value === position)
      return pos.length > 0 ? pos[0].label : ''
    },

    /**
     * 特殊处理link属性值
     */
    linkFilter (link, type) {
      if (
        type <= 2 &&
        (link.indexOf('/pages/article/message/detail?id=') > -1 || link.indexOf('/pages/article/media/detail?id=') > -1)
      ) {
        return link.split('?id=')[1]
      } else {
        return link
      }
    }
  },
  computed: {
    rules () {
      return {
        title: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
        content: [{ required: true, message: '内容不能为空', trigger: 'blur' }],
        imgPath: [{ required: true, message: '封面图不能为空', trigger: 'blur' }],
        isDelete: [{ required: true, message: '请选择状态', trigger: 'blur' }],
        position: [{ required: true, message: '未知不能为空', trigger: 'blur' }]
      }
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
    const uuid = util.cookies.get('uuid')
    if (uuid) {
      this.userId = uuid
      console.log('this.form.userId', this.userId)
    }
  },
  methods: {
    async init () {
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
      this.listQuery.pageNum = 1
      this.fetchData()
    },
    reset () {
      this.listQuery.position = ''
      this.listQuery.title = ''
      this.listQuery.pageNum = 1
      this.fetchData()
    },
    handleFilter () {
      this.getList()
    },
    handleCurrentChange (currentRow, oldCurrentRow) {
      this.selRow = currentRow
    },
    resetForm () {
      this.form = {
        title: '',
        imgPath: '',
        content: '',
        isDelete: 1,
        imgType: 1,
        id: ''
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
    fetchPage (page) {
      this.listQuery.pageNum = page
      this.fetchData()
    },
    changeSize (limit) {
      this.listQuery.pageSize = limit
      this.fetchData()
    },
    add () {
      this.resetForm()
      this.formTitle = '添加广告'
      this.formVisible = true
    },
    save () {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.form.id) {
            update({
              userId: this.userId,
              imgType: this.form.imgType,
              title: this.form.title,
              imgPath: this.form.imgPath,
              isDelete: this.form.isDelete,
              content: this.form.content || '',
              articleType: '7',
              id: this.form.id
            }).then(response => {
              this.$message({
                message: this.$t('common.optionSuccess'),
                type: 'success'
              })
              this.fetchData()
              this.formVisible = false
            })
          } else {
            save({
              userId: this.userId,
              imgType: this.form.imgType,
              title: this.form.title,
              imgPath: this.form.imgPath,
              isDelete: this.form.isDelete,
              content: this.form.content || '',
              articleType: '7'
            }).then(response => {
              this.$message({
                message: this.$t('common.optionSuccess'),
                type: 'success'
              })
              this.fetchData()
              this.formVisible = false
            })
          }
        }
      })
    },
    removeItem (record) {
      this.selRow = record
      this.remove()
    },
    remove () {
      const userId = this.selRow.userId
      this.$confirm(this.$t('common.deleteConfirm'), this.$t('common.tooltip'), {
        confirmButtonText: this.$t('button.submit'),
        cancelButtonText: this.$t('button.cancel'),
        type: 'warning'
      })
        .then(() => {
          remove(userId).then(response => {
            this.$message({
              message: this.$t('common.optionSuccess'),
              type: 'success'
            })
            this.fetchData()
          })
        })
        .catch(() => {})
    },
    /**
     * 关闭/开启 开关
     */
    editItem (record) {
      this.form = record
      this.formTitle = '修改广告'
      this.formVisible = true
    },
    /**
     * 上传文件前处理
     */
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG || png 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传视频大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    /**
     * 上传成功
     */
    handleUploadSuccess (res) {
      const url = 'http://files.q.lidaokoi.com/' + res.key
      console.log('url', url)
      this.form.imgPath = url
    }
    // handleUploadSuccess (response, raw) {
    //   this.loadingInstance.close()
    //   if (response.code === 200) {
    //     this.form.pic_url = response.data.url
    //   } else {
    //     this.$message({
    //       message: this.$t('common.uploadError'),
    //       type: 'error'
    //     })
    //   }
    // },
    /**
     * 选择跳转类型
     */
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.img-tips {
  width: auto;
  height: 220px;
}
.table-img-tips {
  width: auto;
  height: 80px;
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
