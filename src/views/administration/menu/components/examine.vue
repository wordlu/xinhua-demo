<template>
  <div>
    <el-dialog
      v-if="examineVisible"
      :visible="examineVisible"
      :close-on-click-modal="false"
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
    examineData: {
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
    examineData: {
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
