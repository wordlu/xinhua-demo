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
          ref="form"
          :key="baseKey"
          :form-data="formData"
          :label-width="100"
          :set-options="setOptions"
          @queryForm="queryForm"
          @exportForm="exportForm"
          @addBatch="addBatch"
          @resetBatch="resetBatch"
          @trigger="trigger"
          @getRemoteMethod="getRemoteMethod"
          @handleCurrentChangeOrg="handleCurrentChangeOrg"
          @blurValue="blurValue"
          @selectPageChange="selectPageChange"
          @selectVisible="selectVisible"
        ></BaseForm>
        <div v-if="activeTab === 'QuickRating'" class="check-all-container">
          <el-checkbox
            v-model="checkall"
            class="check-all"
            :disabled="dataList && dataList.length < 1"
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

    <!-- 导入新增评级 -->
    <EditDialog
      ref="dialog"
      title="导入新增评级"
      :dialog-type="'fast'"
      :columns="fastDialogColumns"
      :http-name="'getFileRating'"
      :match-http-name="'ratingMatch'"
      :import-http-name="'getMatchQueryFast'"
      @importDialogSure="importDialogSure"
      @downloadTemplate="downloadTemplate"
    >
    </EditDialog>
  </div>
</template>

<script>
import BeforeLineTitle from '@components/CommonTitle'
import TabPane from '@components/TabPane'
import BaseTable from '@components/BaseTable'
import BaseForm from '@components/BaseForm'
import {
  renderFrom,
  tabData,
  columnsQuickRating,
  columnsRatingRemind,
  columnsBondUngrouped,
  columnsBondRepeatgrouped,
  columnsStandardCurve,
  columnsStandardValuation,
  buttons,
  shuttButton
} from './libs/data'
import { initData, dateConfig, removeNullInObject, baseDownLoad } from '@utils/util'
import * as service from '@api/home'
import InitDataMixin from './mixins/initData.mixin'
import EditDialog from '@components/EditDialog'
import { fastDialogColumns } from '../ratemanagement/rate/libs/data'
import * as services from '@api/ratemanagement'
import keepMixin from '@mixins/keep.mixin'
import {
  RatingRemind,
  QuickRating,
  BondUngrouped,
  BondRepeatgrouped,
  StandardCurve,
  StandardValuation
} from '@utils/btnCode'
export default {
  name: 'BusinessAdministrator',
  components: {
    BeforeLineTitle,
    BaseTable,
    BaseForm,
    TabPane,
    EditDialog
  },
  mixins: [InitDataMixin, keepMixin],
  data() {
    return {
      title: '业务管理员首页',
      activeTab: 'RatingRemind',
      tabData,
      columnsQuickRating,
      columnsRatingRemind,
      columnsBondUngrouped,
      columnsBondRepeatgrouped,
      columnsStandardCurve,
      columnsStandardValuation,
      shuttButton,
      fastDialogColumns,
      formData: {
        maxCol: 4, // 最大列数
        isFoldRow: false, // 是否需要折叠
        Folding: false, // 折叠状态
        showButt: true // 按钮列表状态
      },
      buttons,
      checked: [],
      baseKey: 1,
      max: 0,
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
      isCheckedAll: false
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
        if (nv) {
          this.searchParams = {}
          // 先判断这个条件下有默认值
          const hasDate = [
            'StandardValuation',
            'BondUngrouped',
            'BondRepeatgrouped',
            'StandardCurve'
          ]
          if (hasDate.includes(nv)) {
            renderFrom[2].initValue = dateConfig().endDate || ''
            renderFrom[3].initValue = dateConfig().endDate || ''
          } else {
            renderFrom[2].initValue = ''
            renderFrom[3].initValue = ''
          }
          // tab切换动态 form根据status处理当前页所拥有的筛选项以及form按钮
          let renderFormButtons = renderFrom.find(i => i.type === 'Buttons')
          renderFormButtons.children = this.setQueryButtons(renderFormButtons.children)
          let renderForm = renderFrom.filter(v => !v.status || v.status.includes(nv))
          let shuttButton = this.setShuttButtons()
          this.max = Math.ceil(renderForm.length / 4)
          // formData根据不同tab页set不同内容
          this.$set(this.formData, 'initData', initData(renderForm))
          this.$set(this.formData, 'renderFrom', renderForm)
          this.$set(this.formData, 'butData', shuttButton)
          this.$set(this.formData, 'maxRow', this.max)

          // 这个条件下，searchParams 赋值有初始化默认值的条件, 需要在set之后判断
          if (hasDate.includes(nv)) {
            this.searchParams = removeNullInObject(this.formData.initData)
          }
          const initTabArr = ['QuickRating', 'BondUngrouped', 'StandardValuation']
          if (initTabArr.includes(nv)) {
            this.initDict()
          }
          if (nv === 'BondRepeatgrouped') {
            this.getCurveNameList() // 获取曲线名称数据
          }

          // 处理 table表单columns
          if (nv === 'QuickRating') {
            this.getRatingNowBatchNum()
            this.columnsQuickRating = columnsQuickRating.concat([
              {
                label: '批次号',
                prop: 'batchNums',
                align: 'center'
              },
              {
                label: '操作',
                fix: 'right',
                width: '120',
                align: 'center',
                actions: [
                  {
                    text: '撤销',
                    disabled: item => {
                      return item.sbmtStatus === '已撤销'
                    },
                    onClick: item => {
                      this.resetItem(item)
                    }
                  }
                ]
              }
            ])
          }
          // gdm添加的按钮权限,别删
          if (nv && nv === 'RatingRemind') {
            this.formData.butData[0].btnShow = RatingRemind.derive
            this.formData.butData[1].btnShow = RatingRemind.addition
          } else if (nv && nv === 'QuickRating') {
            this.formData.butData[0].btnShow = QuickRating.derive
            this.formData.butData[1].btnShow = QuickRating.revocation
            this.formData.butData[2].btnShow = QuickRating.addition
            this.formData.renderFrom[2].children[0].btnShow = QuickRating.inquire
          } else if (nv && nv === 'BondUngrouped') {
            this.formData.renderFrom[5].children[0].btnShow = BondUngrouped.inquire
            this.formData.renderFrom[5].children[1].btnShow = BondUngrouped.derive
          } else if (nv && nv === 'BondRepeatgrouped') {
            this.formData.renderFrom[3].children[0].btnShow = BondRepeatgrouped.inquire
            this.formData.renderFrom[3].children[1].btnShow = BondRepeatgrouped.derive
          } else if (nv && nv === 'StandardCurve') {
            this.formData.renderFrom[2].children[0].btnShow = StandardCurve.inquire
            this.formData.renderFrom[2].children[1].btnShow = StandardCurve.derive
          } else if (nv && nv === 'StandardValuation') {
            this.formData.renderFrom[6].children[0].btnShow = StandardValuation.inquire
            this.formData.renderFrom[6].children[1].btnShow = StandardValuation.derive
          }
          this.query(1, 50)
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
    this.getCurveNameList()
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
      if (this.activeTab !== 'QuickRating') {
        service.getBndNameList('', 1, 6).then(res => {
          if (res) {
            let { list, total } = res.data
            this.setOptions = { bndAbbrNm: list }
            const index = this.formData.renderFrom.findIndex(item => item.key === 'bndAbbrNm')
            this.formData.renderFrom[index].getPageInfo.total = total
            this.initBnd = { list, total, index }
          }
        }) // 债券简称列表
        service.getBndInitCodeList().then(res => {
          if (res && res.status === 200) {
            const { data } = res
            this.setOptions = { bndCd: data }
            this.bndCd = [...data]
          }
        }) // 债券代码初始化数据
      }
    },
    handleTabOnChange(tab) {
      const { name } = tab
      this.activeTab = name
      this.init()
      this.baseKey++
    },
    queryForm(item) {
      this.searchParams = { ...removeNullInObject(item) }
      const { beginDate, endDate } = this.searchParams
      if (endDate < beginDate) {
        this.$message.warning('结束时间需大于开始时间')
        return false
      }
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
        params.isAdmin = 1
      }
      let remoteTab = ['QuickRating', 'BondUngrouped', 'StandardValuation']
      if (remoteTab.includes(this.activeTab)) {
        const { objName, bndAbbrNm } = params
        if (objName && objName.length === 1) {
          if (this.setOptions.objName && this.setOptions.objName.length === 0) {
            params.objStr = objName.join('')
            delete params.objName
          }
        }
        if (bndAbbrNm && bndAbbrNm.length === 1) {
          if (this.setOptions.bndAbbrNm && this.setOptions.bndAbbrNm.length === 0) {
            params.bndStr = bndAbbrNm.join('')
            delete params.bndAbbrNm
          }
        }
      }
      const pathName =
        this.activeTab === 'QuickRating' ? `getToday${this.activeTab}` : `get${this.activeTab}`
      service[pathName](params)
        .then(res => {
          const { data, status, message } = res
          this.listLoading = false
          if (status === 200) {
            this.dataList = data.list
            this.table.total = data.total
            if (this.activeTab === 'QuickRating' && this.checkall) {
              this.allCheckEvent()
            }
            this.init()
          } else {
            this.listLoading = false
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
    exportForm() {
      if (this.dataList.length < 1) {
        this.$message.warning('暂无数据导出')
        return
      }
      const apiName = this.activeTab === 'QuickRating' ? 'TodayQuickRating' : this.activeTab
      let params = { ...this.searchParams }
      if (this.activeTab === 'RatingRemind') {
        params.isAdmin = 1
      }
      let remoteTab = ['QuickRating', 'BondUngrouped', 'StandardValuation']
      if (remoteTab.includes(this.activeTab)) {
        const { objName, bndAbbrNm } = params
        if (objName && objName.length === 1) {
          if (this.setOptions.objName && this.setOptions.objName.length === 0) {
            params.objStr = objName.join('')
            delete params.objName
          }
        }
        if (bndAbbrNm && bndAbbrNm.length === 1) {
          if (this.setOptions.bndAbbrNm && this.setOptions.bndAbbrNm.length === 0) {
            params.bndStr = bndAbbrNm.join('')
            delete params.bndAbbrNm
          }
        }
      }
      baseDownLoad(service[`export${apiName}`], params, this.table.total)
    },
    // 批量撤销
    resetBatch() {
      if (this.checked.length < 1) {
        const message = this.dataList.length < 1 ? '列表暂无数据' : '请先选择列表数据'
        this.$message.warning(message)
        return
      }
      // InitDataMixin中撤销方法
      this.handlerReset(this.checked, '批量', 1)
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
    setQueryButtons(list) {
      list = this.buttons.filter(v => !v.status || v.status.includes(this.activeTab))
      return list
    },
    setShuttButtons(list) {
      list = this.shuttButton.filter(v => !v.status || v.status.includes(this.activeTab))
      return list
    },
    // 单个撤销
    resetItem(item) {
      // InitDataMixin中撤销方法
      this.handlerReset(item.revokeId)
    },
    // 批量新增方法
    addBatch() {
      this.$refs.dialog.importDialogOpen()
    },
    // 下载模板
    downloadTemplate() {
      services.ratingTemplate({})
    },
    // 批量新增快速评级 操作完成后刷新
    importDialogSure() {
      services.saveRating().then(res => {
        if (res.status === 200) {
          this.$message({
            showClose: true,
            message: '保存成功',
            type: 'success'
          })
          this.$refs.dialog.importDialogClose()
          this.getRatingNowBatchNum()
          this.query(1)
        } else {
          this.$message.error(res.message)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.check-all-container {
  position: relative;
  .check-all {
    position: absolute;
    top: -18px;
    left: 28px;
  }
}
</style>
