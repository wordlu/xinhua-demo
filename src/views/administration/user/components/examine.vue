<template>
  <div>
    <el-dialog
      v-if="examineVisible"
      :visible="examineVisible"
      :close-on-click-modal="false"
      title="查看信息"
      width="80%"
      @close="closeExamine"
    >
      <BaseForm :form-data="formData" :label-width="100" @export="close" />
    </el-dialog>
  </div>
</template>
<script>
import BaseForm from '@components/BaseForm'
import { formData } from '../libs/examine'
export default {
  name: 'Qqq',
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
    },

    closeExamine() {
      this.close()
    }
  }
}
</script>
