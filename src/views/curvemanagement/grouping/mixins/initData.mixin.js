import * as service from '@api/ratemanagement'
export default {
  data() {
    return {
      pageNum: 1,
      pageSize: 6,
      pageBndNum: 1,
      pageBndSize: 6,
      queryVal: '',
      bizDate: '',
      initOrg: {
        list: [],
        total: 0,
        index: 0
      },
      initBnd: {},
      bndCd: []
    }
  },
  mounted() {},
  methods: {
    // 主体选择器中 form表单中某些项更改，触发trigger
    getFilterMethod(val, item) {
      val = val.trim()
      let { remote, options, key } = item
      if (!remote) {
        if (val !== '') {
          let opt = options.filter(i => i.name.includes(val))
          this.setOptions = { [key]: options.length > 0 ? opt : [] }
        } else {
          this.setOptions = { [key]: this.copyOptions[key] }
          if (options.length !== this.copyOptions[key].length) {
            item.checked = false
          }
        }
      }
    },
    selectVisible(initData, item, val) {
      let { type, remote, key } = item
      if (val && remote && type === 'Select') {
        if (key === 'bndCd') {
          this.$set(this.setOptions, 'bndCd', this.bndCd)
        }
      }
    },
    trigger(initData, item) {
      let { key } = item
      this.getRemoteMethod(initData[key], item)
    },
    getRemoteMethod(val, item, initData) {
      const { key } = item
      if (!(!val || val === null || val === undefined || Array.isArray(val))) {
        if (key === 'bndCd') {
          service.getBndCodeSearchList(val).then(res => {
            if (res && res.status === 200) {
              this.$set(this.setOptions, 'bndCd', res.data)
            }
          }) // 债券代码
        }
      }
      this.queryVal = val
      if (key === 'orgList') {
        const index = this.formData.renderFrom.findIndex(item => item.key === 'orgList')
        this.formData.renderFrom[index].getPageInfo.pageNum = 1
        this.pageNum = 1
      } else if (key === 'bndAbbrNm') {
        const index = this.formData.renderFrom.findIndex(item => item.key === 'bndAbbrNm')
        this.formData.renderFrom[index].getPageInfo.pageNum = 1
        this.pageBndNum = 1
      } else {
        this.queryVal = ''
      }
      this.getDataList(val, item.key)
    },
    blurValue(initData, item) {
      let current = initData[item.key]
      if ((current === undefined || current === '' || current.length === 0) && this.queryVal) {
        initData[item.key] = [this.queryVal]
        this.setOptions[item.key] = []
      }
      this.queryVal = ''
    },
    handleCurrentChangeOrg(val, item) {
      if (item.key === 'orgList') {
        this.pageNum = val
      } else {
        this.pageBndNum = val
      }
      this.getDataList(this.queryVal, item.key)
    },
    // 获取模糊查询数据
    getDataList(val, key) {
      let params = {}
      params.name = val
      if (key === 'orgList') {
        params.pageNum = this.pageNum
        params.pageSize = this.pageSize
        service.getOrgNamePageList(params).then(res => {
          if (res && res.status === 200) {
            let { list, total } = res.data
            this.$set(this.setOptions, 'orgList', list)
            const index = this.formData.renderFrom.findIndex(item => item.key === 'orgList')
            this.formData.renderFrom[index].getPageInfo.total = total
          }
        })
      } else if (key === 'bndAbbrNm') {
        params.pageNum = this.pageBndNum
        params.pageSize = this.pageBndSize
        service.getBndNamePageList(params).then(res => {
          if (res && res.status === 200) {
            let { list, total } = res.data
            this.$set(this.setOptions, 'bndAbbrNm', list)
            const index = this.formData.renderFrom.findIndex(item => item.key === 'bndAbbrNm')
            this.formData.renderFrom[index].getPageInfo.total = total
          }
        })
      }
    },
    selectPageChange(val, data, item) {
      const { key } = item
      if (val && val.length === 0) {
        const { list, total, index } = key === 'orgList' ? this.initOrg : this.initBnd
        this.$set(this.setOptions, key, list)
        this.formData.renderFrom[index].getPageInfo.total = total
        this.formData.renderFrom[index].getPageInfo.pageNum = 1
      }
    },
    resetSelect(key) {
      const { list, total, index } = key === 'orgList' ? this.initOrg : this.initBnd
      this.$set(this.setOptions, key, list)
      this.formData.renderFrom[index].getPageInfo.total = total
      this.formData.renderFrom[index].getPageInfo.pageNum = 1
    }
  }
}
