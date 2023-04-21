<template>
  <!-- 主体级别状态查询 -->
  <div class="configMain">
    <el-container direction="vertical" class="bodyWrap">
      <BaseForm
        ref="baseForm"
        :key="baseKey"
        :form-data="formData"
        :label-width="100"
        :set-options="setOptions"
        @queryForm="getQueryForm"
        @download="download"
        @resetForm="resetForm"
        @handleImport="handleImport"
        @handleFast="handleFast"
        @trigger="trigger"
        @selectVisible="selectVisible"
        @getRemoteMethod="getRemoteMethod"
        @getFilterMethod="getFilterMethod"
        @handleCurrentChangeOrg="handleCurrentChangeOrg"
        @blurValue="blurValue"
        @selectPageChange="selectPageChange"
      />
      <BaseTable
        :columns="columns"
        has-pagination
        :page-size="table.pageSize"
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
      :title="historyTitle"
      width="55%"
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
    <!-- 导入待查询主体 -->
    <EditDialog
      ref="dialog"
      title="导入待查询主体"
      :columns="dialogColumns"
      :http-name="'getFileUpload'"
      @importDialogSure="importDialogSure"
      @downloadTemplate="downloadTemplate"
    >
    </EditDialog>
    <!-- 新增快速评级 -->
    <FastRateDialog
      :is-show="dialogFastVisible"
      :title="'新增'"
      :item-data="itemData"
      @dialogClose="handleDialogCancle"
      @success="fastSuccess"
    ></FastRateDialog>
  </div>
</template>
<script>
import BaseForm from '@components/BaseForm/index.vue'
import EditDialog from '@components/EditDialog'
import FastRateDialog from '@components/FastRateDialog'
import { formData, dialogColumns } from './libs/dataLevel'
import { columnsHistory } from './libs/columnsHistory'
import BaseTable from '@components/BaseTable'
import * as service from '@api/ratemanagement'
import * as servdeal from '@api/bondYield'
import { globalDictMap } from '@utils/dict'
import { removeNullInObject, renderColumnsIndustry, baseDownLoad } from '@utils/util'
import initMixin from '../mixins/initData.mixin.js'

export default {
  components: {
    BaseForm,
    BaseTable,
    EditDialog,
    FastRateDialog
  },
  mixins: [initMixin],
  data() {
    const _this = this
    return {
      setOptions: {},
      formData,
      dialogColumns,
      columns: [
        {
          label: '序号',
          width: 50,
          render: (h, record) => {
            return h('span', record.$index + 1)
          },
          align: 'center',
          fix: 'left'
        },
        {
          label: '主体代码',
          prop: 'objCode',
          align: 'center',
          fix: 'left'
        },
        {
          label: '主体名称',
          prop: 'objName',
          'show-overflow-tooltip': true,
          minWidth: '120',
          align: 'center',
          fix: 'left',
          sortable: true
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
          label: '最新人工正式评级',
          prop: 'newestOfficialLevel',
          minWidth: '140',
          align: 'center'
        },
        {
          label: '人工正式评级生效时间',
          prop: 'officialLevelEffectiveDt',
          minWidth: '130',
          align: 'center',
          sortable: true
        },
        {
          label: '人工正式评级状态',
          prop: 'officialLevelTp',
          minWidth: '140',
          align: 'center'
        },
        {
          label: '最新人工快速评级',
          prop: 'newestSpeedyLevel',
          minWidth: '140',
          align: 'center'
        },
        {
          label: '人工快速评级生效时间',
          prop: 'speedyLevelEffectiveDt',
          minWidth: '130',
          align: 'center'
        },
        {
          label: '人工快速评级状态',
          prop: 'speedyLevelTp',
          minWidth: '120',
          align: 'center'
        },
        {
          label: '最新批量评级',
          prop: 'newestBatchLevel',
          minWidth: '120',
          align: 'center'
        },
        {
          label: '批量生效时间',
          prop: 'batchLevelEffectiveDt',
          minWidth: '120',
          align: 'center'
        },
        {
          label: '批量评级状态',
          prop: 'batchLevelTp',
          minWidth: '120',
          align: 'center'
        },
        {
          label: '最终级别',
          prop: 'lastLevel',
          align: 'center'
        },
        {
          label: '操作',
          prop: '',
          'header-align': 'center',
          width: 160,
          align: 'center',
          fix: 'right',
          render(h, { record }) {
            const role = JSON.parse(sessionStorage.getItem('NCAM')).user.roleName
            if (
              role === '投资经理' ||
              role === '风险经理' ||
              role === '项目经理' ||
              role === '公司领导'
            ) {
              return (
                <div>
                  <el-button type="text" on-click={() => _this.handleHistory(record)}>
                    {' '}
                    评级历史{' '}
                  </el-button>
                </div>
              )
            } else {
              return (
                <div>
                  <el-button
                    type="text"
                    disabled={record.insertFlag === '0'}
                    on-click={() => _this.handleOpenFast(record)}
                  >
                    {' '}
                    新增快速评级{' '}
                  </el-button>
                  <span> | </span>
                  <el-button type="text" on-click={() => _this.handleHistory(record)}>
                    {' '}
                    评级历史{' '}
                  </el-button>
                </div>
              )
            }
          }
        }
      ],
      tableList: [],
      table: {
        currentPage: 1,
        total: 0,
        pageSize: 20
      },
      dialogFastVisible: false,
      itemData: {},
      dialogHistoryVisible: false,
      columnsHistory,
      tableHistoryList: [],
      tableHistory: {
        currentPage: 1,
        pageSize: 20,
        total: 0
      },
      tableHistoryItem: {},
      matchResult: '',
      objTablelist: [],
      tempTableList: [],
      isDisabled: true,
      baseKey: 1,
      searchParams: {},
      listLoading: false,
      tableHistoryLoading: false,
      historyTitle: '',
      copyOptions: {},
      roleName: '',
      sort: null
    }
  },
  computed: {
    orgName() {
      return this.$store.state.user.orgName
    }
  },
  mounted() {
    this.initDict()
    this.roleName = JSON.parse(sessionStorage.getItem('NCAM')).user.roleName
  },
  beforeDestroy() {
    this.formData.initData.objName = ''
  },
  methods: {
    renderColumns(h, prop) {
      return renderColumnsIndustry(h, prop)
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
    initOrgList() {
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
    },
    // 获取行业
    getIndustry(params) {
      return servdeal.getIndustryList(params)
    },
    initDict() {
      this.copyOptions = {
        objType: globalDictMap('2020'),
        objNewestLevel: globalDictMap('2010')
      }
      this.initOrgList()
      service.getOrgAnalystList().then(res => {
        if (res) {
          this.$set(this.setOptions, 'objBelongAnalyst', res.data)
          this.copyOptions.objBelongAnalyst = res.data
        }
      }) // 主体所属分析师列表
      let params = this.globalDictMap(2060).map(item => {
        return item.code
      })
      // 申万行业
      this.getIndustry(params[2]).then(res => {
        if (res) {
          this.$set(this.setOptions, 'objSWIndustryNew', res.data)
        }
      })
      // 新华内部行业
      this.getIndustry(params[1]).then(res => {
        this.$set(this.setOptions, 'objInnerIndustryNew', res.data)
      })
      // 新华GICS行业
      this.getIndustry(params[0]).then(res => {
        this.$set(this.setOptions, 'objGICSIndustryNew', res.data)
      })
    },
    getQueryForm(fromData) {
      this.searchParams = { ...fromData }
      this.queryForm(1)
    },
    queryForm(page, pageSize) {
      this.table.currentPage = page || this.table.currentPage
      this.table.pageSize = pageSize || this.table.pageSize
      const params = {
        pageNum: this.table.currentPage,
        pageSize: this.table.pageSize,
        roleName: this.roleName,
        ...removeNullInObject(this.searchParams),
        officialLevelEffectiveDtOrderBy: this.sort
      }
      const { objName } = params
      if (objName && objName.length === 1) {
        if (this.setOptions.objName && this.setOptions.objName.length === 0) {
          params.blurryObjName = objName.join('')
          delete params.objName
        }
      }
      this.listLoading = true
      service
        .getobjLevelStatusQuery(params)
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
      const { objName } = params
      if (objName && objName.length === 1) {
        if (this.setOptions.objName && this.setOptions.objName.length === 0) {
          params.blurryObjName = objName.join('')
          delete params.objName
        }
      }
      baseDownLoad(service.objLevelStatusExcel, params, this.table.total)
    },
    handleSize(val) {
      this.table.pageSize = val
      this.queryForm(1)
    },
    handleCurrent(val) {
      this.table.currentPage = val
      this.queryForm()
    },
    // 重置只需清空筛选项
    resetForm(val) {
      this.formData.initData = val
      this.searchParams = {}
      this.table.currentPage = 1
      this.resetSelect('objName')
    },
    // 快速评级
    handleFast() {
      this.dialogFastVisible = true
      this.itemData = {}
    },
    // 列表项新增快速评级
    handleOpenFast(val) {
      this.dialogFastVisible = true
      this.itemData = { ...val }
    },
    handleDialogCancle() {
      this.dialogFastVisible = false
    },
    // 新增评级之后刷新页面
    fastSuccess() {
      // this.queryForm(this.searchParams);
    },
    handleImport() {
      this.$refs.dialog.importDialogOpen()
    },
    importDialogSure(objCodeArray) {
      this.baseKey++
      this.getOrgNameByOrgCode(objCodeArray)
      this.formData.initData.objName = objCodeArray
      this.$refs.dialog.importDialogClose()
    },
    // 下载模板
    downloadTemplate() {
      service.orgNameTemplate({})
    },
    // 评价历史
    handleHistory(val) {
      const { objName, objBelongAnalyst, objCode } = val
      this.historyTitle = `主体名称：${objName}`
      this.dialogHistoryVisible = true
      this.tableHistoryItem = {
        objBelongAnalyst,
        orgCd: objCode
      }
      this.handleHistoryQuery(1)
    },
    handleHistoryQuery(page, pageSize) {
      const params = {
        pageNum: page || this.tableHistory.currentPage,
        pageSize: pageSize || this.tableHistory.pageSize,
        ...this.tableHistoryItem,
        queryDate: this.searchParams.queryDate
      }
      this.tableHistoryLoading = true
      service.getratingHistoryQuery(params).then(res => {
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
    sortChange(val) {
      const { order } = val
      if (!this.searchParams.queryDate) {
        return
      }
      if (order === 'ascending') {
        this.sort = 'asc'
      } else if (order === null) {
        this.sort = ''
      } else {
        this.sort = 'desc'
      }
      const params = {
        pageNum: this.table.currentPage,
        pageSize: this.table.pageSize,
        officialLevelEffectiveDtOrderBy: this.sort,
        ...removeNullInObject(this.searchParams)
      }
      const { objName } = params
      if (objName && objName.length === 1) {
        if (this.setOptions.objName && this.setOptions.objName.length === 0) {
          params.blurryObjName = objName.join('')
          delete params.objName
        }
      }
      this.listLoading = true
      service
        .getobjLevelStatusQuery(params)
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
    }
  }
}
</script>
