import { selectData } from '../libs/termData'
import { selectBndtData } from '@libs/selectBndtData.js'
import * as servdeal from '@api/bondYield'
import { removeNullInObject, initData } from '@utils/util'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      selectData: { ...selectData },
      selectBndtData: { ...selectBndtData },
      pickerOptions: {
        disabledDate: time => {
          return !this.ableDate.includes(this.$moment(time).format('YYYYMMDD'))
        }
      },
      dialogSearchParams: {},
      dialogSearchParamsBnd: {},
      pageNum: 1,
      pageSize: 6,
      queryVal: '',
      bizDate: '',
      listLoading: false,
      initOrg: {
        list: [],
        total: 0,
        index: 0
      },
      initBnd: {}
    }
  },
  computed: {
    ...mapGetters({ ableDate: 'ableDate' })
  },
  mounted() {
    this.initDict()
  },
  methods: {
    // 获取行业
    getIndustry(params) {
      return servdeal.getIndustryList(params)
    },
    // 穿梭框 - 右侧输入框双击 给数据重新赋值
    getResult(data) {
      this.selectData.selectedData = data
    },
    // 获取左侧穿梭框数据
    getTransferData(data, pageNum) {
      this.dialogSearchParams = removeNullInObject(data)
      this.dialogSearchParams.pageNum = pageNum || 1
      let params = { ...this.dialogSearchParams }

      if (params.orgList && params.orgList.length === 1) {
        if (this.selectData.setOptions.orgList.length === 0) {
          params.boxCode = params.orgList.join('')
          delete params.orgList
        }
      }
      this.$refs.customTransfer.listLoading = true
      servdeal
        .getMainList(params)
        .then(res => {
          this.$refs.customTransfer.listLoading = false
          if (res && res.status === 200) {
            let { list, total } = res.data
            this.selectData.transferData = list
            this.selectData.total = total
          }
        })
        .catch(() => {
          this.$refs.customTransfer.listLoading = false
        })
    },
    handleCurrentChange(val) {
      this.getTransferData(this.dialogSearchParams, val)
    },
    searchInputLeft(val) {
      if (Object.keys(this.dialogSearchParams).length < 1) return
      this.dialogSearchParams.code = val
      this.$refs.customTransfer.listLoading = true
      servdeal
        .getMainList(this.dialogSearchParams)
        .then(res => {
          this.$refs.customTransfer.listLoading = false
          if (res && res.status === 200) {
            let { list, total } = res.data
            this.selectData.transferData = list
            this.selectData.total = total
          }
        })
        .catch(() => {
          this.$refs.customTransfer.listLoading = false
        })
    },
    importDialogSure(val) {
      const date =
        Object.values(this.dialogSearchParams).length > 0
          ? this.dialogSearchParams.bizDate
          : removeNullInObject(this.selectData.formData.initData).bizDate
      const params = {
        bizDate: date,
        orgList: val
      }
      this.getTransferData(params, 1)
    },
    importDialogSureBnd(val) {
      const date =
        Object.values(this.dialogSearchParamsBnd).length > 0
          ? this.dialogSearchParamsBnd.bizDate
          : removeNullInObject(this.selectBndtData.formData.initData).bizDate
      const params = {
        bizDate: date,
        bndCodeList: val
      }
      this.getBndTransferData(params)
    },
    initSelect(type) {
      const dateOrg =
        Object.values(this.dialogSearchParams).length > 0
          ? this.dialogSearchParams.bizDate
          : removeNullInObject(this.selectData.formData.initData).bizDate
      const dateBnd =
        Object.values(this.dialogSearchParamsBnd).length > 0
          ? this.dialogSearchParamsBnd.bizDate
          : removeNullInObject(this.selectBndtData.formData.initData).bizDate
      const paramsOrg = { bizDate: dateOrg }
      const paramsBnd = { bizDate: dateBnd }
      const bndPara = this.selectBndtData.formData.renderFrom
      if (type !== 'org') {
        this.bizDate = dateBnd
        paramsBnd.pageNum = 1
        paramsBnd.pageSize = 6
        servdeal.getBondCode(paramsBnd).then(res => {
          if (res) {
            let { list, total } = res.data
            const index = this.findIndex(bndPara, 'bndCodeList')
            this.$set(this.selectBndtData.setOptions, 'bndCodeList', list)
            this.$set(this.initBnd, 'bndCodeList', { list, total, index })
            bndPara[index].getPageInfo.total = total
            bndPara[index].getPageInfo.pageNum = 1
          }
        })
        servdeal.getBondShortList(paramsBnd).then(res => {
          if (res) {
            let { list, total } = res.data
            const index = this.findIndex(bndPara, 'bndAttrList')
            this.$set(this.selectBndtData.setOptions, 'bndAttrList', list)
            this.$set(this.initBnd, 'bndAttrList', { list, total, index })
            bndPara[index].getPageInfo.total = total
            bndPara[index].getPageInfo.pageNum = 1
          }
        })
        servdeal.getSubjNameList(paramsBnd).then(res => {
          if (res) {
            let { list, total } = res.data
            const index = this.findIndex(bndPara, 'orgList')
            this.$set(this.selectBndtData.setOptions, 'orgList', list)
            this.$set(this.initBnd, 'orgList', { list, total, index })
            bndPara[index].getPageInfo.total = total
            bndPara[index].getPageInfo.pageNum = 1
          }
        })
        // 所属曲线
        servdeal.getCurveNameList(dateBnd).then(res => {
          if (res && res.status === 200) {
            let { data } = res
            this.$set(this.selectBndtData.setOptions, 'curveList', data)
          }
        })
      } else {
        this.bizDate = dateOrg
        paramsOrg.pageNum = 1
        paramsOrg.pageSize = 6
        servdeal.getSubjNameList(paramsOrg).then(res => {
          if (res && res.status === 200) {
            let { list, total } = res.data
            this.$set(this.selectData.setOptions, 'orgList', list)
            const index = this.selectData.formData.renderFrom.findIndex(
              item => item.key === 'orgList'
            )
            this.selectData.formData.renderFrom[index].getPageInfo.total = total
            this.selectData.formData.renderFrom[index].getPageInfo.pageNum = 1
            this.initOrg = {
              list,
              total,
              index
            }
          }
        })
      }
    },
    initDict() {
      let params = this.globalDictMap(2060).map(item => {
        return item.code
      })
      // 申万行业
      this.getIndustry(params[2]).then(res => {
        if (res && res.status === 200) {
          this.$set(this.selectData.setOptions, 'swIndustryList', res.data)
        }
      })
      // 新华内部行业
      this.getIndustry(params[1]).then(res => {
        this.$set(this.selectData.setOptions, 'innerIndustryList', res.data)
      })
      // 新华GICS行业
      this.getIndustry(params[0]).then(res => {
        this.$set(this.selectData.setOptions, 'gicsIndustryList', res.data)
      })
      // 主体所属分析师
      servdeal.getOrgAnalystList(params).then(res => {
        this.$set(this.selectData.setOptions, 'orgAnalystList', res.data)
      })
      // 主体分析 2级
      servdeal.getOrgMuniRregionlist().then(res => {
        this.$set(this.selectData.setOptions, 'orgMuniRregionlist', res.data)
      })
      // 主体分析 2级
      servdeal.getOrgRregionList().then(res => {
        this.$set(this.selectData.setOptions, 'orgRregionList', res.data)
      })
    },
    // 主体选择器中 form表单中某些项更改，触发trigger
    selectTrigger(formData, item) {
      this.$set(this.selectData.formData, 'initData', formData)
      if (item.key === 'orgList') {
        this.getItemRemoteMethod()
      }
    },
    // 选择器中 form表单 select远程搜索
    getItemRemoteMethod(val, item) {
      this.queryVal = val
      let { initData } = this.selectData.formData
      if (!initData.bizDate) {
        this.$message.warning('请先选择日期')
        return
      }
      if (item.key === 'orgList') {
        this.bizDate = initData.bizDate
        this.getDataList(val, initData.bizDate, item.key)
      } else {
        this.queryVal = ''
      }
    },
    // 获取模糊查询数据
    getDataList(val, bizDate, key) {
      let params = {}
      params.bizDate = bizDate
      params.code = val
      params.pageNum = this.pageNum
      params.pageSize = this.pageSize
      const index = this.findIndex(this.selectData.formData.renderFrom, key)
      const el = this.selectData.formData.renderFrom[index]
      el.loading = true
      servdeal.getSubjNameList(params).then(res => {
        this.loading = false
        if (res) {
          let { list, total } = res.data
          this.$set(this.selectData.setOptions, 'orgList', list)
          el.getPageInfo.total = total
          el.loading = false
        }
      })
    },
    getDataListBnd(val, bizDate, key) {
      let params = { bizDate: bizDate, code: val, pageNum: this.pageNum, pageSize: this.pageSize }
      if (key === 'orgList') {
        const index = this.findIndex(this.selectBndtData.formData.renderFrom, 'orgList')
        const el = this.selectBndtData.formData.renderFrom[index]
        el.loading = true
        servdeal.getSubjNameList(params).then(res => {
          if (res) {
            let { list, total } = res.data
            this.$set(this.selectBndtData.setOptions, 'orgList', list)
            this.selectBndtData.formData.renderFrom.forEach(item => {
              if (item.key === key) {
                item.getPageInfo.total = total
                item.loading = false
              }
            })
          }
        })
      } else if (key === 'bndAttrList') {
        const index = this.findIndex(this.selectBndtData.formData.renderFrom, 'bndAttrList')
        const el = this.selectBndtData.formData.renderFrom[index]
        el.loading = true
        servdeal.getBondShortList(params).then(res => {
          if (res && res.status === 200) {
            let { list, total } = res.data
            this.$set(this.selectBndtData.setOptions, 'bndAttrList', list)
            this.selectBndtData.formData.renderFrom.forEach(item => {
              if (item.key === key) {
                item.getPageInfo.total = total
                el.loading = false
              }
            })
          }
        })
      } else if (key === 'bndCodeList') {
        const index = this.findIndex(this.selectBndtData.formData.renderFrom, 'bndCodeList')
        const el = this.selectBndtData.formData.renderFrom[index]
        el.loading = true
        servdeal.getBondCode(params).then(res => {
          if (res && res.status === 200) {
            let { list, total } = res.data
            this.$set(this.selectBndtData.setOptions, 'bndCodeList', list)
            this.selectBndtData.formData.renderFrom.forEach(item => {
              if (item.key === key) {
                item.getPageInfo.total = total
                el.loading = false
              }
            })
          }
        })
      }
    },
    // 债券选择器中 form表单中某些项更改，触发trigger
    selectBndTrigger(initData, item) {
      this.$set(this.selectBndtData.formData, 'initData', initData)
      const { key } = item
      this.getBndItemRemoteMethod(initData[key], item)
    },
    getBndItemRemoteMethod(val, item) {
      this.queryVal = val
      const { key } = item
      if (!(!val || val === null || val === undefined || Array.isArray(val))) {
        let { initData } = this.selectBndtData.formData
        if (!initData.bizDate) {
          this.$message.warning('请先选择日期')
          return
        }
        if (key === 'orgList' || key === 'bndCodeList' || key === 'bndAttrList') {
          this.bizDate = initData.bizDate
          this.getDataListBnd(val, initData.bizDate, key)
        } else {
          this.queryVal = ''
        }
      }
    },
    handleBndCurrentChange(val) {
      this.getBndTransferData(this.dialogSearchParamsBnd, val)
    },
    searchBndInputLeft(val) {
      if (Object.keys(this.dialogSearchParamsBnd).length < 1) return
      this.dialogSearchParamsBnd.code = val
      this.$refs.customTransferBnd.listLoading = true
      servdeal
        .getBondList(this.dialogSearchParamsBnd)
        .then(res => {
          this.$refs.customTransferBnd.listLoading = false
          if (res && res.status === 200) {
            let { list, total } = res.data
            this.selectBndtData.transferData = list
            this.selectBndtData.total = total
          }
        })
        .catch(() => {
          this.$refs.customTransferBnd.listLoading = false
        })
    },
    getBndTransferData(initData, pageNum) {
      this.dialogSearchParamsBnd = removeNullInObject(initData)
      const {
        issueRateBegNum,
        issueRateEndNum,
        issueScaleBegNum,
        issueScaleEndNum,
        remainPeriodBegNum,
        remainPeriodEndNum,
        remainScaleBegNum,
        remainScaleEndNum
      } = this.dialogSearchParamsBnd
      if (
        Number(issueRateEndNum) < Number(issueRateBegNum) ||
        Number(issueScaleEndNum) < Number(issueScaleBegNum) ||
        Number(remainPeriodEndNum) < Number(remainPeriodBegNum) ||
        Number(remainScaleEndNum) < Number(remainScaleBegNum)
      ) {
        return this.$message.warning('查询条件的结束值不能小于开始值')
      }
      this.dialogSearchParamsBnd.pageNum = pageNum || 1
      let params = { ...this.dialogSearchParamsBnd }
      const { orgList, bndCodeList, bndAttrList } = params
      if (
        (orgList && orgList.length === 1) ||
        (bndCodeList && bndCodeList.length === 1) ||
        (bndAttrList && bndAttrList.length === 1)
      ) {
        if (this.selectBndtData.setOptions.orgList.length === 0) {
          if (Array.isArray(params.orgList)) {
            params.orgBox = params.orgList.join('')
            delete params.orgList
          }
        }
        if (this.selectBndtData.setOptions.bndCodeList.length === 0) {
          if (Array.isArray(params.bndCodeList)) {
            params.windBox = params.bndCodeList.join('')
            delete params.bndCodeList
          }
        }
        if (this.selectBndtData.setOptions.bndAttrList.length === 0) {
          if (Array.isArray(params.bndAttrList)) {
            params.nameBox = params.bndAttrList.join('')
            delete params.bndAttrList
          }
        }
      }
      this.$refs.customTransferBnd.listLoading = true
      servdeal
        .getBondList(params)
        .then(res => {
          this.$refs.customTransferBnd.listLoading = false
          if (res && res.status === 200) {
            let { list, total } = res.data
            this.selectBndtData.transferData = list
            this.selectBndtData.total = total
          }
        })
        .catch(() => {
          this.$refs.customTransferBnd.listLoading = false
        })
    },
    handleCurrentChangeOrg(val) {
      this.pageNum = val
      this.getDataList(this.queryVal, this.bizDate)
    },
    handleCurrentChangeBnd(val, item) {
      const { key } = item
      this.pageNum = val
      this.getDataListBnd(this.queryVal, this.bizDate, key)
    },
    blurValue(initData, item) {
      let current = initData[item.key]
      if ((current === undefined || current === '' || current.length === 0) && this.queryVal) {
        initData[item.key] = [this.queryVal]
        this.selectData.setOptions[item.key] = []
        const object = this.selectData.formData.renderFrom
        const index = this.findIndex(object, item.key)
        object[index].getPageInfo.pageNum = 1
        this.pageNum = 1
      }
      this.queryVal = ''
    },
    blurValueBnd(initData, item) {
      const { key } = item
      let current = initData[key]
      if ((current === undefined || current === '' || current.length === 0) && this.queryVal) {
        initData[key] = [this.queryVal]
        this.selectBndtData.setOptions[key] = []
        const object = this.selectBndtData.formData.renderFrom
        const index = this.findIndex(object, key)
        object[index].getPageInfo.pageNum = 1
        this.pageNum = 1
      }
      this.queryVal = ''
    },
    selectPageChange(val, data, item) {
      const { key } = item
      if (val && val.length === 0) {
        const { list, total, index } = this.initOrg
        this.$set(this.selectData.setOptions, key, list)
        this.selectData.formData.renderFrom[index].getPageInfo.total = total
        this.selectData.formData.renderFrom[index].getPageInfo.pageNum = 1
      }
    },
    selectPageChangeBnd(val, data, item) {
      const { key } = item
      if (val.length === 0) {
        const { list, total, index } = this.initBnd[key]
        this.$set(this.selectBndtData.setOptions, key, list)
        this.selectBndtData.formData.renderFrom[index].getPageInfo.total = total
        this.selectBndtData.formData.renderFrom[index].getPageInfo.pageNum = 1
      }
    },
    findIndex(object, key) {
      const index = object.findIndex(item => item.key === key)
      return index
    }
  },
  beforeDestroy() {
    // 将主体选择器中 form表单内容清空
    this.$set(this.selectData.formData, 'initData', initData(this.selectData.formData.renderFrom))
    // 将债券选择器中 form表单内容清空
    this.$set(
      this.selectBndtData.formData,
      'initData',
      initData(this.selectBndtData.formData.renderFrom)
    )
  }
}
