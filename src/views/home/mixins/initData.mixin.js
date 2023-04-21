import * as service from '@api/home'

export default {
  data() {
    return {
      setOptions: {},
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
      bndCd: []
    }
  },
  methods: {
    // 主体选择器中 form表单中某些项更改，触发trigger
    trigger(initData, item) {
      this.getRemoteMethod(initData[item.key], item)
    },
    // 选择器中 form表单 select远程搜索
    getRemoteMethod(val, item) {
      const { key } = item
      if (!(!val || val === null || val === undefined || Array.isArray(val))) {
        if (key === 'bndCd') {
          service.getBndCodeList(val).then(res => this.$set(this.setOptions, 'bndCd', res.data))
        }
      }
      this.queryVal = val
      if (key === 'objName') {
        const index = this.formData.renderFrom.findIndex(i => i.key === 'objName')
        this.formData.renderFrom[index].getPageInfo.pageNum = 1
        this.pageNum = 1
      } else if (key === 'bndAbbrNm') {
        const index = this.formData.renderFrom.findIndex(i => i.key === 'bndAbbrNm')
        this.formData.renderFrom[index].getPageInfo.pageNum = 1
        this.pageBndNum = 1
      } else {
        this.queryVal = ''
      }
      this.getDataList(val, key)
    },
    selectVisible (initData, item, val) {
      let { type, remote, key } = item
      if (val && remote && type === 'Select') {
        if (key === 'bndCd') {
          this.setOptions = { bndCd: this.bndCd }
        }
      }
    },
    // 曲线名称
    getCurveNameList() {
      service.getCurveNameList().then(res => {
        if (res) {
          this.$set(this.setOptions, 'curveName', res.data)
        }
      })
    },
    // 批次号
    getRatingNowBatchNum() {
      service.getRatingNowBatchNum().then(res => {
        if (res) {
          this.$set(this.setOptions, 'batchNums', res.data)
        }
      })
    },
    handlerReset(data, type = '', isAdmin) {
      this.$confirm(`是否确认${type}撤销?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.listLoading = true
        if (type !== '') {
          let revokeId = Object.values(this.checkedMap).flat()
          let params = {
            ...this.searchParams,
            isAdmin,
            selectAll: this.checkall ? 1 : 0
          }
          if (!this.checkall) {
            params.revokeId = revokeId
          }
          service.resetQuickRatingBatch(params).then(res => {
            this.listLoading = false
            if (res.status === 200) {
              this.query()
              this.$nextTick(() => {
                this.$refs.baseTable.$refs.commonTable &&
                  this.$refs.baseTable.$refs.commonTable.doLayout()
              })
              this.checkall = false
              this.$message({
                type: 'success',
                message: '撤销成功!'
              })
            }
          })
        } else {
          const roleName = JSON.parse(sessionStorage.getItem('NCAM')).user.roleName
          service.resetQuickRating(data, roleName).then(res => {
            this.listLoading = false
            if (res.status === 200) {
              this.query()
              this.$message({
                type: 'success',
                message: '撤销成功!'
              })
            }
          })
        }
      })
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
      if (key === 'objName') {
        service.getOrgNameList(val, this.pageNum, this.pageSize).then(res => {
          if (res) {
            let { list, total } = res.data
            this.$set(this.setOptions, 'objName', list)
            const index = this.formData.renderFrom.findIndex(item => item.key === 'objName')
            this.formData.renderFrom[index].getPageInfo.total = total
          }
        })
      } else if (key === 'bndAbbrNm') {
        service.getBndNameList(val, this.pageBndNum, this.pageBndSize).then(res => {
          if (res) {
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
      if (val.length === 0) {
        const { list, total, index } = key === 'objName' ? this.initOrg : this.initBnd
        this.$set(this.setOptions, key, list)
        this.formData.renderFrom[index].getPageInfo.total = total
        this.formData.renderFrom[index].getPageInfo.pageNum = 1
      }
    }
  }
}
