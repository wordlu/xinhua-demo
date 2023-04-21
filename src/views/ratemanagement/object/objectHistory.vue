<template>
  <!-- 主体评级记录查询 -->
  <div class="configMain">
    <el-container direction="vertical" class="bodyWrap">
      <BaseForm
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
      ></BaseForm>
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
    <!-- 快速评级 -->
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
import { formData } from './libs/dataHistory'
import { dialogColumns } from './libs/dataLevel'
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
          'show-overflow-tooltip': true,
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
          label: '主体级别',
          prop: 'objLevel',
          align: 'center'
        },
        {
          label: '主体级别类型',
          prop: 'objLevelType',
          minWidth: '120',
          align: 'center'
        },
        {
          label: '主体级别生效日期',
          prop: 'objLevelEffectiveDt',
          minWidth: '140',
          align: 'center'
        },
        {
          label: '主体级别失效日期',
          prop: 'objLevelExpireDt',
          minWidth: '140',
          align: 'center'
        },
        {
          label: '评级状态',
          prop: 'ratingTp',
          align: 'center'
        },
        {
          label: '是否当前最终级别',
          prop: 'finalLevelFlag',
          minWidth: '130',
          align: 'center'
        },
        {
          label: '主体评级ID',
          prop: 'objRatingId',
          minWidth: '120',
          align: 'center'
        },
        {
          label: '操作分析师',
          prop: 'creater',
          minWidth: '100',
          align: 'center'
        },
        {
          label: '创建时间',
          prop: 'createDt',
          align: 'center',
          width: 140
        },
        {
          label: '操作',
          prop: '',
          'header-align': 'center',
          width: 160,
          fix: 'right',
          align: 'center',
          render(h, { record }) {
            const { insertFlag, revokeId } = record
            return (
              <div>
                <el-button
                  type="text"
                  disabled={insertFlag === '0'}
                  on-click={() => _this.handleOpenFast(record)}
                >
                  {' '}
                  新增快速评级{' '}
                </el-button>
                <span> | </span>
                <el-button
                  type="text"
                  disabled={revokeId === 0}
                  on-click={() => _this.handleCancel(record)}
                >
                  {' '}
                  撤销{' '}
                </el-button>
              </div>
            )
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
      objNameList: [],
      objNewestLevelList: [],
      baseKey: 1,
      searchParams: {},
      listLoading: false,
      copyOptions: {},
      roleName: ''
    }
  },
  watch: {
    roleName(nv) {
      if (nv === '投资经理' || nv === '风险经理' || nv === '项目经理' || nv === '公司领导') {
        this.columns = this.columns.filter(i => i.label !== '操作')
      }
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
    // 获取行业
    getIndustry(params) {
      return servdeal.getIndustryList(params)
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
    initDict() {
      this.copyOptions = {
        objType: globalDictMap('2020'),
        objLevel: globalDictMap('2010')
      }
      this.initOrgList()
      service.getOrgAnalystList().then(res => {
        if (res) {
          this.$set(this.setOptions, 'objBelongAnalyst', res.data)
          this.copyOptions.objBelongAnalyst = res.data
        }
      }) // 主体所属分析师列表
      service.getOrgList('1003').then(res => {
        if (res) {
          const data = [{ name: '暂存', code: 'ZC' }, ...res.data]
          this.$set(this.setOptions, 'levelStatus', data)
          this.copyOptions.levelStatus = data
        }
      }) // 评级状态options自定义
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
    },
    getQueryForm(fromData) {
      const { effectiveEndDt, effectiveStartDt, expireEndDt, expireStartDt } = fromData
      if (
        (effectiveEndDt && effectiveStartDt && effectiveEndDt < effectiveStartDt) ||
        (expireEndDt && expireStartDt && expireEndDt < expireStartDt)
      ) {
        this.$message.warning('结束时间请大于开始时间')
        return false
      }
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
      this.tableList = []
      service
        .getobjLevelRecordQuery(params)
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
      baseDownLoad(service.objLevelRecordExcel, params, this.table.total)
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
    },
    // 快速评级
    handleFast() {
      this.dialogFastVisible = true
      this.itemData = {}
    },
    handleOpenFast(val) {
      this.dialogFastVisible = true
      this.itemData = { ...val }
    },
    handleDialogCancle() {
      this.dialogFastVisible = false
    },
    fastSuccess() {
      this.queryForm(1)
    },
    // 撤销
    handleDisabled(val) {
      if (val.revokeId === 0) {
        return true
      } else {
        return false
      }
    },
    handleCancel(val) {
      const roleName = JSON.parse(sessionStorage.getItem('NCAM')).user.roleName
      service.revokeFastRating(val.revokeId, roleName).then(res => {
        if (res && res.status === 200) {
          this.$message({
            showClose: true,
            message: '撤销成功',
            type: 'success'
          })
          this.queryForm(1)
        }
      })
    },
    handleImport() {
      this.$refs.dialog.importDialogOpen()
    },
    importDialogSure(objNameArray) {
      this.baseKey++
      this.getOrgNameByOrgCode(objNameArray)
      this.formData.initData.objName = objNameArray
      this.$refs.dialog.importDialogClose()
    },
    // 下载模板
    downloadTemplate() {
      service.orgNameTemplate({})
    }
  }
}
</script>
