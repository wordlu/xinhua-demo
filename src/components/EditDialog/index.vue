<template>
  <div>
    <el-dialog
      :title="title"
      :visible.sync="visible"
      width="60%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      @close="importDialogClose"
      v-on="$listeners"
    >
      <div>
        <div style="position: relative;">
          <el-button class="download-temp" size="small" type="success" @click="downloadTemplate"
            ><i class="el-icon-download"></i>下载模板</el-button
          >
          <BaseUpload :options="options" @httpRequest="httpRequest"></BaseUpload>
        </div>
        <div style="margin:20px 0">
          <span>{{ matchResult }}</span>
          <span class="tip-show">
            <el-checkbox v-model="objChecked" :disabled="isDisabled" @change="handleMatchFail"
              >只看匹配失败</el-checkbox
            >
          </span>
        </div>
        <!-- 保留slot -->
        <slot></slot>
        <!-- table -->
        <el-table
          v-loading="tableLoading"
          :data="objTablelist"
          border
          :row-class-name="rowClassName"
          :cell-style="cellClassName"
          max-height="400px"
        >
          <div slot="empty">
            <div>暂无数据</div>
          </div>
          <el-table-column
            v-for="(item, index) in columns"
            :key="item.label + index"
            :label="item.label"
            :align="item.align"
            :prop="item.prop"
            :width="item.width"
            :min-width="item.minWidth"
            :render-header="item.required && requiredItem"
          >
            <template slot-scope="scope">
              <el-input v-if="item.input" v-model.trim="scope.row[item.prop]" clearable></el-input>
              <el-select v-else-if="item.select" v-model="scope.row[item.prop]">
                <el-option v-for="i in item.options" :key="i.code" :label="i.name" :value="i.code">
                </el-option>
              </el-select>
              <span v-else>{{ item.prop ? scope.row[item.prop] : scope.$index + 1 }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer">
        <el-button type="primary" size="small" @click="importDialogMatch">匹配</el-button>
        <el-button size="small" @click="importDialogClose">取消</el-button>
        <el-button :loading="submitLoading" type="primary" size="small" @click="importDialogSure"
          >确定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
<script>
import BaseUpload from '@components/BaseUpload'
import * as service from '@api/ratemanagement'
export default {
  name: 'ImportDialog',
  components: {
    BaseUpload
  },
  props: {
    title: {
      type: String,
      default: () => ''
    },
    // 弹窗类型
    // orgName：主体；
    // bnd：债项
    // fast：新增快速评级；
    dialogType: {
      type: String,
      default: 'orgName'
    },
    columns: {
      // table columns
      type: Array,
      default: () => []
    },
    successHttpName: {
      // 点击确认，通过接口获取到匹配成功的code，prop传入接口name --默认为主体名称导入查询
      type: String,
      default: 'getSuccesshQueryOrg'
    },
    importHttpName: {
      // 只看匹配失败为false时，返回所有数据，传日对应的接口name --默认为主体名称导入查询
      type: String,
      default: 'getMatchQueryOrg'
    },
    httpName: {
      // 上传文件 接口方法名
      type: String,
      default: ''
    },
    matchHttpName: {
      // 匹配按钮 默认是匹配主体接口，其他可以传入接口name
      type: String,
      default: 'orgNameMatch'
    }
  },
  data() {
    return {
      visible: false,
      objChecked: false,
      isDisabled: true,
      objTablelist: [],
      tempTableList: [],
      options: {
        btnName: '上传文件',
        showFileList: false,
        extensions: ['xlsx'],
        maxSize: 10 * 1024,
        multiple: false,
        limit: 1,
        tips: '只能上传xlsx文件，且不超过10M'
      },
      tableLoading: false,
      submitLoading: false,
      totalMatchResult: {
        total: 0,
        fail: 0,
        success: 0
      }
    }
  },
  computed: {
    matchResult() {
      const name =
        this.dialogType === 'orgName' ? '主体' : this.dialogType === 'bnd' ? '债券' : '快速评级'
      const { total, fail, success } = this.totalMatchResult
      return `共导入${total}个${name}，其中${fail}个不匹配，已经匹配${success}个`
    }
  },
  methods: {
    importDialogOpen() {
      this.visible = true
    },
    importDialogClose() {
      this.visible = false
      this.objTablelist = []
      this.tempTableList = []
      this.isDisabled = true
      this.objChecked = false
      this.tableLoading = false
      this.totalMatchResult = {
        total: 0,
        fail: 0,
        success: 0
      }
    },
    // 确认按钮
    importDialogSure() {
      if (this.tempTableList.length === 0) {
        this.$message.error('请先选择上传文件')
        return false
      }
      let objCodeArray = []
      // 不是新增快速评级，把成功的抛出反显到父组件；
      // 新增快速评级返回列表，父组件请求接口
      this.submitLoading = true
      if (this.dialogType !== 'fast') {
        service[this.successHttpName]()
          .then(res => {
            if (res && res.status === 200) {
              objCodeArray = res.data.matchList
              this.submitLoading = false
            }
            this.$emit('importDialogSure', objCodeArray)
          })
          .catch(() => {
            this.submitLoading = false
          })
      } else {
        this.submitLoading = false
        this.$emit('importDialogSure')
      }
    },
    // 匹配按钮
    importDialogMatch() {
      if (this.objTablelist.length === 0) {
        this.$message.error('请先选择上传文件')
        return false
      }
      this.tableLoading = true
      service[this.matchHttpName](this.objTablelist).then(res => {
        this.tableLoading = false
        if (res && res.status === 200) {
          const { fail, success, matchList } = res.data
          this.objTablelist = matchList
          this.objChecked && this.handleMatchFail(true)
          // 如果选择 只看匹配失败
          if (this.objChecked) {
            this.totalMatchResult.fail = fail
            this.totalMatchResult.success = this.totalMatchResult.success + success
          } else {
            this.totalMatchResult.fail = fail
            this.totalMatchResult.success = success
          }
        }
      })
      this.$emit('importDialogMatch')
    },
    // 下载模板
    downloadTemplate() {
      this.$emit('downloadTemplate')
    },
    // 上次文件
    httpRequest(formData) {
      if (this.httpName) {
        this.tableLoading = true
        service[this.httpName](formData).then(res => {
          this.tableLoading = false
          if (res && res.status === 200) {
            const { total = 0, success = 0, fail = 0, matchList = [] } = res.data
            matchList.map((item, index) => {
              item.id = index
            })
            this.totalMatchResult.total = total
            this.totalMatchResult.fail = fail
            this.totalMatchResult.success = success
            this.objTablelist = matchList
            this.tempTableList = matchList
            this.isDisabled = false
            this.objChecked = false
          }
        })
      }
      this.$emit('getFileData', formData)
    },
    // 只看匹配失败
    handleMatchFail(val) {
      if (this.tempTableList.length === 0) {
        this.$message.error('请先选择上传文件')
        this.isDisabled = false
      }
      if (val) {
        const matchFailList = []
        this.objTablelist.map(item => {
          if (item.matchResult.includes('匹配失败')) {
            matchFailList.push(item)
          }
        })
        this.objTablelist = matchFailList
      } else {
        this.getTableList()
      }
      this.$emit('handleMatchFail', val)
    },
    // 只匹配失败选项为false时，返回所有数据列表
    getTableList() {
      const { total, fail, success } = this.totalMatchResult
      const params = {
        message: this.matchResult,
        total,
        fail,
        success
      }
      this.tableLoading = true
      service[this.importHttpName](params).then(res => {
        this.tableLoading = false
        if (res && res.status === 200) {
          const { total = 0, success = 0, fail = 0, matchList = [] } = res.data
          matchList.map((item, index) => {
            item.id = index
          })
          this.totalMatchResult.total = total
          this.totalMatchResult.fail = fail
          this.totalMatchResult.success = success
          this.objTablelist = matchList
        }
      })
    },
    // table样式
    rowClassName({ row, rowIndex }) {
      const indexRow = rowIndex + 1
      this.$set(row, 'index', indexRow)
    },
    cellClassName({ row, column }) {
      if (row.matchResult.includes('匹配失败') && column.property === 'matchResult') {
        return 'color: #F56C6C'
      }
    },
    requiredItem(h, { column }) {
      return [
        h('span', { style: 'color: #F56C6C; margin-right: 3px;' }, '*'),
        h('span', column.label)
      ]
    }
  }
}
</script>
<style lang="scss" scoped>
// input框标红样式，后期需要可用
.input-border-style {
  ::v-deep .el-input__inner {
    border-color: #f56c6c !important;
  }
}

.tip-show {
  display: block;
  float: right;
}

.download-temp {
  position: absolute;
  top: 0;
  left: 100px;
}

.custom-pagination {
  margin-top: 10px;
  text-align: right;

  ::v-deep.el-select {
    .el-input {
      .el-input__inner {
        height: 28px !important;
        line-height: 28px !important;
      }
    }
  }
}
</style>
