import * as service from '@api/valuation/standard.js'
import * as serviceCustom from '@api/valuation/custom.js'
import { tabData } from '../standard/singleSubject/libs/data'
import { formData } from '@/src/libs/selectBndFormData'
export default {
  data() {
    return {
      path: this.$route.path,
      formInitData: {},
      isCurveBnd: true,
      curveId: [],
      bndCode: [],
      bndName: [],
      orgCd: []
    }
  },
  mounted() {
    this.initDict() // 初始化函数
  },
  activated() {
    this.initDict()
  },
  methods: {
    // form表单中某些项更改，触发trigger
    trigger(initData, item) {
      this.formInitData = initData
      const { key } = item
      if (initData.orgCd && key === 'orgCd' && this.path.includes('single-subject')) {
        const params = {
          orgCd: initData.orgCd
        }
        service.getClusterInfo(params).then(res => {
          if (res && res.status === 200) {
            this.setOptions = { clusterCd: [res.data] }
            initData['clusterCd'] = res.data.code
          }
        })
      } else if (key === 'rateOrInterMargin' && this.path.includes('single-subject')) {
        // 单一主体页面利率走势分析，收益率与利差，利差tab没有散点数据
        this.tabData = initData[key] === '1' ? tabData : tabData.filter(i => i.name !== 'Scatter')
      } else if (key === 'bizDt' && this.path.includes('custom')) {
        const { orgCd, bndCode, bndName } = this.outForm
        const params = {
          windCd: bndCode || bndName,
          orgCd,
          bizDt: this.formInitData.bizDt
        }
        if (initData[key]) {
          serviceCustom.getCurvTree(params).then(res => {
            if (res && res.status === 200) {
              this.setOptions = { curveId: res.data }
            }
          })
        }
      }
      this.getRemoteMethod(initData[key], item)
    },
    // form表单 select远程搜索
    getRemoteMethod(val, item) {
      const { key } = item
      if (!(!val || val === null || val === undefined || Array.isArray(val))) {
        const params = {
          code: val
        }
        if (key === 'orgCd') {
          service.getOrgCd(params).then(res => {
            if (res && res.status === 200) {
              this.setOptions = { orgCd: res.data.list }
            }
          })
        } else if (key === 'windCd') {
          service.getBondCode(params).then(res => {
            if (res && res.status === 200) {
              this.setOptions = { windCd: res.data.list }
            }
          })
        }
      }
    },

    triggerCustom(initData, key) {
      this.getCustomRemoteMethod(initData[key], key)
      if (key === 'bndCode') {
        this.getCustomRemoteMethod(initData[key], 'bndName')
        initData['bndName'] = initData[key]
        if (this.path.includes('custom')) this.getClusteData(initData, key)
      } else if (key === 'bndName') {
        this.getCustomRemoteMethod(initData[key], 'bndCode')
        initData['bndCode'] = initData[key]
        if (this.path.includes('custom')) this.getClusteData(initData, key)
      } else if (key === 'orgCd') {
        if (this.path.includes('custom')) this.getClusteData(initData, key)
      }
    },
    getCustomRemoteMethod(val, key) {
      if (!(!val || val === null || val === undefined || Array.isArray(val))) {
        const params = {
          code: val
        }
        if (key === 'orgCd') {
          service.getOrgCd(params).then(res => {
            if (res && res.status === 200) {
              this.getObjNameList = res.data.list
            }
          })
        } else if (key === 'bndCode') {
          // 债券代码远程搜索
          service.getBondCodeList(params).then(res => {
            if (res && res.status === 200) this.getBndCodeList = res.data.list
          })
        } else if (key === 'bndName') {
          // 债券简称远程搜索
          service.getBondCode(params).then(res => {
            if (res && res.status === 200) this.getBndNameList = res.data.list
          })
        }
      }
    },
    getClusteData(initData, key) {
      const { orgCd, bndCode, bndName } = this.outForm
      const params = {
        windCd: bndCode || bndName,
        orgCd,
        bizDt: this.formInitData.bizDt || formData.initData.bizDate
      }
      if ((this.formInitData.bizDt !== undefined || formData.initData.bizDate) && initData[key]) {
        serviceCustom.getCurvTree(params).then(res => {
          if (res && res.status === 200) {
            this.setOptions = { curveId: res.data }
          }
        })
      }
    },
    initDict() {
      service.getOrgCd({}).then(res => {
        if (res && res.status === 200) {
          const { list } = res.data
          this.getObjNameList = list
          this.setOptions = { orgCd: list }
          this.orgCd = list
        }
      })
      service.getBondCodeList({}).then(res => {
        if (res && res.status === 200) {
          const { list } = res.data
          this.getBndCodeList = list
          this.bndCode = list
        }
      })
      service.getBondCode({}).then(res => {
        if (res && res.status === 200) {
          const { list } = res.data
          this.getBndNameList = list
          this.setOptions = { windCd: list }
          this.bndName = list
        }
      })
    },
    selectVisible(val, key) {
      if (val) {
        if (key === 'orgCd') {
          this.getObjNameList = this.orgCd
        } else if (key === 'bndName') {
          this.getBndNameList = this.bndName
        } else if (key === 'bndCode') {
          this.getBndCodeList = this.bndCode
        }
      }
    },
    baseSelectVisible(initData, item, val) {
      const { key } = item
      if (val) {
        if (key === 'windCd') {
          this.setOptions = { windCd: this.bndName }
        } else if (key === 'orgCd') {
          this.setOptions = { orgCd: this.orgCd }
        }
      }
    }
  }
}
