<template>
  <div>
    <Sizer
      is-show-sizer
      :btn-name="'选择主体'"
      :is-show-transfer="false"
      :btn-icon="'el-icon-plus'"
      :sizers="mainSizers"
      :label-width="'100px'"
      :dialog-title="'主体选择器'"
      :sizer-form="mainSizerForm"
      :shuttle-data="shuttleData"
      :check-data1="checkData"
      :add-curve-rule-list="addCurveRuleList"
      :del-curve-rule-list="delCurveRuleList"
      :main-btn="mainBtn"
      :total="total"
      @bizDateChange="mainBizDateChange"
      @handleSave="handleSave1"
      @getMainList="getMainList"
      @handleCurrentChange="handleCurrentChange"
      @getRemoteMethod="getRemoteMethod"
    >
      <template v-slot:footer="{ handleClose, handleSave }">
        <el-row>
          <el-col style="text-align: right">
            <el-button v-if="!mainBtn" type="primary" @click="handleSave">确定</el-button>
            <el-button @click="handleClose">取消</el-button>
          </el-col>
        </el-row>
      </template>
    </Sizer>
  </div>
</template>

<script>
import Sizer from './sizer.vue'
import { getSubjNameList, getMainList } from '@api/bondYield'
import { getOrgAnalystList } from '@api/curveRoule'
import cloneDeep from 'lodash/cloneDeep'
export default {
  name: 'Aa',
  components: {
    Sizer
  },
  props: {
    addCurveRuleList: {
      type: Array,
      default: () => []
    },
    delCurveRuleList: {
      type: Array,
      default: () => []
    },
    mainBtn: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogVisible: false,
      mainSizers: [],
      mainSizerForm: {},
      // 列表主体
      checkList: [],
      // 列表数据
      checkData: [],
      // 添加的列表主体
      addCheckList: [],
      // 添加的列表数据:
      addCheckData: [],
      // 删除的列表主体，
      delCheckList: [],
      // 删除的列表数据
      delCheckData: [],
      // 主体名称
      getSubjNameList: [],
      // 新华GICS行业
      industryList: [],
      // 新华内部行业
      innerIndustryList: [],
      // 申万行业
      swIndustryList: [],
      // 主体分析师:
      orgAnalystList: [],
      // 验证规则
      rules: {
        bizDate: [{ required: true, message: '请选择开始日期', trigger: 'change' }],
        endDate: [{ required: true, message: '请选择结束日期', trigger: 'change' }],
        calType: [{ required: true, message: '请选择汇总或逐笔', trigger: 'change' }]
      },
      orjNameTotal: 0,
      // 主体列表控制全选反选
      isIndeterminate: false,
      // 搜索表单的数据
      state1: '',
      // 穿梭框数据
      shuttleData: [],
      // 删除的主体
      delMain: [],
      // 添加的主体
      addMain: [],
      time: '',
      total: 0,
      tabel: {
        pageNum: 1,
        pageSize: 100
      },
      // 主体名称关键值
      mainData: ''
    }
  },

  watch: {
    addCurveRuleList: {
      handler(val) {},
      deep: true
    }
  },
  methods: {
    // 1
    handleGetSubjNameList(params) {
      getSubjNameList({ bizDate: params }).then(res => {
        if (res && res.status === 200) {
          let { list, total } = res.data
          this.getSubjNameList = list
          this.orjNameTotal = total
        }
      })
    },
    mainBizDateChange(date) {
      this.time = date
      this.getOrgAnalystAPI()
    },
    // 清除数据
    clear() {
      this.mainSizerForm = {}
    },
    // 处理各种行业数据
    initOrgParams(data) {
      if (data && data.length) {
        const result = data.map(item => {
          return item[item.length - 1]
        })
        return result
      }
    },
    // 查询列表
    async inquire() {
      if (this.mainSizerForm.bizDate) {
        let newMainSizerForm = cloneDeep(this.mainSizerForm)
        let { gicsIndustryList, innerIndustryList, swIndustryList } = newMainSizerForm
        if (gicsIndustryList && gicsIndustryList.length > 0) {
          newMainSizerForm.gicsIndustryList = this.initOrgParams(gicsIndustryList)
        }
        if (innerIndustryList && innerIndustryList.length > 0) {
          newMainSizerForm.innerIndustryList = this.initOrgParams(innerIndustryList)
        }
        if (swIndustryList && swIndustryList.length > 0) {
          newMainSizerForm.swIndustryList = this.initOrgParams(swIndustryList)
        }
        const res = await getMainList({ ...newMainSizerForm, ...this.tabel })
        this.checkData = res.data.list
        this.total = res.data.total
      } else {
        this.$message.error('查询日期不能为空')
      }
    },
    handleSave1(add, del) {
      this.addMain = add
      this.delMain = del
      this.$emit('getMain', this.addMain, this.delMain)
    },
    // 获取主体分析师
    async getOrgAnalystAPI() {
      const res = await getOrgAnalystList()
      this.orgAnalystList = res.data
    },
    // 远程搜索   //未完待续
    async getMainList(val) {
      const { data, status } = await getSubjNameList({ bizDate: this.time, code: val })
      if (status === 200) {
        this.getSubjNameList = data.list
        this.orjNameTotal = data.total
      }
    },
    handleCurrentChange(val) {
      this.tabel.pageNum = val
      this.inquire()
    },
    async getRemoteMethod(val) {
      const { data } = await getSubjNameList({ bizDate: this.time, code: val })
      this.getSubjNameList = data.list
    }
  }
}
</script>
<style lang="scss">
.v-model {
  z-index: 1000;
}
</style>
