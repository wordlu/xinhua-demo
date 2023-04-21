import * as service from '@api/ratemanagement'
export default {
  data() {
    return {
      pageNum: 1,
      pageSize: 6,
      pageBndNum: 1,
      pageBndSize: 6,
      queryVal: '',
      initOrg: {
        list: [],
        total: 0,
        index: 0
      },
      initBnd: {},
      bndCode: []
    }
  },
  mounted() {},
  methods: {
    // 主体选择器中 form表单中某些项更改，触发trigger
    getFilterMethod(val, item) {
      let { remote, options, key } = item
      if (!remote) {
        if (val !== '') {
          item.optionsHasSelectAll = false
          let opt = this.copyOptions[key].filter(i => i.name.includes(val))
          this.$set(this.setOptions, key, opt)
        } else {
          item.optionsHasSelectAll = true
          this.$set(this.setOptions, key, this.copyOptions[key])
          if (options.length !== this.copyOptions[key].length) {
            item.checked = false
          }
        }
      }
    },
    trigger(initData, item) {
      let { key } = item
      this.getRemoteMethod(initData[key], item)
    },
    selectVisible(initData, item, val) {
      // 下拉框触发时，如果options没有数据或者与原始数据不一致的时候，给下拉框附上原始数据
      let { type, remote, key, options, multiple, optionsHasSelectAll } = item
      if (val && type === 'Select' && !remote && multiple && this.copyOptions[key]) {
        // trigger方法 select 有输入值的时候，以及不是远程搜索，以及不为多选
        const hasOptions = !options || options.length < 1
        const optionsQuiteCopyOptions =
          !hasOptions && options.length !== this.copyOptions[key].length
        if (optionsQuiteCopyOptions || hasOptions) {
          this.$set(this.setOptions, key, this.copyOptions[key])
        }
        if (options.length !== this.copyOptions[key].length) {
          item.checked = false
        }
      } else {
        if (val) {
          if (key === 'bndCode') {
            this.$set(this.setOptions, 'bndCode', this.bndCode)
          }
        }
      }
      if (optionsHasSelectAll !== undefined) {
        item.optionsHasSelectAll = true
      }
    },
    getRemoteMethod(val, item, initData) {
      const { key } = item
      if (!(!val || val === null || val === undefined || Array.isArray(val))) {
        if (key === 'bndCode') {
          // 债券代码远程搜索
          service.getBndCodeSearchList(val).then(res => {
            if (res && res.status === 200) this.$set(this.setOptions, 'bndCode', res.data)
          })
        }
      }
      this.queryVal = val
      if (key === 'objName') {
        const index = this.formData.renderFrom.findIndex(i => i.key === 'objName')
        this.formData.renderFrom[index].getPageInfo.pageNum = 1
        this.formData.renderFrom[index].showPagination = true
        this.pageNum = 1
      } else if (key === 'bndName') {
        const index = this.formData.renderFrom.findIndex(i => i.key === 'bndName')
        this.formData.renderFrom[index].getPageInfo.pageNum = 1
        this.formData.renderFrom[index].showPagination = true
        this.pageBndNum = 1
      } else {
        this.queryVal = ''
      }
      this.getDataList(val, key)
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
      if (item.key === 'objName') {
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
      if (key === 'objName') {
        params.pageNum = this.pageNum
        params.pageSize = this.pageSize
        service.getOrgNamePageList(params).then(res => {
          if (res) {
            let { list, total } = res.data
            this.$set(this.setOptions, 'objName', list)
            const index = this.formData.renderFrom.findIndex(item => item.key === 'objName')
            this.formData.renderFrom[index].getPageInfo.total = total
          }
        })
      } else if (key === 'bndName') {
        params.pageNum = this.pageBndNum
        params.pageSize = this.pageBndSize
        service.getBndNamePageList(params).then(res => {
          if (res) {
            let { list, total } = res.data
            this.$set(this.setOptions, 'bndName', list)
            const index = this.formData.renderFrom.findIndex(item => item.key === 'bndName')
            this.formData.renderFrom[index].getPageInfo.total = total
          }
        })
      }
    },
    selectPageChange(val, data, item) {
      const { key } = item
      if (val && val.length === 0) {
        const { list, total, index } = key === 'objName' ? this.initOrg : this.initBnd
        this.$set(this.setOptions, key, list)
        this.formData.renderFrom[index].getPageInfo.total = total
        this.formData.renderFrom[index].getPageInfo.pageNum = 1
        this.formData.renderFrom[index].showPagination = true
      }
    },
    resetSelect (key) {
      const { list, total, index } = key === 'objName' ? this.initOrg : this.initBnd
      this.$set(this.setOptions, key, list)
      this.formData.renderFrom[index].getPageInfo.total = total
      this.formData.renderFrom[index].getPageInfo.pageNum = 1
    }
  }
}
