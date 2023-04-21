<template>
  <el-upload
    ref="baseUpload"
    action=""
    :on-preview="handlePreview"
    :on-remove="handleRemove"
    :before-remove="beforeRemove"
    :http-request="httpRequest"
    :multiple="options.multiple"
    :limit="options.limit"
    :on-exceed="handleExceed"
    :show-file-list="options.showFileList"
    :before-upload="beforeUpload"
    :file-list="fileList">
    <el-button size="small" type="primary">{{ options.btnName }}</el-button>
    <div v-if="options.tips" slot="tip" class="el-upload__tip">{{ options.tips }}</div>
  </el-upload>
</template>

<script>

const DEFAULT_CONFIG = {
  extensions: ['pdf', 'jpg', 'jpeg', 'png', 'zip', 'rar'], // 可选文件的扩展名，可接受数组
  maxSize: 60 * 1024 // 最大可上传文件大小
}

/**
 * 传入options
 * {
 *   btnName: '上传文件', // 上传按钮文案
 *   showFileList: false, // 是否显示已上传文件列表
 *   extensions: ['xlsx'], // 可选文件的扩展名，可接受数组
 *   maxSize: 10 * 1024, // 最大可上传文件大小
 *   multiple: false, // 是否可以多选文件
 *   limit: 1, // 可上传最多数量
 *   tips: '只能上传xlsx文件，且不超过10M' // 备注文案
 * }
 * 
*/

export default {
  props: {
    options: {
      type: Object,
      default: () => Object.assign({}, DEFAULT_CONFIG)
    }
  },
  data () {
    return {
      fileList: []
    }
  },
  methods: {
    handlePreview () {},
    handleRemove () {},
    beforeRemove () {},
    handleExceed () {},
    // 验证
    beforeUpload (file) {
      const { extensions, maxSize } = this.options
      // 可上传类型校验
      if (extensions.length) {
        const fileFormat = file.name.split('.').pop().toLocaleLowerCase()
        const checked = extensions.some(item => item.toLocaleLowerCase() === fileFormat)
        if (!checked) {
          this.$message.error(`待上传文件的后缀名错误，允许上传后缀名为${extensions.join('、')}的文件`)
          return false
        }
      }
      // 可上传大小校验
      if (maxSize) {
        if (file.size > maxSize * 1024) {
          this.$message.error(`待上传文件大小超过可上传的最大值${Math.round(maxSize / 1024)}M`)
          return false
        }
      }
      return true
    },
    httpRequest (res) {
      const { file } = res
      if (file) {
        let formData = new FormData()
        formData.append('file', file)
        this.$emit('httpRequest', formData)
        // 上传之后 clearFiles，才可以再次触发
        this.$refs.baseUpload.clearFiles();
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-upload__tip {
  color: #F56C6C;
}
</style>