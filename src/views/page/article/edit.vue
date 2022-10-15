<template>
  <div class="app-container">
    <el-button icon="el-icon-back" size="mini" @click.native="goBack">返回</el-button>
    <div class="block">
      <el-form ref="form" :model="form" :rules="rules">
        <el-row>
          <el-form-item label="上传图片" prop="imgPath">
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
                  <img v-if="form.imgPath" :src="form.imgPath" class="img" />
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
            <el-form-item label="文章类型" prop="articleType">
               <el-radio-group v-model="form.articleType">
                <el-radio :label="3">拍卖资讯</el-radio>
                <el-radio :label="4">鲤道头条</el-radio>
                <el-radio :label="5">答鱼友问</el-radio>
                <el-radio :label="6">鲤道课堂</el-radio>
              </el-radio-group>
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
            <el-form-item label="图片类型" prop="imgType">
                 <el-radio-group v-model="form.imgType">
                    <el-radio :label="1">图片</el-radio>
                    <el-radio :label="2">视频</el-radio>
                </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="展示类型" prop="billType">
              <el-radio-group v-model="form.billType" @change="choiceDisplayType">
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
            <el-form-item label="文章状态" prop="isDelete">
              <el-switch
                v-model="form.isDelete"
                :active-value='0'
                :inactive-value='1'
                 active-text="开启"
                 inactive-text="关闭"
                >
                </el-switch>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <transition name="fade" mode="out-in">
            <el-col v-if="form.billType === 1" :span="18">
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

    <el-button class="article-submit" icon="el-icon-plus" size="medium" type="primary" @click="saveBtns">提交</el-button>
  </div>
</template>

<script>
// import { Loading } from 'element-ui'
import { addOt } from '@/api/system/article'
import { getToken } from '@/api/api'
import WangEditor from '@/components/WangEditor'
import util from '@/libs/util'
// import { uploadImages } from '@/utils'

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
      token: '',
      form: {
        userId: '',
        title: '',
        articleType: 3,
        imgType: 1,
        content: '',
        imgPath: '',
        billType: 1, // 文章展示
        isDelete: 0 //
      },
      relatedListLoading: false, // 推荐文章loading
      relatedListOpts: [], // 推荐文章
      categoryOpts: [], // 文章栏目

      rules: {
        title: [{ required: true, message: '请选择文章标题', trigger: 'blur' }],
        imgPath: [{ required: true, message: '请上传图片', trigger: 'blur' }],
        articleType: [{ required: true, message: '请选择文章类型', trigger: 'blur' }],
        imgType: [{ required: true, message: '请选择图片类型', trigger: 'blur' }],
        content: [{ required: true, message: '内容/链接不能为空', trigger: 'blur' }],
        isDelete: [{ required: true, message: '请选择文章状态', trigger: 'blur' }]
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
      this.form.userId = uuid
    }
  },
  deactivated () {},
  destroyed () {},
  watch: {
    richText (newVal) {
      if (this.form.billType === 1) {
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

    },
    saveBtns () {
      this.$refs.form.validate(valid => {
        if (valid) {
          addOt(this.form).then(response => {
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
      this.form.content = 'resultFiles[0].name'
      console.log('resultFiles', resultFiles[0].name)
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
    },
    /**
     * 删除上传的图片
     */
    delUploaderPic () {
      this.form.imgPath = ''
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
