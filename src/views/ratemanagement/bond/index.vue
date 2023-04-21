<template>
  <!-- 评级管理 - 债项评级查询 -->
  <div class="configMain">
    <el-container direction="vertical" class="bodyWrap">
      <BeforeLineTitle :title="beforeLineTitle" />
      <BaseForm
        :key="baseKey"
        ref="bondForm"
        :form-data="formData"
        :label-width="100"
        :set-options="setOptions"
        @queryForm="getQueryForm"
        @download="download"
        @resetForm="resetForm"
        @handleImport="handleImport"
        @handleBondImport="handleBondImport"
        @getRemoteMethod="getRemoteMethod"
        @getFilterMethod="getFilterMethod"
        @trigger="trigger"
        @selectVisible="selectVisible"
        @handleCurrentChangeOrg="handleCurrentChangeOrg"
        @blurValue="blurValue"
        @selectPageChange="selectPageChange"
      />
      <BaseTable
        :columns="columns"
        has-pagination
        :page-size="1"
        :data-source="tableList"
        :current-page="table.currentPage"
        :total="table.total"
        :loading="listLoading"
        :page-sizes="[20, 50, 100]"
        @handleCurrent="handleCurrent"
        @handleSize="handleSize"
      />
    </el-container>
    <!-- 评级历史 -->
    <el-dialog
      :visible.sync="dialogHistoryVisible"
      :close-on-click-modal="false"
      title="债项评级历史"
      width="46%"
    >
      <BaseTable
        :columns="columnsHistory"
        has-pagination
        :page-size="1"
        :data-source="tableHistoryList"
        :current-page="tableHistory.currentPage"
        :total="tableHistory.total"
        :loading="tableHistoryLoading"
        :page-sizes="[20, 50, 100]"
        @handleCurrent="handleHistoryCurrent"
        @handleSize="handleHistorySize"
      />
    </el-dialog>
    <!-- 导入待查询主体 / 导入查询债项 -->
    <EditDialog
      ref="dialog"
      :key="tableKey"
      :title="titleImport"
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
import {
  currencyFormatter,
  removeNullInObject,
  renderColumnsIndustry,
  baseDownLoad
} from '@utils/util'
import BeforeLineTitle from '@components/CommonTitle'
import BaseForm from '@components/BaseForm/index.vue'
import EditDialog from '@components/EditDialog'
import { formData } from './libs/data'
import { dialogColumns, dialogDebtColumns } from '../object/libs/dataLevel'
import { columnsHistory } from './libs/columnsHistory'
import BaseTable from '@components/BaseTable'
import * as service from '@api/ratemanagement'
import * as servdeal from '@api/bondYield'
import { globalDictMap } from '@utils/dict'
import initMixin from '../mixins/initData.mixin.js'
import keepMixin from '@mixins/keep.mixin'

export default {
  name: 'BondRate',
  components: {
    BeforeLineTitle,
    BaseForm,
    BaseTable,
    EditDialog
  },
  mixins: [initMixin, keepMixin],
  data() {
    const _this = this
    return {
      setOptions: {},
      formData,
      dialogColumns,
      dialogDebtColumns,
      columns: [
        {
          label: '序号',
          fix: 'left',
          render: (h, record) => {
            return h('span', record.$index + 1)
          },
          align: 'center'
        },
        {
          label: '查询日期',
          prop: 'bndRatingDate',
          align: 'center'
        },
        {
          label: '债券代码',
          prop: 'bndCode',
          minWidth: '120',
          align: 'center'
        },
        {
          label: '债券简称',
          prop: 'bndName',
          minWidth: '140',
          align: 'center'
        },
        {
          label: '债项级别',
          prop: 'bndLevel',
          align: 'center'
        },

        {
          label: '债项模型评级',
          prop: 'bndModelRating',
          minWidth: '120',
          align: 'center'
        },
        {
          label: '债项快速评级',
          prop: 'bndFastRating',
          minWidth: '120',
          align: 'center'
        },
        {
          label: '债项正式评级',
          prop: 'bndArtificialRating',
          minWidth: '120',
          align: 'center'
        },
        {
          label: '债项交易市场',
          prop: 'bndRradeMarket',
          minWidth: '120',
          align: 'center'
        },
        {
          label: '剩余期限',
          prop: 'remainPeriod',
          align: 'center'
        },
        {
          label: '含权剩余期限',
          prop: 'withRightRemainPeriod',
          minWidth: '120',
          align: 'center'
        },
        {
          label: '含权期限说明',
          prop: 'withRightPeriodDesc',
          minWidth: '120',
          align: 'center'
        },
        {
          label: '含权剩余期限说明',
          prop: 'withRightRemainPeriodDesc',
          minWidth: '110',
          align: 'center'
        },
        {
          label: '发行期限(年)',
          prop: 'issuePeriod',
          formatter: this.currency,
          align: 'center'
        },
        {
          label: '发行规模(亿元)',
          prop: 'issueScale',
          formatter: this.currency,
          minWidth: '120',
          align: 'center'
        },
        {
          label: '票面利率(%)',
          prop: 'couponRate',
          formatter: this.currency,
          minWidth: '120',
          align: 'center'
        },
        {
          label: '主体名称',
          prop: 'objName',
          minWidth: '120',
          align: 'center'
        },
        {
          label: '主体类型',
          prop: 'objType',
          align: 'center'
        },
        {
          label: '新华GICS行业',
          prop: 'objGICSIndustry',
          minWidth: '120',
          align: 'center',
          render: (h, { record }) => this.renderColumns(h, record.objGICSIndustry)
        },
        {
          label: '新华内部行业',
          prop: 'objInnerIndustry',
          minWidth: '120',
          align: 'center',
          render: (h, { record }) => this.renderColumns(h, record.objInnerIndustry)
        },
        {
          label: '申万行业',
          prop: 'objSWIndustry',
          minWidth: '100',
          align: 'center',
          render: (h, { record }) => this.renderColumns(h, record.objSWIndustry)
        },
        {
          label: '主体所属分析师',
          prop: 'objBelongAnalyst',
          minWidth: '120',
          align: 'center'
        },
        {
          label: '主体最终级别类型',
          prop: 'finalObjLevelType',
          minWidth: '110',
          align: 'center'
        },
        {
          label: '主体最终级别',
          prop: 'finalObjLevel',
          align: 'center'
        },
        {
          label: '主体评级ID',
          prop: 'objRatingId',
          minWidth: '120',
          align: 'center'
        },
        {
          label: '操作',
          prop: '',
          'header-align': 'center',
          width: 120,
          fix: 'right',
          align: 'center',
          render: function(h, { record }) {
            return (
              <div>
                <el-button
                  type="text"
                  onClick={() => {
                    _this.handleHistory(record)
                  }}
                >
                  评级历史
                </el-button>
              </div>
            )
          }
        }
      ],
      beforeLineTitle: '债项评级信息',
      titleImport: '',
      tableName: true,
      tableList: [],
      table: {
        currentPage: 1,
        total: 0,
        pageSize: 20
      },
      dialogHistoryVisible: false,
      columnsHistory,
      tableHistoryList: [],
      tableHistory: {
        currentPage: 1,
        total: 0,
        pageSize: 10
      },
      tableHistoryItem: {},
      matchResult: '',
      objTablelist: [],
      tempTableList: [],
      isDisabled: true,
      baseKey: 1,
      tableKey: 1,
      searchParams: {},
      copyOptions: {},
      listLoading: false,
      tableHistoryLoading: false
    }
  },
  computed: {
    getColumns() {
      return this.tableName ? this.dialogColumns : this.dialogDebtColumns
    },
    getHttpName() {
      // 导入弹窗 上传文件接口名称
      return this.tableName ? 'getFileUpload' : 'getFileBndName'
    },
    getDialogType() {
      // 导入弹窗类型
      return this.tableName ? 'orgName' : 'bnd'
    },
    getMatchName() {
      // 导入弹窗匹配按钮对应接口名称
      return this.tableName ? 'orgNameMatch' : 'bndNameMatch'
    },
    getSuccessHttpName() {
      // 导入弹窗 确认按钮获取匹配成功id 接口名称
      return this.tableName ? 'getSuccesshQueryOrg' : 'getSuccesshQueryBnd'
    },
    getImportHttpName() {
      // 导入弹窗 确认按钮获取匹配成功id 接口名称
      return this.tableName ? 'getMatchQueryOrg' : 'getMatchQueryBnd'
    }
  },
  mounted() {
    this.initDict()
  },
  beforeDestroy() {
    this.formData.initData.objName = ''
    this.formData.initData.bndName = ''
  },
  methods: {
    currency(row, column, cellValue) {
      return currencyFormatter(cellValue, 2)
    },
    renderColumns(h, prop) {
      return renderColumnsIndustry(h, prop)
    },
    // 获取行业
    getIndustry(params) {
      return servdeal.getIndustryList(params)
    },
    initSelect() {
      let params = {
        pageNum: 1,
        pageSize: 6
      }
      service.getOrgNamePageList(params).then(res => {
        if (res) {
          let { list, total } = res.data
          this.$set(this.setOptions, 'objName', list)
          const index = this.formData.renderFrom.findIndex(item => item.key === 'objName')
          this.formData.renderFrom[index].getPageInfo.total = total
          this.initOrg = { list, total, index }
        }
      }) // 主体名称初始化
      let bndParams = {
        pageNum: 1,
        pageSize: 6
      }
      service.getBndNamePageList(bndParams).then(res => {
        if (res) {
          let { list, total } = res.data
          this.$set(this.setOptions, 'bndName', list)
          const index = this.formData.renderFrom.findIndex(item => item.key === 'bndName')
          this.formData.renderFrom[index].getPageInfo.total = total
          this.initBnd = { list, total, index }
        }
      }) // 债券简称列表
    },
    initDict() {
      this.copyOptions = {
        objType: globalDictMap('2020'),
        finalObjLevel: globalDictMap('2010')
      }
      this.initSelect()
      service.getOrgAnalystList().then(res => {
        if (res) {
          this.$set(this.setOptions, 'objBelongAnalyst', res.data)
          this.copyOptions.objBelongAnalyst = res.data
        }
      }) // 主体所属分析师列表
      let code = this.globalDictMap(2060).map(item => {
        return item.code
      })
      // 申万行业
      this.getIndustry(code[2]).then(res => {
        if (res) {
          this.$set(this.setOptions, 'objSWIndustryNew', res.data)
        }
      })
      // 新华内部行业
      this.getIndustry(code[1]).then(res => {
        this.$set(this.setOptions, 'objInnerIndustryNew', res.data)
      })
      // 新华GICS行业
      this.getIndustry(code[0]).then(res => {
        this.$set(this.setOptions, 'objGICSIndustryNew', res.data)
      })
      service.getBndCodeData().then(res => {
        if (res && res.status === 200) {
          const { data } = res
          this.$set(this.setOptions, 'bndCode', data)
          this.bndCode = [...data]
        }
      }) // 债券代码初始化数据
    },
    getQueryForm(formData) {
      this.searchParams = { ...formData }
      this.queryForm(1)
    },
    queryForm(page, pageSize) {
      this.table.currentPage = page || this.table.currentPage
      this.table.pageSize = pageSize || this.table.pageSize
      const params = {
        pageNum: this.table.currentPage,
        pageSize: this.table.pageSize,
        ...removeNullInObject(this.searchParams)
      }
      const { objName, bndName } = params
      if (objName && objName.length === 1) {
        if (this.setOptions.objName && this.setOptions.objName.length === 0) {
          params.blurryObjName = objName.join('')
          delete params.objName
        }
      }
      if (bndName && bndName.length === 1) {
        if (this.setOptions.bndName && this.setOptions.bndName.length === 0) {
          params.blurryBndName = bndName.join('')
          delete params.bndName
        }
      }
      this.listLoading = true
      service
        .getbndRatingQuery(params)
        .then(res => {
          this.listLoading = false
          if (res) {
            const { list, total } = res.data
            this.tableList = list
            this.table.total = total
          }
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    download() {
      if (this.tableList.length < 1) {
        this.$message.warning('暂无数据导出')
        return
      }
      let params = {
        ...this.searchParams
      }
      const { objName, bndName } = params
      if (objName && objName.length === 1) {
        if (this.setOptions.objName && this.setOptions.objName.length === 0) {
          params.blurryObjName = objName.join('')
          delete params.objName
        }
      }
      if (bndName && bndName.length === 1) {
        if (this.setOptions.bndName && this.setOptions.bndName.length === 0) {
          params.blurryBndName = bndName.join('')
          delete params.bndName
        }
      }
      baseDownLoad(service.bndRatingExcel, params, this.table.total)
    },
    handleSize(val) {
      this.table.pageSize = val
      this.queryForm(1)
    },
    handleCurrent(val) {
      this.table.currentPage = val
      this.queryForm()
    },
    resetForm(val) {
      this.formData.initData = val
      this.searchParams = {}
      this.table.currentPage = 1
      this.resetSelect('objName')
      this.resetSelect('bndName')
    },
    // 评价历史
    handleHistory(val) {
      this.dialogHistoryVisible = true
      const { objName, orgCd, bndCode, bndRatingDate } = val
      this.tableHistoryItem = {
        objName,
        orgCd,
        windCd: bndCode,
        bizDt: bndRatingDate
      }
      this.handleHistoryQuery(1)
    },
    handleHistoryQuery(page, pageSize) {
      const params = {
        pageNum: page || this.tableHistory.currentPage,
        pageSize: pageSize || this.tableHistory.pageSize,
        ...this.tableHistoryItem
      }
      this.tableHistoryLoading = true
      service.getbndRatingHistoryQuery(params).then(res => {
        this.tableHistoryLoading = false
        if (res) {
          const { list, total } = res.data
          this.tableHistoryList = list
          this.tableHistory.total = total
        }
      })
    },
    handleHistorySize(val) {
      this.tableHistory.pageSize = val
      this.handleHistoryQuery()
    },
    handleHistoryCurrent(val) {
      this.tableHistory.currentPage = val
      this.handleHistoryQuery()
    },
    // 主体名称导入
    handleImport() {
      this.$refs.dialog.importDialogOpen()
      this.titleImport = '导入待查询主体'
      this.tableName = true
    },
    // 债券名称导入
    handleBondImport() {
      this.$refs.dialog.importDialogOpen()
      this.titleImport = '导入待查询债券'
      this.tableName = false
    },
    importDialogSure(objNameArray) {
      this.baseKey++
      this.tableKey++
      if (this.tableName) {
        this.getOrgNameByOrgCode(objNameArray)
        this.formData.initData.objName = objNameArray
      } else {
        this.getBndNameByBndCode(objNameArray)
        this.formData.initData.bndName = objNameArray
      }
      this.$refs.dialog.importDialogClose()
    },
    // 下载模板
    downloadTemplate() {
      this.tableName ? service.orgNameTemplate({}) : service.bndNameTemplate()
    },
    getOrgNameByOrgCode(params) {
      service.getOrgNameByOrgCode(params).then(res => {
        if (res && res.status === 200) {
          this.$set(this.setOptions, 'objName', res.data)
          const index = this.formData.renderFrom.findIndex(item => item.key === 'objName')
          this.formData.renderFrom[index].showPagination = false
        }
      })
    },
    getBndNameByBndCode(params) {
      service.getBndNameByBndCode(params).then(res => {
        if (res && res.status === 200) {
          this.$set(this.setOptions, 'bndName', res.data)
          const index = this.formData.renderFrom.findIndex(item => item.key === 'bndName')
          this.formData.renderFrom[index].showPagination = false
        }
      })
    }
  }
}
</script>
