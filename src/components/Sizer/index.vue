<template>
  <div class="sizer">
    <el-row v-if="isShowSizer" class="chose">
      <el-col class="chose-item">
        <el-button class="choseBtn" type="primary" size="small" @click="handleShow">
          {{ btnName }}
          <i v-if="btnIcon" class="el-icon--right" :class="btnIcon"></i>
        </el-button>
        <div v-if="transferData && transferData.length > 0" class="box">
          <p v-for="(item, index) in selectedDataNames" :key="item.name" class="selected-item">
            {{ item.name }}
            <i class="del-select-item el-icon-close" @click="deleteItem(index)" />
          </p>
        </div>
        <div v-else class="box">
          <p v-for="(item, index) in selectedData" :key="item.name" class="selected-item">
            {{ customName ? item.curveName + item[customName] : item.curveName + item.periodName }}
            <i class="del-select-item el-icon-close" @click="deleteItem(index)" />
          </p>
        </div>
        <el-button @click="handleEmpty">清空</el-button>
      </el-col>
    </el-row>
    <el-dialog
      :visible.sync="isShow"
      :title="dialogTitle"
      :show-close="showClose"
      :before-close="handleDialogClose"
      :width="dialogWidth"
      :close-on-click-modal="false"
    >
      <el-form
        v-if="dataType === 'formData'"
        ref="sizerForm"
        :model="sizerForm"
        :label-width="labelWidth"
        :rules="rules"
      >
        <el-row :gutter="16">
          <template v-for="item in formList">
            <el-col :key="item.prop" :span="8">
              <el-form-item
                v-if="item.type === 'date'"
                :label="item.label + ':'"
                :prop="item.prop"
                :rules="item.rules ? [item.rules] : null"
              >
                <el-date-picker
                  v-model="sizerForm[item.prop]"
                  align="center"
                  value-format="yyyyMMdd"
                  :picker-options="pickerOptions"
                  @change="handleDateChange"
                ></el-date-picker>
              </el-form-item>
              <el-form-item
                v-if="item.type === 'select'"
                :label="item.label + ':'"
                :prop="item.prop"
              >
                <el-select
                  v-model="sizerForm[item.prop]"
                  :multiple="item.multiple"
                  filterable
                  collapse-tags
                  class="sizer-select"
                >
                  <el-option
                    v-for="(option, index) in item.options"
                    :key="index"
                    :label="option.name"
                    :value="option.code"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-if="item.type === 'fix-number'" :label="item.label + ':'">
                <el-row class="fix-number">
                  <el-col :span="11">
                    <el-form-item :prop="item.props[0]">
                      <el-input
                        v-model="sizerForm[item.props[0]]"
                        @input="inputFormat(sizerForm[item.props[0]], item.props[0])"
                      >
                        <template v-if="item.showUnit" slot="append">{{ item.unit }}</template>
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="2" style="text-align: center">-</el-col>
                  <el-col :span="11">
                    <el-form-item :prop="item.props[1]">
                      <el-input
                        v-model="sizerForm[item.props[1]]"
                        @input="inputFormat(sizerForm[item.props[1]], item.props[1])"
                      >
                        <template v-if="item.showUnit" slot="append">{{ item.unit }}</template>
                      </el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-col>
          </template>
        </el-row>
      </el-form>
      <div v-if="isShowTransfer">
        <slot
          name="functionBtn"
          :queryData="sizerForm"
          :handleReset="handleReset"
          :handleSearch="handleSearch"
        ></slot>
        <div style="margin-top: 15px; text-align: center">
          <el-transfer
            v-model="selectedData"
            style="display: inline-block; text-align: left"
            filterable
            filter-placeholder="请输入"
            :props="{
              key: 'code',
              label: 'name'
            }"
            :data="transferData"
          />
        </div>
      </div>
      <slot></slot>
      <slot
        name="footer"
        :handleClose="handleDialogClose"
        :handleSave="handleDialogSave"
        :selectedData="selectedData"
      ></slot>
    </el-dialog>
  </div>
</template>

<script>
/**
 * @props
 * isShowSizer: 是否显示筛选器
 * isShowTransfer: 是否显示穿梭框
 * sizers：筛选器 配置
 * labelWidth：表单label宽度
 */
import { mapGetters } from 'vuex'
export default {
  props: {
    isShowSizer: {
      type: Boolean,
      default: false
    },
    isShowTransfer: {
      type: Boolean,
      default: false
    },
    sizerTitle: {
      type: String,
      default: ''
    },
    btnName: {
      type: String,
      default: ''
    },
    btnIcon: {
      type: String,
      default: ''
    },
    sizers: {
      type: Array,
      default: () => []
    },
    labelWidth: {
      type: String,
      default: () => '120px'
    },
    dataType: {
      type: String,
      default: 'formData'
    },
    transferData: {
      type: Array,
      default: () => []
    },
    formList: {
      type: Array,
      default: () => []
    },
    selected: {
      type: Array,
      default: () => {}
    },
    dialogTitle: {
      type: String,
      default: ''
    },
    dialogWidth: {
      type: String,
      default: '1300px'
    },
    sizerForm: {
      type: Object,
      default: () => {}
    },
    rules: {
      type: Object,
      default: () => {}
    },
    dialogShow: {
      type: Boolean,
      default: false
    },
    total: {
      type: Number,
      default: 0
    },
    customName: {
      type: String,
      default: ''
    },
    closeType: {
      type: String,
      default: 'show'
    }
  },
  data() {
    return {
      pickerOptions: {
        disabledDate: time => {
          return !this.ableDate.includes(this.$moment(time).format('YYYYMMDD'))
        }
      },
      dialogFormData: {},
      dialogName: '',
      sizerData: {},
      // formList: [],
      selectedData: [], // 穿梭框数据。
      currentType: '',
      isShow: false,
      // selectedDataNames: []
      pageConfig: {
        total: 0,
        current: 1,
        pageSize: 100
      },
      transferPageConfig: {
        currentPage: 1,
        total: 0,
        pageSize: 100
      }
    }
  },
  computed: {
    selectedDataNames() {
      let result = this.transferData.filter((item, index) => {
        let { code, name } = item
        if (this.selectedData.includes(code)) {
          return name
        }
      })
      return result
    },
    showClose() {
      return this.closeType === 'show'
    },
    ...mapGetters({ ableDate: 'ableDate' })
  },
  watch: {
    sizerData: {
      handler(n) {
        this.sizerData = n
      },
      deep: true
    },
    formList: {
      handler(n) {
        this.formList = n
      },
      deep: true
    },
    dialogShow: {
      handler(v) {
        this.isShow = this.dialogShow
      },
      immediate: true
    },
    transferData: {
      handler(n) {
        this.transferData = n
      },
      deep: true
    }
  },
  methods: {
    change(v) {
      this.$emit('change', v)
    },
    init() {
      let arr = this.formList
      let obj = {}
      if (arr.length > 0) {
        arr.map(item => {
          let { defaultValue, prop, props, defaultValues } = item
          if (defaultValue) {
            obj[prop] = defaultValue || ''
          }
          if (defaultValues && defaultValues.length > 0) {
            obj[props[0]] = defaultValues[0] || ''
            obj[props[1]] = defaultValues[1] || ''
          }
        })
      }
      this.sizerData = Object.assign({}, obj)
    },
    initDialogForm() {},
    // 弹窗事件
    handleShow() {
      this.change(true)
      this.isShow = true
    },
    // 弹窗关闭事件
    handleDialogClose() {
      this.$emit('handleDialogClose')
      this.isShow = false
    },
    // 点击确定返回选择数据
    handleDialogSave() {
      this.$emit('handleSave', this.selectedData)
      this.isShow = false
    },
    inputFormat(val, key) {
      let value = val.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1').replace(/^0+(\d)/, '$1')
      this.sizerForm[key] = value
    },
    handleDateChange(date) {
      this.$emit('bizDateChange', date)
    },
    // 清空
    handleEmpty(current) {
      this.selectedData = []
      this.$emit('handleEmpty', current)
    },
    deleteItem(params) {
      if (this.isShowTransfer) {
        this.transferData.splice(params, 1)
      } else {
        this.selectedData.splice(params, 1)
        this.$emit('deleteItem', { params, selectedData: this.selectedData })
      }
    },
    // 重置
    handleReset() {
      this.selectedData = []
      this.$refs['sizerForm'].resetFields()
      this.$emit('handleReset')
    },
    transferPageChange(v) {
      this.transferPageConfig.currentPage = v
      this.handleSearch()
      this.$emit('sizerPageChange', this.sizerForm)
    },
    handleSearch() {
      let { pageSize, currentPage } = this.transferPageConfig
      this.sizerForm.pageSize = pageSize
      this.sizerForm.pageNum = currentPage
      this.$emit('transferSearch', this.sizerForm)
    }
  }
}
</script>

<style lang="scss" scoped>
.sizer {
  margin: 20px 40px 0 40px;

  .choseBtn {
    margin-right: 20px;
  }

  .chose-item {
    display: flex;
  }

  .box {
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

.el-form-item {
  margin-right: 0;

  ::v-deep .el-form-item__content {
    .el-select {
      width: 220px;
      .el-input {
        .el-input__inner {
          padding-right: 51px !important;
        }
      }
    }
  }
  ::v-deep .el-form-item__error {
    width: 220px;
  }
}
.fix-number {
  width: 220px;
  .el-form-item {
    width: 100% !important;
  }
}
.el-scrollbar__view {
  position: relative;
  .select-page {
    position: absolute;
    bottom: 0;
    padding: 0;
  }
}
::v-deep .el-transfer-panel {
  width: 350px !important;
}
.transfer-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 7px;
}
</style>
