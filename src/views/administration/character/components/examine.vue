<template>
  <div>
    <el-dialog
      v-if="examineVisible"
      :close-on-click-modal="false"
      :visible="examineVisible"
      title="查看信息"
      width="80%"
      @close="close"
    >
      <BaseForm :form-data="formData" :label-width="100" @export="close" />
    </el-dialog>
  </div>
</template>
<script>
import BaseForm from '@components/BaseForm'
import { formData } from '../libs/examine'
export default {
  components: {
    BaseForm
  },
  props: {
    examineVisible: {
      type: Boolean,
      default: false
    },
    details: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      formData
    }
  },
  watch: {
    details: {
      handler(val) {
        this.formData.initData = val
      },
      deep: true
    }
  },
  methods: {
    close() {
      this.$emit('close', false)
    }
  }
}
</script>
