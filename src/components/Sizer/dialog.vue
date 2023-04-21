<template>
  <div class="sizer-dialog">
    <el-dialog
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :title="title"
      width="1200px"
      :before-close="handleClose"
      :label-width="80"
    >
      <slot></slot>
      <span slot="footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="handleClose = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
// import BaseForm from '../BaseForm';
export default {
  components: {
    // BaseForm
  },
  model: {
    prop: 'dialogVisible',
    event: 'change'
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    formData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {}
  },
  methods: {
    handleClose() {
      this.$emit('change', false)
    }
  }
}
</script>
