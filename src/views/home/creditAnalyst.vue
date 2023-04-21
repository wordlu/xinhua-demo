<template>
  <div class="configMain">
    <el-container direction="vertical" class="bodyWrap">
      <BeforeLineTitle :title="title" />
      <div class="content">
        <TabPane
          v-model="activeTab"
          :tab-list="tabData"
          :type="'card'"
          :default-name="activeTab"
          @handleTabChange="handleTabOnChange"
        />
        <BaseForm
          v-if="activeTab === 'QuickRating'"
          :form-data="formData"
          :label-width="100"
          :set-options="setOptions"
          @queryForm="queryForm"
          @trigger="trigger"
          @resetBatch="resetBatch"
          @getRemoteMethod="getRemoteMethod"
          @exportForm="exportForm"
          @handleCurrentChangeOrg="handleCurrentChangeOrg"
          @blurValue="blurValue"
          @selectPageChange="selectPageChange"
        ></BaseForm>
        <el-row v-else-if="activeTab === 'RatingRemind'" type="flex" justify="end">
          <el-col :span="2" class="text-right mr10">
            <el-button v-btnShow="derive" type="primary" size="small" @click="exportRatingRemind"
              >导出</el-button
            >
          </el-col>
        </el-row>
        <div v-if="activeTab === 'QuickRating'" class="check-all-container">
          <el-checkbox
            v-model="checkall"
            class="check-all"
            :disabled="dataList.length < 1"
            @change="allCheckEvent"
            >全选</el-checkbox
          >
        </div>
        <BaseTable
          :key="activeTab"
          ref="baseTable"
          :columns="getColumns"
          has-pagination
          :page-size="table.pageSize"
          :data-source="dataList"
          :current-page="table.currentPage"
          :total="table.total"
          :loading="listLoading"
          :page-sizes="[50, 100, 200, 500]"
          @handleCurrent="handleCurrentChange"
          @handleSize="handleSizeChange"
          @rowSelect="rowSelect"
          @selectAll="selectAll"
        ></BaseTable>
      </div>
    </el-container>
    <FastDialog
      :is-show="dialogShow"
      :title="'新增'"
      :item-data="itemData"
      @dialogClose="dialogClose"
      @success="success"
    ></FastDialog>

    <DialogCurve
      :dialog-form-visible="dialogFormVisible"
      :tab-pane-show="true"
      :edit-btn-show="true"
      :type="'1'"
      :curve-id="curveId"
      :add-show="addShow"
      :sub-show="subShow"
      :main-show="mainShow"
      :standard-show="standardShow"
      @close="addClose"
      @cancel="addCancel"
    ></DialogCurve>
  </div>
</template>

<script>
import BeforeLineTitle from '@components/CommonTitle'
import TabPane from '@components/TabPane'
import BaseTable from '@components/BaseTable'
import BaseForm from '@components/BaseForm'
import FastDialog from '@components/FastRateDialog'
import DialogCurve from '../curvemanagement/regulation/components/add.vue'
import { columnsQuickRating, columnsRatingRemind } from './libs/data'
import { formData, tabData } from './libs/creditAnalystData'
import { baseDownLoad, removeNullInObject } from '@utils/util'
import * as service from '@api/home'
import InitDataMixin from './mixins/initData.mixin'
import keepMixin from '@mixins/keep.mixin'

export default {
  name: 'CreditAnalyst',
  components: {
    BeforeLineTitle,
    BaseTable,
    TabPane,
    BaseForm,
    FastDialog,
    DialogCurve
  },
  mixins: [InitDataMixin, keepMixin],
  data() {
    return {
      title: '信用分析师首页',
      derive: 12005,
      activeTab: 'CustomCurve',
      tabData,
      setOptions: {},
      formData,
      columnsCustomCurve: [
        {
          label: '序号',
          fix: 'left',
          type: 'index',
          align: 'center',
          width: '60'
        },
        {
          label: '自定义曲线名称',
          prop: 'curveName',
          align: 'center',
          render: (h, { record }) => {
            let btnProps = {
              type: 'text',
              size: 'small'
            }
            return h(
              'el-button',
              {
                props: btnProps,
                on: {
                  click: () => {
                    this.openCurveDialog(record.curveId)
                  }
                }
              },
              record.curveName
            )
          }
        },
        {
          label: '创建日期',
          prop: 'createTime',
          align: 'center'
        },
        {
          label: '是否每日计算',
          prop: 'isDailyCal',
          align: 'center'
        },
        {
          label: '是否存在连续多日数据不足的情形',
          prop: 'fiveDay',
          align: 'center'
        },
        {
          label: '操作',
          fix: 'right',
          width: '120',
          align: 'center',
          actions: [
            {
              text: '删除曲线',
              onClick: item => {
                this.delCurveItem(item)
              }
            }
          ]
        }
      ],
      columnsQuickRating,
      columnsRatingRemind,
      dialogShow: false,
      itemData: {},
      checked: [],
      // dialog框显示与隐藏
      dialogFormVisible: false,
      // 每项数据的详情id
      curveId: '',
      // 控制显示哪种form表单
      addShow: true,
      // 控制分段是否显示
      subShow: true,
      // 控制主体是否显示
      mainShow: true,
      // 控制参数阀值是否显示
      standardShow: false,
      checkall: false,
      checkedMap: {},
      dataList: [],
      table: {
        currentPage: 1,
        total: 0,
        pageSize: 50
      },
      listLoading: false,
      searchParams: {},
      selectedItems: [],
      isCheckedAll: false,
      userId: JSON.parse(sessionStorage.getItem('NCAM')).user.userInfo.userId
    }
  },
  computed: {
    getColumns() {
      return this[`columns${this.activeTab}`]
    }
  },
  watch: {
    activeTab: {
      handler(nv) {
        if (nv === 'QuickRating') {
          this.columnsQuickRating = columnsQuickRating.concat([
            {
              label: '操作',
              fix: 'right',
              width: '120',
              align: 'center',
              actions: [
                {
                  text: '撤销',
                  style: {
                    marginRight: '10px'
                  },
                  disabled: item => {
                    return !(item.sbmtStatus !== '已撤销')
                  },
                  onClick: item => {
                    this.resetItem(item)
                  }
                },
                {
                  text: '新增',
                  onClick: item => {
                    this.addQuickItem(item)
                  }
                }
              ]
            }
          ])
          this.columnsQuickRating[0] = {
            type: 'selection',
            align: 'center',
            selectable: row => {
              if (row.sbmtStatus === '已撤销') {
                return false
              } else {
                return true
              }
            },
            with: '60',
            fix: 'left'
          }
        } else if (nv === 'RatingRemind') {
          this.columnsRatingRemind = columnsRatingRemind.concat([
            {
              label: '操作',
              fix: 'right',
              width: '120',
              align: 'center',
              actions: [
                {
                  text: '新增快速评级',
                  onClick: item => {
                    this.addRatingRemind(item)
                  }
                }
              ]
            }
          ])
        }
      },
      immediate: true
    }
  },
  created() {
    const { routerList } = this.$store.state.user
    if (routerList[0].path === '/home' && routerList[0].children.length === 1) {
      this.title = `${this.$store.state.user.roleName}首页`
    }
  },
  mounted() {
    this.query(1)
    this.initDict()
  },
  activated() {
    this.$refs.baseTable.$refs.commonTable && this.$refs.baseTable.$refs.commonTable.doLayout()
  },
  methods: {
    initDict() {
      service.getOrgNameList('', 1, 6).then(res => {
        if (res) {
          let { list, total } = res.data
          this.setOptions = { objName: list }
          const index = this.formData.renderFrom.findIndex(item => item.key === 'objName')
          this.formData.renderFrom[index].getPageInfo.total = total
          this.initOrg = { list, total, index }
        }
      }) // 主体名称列表
    },
    handleTabOnChange(tab) {
      this.activeTab = tab.name
      this.searchParams = {}
      this.query()
    },
    queryForm(item) {
      this.searchParams = { ...removeNullInObject(item) }
      this.query(1, 50)
      this.checkall = false
    },
    query(page, pageSize) {
      this.listLoading = true
      this.table.currentPage = page || this.table.currentPage
      this.table.pageSize = pageSize || this.table.pageSize
      let params = {
        pageNum: this.table.currentPage,
        pageSize: this.table.pageSize,
        ...this.searchParams
      }
      if (this.activeTab === 'RatingRemind') {
        params.isAdmin = 0
      } else if (this.activeTab === 'QuickRating') {
        const { objName } = params
        if (objName && objName.length === 1) {
          if (this.setOptions.objName && this.setOptions.objName.length === 0) {
            params.objStr = objName.join('')
            delete params.objName
          }
        }
      }
      service[`get${this.activeTab}`](params)
        .then(res => {
          const { status, data, message } = res
          this.listLoading = false
          if (status === 200) {
            this.dataList = data.list
            this.table.total = data.total
            if (this.activeTab === 'QuickRating' && this.checkall) {
              this.allCheckEvent()
            }
            this.init()
          } else {
            this.dataList = []
            message && this.$Message.error(message)
          }
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    init() {
      this.selectedItems = []
      this.isCheckedAll = false
    },
    handleCurrentChange(page) {
      this.table.currentPage = page
      this.query()
    },
    handleSizeChange(pageSize) {
      this.table.pageSize = pageSize
      this.query(1)
    },
    resetItem(item) {
      // InitDataMixin中撤销方法
      this.handlerReset(item.revokeId, '', 0)
    },
    // 批量撤销
    resetBatch() {
      if (this.checked.length < 1) {
        const message = this.dataList.length < 1 ? '列表暂无数据' : '请先选择列表数据'
        this.$message.warning(message)
        return
      }
      // InitDataMixin中撤销方法
      this.handlerReset(this.checked, '批量', 0)
    },
    rowSelect(selection) {
      this.checked = []
      this.checkall = selection.length === this.table.total
      selection.map(item => {
        this.checked.push(item.revokeId)
      })
      this.checkedMap[`page${this.table.currentPage}`] = this.checked
    },
    // 全选
    selectAll(selection) {
      let selected = selection
      if (this.checkall) {
        selected = this.dataList
      }
      if (selected && selected.length > 0) {
        let revokeIdList = []
        selected.map(item => {
          this.checked.push(item.revokeId)
          revokeIdList.push(item.revokeId)
        })
        this.checkedMap[`page${this.table.currentPage}`] = revokeIdList
      } else {
        this.checked = []
        this.checkedMap[`page${this.table.currentPage}`] = []
      }
    },
    allCheckEvent() {
      if (this.checkall) {
        this.selectAll(this.dataList)
        this.toggleSelection(this.dataList)
      } else {
        this.selectAll([])
        this.toggleSelection()
      }
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.baseTable.$refs.commonTable.toggleAllSelection(row)
        })
      } else {
        this.$refs.baseTable.$refs.commonTable.clearSelection()
      }
    },
    // 快速评级 - 新增
    addQuickItem(item) {
      this.dialogShow = true
      this.itemData = { ...item }
    },
    // 快速评级提醒 - 新增
    addRatingRemind(item) {
      this.dialogShow = true
      this.itemData = { ...item }
    },
    delCurveItem(item) {
      this.$confirm('是否确认删除该自定义曲线?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        service.delCurveInfo({ curveId: item.curveId }).then(res => {
          if (res.status === 200) {
            this.query()
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }
        })
      })
    },
    // 新增快速评级关闭
    dialogClose() {
      this.dialogShow = false
    },
    // 新增快速评级成功
    success() {
      this.query()
    },
    exportForm() {
      if (this.dataList.length < 1) {
        this.$message.warning('暂无数据导出')
        return
      }
      let params = { ...this.searchParams, userId: this.userId }
      if (this.activeTab === 'QuickRating') {
        const { objName } = params
        if (objName && objName.length === 1) {
          if (this.setOptions.objName && this.setOptions.objName.length === 0) {
            params.objStr = objName.join('')
            delete params.objName
          }
        }
      }
      baseDownLoad(service.exportQuickRating, params, this.table.total)
    },
    exportRatingRemind() {
      if (this.dataList.length < 1) {
        this.$message.warning('暂无数据导出')
        return
      }
      baseDownLoad(service.exportRatingRemind, { isAdmin: 0, userId: this.userId })
    },
    // addDialog框关闭的时候
    addClose() {
      this.tabPaneShow = false
      this.dialogFormVisible = false
      this.curveId = ''
    },
    addCancel() {
      this.tabPaneShow = false
      this.dialogFormVisible = false
      this.curveId = ''
    },
    openCurveDialog(val) {
      this.dialogFormVisible = true
      this.tabPaneShow = true
      this.curveId = val
    }
  }
}
</script>
<style lang="scss" scoped>
.text-right {
  text-align: right;
}
.check-all-container {
  position: relative;
  .check-all {
    position: absolute;
    top: -18px;
    left: 28px;
  }
}
</style>
