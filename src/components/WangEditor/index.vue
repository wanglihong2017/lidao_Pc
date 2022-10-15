<template>
  <div class="w_editor">
    <!-- 富文本编辑器 -->
    <div id="w_view"></div>
  </div>
</template>

<script>
// 引入富文本
import WE from 'wangeditor'
// 引入elementUI Message模块（用于提示信息）
import { Message } from 'element-ui'

export default {
  name: 'WangEditor',
  props: {
    // 默认值
    defaultText: { type: String, default: '' },
    // 富文本更新的值
    richText: { type: String, default: '' }
  },
  data () {
    return {
      // 编辑器实例
      editor: null,
      // 富文本菜单选项配置
      menuItem: [
        'head',
        'bold',
        'fontSize',
        // 'fontName',
        'italic',
        'underline',
        'indent',
        'lineHeight',
        'foreColor',
        'backColor',
        // 'link',
        'list',
        'justify',
        'image'
        // 'video'
      ]
    }
  },
  watch: {
    // 监听默认值
    defaultText (nv, ov) {
      if (nv !== '') {
        this.editor.txt.html(nv)
        this.$emit('update:rich-text', nv)
      }
    }
  },
  mounted () {
    this.initEditor()
  },
  beforeDestroy () {
    // 销毁编辑器
    this.editor.destroy()
    this.editor = null
  },
  methods: {
    // 初始化编辑器
    initEditor () {
      // 获取编辑器dom节点
      const editor = new WE('#w_view')
      // 配置编辑器
      editor.config.showLinkImg = false /* 隐藏插入网络图片的功能 */
      editor.config.onchangeTimeout = 400 /* 配置触发 onchange 的时间频率，默认为 200ms */
      editor.config.uploadImgMaxLength = 1 /* 限制一次最多能传几张图片 */
      editor.config.showFullScreen = false /* 配置全屏功能按钮是否展示 */
      editor.config.menus = [...this.menuItem] /* 自定义系统菜单 */
      editor.config.height = 400
      editor.config.zIndex = 999
      editor.config.uploadImgMaxLength = 1
      editor.config.uploadImgMaxSize = 2 * 1024 * 1024 // 2M
      editor.config.uploadImgAccept = ['jpg', 'jpeg', 'png', 'gif', 'bmp']
      // editor.config.uploadImgMaxSize = 5 * 1024 * 1024 /* 限制图片大小 */;
      editor.config.customAlert = err => {
        Message.error(err)
      }
      // 监控变化，同步更新数据
      editor.config.onchange = newHtml => {
        // 异步更新组件富文本值的变化
        this.$emit('update:rich-text', newHtml)
      }
      // 自定义上传图片
      editor.config.customUploadImg = (resultFiles, insertImgFn) => {
        /**
         * resultFiles：图片上传文件流
         * insertImgFn：插入图片到富文本
         * 返回结果为生成的图片URL地址
         *  */
        // 此方法为自己封赚改写的阿里云图片OSS直传插件。
        // this.$oss(resultFiles[0], resultFiles[0]['name']).then(url => {
        //   !!url && insertImgFn(url) /* oss图片上传，将图片插入到编辑器中 */
        // })
        this.$emit('upload:img', { resultFiles, insertImgFn })
      }
      // 创建编辑器
      editor.create()
      this.editor = editor
    }
  }
}
</script>
<style lang="scss" scoped>
.w_editor {
  position: relative;
  font-size: 14px;
  display: inline-block;
  width: 100%;
}
</style>
