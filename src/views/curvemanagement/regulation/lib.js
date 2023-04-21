export const headerList = [
  {
    label: '序号',
    align: 'center',
    render: (h, record) => {
      return h('span', record.$index + 1)
    },
    width: 50
  },
  {
    label: '曲线名称',
    prop: 'curveName',
    align: 'center',
    width: 100
  },
  {
    label: '曲线创建人',
    prop: 'creater',
    align: 'center',
    width: 100
  },
  {
    label: '创建日期',
    prop: 'createTime',
    align: 'center',
    width: 125
  },
  {
    label: '最近修改日期',
    prop: 'modifieTime',
    align: 'center',
    width: 130
  },
  {
    label: '最近拟合起始时间',
    prop: 'startFitDate',
    align: 'center',
    width: 125
  },
  {
    label: '最近拟合结束时间',
    prop: 'endFitDate',
    align: 'center',
    width: 125
  },
  {
    label: '是否每日计算',
    prop: 'isDailyCal',
    align: 'center',
    width: 125,
    render: function(h, { record }) {
      // let _self = this;
      return (
        <div>
          <el-switch v-model="value" active-color="#13ce66" inactive-color="#ff4949" />
          {/* <span class="blueBar" />
          <span>
            <table-row-delete-confirm
              style={'margin-left:1px'}
              onConfirm={() => _self.handleCheckRemove(record)}
            />
          </span> */}
        </div>
      )
    }
  },
  {
    label: '曲线类型',
    prop: 'curveRuleTp',
    align: 'center',
    width: 100
  },
  {
    label: '曲线ID',
    prop: 'curveId',
    align: 'center',
    width: 100
  },
  {
    label: '操作',
    prop: '',
    'header-align': 'center',
    width: 200,
    align: 'center',
    render: (h, { record }) => {
      let _self = this
      return (
        <div>
          <el-button type="text" onClick={() => _self.editFileCheck(record)}>
            详情
          </el-button>
          <el-button type="text" onClick={() => _self.editFileCheck(record)}>
            删除
          </el-button>
          <el-button
            type="text"
            onClick={() => {
              _self.qwe()
            }}
          >
            发起计算
          </el-button>
          {/* <span class="blueBar" />
          <span>
            <table-row-delete-confirm
              style={'margin-left:1px'}
              onConfirm={() => _self.handleCheckRemove(record)}
            />
          </span> */}
        </div>
      )
    }
  }
]

// 拟合结果的数据
export const fittingList = [
  {
    type: 'selection',
    align: 'center'
  },
  {
    label: '序号',
    align: 'center',
    render: (h, record) => {
      return h('span', record.$index + 1)
    },
    width: 50
  },
  {
    label: '开始日期',
    prop: 'curveName',
    align: 'center',
    width: 100
  },
  {
    label: '结束日期',
    prop: 'creater',
    align: 'center',
    width: 100
  },
  {
    label: '拟合结果',
    prop: 'createTime',
    align: 'center',
    width: 125
  },
  {
    label: '操作',
    prop: '',
    'header-align': 'center',
    width: 200,
    align: 'center',
    render: function(h, { record }) {
      let _self = this
      return (
        <div>
          <el-button type="text" onClick={() => _self.editFileCheck(record)}>
            详情
          </el-button>
          <el-button type="text" onClick={() => _self.editFileCheck(record)}>
            删除
          </el-button>
          <el-button
            type="text"
            onClick={() => {
              _self.$emit('asd', record)
              // _self.editFileCheck(record);
            }}
          >
            发起计算
          </el-button>
          <span class="blueBar" />
          {/* <span>
            <table-row-delete-confirm
              style={'margin-left:1px'}
              onConfirm={() => _self.handleCheckRemove(record)}
            />
          </span> */}
        </div>
      )
    }
  }
]
export const increase = [
  {
    label: '开始日期',
    prop: 'curveName',
    align: 'center',
    width: 100
  },
  {
    label: '操作',
    prop: '',
    'header-align': 'center',
    width: 200,
    align: 'center',
    render: function(h, { record }) {
      let _self = this
      return (
        <div>
          <el-button
            type="text"
            onClick={() => {
              _self.editFileCheck(record)
            }}
          >
            发起计算
          </el-button>
          <span class="blueBar" />
          {/* <span>
            <table-row-delete-confirm
              style={'margin-left:1px'}
              onConfirm={() => _self.handleCheckRemove(record)}
            />
          </span> */}
        </div>
      )
    }
  }
]
