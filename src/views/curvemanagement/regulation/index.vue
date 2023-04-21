<template>
  <div class="configMain">
    <el-container direction="vertical" class="bodyWrap">
      <top-title :title="'曲线规则查询与曲线配置'"></top-title>
      <!-- form表单 -->
      <div class="form">
        <el-form class="demo-form-inline" :inline="true">
          <el-form-item label=" 曲线类型：">
            <el-select
              v-model="formData.curveType"
              collapse-tags
              placeholder="请输入"
              filterable
              clearable
            >
              <el-option
                v-for="(item, index) in curveType"
                :key="index"
                :label="item.name"
                :value="item.code"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="曲线创建人：">
            <el-select
              v-model="formData.curveCreatePrsnList"
              collapse-tags
              placeholder="请输入"
              multiple
              filterable
              :disabled="formData.curveType === '0'"
              clearable
            >
              <el-option
                v-for="(item, index) in curveCreatePrsnList"
                :key="index"
                :label="item.name"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="曲线名称：">
            <el-select
              v-model="formData.curveList"
              collapse-tags
              placeholder="请输入"
              multiple
              filterable
              clearable
            >
              <el-option
                v-for="(item, index) in curveName"
                :key="index"
                :label="item.name"
                :value="item.code"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button v-btnShow="inquire" type="primary" @click="query">查询</el-button>
            <el-button v-btnShow="clearBtn" @click="clear">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 按钮 -->
      <div class="btn">
        <el-button v-btnShow="increased" type="primary" icon="el-icon-plus" @click="add"
          >新增</el-button
        >
        <el-button v-btnShow="deriveOne" type="primary" icon="el-icon-upload" @click="derive"
          >导出</el-button
        >
      </div>
      <!-- tabel表格 -->
      <div class="tabel">
        <BaseTable
          :data-source="dataList"
          :columns="list"
          :total="total"
          :page-size="table.pageSize"
          :current-page="table.pageNum"
          :loading="false"
          :page-sizes="[20, 50, 100]"
          has-pagination
          @handleCurrent="changeCurrent"
          @handleSize="changeSize"
        >
        </BaseTable>
      </div>
    </el-container>
    <div>
      <!-- dialog框 -->
      <add
        :dialog-form-visible="dialogFormVisible"
        :tab-pane-show="tabPaneShow"
        :curve-id="curveId"
        :add-show="addShow"
        :sub-show="subShow"
        :main-show="mainShow"
        :btn-show="btnShow"
        :standard-show="standardShow"
        :title="title"
        :edit-btn-show="editBtnShow"
        :type="type"
        :detail-info="detailInfo"
        :active-type="activeType"
        @close="addClose"
        @cancel="addCancel"
        @editBtn="editBtn"
        @add="addLater"
      />
      <!-- 发起计算的组件 -->
      <calculate
        :sponsor-title="sponsorTitle"
        :dialog-visible="dialogVisible"
        :curve-id="curveId"
        :record="record"
        @calClose="close"
        @showClose="showClose"
      />
    </div>
  </div>
</template>

<script>
import topTitle from '@components/CommonTitle'
import BaseTable from '@components/BaseTable'
import keepMixin from '@mixins/keep.mixin'
import {
  getSelectListAPI,
  getCurveListFN,
  getDeriveFN,
  delCurveListAPI,
  dailyCalSwitchAPI,
  getLogInNameAPI
  // getNewSelectListAPI
} from '@api/curveRoule'
import add from './components/add.vue'
import calculate from './components/calculate.vue'
import { baseDownLoad } from '@utils/util'
export default {
  name: 'CurvemanagementRegulation',
  components: {
    topTitle,
    BaseTable,
    add,
    calculate
  },
  mixins: [keepMixin],

  data() {
    return {
      inquire: 41001,
      increased: 41002,
      deriveOne: 41003,
      // 获取当前曲线创建人
      LogInName: '',
      // 控制add编辑按钮是否显示
      editBtnShow: false,
      // 控制add是否可以编辑
      btnShow: false,
      // add组件的title名
      title: '',
      // 控制发起计算是否显示
      dialogVisible: false,
      // 控制参数阀值是否显示
      standardShow: false,
      // 控制dialog框的标签页显示与否
      tabPaneShow: false,
      // dialog框显示与隐藏
      dialogFormVisible: false,
      // 每项数据的详情id
      curveId: '',
      // 控制显示哪种form表单
      addShow: true,
      // 控制分段是否显示
      subShow: true,
      // 控制主体是否显示
      mainShow: true,
      // 数据
      dataList: [],
      value: false,
      // 表头
      list: [
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
          align: 'center'
        },
        {
          label: '曲线创建人',
          prop: 'chineseName',
          align: 'center'
        },
        {
          label: '创建日期',
          prop: 'createTime',
          align: 'center'
        },
        {
          label: '最近修改日期',
          prop: 'modifieTime',
          align: 'center'
        },
        {
          label: '最近拟合起始时间',
          prop: 'startFitDate',
          align: 'center'
        },
        {
          label: '最近拟合结束时间',
          prop: 'endFitDate',
          align: 'center'
        },
        {
          label: '是否每日计算',
          prop: 'isDailyCal',
          align: 'center',
          render: (h, { record }) => {
            return h('el-switch', {
              class: {
                'active-color': '#13ce66',
                'inactive-color': '#ff4949'
              },
              attrs: {
                value: record.isDailyCal,
                disabled: record.curveTp === '标准曲线' || !(this.LogInName === record.createrName)
              },
              on: {
                change: event => {
                  if (event) {
                    record.isDailyCal = 1
                  } else {
                    record.isDailyCal = 0
                  }
                  if (record.curveTp === '自定义曲线') {
                    let str = record.isDailyCal === 1 ? '是' : '否'
                    let newStr = record.isDailyCal === 0 ? '是' : '否'
                    this.$confirm(
                      `该曲线当前是否每日计算参数为"${newStr}",是否确认修改为"${str}"`,
                      {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                      }
                    )
                      .then(async () => {
                        await dailyCalSwitchAPI({
                          isDailyCal: record.isDailyCal,
                          curveId: record.curveId
                        })
                        record.isDailyCal = event
                        this.$message({
                          type: 'success',
                          message: '修改成功!'
                        })
                      })
                      .catch(() => {
                        if (record.isDailyCal === 0) {
                          record.isDailyCal = !event
                        } else if (record.isDailyCal === 1) {
                          record.isDailyCal = !event
                        }
                        this.$message({
                          type: 'warning',
                          message: '已取消修改'
                        })
                      })
                  }
                }
              }
            })
          }
        },
        {
          label: '曲线类型',
          prop: 'curveTp',
          align: 'center'
        },
        {
          label: '曲线ID',
          prop: 'curveId',
          align: 'center'
        },
        {
          label: '计算状态',
          prop: 'calType',
          align: 'center'
        },
        {
          label: '操作',
          width: 200,
          prop: '',
          'header-align': 'center',
          align: 'center',
          render: (h, { record }) => {
            return (
              <div>
                <el-button type="text" onClick={() => this.detail(record)}>
                  详情
                </el-button>
                <el-button
                  v-show={record.curveTp === '自定义曲线'}
                  type="text"
                  disabled={!(this.LogInName === record.createrName)}
                  onClick={() => {
                    this.delCurveListFN(record.curveId)
                  }}
                >
                  删除
                </el-button>
                <el-button
                  type="text"
                  v-show={record.curveTp === '自定义曲线'}
                  disabled={!(this.LogInName === record.createrName)}
                  onClick={() => {
                    this.calculate(record.curveId)
                  }}
                >
                  发起计算
                </el-button>
              </div>
            )
          }
        }
      ],
      table: {
        pageNum: 1,
        pageSize: 20
      },
      // 总数
      total: 0,
      formData: {
        curveList: [],
        // 曲线创建人
        curveCreatePrsnList: [],
        curveType: ''
      },
      // 曲线类型
      curveType: [{ code: '1', name: '自定义曲线' }, { code: '0', name: '标准曲线' }],
      // 曲线名称
      curveName: [],
      // 曲线创建人
      curveCreatePrsnList: [],
      value1: '',
      type: '',
      detailInfo: {},
      clearBtn: 84205,
      activeType: null,
      sponsorTitle: '',
      record: {}
    }
  },
  watch: {
    // 联动后的曲线类型
    'formData.curveType'(val) {
      this.getSelectListFN({ curveType: val })
      this.formData.curveCreatePrsnList = []
      this.formData.curveList = []
    },
    // 联动后的曲线创建人
    'formData.curveCreatePrsnList'(val) {
      this.table.pageNum = 1
      this.getSelectListFN({ curveType: this.formData.curveType, curveCreatePrsnList: val })
      this.formData.curveList = []
    }
  },
  created() {
    this.getSelectListFN({ curveList: [], curveCreatePrsnList: [], curveType: '', type: '' })
    this.query()
    this.getLogInNameFN()
  },
  methods: {
    // 获取所以下拉列表
    async getSelectListFN(type) {
      const { data } = await getSelectListAPI(type)
      this.curveCreatePrsnList = data.curveCreatePrsnList
      this.curveName = data.curveList
    },
    // 重置按钮
    clear() {
      this.formData = {
        curveList: [],
        curveCreatePrsnList: [],
        curveType: ''
      }
    },
    // 获取列表数据
    async query(flag) {
      if (flag !== true) {
        this.table.pageNum = 1
      }
      if (!this.formData.curveCreatePrsnList) {
        this.formData.curveCreatePrsnList = []
      }
      const res = await getCurveListFN({ ...this.formData, ...this.table })
      this.dataList = res.data.list.map(item => {
        if (item.isDailyCal === 1) {
          item.isDailyCal = true
        } else if (item.isDailyCal === 0) {
          item.isDailyCal = false
        }
        return item
      })
      this.total = res.data.total
    },
    // 导出
    derive() {
      baseDownLoad(getDeriveFN, this.formData)
    },
    async delCurveListFN(id) {
      this.$confirm('是否确认删除该自定义曲线', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await delCurveListAPI({ curveId: id })
          this.$message.success('删除成功')
          this.query()
        })
        .catch(() => {
          this.$message({
            type: 'warning',
            message: '已取消删除'
          })
        })
    },
    // 分页
    changeCurrent(val) {
      this.table.pageNum = val
      this.query(true)
    },
    // 每页几条数据
    changeSize(val) {
      this.table.pageSize = val
      this.table.pageNum = 1
      this.query(true)
    },
    // 查看详情的时候
    detail(record) {
      if (record.curveTp === '标准曲线') {
      } else {
        this.tabPaneShow = true
        this.editBtnShow = true
      }
      this.btnShow = true
      this.dialogFormVisible = true
      this.curveId = record.curveId
      this.title = '详情'
      this.type = '1'
      this.detailInfo = record
    },
    // 发起计算
    async calculate(id) {
      this.curveId = id
      this.sponsorTitle = '发起计算'
      this.dialogVisible = true
    },
    close() {
      this.query()
      this.dialogVisible = false
    },
    showClose() {
      this.dialogVisible = false
    },
    // addDialog框关闭的时候
    addClose(falg, val) {
      this.activeType = 0
      this.tabPaneShow = false
      this.dialogFormVisible = false
      this.btnShow = false
      this.curveId = ''
      this.editBtnShow = false
      this.query()
      this.type = ''
      if (val) {
        this.$nextTick(() => {
          this.addLater(val)
        })
      }
    },
    addCancel() {
      this.activeType = 0
      this.tabPaneShow = false
      this.dialogFormVisible = false
      this.btnShow = false
      this.curveId = ''
      this.editBtnShow = false
      this.query()
      this.type = ''
    },
    // 点击新增的时候
    add() {
      this.dialogFormVisible = true
      this.title = '新增'
    },
    // 点击add中的编辑按钮时
    editBtn() {
      this.btnShow = false
    },
    // 添加完曲线后获取最新的查询条件
    addLater(val) {
      this.tabPaneShow = true
      this.editBtnShow = true
      this.btnShow = true
      this.dialogFormVisible = true
      this.curveId = val
      this.title = '详情'
      this.type = '1'
      this.activeType = 1
    },
    // 获取当前曲线创建人
    async getLogInNameFN() {
      const { data } = await getLogInNameAPI()
      this.LogInName = data.name
    }
  }
}
</script>
<style lang="scss" scoped>
.configMain {
  // padding: 10px;
  background-color: $color-body-bg;

  .bodyWrap {
    background-color: #fff;
  }

  .form {
    height: 52px;
    // padding-left: 16px;
    margin: 8px 8px 12px 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    .el-form {
      display: flex;
      align-items: center;
      height: 52px;
      .el-form-item {
        margin: 0;
        margin-left: 16px;
      }
    }
  }

  .btn {
    padding: 0 10px 12px 8px;
    text-align: right;
  }

  .el-table {
    font-size: 12px;

    ::v-deep .has-gutter {
      color: #303133;
    }
  }
}
</style>
