<template>
  <div class="configMain">
    <el-container direction="vertical" class="bodyWrap">
      <BeforeLineTitle :title="beforeLineTitle" />
      <BaseForm
        :form-data="formData"
        :label-width="80"
        :set-options="setOptions"
        @queryForm="getQueryForm"
        @download="download"
        @resetForm="resetForm"
        @getRemoteMethod="getRemoteMethod"
        @handleCurrentChangeOrg="handleCurrentChangeOrg"
        @blurValue="blurValue"
        @selectPageChange="selectPageChange"
        @selectVisible="selectVisible"
      >
        <template v-slot:items="{ data, rowItem }">
          <el-form-item :label="rowItem.label" class="formItem">
            <el-select
              v-model="data.curveTp"
              :popper-append-to-body="false"
              placeholder="请选择"
              filterable
              clearable
              @change="onTrigger(data, rowItem)"
            >
              <el-option
                v-for="item in curveTpList"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </template>
        <template v-slot:flow="{ data, rowItem }">
          <el-form-item :label="rowItem.label" class="formItem">
            <el-select
              v-model="data.creater"
              :disabled="data.curveTp.includes('0')"
              :popper-append-to-body="false"
              placeholder="请选择"
              collapse-tags
              filterable
              clearable
              multiple
              @change="onTrigger(data, rowItem)"
            >
              <el-option
                v-for="item in createrList"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </template>
        <template v-slot:rose="{ data, rowItem }">
          <el-form-item :label="rowItem.label" class="formItem">
            <el-select
              v-model="data.curveName"
              :popper-append-to-body="false"
              placeholder="请选择"
              collapse-tags
              filterable
              clearable
              multiple
            >
              <el-option
                v-for="item in curveNameList"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </template>
      </BaseForm>
      <BaseTable
        :columns="columns"
        has-pagination
        :page-size="1"
        :data-source="tableList"
        :current-page="table.currentPage"
        :total="table.total"
        :loading="tableLoading"
        :page-sizes="[20, 50, 100]"
        @handleCurrent="handleCurrent"
        @handleSize="handleSize"
      />
    </el-container>
  </div>
</template>
<script>
import BeforeLineTitle from '@components/CommonTitle'
import BaseForm from '@components/BaseForm/index.vue'
import { formData, columns, renderFrom } from './libs/data'
import BaseTable from '@components/BaseTable'
import * as service from '@api/curveManagement'
import * as servicerat from '@api/ratemanagement'
import * as servdeal from '@api/bondYield'
import { globalDictMap } from '@utils/dict'
import { removeNullInObject, baseDownLoad } from '@utils/util'
import initMixin from './mixins/initData.mixin'
import keepMixin from '@mixins/keep.mixin'
import { cloneDeep } from 'lodash'
export default {
  name: 'CurvemanagementGrouping',
  components: {
    BeforeLineTitle,
    BaseForm,
    BaseTable
  },
  mixins: [keepMixin, initMixin],
  data() {
    return {
      setOptions: {},
      formData,
      columns,
      beforeLineTitle: '曲线分组查询',
      tableList: [],
      table: {
        currentPage: 1,
        total: 0,
        pageSize: 20
      },
      searchParams: {},
      tableLoading: false,
      curveTp: '',
      curveTpList: [],
      createrList: [],
      curveNameList: [],
      renderFromCopy: []
    }
  },
  mounted() {
    this.initDict()
  },
  methods: {
    initDict() {
      this.renderFromCopy = cloneDeep(renderFrom)
      this.$set(this.formData, 'renderFrom', this.renderFromCopy)
      service.getgroupQueryList().then(res => {
        if (res && res.status === 200) {
          const { curveTpList, curveNameList, createrList } = res.data
          this.curveTpList = curveTpList
          this.curveNameList = curveNameList
          this.createrList = createrList
        } // 曲线类型
      })
      servicerat.getBndCodeData().then(res => {
        if (res && res.status === 200) {
          this.$set(this.setOptions, 'bndCd', res.data)
          this.bndCd = [...res.data]
        }
      }) // 债券代码初始化数据
      servdeal.getIndustryList(globalDictMap('2060')[0].code).then(res => {
        if (res && res.status === 200) {
          this.$set(this.setOptions, 'objGICSIndustryNew', res.data)
        }
      }) // 新华内部行业
      servdeal.getIndustryList(globalDictMap('2060')[1].code).then(res => {
        if (res && res.status === 200) {
          this.$set(this.setOptions, 'objInnerIndustryNew', res.data)
        }
      }) // 新华GICS行业
      servdeal.getIndustryList(globalDictMap('2060')[2].code).then(res => {
        if (res && res.status === 200) {
          this.$set(this.setOptions, 'objSWIndustryNew', res.data)
        }
      }) // 申万行业
      servicerat.getOrgNamePageList({ pageNum: 1, pageSize: 6 }).then(res => {
        if (res && res.status === 200) {
          let { list, total } = res.data
          this.$set(this.setOptions, 'orgList', list)
          const index = this.formData.renderFrom.findIndex(item => item.key === 'orgList')
          this.formData.renderFrom[index].getPageInfo.total = total
          this.initOrg = { list, total, index }
        }
      }) // 主体名称初始化
      servicerat.getBndNamePageList({ pageNum: 1, pageSize: 6 }).then(res => {
        if (res && res.status === 200) {
          let { list, total } = res.data
          this.$set(this.setOptions, 'bndAbbrNm', list)
          const index = this.formData.renderFrom.findIndex(item => item.key === 'bndAbbrNm')
          this.formData.renderFrom[index].getPageInfo.total = total
          this.initBnd = { list, total, index }
        }
      }) // 债券简称列表
    },
    onTrigger(val, rowItem) {
      if (rowItem.label === '曲线类型') {
        val.creater = []
      }
      val.curveName = []
      const { curveTp, creater } = val
      this.curveTp = curveTp
      service
        .getgroupQueryList({
          curveTp: curveTp,
          creater: creater,
          type: curveTp === '0' ? 'CREATER' : 'CREATER'
        })
        .then(res => {
          if (res && res.status === 200) {
            const { curveNameList, createrList } = res.data
            this.curveNameList = curveNameList
            this.createrList = createrList
          }
        })
    },
    getQueryForm(formData) {
      this.searchParams = { ...formData, curveTp: this.curveTp === '' ? [] : [this.curveTp] }
      this.table = {
        currentPage: 1,
        total: 0,
        pageSize: 20
      }
      this.queryForm()
    },
    queryForm() {
      const params = {
        pageNum: this.table.currentPage,
        pageSize: this.table.pageSize,
        ...removeNullInObject(this.searchParams)
      }
      if (params.orgList && params.orgList.length === 1) {
        if (this.setOptions.orgList.length === 0) {
          params.blurryObjName = params.orgList
          params.blurryObjName = params.blurryObjName.join('')
          delete params.orgList
        }
      }
      if (params.bndAbbrNm && params.bndAbbrNm.length === 1) {
        if (this.setOptions.bndAbbrNm.length === 0) {
          params.blurryBndName = params.bndAbbrNm
          params.blurryBndName = params.blurryBndName.join('')
          delete params.bndAbbrNm
        }
      }
      this.tableLoading = true
      service
        .getgroupQuery(params)
        .then(res => {
          if (res && res.status === 200) {
            const { list, total } = res.data
            this.tableList = list
            this.table.total = total
            this.tableLoading = false
          } else {
            this.tableLoading = false
          }
        })
        .catch(() => {
          this.tableLoading = false
        })
    },
    download() {
      if (this.tableList.length < 1) {
        this.$message.warning('暂无数据导出')
        return
      }
      baseDownLoad(service.getgroupOutExcel, this.searchParams, this.table.total)
    },
    handleSize(val) {
      this.table.pageSize = val
      this.table.currentPage = 1
      this.queryForm()
    },
    handleCurrent(val) {
      this.table.currentPage = val
      this.queryForm()
    },
    resetForm(val) {
      this.formData.initData = val
      this.searchParams = {}
      this.resetSelect('orgList')
      this.resetSelect('bndAbbrNm')
    }
  }
}
</script>
<style lang="scss" scoped>
.configMain {
  background-color: $color-body-bg;

  .bodyWrap {
    background-color: #fff;
  }
}
</style>
