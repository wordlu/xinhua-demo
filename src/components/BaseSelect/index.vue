<template>
  <div class="sizer">
    <!-- 外部选择器样式 -->
    <el-row v-if="options.isShowSizer" class="chose">
      <el-col class="chose-item">
        <el-button class="choseBtn" type="primary" size="small" @click="handleShow">
          {{ options.btnName }}
          <i v-if="options.btnIcon" class="el-icon--right" :class="options.btnIcon"></i>
        </el-button>
        <div class="sizer-box">
          <p v-for="(item, index) in options.selectedData" :key="item.name" class="selected-item">
            {{ item.name }}
            <i class="del-select-item el-icon-close" @click="deleteItem(index)" />
          </p>
        </div>
        <el-button @click="handleEmpty">清空</el-button>
      </el-col>
    </el-row>
    <!-- 弹窗内容 -->
    <el-dialog
      class="BaseSelect"
      :visible.sync="isShow"
      :title="options.dialogTitle"
      :show-close="options.showClose"
      :width="options.dialogWidth"
      :destroy-on-close="true"
      :close-on-click-modal="false"
      @close="handleDialogClose"
    >
      <template v-if="options.customForm">
        <slot name="customForm" :options="options"></slot>
      </template>
      <template v-else>
        <BaseForm
          ref="searchForm"
          :form-data="options.formData"
          :label-width="options.formLabelWith"
          :set-options="options.setOptions"
          @trigger="trigger"
          @getRemoteMethod="getRemoteMethod"
          @queryForm="queryForm"
          @export="exportForm"
          @handleCurrentChangeOrg="handleCurrentChangeOrg"
          @blurValue="blurValue"
          @selectPageChange="selectPageChange"
          @handleClear="handleClear"
          @resetForm="resetForm"
        ></BaseForm>
      </template>
      <template v-if="options.isShowTransfer">
        <div style="margin-top: 15px; text-align: center">
          <!-- 目前测试elementui 穿梭框不满足客户需求：主体选择为远程搜索，data数据改变时，无法保存右侧数据，需自己自定义穿梭框 -->
          <el-transfer
            v-model="options.selectedData"
            style="display: inline-block; text-align: left"
            filterable
            filter-placeholder="请输入"
            :props="{
              key: 'code',
              label: 'name'
            }"
            :data="options.transferData"
          />
        </div>
      </template>
      <slot
        v-else
        name="customTransfer"
        :transferData="options.transferData"
        :selectedData="options.selectedData"
        :total="options.total"
      ></slot>
      <div slot="footer" class="dialog-footer">
        <slot name="footer" :data="isShow"></slot>
      </div>
    </el-dialog>

    <!-- 导入待查询主体/债券 -->
    <EditDialog
      ref="dialog"
      :title="editTitle"
      :dialog-type="getDialogType"
      :columns="getColumns"
      :http-name="getHttpName"
      :match-http-name="getMatchName"
      :success-http-name="getSuccessHttpName"
      :import-http-name="getImportHttpName"
      @importDialogSure="importDialogSure"
      @downloadTemplate="downloadTemplate"
    >
    </EditDialog>
  </div>
</template>

<script>
/**
 * @props 
 * options
 * {
 *  formData, // form数据 -> 基于BaseForm数据
    customForm: false, // 是否使用自定义form
    formLabelWith: 100, // formItem 宽度
    isShowSizer: true, // 选择器是否显示
    btnName: '选择主体', // 选择器 按钮文案
    btnIcon: 'el-icon-plus', // 选择器 按钮icon
    dialogTitle: '选择主体', // 弹窗 title
    dialogWidth: '1200px', // 弹窗 宽度
    isShowTransfer: false,
    transferData: [], // 穿梭框数据
    selectedData: [], // 已选择的数据
    setOptions: {} // form options 自定义选项
 * }
 */
import BaseForm from '@components/BaseForm'
import EditDialog from '@components/EditDialog'
import * as service from '@api/ratemanagement'
import { dialogColumns, dialogDebtColumns } from '@views/ratemanagement/object/libs/dataLevel'

export default {
  name: 'BaseSelect',
  components: {
    BaseForm,
    EditDialog
  },
  props: {
    options: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      isShow: false
    }
  },
  computed: {
    editTitle() {
      return `导入待查询${this.options.btnName === '选择主体' ? '主体' : '债券'}`
    },
    getColumns() {
      const { btnName } = this.options
      return btnName === '选择主体' ? dialogColumns : dialogDebtColumns
    },
    getHttpName() {
      // 导入弹窗 上传文件接口名称
      const { btnName } = this.options
      return btnName === '选择主体' ? 'getFileUpload' : 'getFileBndName'
    },
    getDialogType() {
      // 导入弹窗类型
      const { btnName } = this.options
      return btnName === '选择主体' ? 'orgName' : 'bnd'
    },
    getMatchName() {
      // 导入弹窗匹配按钮对应接口名称
      const { btnName } = this.options
      return btnName === '选择主体' ? 'orgNameMatch' : 'bndNameMatch'
    },
    getSuccessHttpName() {
      // 导入弹窗 确认按钮获取匹配成功id 接口名称
      const { btnName } = this.options
      return btnName === '选择主体' ? 'getSuccesshQueryOrg' : 'getSuccesshQueryBnd'
    },
    getImportHttpName() {
      // 导入弹窗 确认按钮获取匹配成功id 接口名称
      const { btnName } = this.options
      return btnName === '选择主体' ? 'getMatchQueryOrg' : 'getMatchQueryBnd'
    }
  },
  watch: {
    options: {
      handler(nv) {},
      immediate: true
    }
  },
  methods: {
    // 弹窗搜索方法
    queryForm(formData) {
      this.$emit('getTransferData', formData)
    },
    // select远程搜索方法
    getRemoteMethod(val, item) {
      this.$emit('getItemRemoteMethod', val, item)
    },
    // 失去焦点事件
    blurValue(data, item) {
      this.$emit('blurValue', data, item)
    },
    // 分页事件
    handleCurrentChangeOrg(val, item) {
      this.$emit('handleCurrentChangeOrg', val, item)
    },
    selectPageChange(val, data, item, ref) {
      this.$emit('selectPageChange', val, data, item, ref)
    },
    trigger(fromData, val) {
      this.$emit('trigger', fromData, val)
    },
    // 弹窗打开
    handleShow() {
      this.isShow = true
      this.$emit('selectOpen')
    },
    // 弹窗关闭事件
    handleDialogClose() {
      this.$emit('handleDialogClose')
      this.isShow = false
    },
    // 清空
    handleEmpty() {
      this.$emit('handleEmpty')
    },
    // 选择器 input 删除按钮
    deleteItem(current) {
      this.$emit('deleteItem', current)
    },
    exportForm() {
      this.$refs.dialog.importDialogOpen()
    },
    // 下载模板
    downloadTemplate() {
      this.getDialogType === 'orgName' ? service.orgNameTemplate({}) : service.bndNameTemplate()
    },
    importDialogSure(arr) {
      this.$refs.dialog.importDialogClose()
      this.$emit('importDialogSure', arr)
    },
    handleClear(initData, item) {
      this.$emit('handleClear', initData, item)
    },
    resetForm() {
      this.$emit('resetForm')
    }
  }
}
</script>

<style lang="scss" scoped>
.sizer {
  padding: 8px;
  margin: 0 10px 8px;
  border: 1px solid #e6e9eb;
  border-radius: 4px;

  .choseBtn {
    margin-right: 12px;
  }

  .chose-item {
    display: flex;
  }

  .sizer-box {
    display: flex;
    width: 100%;
    margin-right: 10px;
    overflow: auto;
    border: 1px solid #e0e3e5;

    &::-webkit-scrollbar {
      display: none;
      width: 0;
    }

    .selected-item {
      position: relative;
      height: 20px;
      padding: 0 15px;
      margin: 7px 10px;
      line-height: 20px;
      white-space: nowrap;
      background: #e0e3e5;
      border-radius: 4px;

      .del-select-item {
        position: absolute;
        top: -7px;
        right: 3px;
        display: block;
        width: 5px;
        height: 5px;
        cursor: pointer;

        .el-icon-close {
          &::before {
            font-size: 12px;
            font-weight: 600 !important;
            content: '' !important;
          }
        }
      }
    }
  }
}
</style>
