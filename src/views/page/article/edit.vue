<template>
  <div class="app-container">
    <el-button icon="el-icon-back" size="mini" @click.native="goBack">返回</el-button>
    <div class="block">
      <el-form ref="form" :model="form" :rules="rules">
        <el-row>
          <el-form-item label="封面图" prop="pic_url">
            <el-row>
              <el-col :span="8">
                <el-upload
                  class="uploader-layout"
                  drag
                  :action="uploadUrl"
                  :headers="uploadHeaders"
                  :show-file-list="false"
                  :before-upload="beforeAvatarUpload"
                  :on-success="handleUploadSuccess"
                  :data="{ token: token }"
                >
                  <img v-if="form.pic_url" :src="form.pic_url" class="img" />
                  <template v-else>
                    <i class="el-icon-plus"></i>
                    <div class="el-upload__text">上传图片</div>
                  </template>
                </el-upload>
              </el-col>
              <el-col :span="4" style="height: 180px;">
                <el-button class="del-pic" size="small" type="primary" @click="delUploaderPic">删除图片</el-button>
              </el-col>
            </el-row>
          </el-form-item>
        </el-row>
        <el-row>
          <el-col :span="18">
            <el-form-item label="推荐文章" prop="related_list">
              <el-select
                v-model="form.related_list_key"
                multiple
                filterable
                remote
                reserve-keyword
                placeholder="请输入推荐文章关键词"
                :remote-method="remoteMethod"
                :loading="relatedListLoading"
                style="width: 75%;"
              >
                <el-option
                  v-for="item in relatedListOpts"
                  :key="item.article_id"
                  :label="item.title"
                  :value="item.article_id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18">
            <el-form-item label="文章标题" prop="title">
              <el-input v-model="form.title" minlength="1" placeholder="文章标题"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18">
            <el-form-item label="选择栏目" prop="category_id">
              <el-select v-model="form.category_id" placeholder="选择栏目" style="width: 100%;">
                <el-option v-for="item in categoryOpts" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="展示类型" prop="type">
              <el-radio-group v-model="form.type" @change="choiceDisplayType">
                <el-radio
                  v-for="(item, index) in [{ value: 1, label: '图文展示' }, { value: 2, label: '流媒体展示' }]"
                  :key="index"
                  :label="item.value"
                >
                  {{ item.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="文章状态" prop="status">
              <el-radio-group v-model="form.status">
                <el-radio label="draft">草稿</el-radio>
                <el-radio label="publish">发布</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <transition name="fade" mode="out-in">
            <el-col v-if="form.type === 1" :span="18">
              <el-form-item label="图文信息" prop="content">
                <WangEditor
                  :default-text="defaultText"
                  :rich-text.sync="richText"
                  @update:rich-text="updateRichText"
                  @upload:img="uploadImg"
                />
              </el-form-item>
            </el-col>
            <el-col v-else :span="18">
              <el-form-item label="流媒体链接（vid）" prop="content">
                <el-input v-model="form.content" minlength="1" placeholder="视频链接地址"></el-input>
              </el-form-item>
            </el-col>
          </transition>
        </el-row>
      </el-form>
    </div>

    <el-button class="article-submit" icon="el-icon-plus" size="medium" type="primary" @click="save">提交</el-button>
  </div>
</template>

<script>
import { Loading } from 'element-ui'
import { save, get, searchRelated, getList } from '@/api/system/article'
import { getToken } from '@/api/api'
import WangEditor from '@/components/WangEditor'
import util from '@/libs/util'
import { uploadImages } from '@/utils'

export default {
  name: 'ArticleEdit',
  components: { WangEditor },
  data () {
    return {
      // 默认值
      defaultText: '',
      // 富文本更新的值
      richText: '',
      uploadUrl: process.env.VUE_APP_UPLOAD_API, // 上传地址
      // 上传请求头部信息
      uploadHeaders: {
        // Authorization: getToken()
      },
      loadingInstance: {},
      article_id: '',
      token: '',
      form: {
        title: '',
        related_list: [], // 相关推荐文章
        related_list_key: [], // 相关推荐文章ID
        category_id: undefined, // 类目ID
        content: '',
        pic_url: '',
        type: 1, // 文章类型 1:图文 2:视频
        status: 'draft' // 文章状态 draft:草稿 publish:发布
      },
      relatedListLoading: false, // 推荐文章loading
      relatedListOpts: [], // 推荐文章
      categoryOpts: [], // 文章栏目

      rules: {
        title: [{ required: true, message: '请选择文章标题', trigger: 'blur' }],
        // pic_url: [{ required: true, message: '请上传广告图片', trigger: 'blur' }],
        type: [{ required: true, message: '请选择文章类型', trigger: 'blur' }],
        category_id: [{ required: true, message: '请选择文章栏目', trigger: 'blur' }],
        content: [{ required: true, message: '内容/链接不能为空', trigger: 'blur' }],
        status: [{ required: true, message: '请选择文章状态', trigger: 'blur' }]
        // email: [{ required: true, message: '请输入email', trigger: 'blur' }]
      }
    }
  },
  mounted () {
    this.inititalData()
  },
  activated () {},
  created () {
    getToken().then((res) => {
      const { code, data } = res
      if (code === '0') {
        this.token = data
      }
    })
    const uuid = util.cookies.get('uuid')
    if (uuid) {
      this.userId = uuid
    }
  },
  deactivated () {},
  destroyed () {},
  watch: {
    richText (newVal) {
      if (this.form.type === 1) {
        this.form.content = newVal
      }
    }
  },
  methods: {
    goBack () {
      this.$router.go(-1)
    },
    /**
     * 初始化数据
     */
    async inititalData () {
      this.article_id = this.$route.query.article_id || ''
      if (!this.article_id) {
        const { data: categoryOpts } = await getList()
        this.categoryOpts = categoryOpts.category_options
        return
      }
      try {
        const {
          data: { article }
        } = await get(this.article_id)
        const { data: categoryOpts } = await getList()
        this.categoryOpts = categoryOpts.category_options
        this.relatedListOpts = JSON.parse(JSON.stringify(article.related_list))
        article.related_list_key = article.related_list.map(el => el.article_id)
        this.form = article
        // 等待组件加载完毕赋值
        this.$nextTick(() => {
          this.defaultText = this.form.content
        })
      } catch (error) {
        console.log(error)
      }
    },
    save () {
      this.$refs.form.validate(valid => {
        if (valid) {
          // const content = this.form.type === 1 ? this.richText : this.form.content
          const article_id = this.$route.query.article_id || ''
          save({
            article_id,
            title: this.form.title,
            related_list: this.form.related_list_key,
            category_id: this.form.category_id,
            content: this.form.content,
            pic_url: this.form.pic_url || '',
            type: this.form.type,
            status: this.form.status
          }).then(response => {
            this.$message({
              message: this.$t('common.optionSuccess'),
              type: 'success'
            })
            this.goBack()
          })
        } else {
          return false
        }
      })
    },
    /**
     * 展示类型切换
     */
    choiceDisplayType (type) {
      if (type === 1) {
        this.$nextTick(() => {
          this.defaultText = this.form.content
        })
      } else {
        this.defaultText = ''
      }
    },

    /**
     * 富文本编辑器内容改变
     */
    updateRichText (val) {
      console.log(val)
    },

    /**
     * 富文本编辑器上传图片
     */
    async uploadImg ({ resultFiles, insertImgFn }) {
      console.log('resultFiles', resultFiles[0].name)
      this.handleUploadSuccess({ key: resultFiles[0].name })
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
    //   this.form.imgPath = url
    },
    /**
     * 删除上传的图片
     */
    delUploaderPic () {
      this.form.pic_url = ''
    },
    /**
     * 搜索推荐文章
     */
    async remoteMethod (query) {
      if (query !== '') {
        this.relatedListLoading = true
        try {
          const { data } = await searchRelated({ keyword: query, page_size: 9999 })
          console.log(this.form.related_list)
          this.relatedListOpts = JSON.parse(JSON.stringify(this.form.related_list)).concat(data.entries)
        } catch (error) {
          console.log(error)
        }
        this.relatedListLoading = false
      } else {
        this.relatedListOpts = []
      }
    }
  }
}

</script>

<style lang="scss" scoped>
.uploader-layout {
  width: 100%;
  padding: 8px 0;

    >>>  .el-upload {
    display: flex;
    align-items: center;
    justify-content: center;
    &:hover {
      border-color: #409eff;
      color: #409eff;
      .el-upload__text {
        color: #409eff;
      }
    }
  }
  >>> .el-upload-dragger {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%;
    min-height: 80px;
    .el-upload__text {
      height: 24px;
      line-height: 24px;
    }
  }
  .img {
    height: 100%;
  }
}
.article-submit {
  // position: fixed;
  // bottom: 10px;
  // right: 10px;
  margin-top: 20px;
}
/* 可以设置不同的进入和离开动画 */
/* 设置持续时间和动画函数 */
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
// .slide-fade-leave-active {
//   transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
// }
.slide-fade-enter {
  transform: translateX(10px);
  opacity: 0;
}

.del-pic {
  position: relative;
  top: 50%;
  transform: translate(20px, -50%);
}
</style>
