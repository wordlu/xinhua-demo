<template>
  <div class="configMain">
    <el-container direction="vertical" class="bodyWrap">
      <BeforeLineTitle :title="beforeTitle" />
      <div class="form">
        <el-form ref="ruleForm" :model="ruleForm" inline>
          <el-form-item label="标准曲线方案名称">
            <el-select v-model="ruleForm.planNameList" placeholder="请选择" filterable multiple>
              <el-option
                v-for="item in planNameListData"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="标准曲线簇名称">
            <el-select v-model="ruleForm.clusterNameList" placeholder="请选择" filterable multiple>
              <el-option
                v-for="item in clusterNameListData"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="标准曲线名称">
            <el-select v-model="ruleForm.curveNameList" placeholder="请选择" filterable multiple>
              <el-option
                v-for="item in curveNameListData"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item class="item">
            <el-button v-btnShow="inquire" type="primary" @click="submitForm(true)">查询</el-button>
            <el-button v-btnShow="reset" @click="resetForm">重置</el-button>
            <el-button v-btnShow="derive" @click="exportData">导出</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="rightButt">
        <span class="notice"
          >注意：若需切换标准曲线簇方案，请联系开发人员，该功能将在后端实现。</span
        >
        <el-button v-btnShow="increased" type="primary" @click="addcurveScheme"
          >新增标准曲线簇方案</el-button
        >
      </div>

      <BaseTable
        :columns="columns"
        has-pagination
        :page-size="1"
        :data-source="tableList"
        :current-page="table.currentPage"
        :total="table.total"
        :loading="false"
        :page-sizes="pageSizeList"
        @handleCurrent="handleCurrent"
        @handleSize="handleSize"
        @sortChange="sortChange"
      />
      <add
        ref="addRef"
        :dialog-form-visible="dialogFormVisible"
        :tab-pane-show="tabPaneShow"
        :curve-id="curveId"
        :type="type"
        :sub-show="subShow"
        :plan-name="planName"
        :curve-name="curveName"
        :cluster-name="clusterName"
        :btn-show="btnShow"
        :standard-show="standardShow"
        :plan-cd="planCd"
        :cluster-id="clusterCd"
        @close="closeAdd"
        @cancel="closeAdd"
        @query="query"
      />
      <increase
        :increase-visible="increaseVisible"
        :plan-cd="planCd"
        :show="show"
        :plane-name="planName"
        @close="closeScheme"
        @add="addLater"
      />
    </el-container>
  </div>
</template>
<script>
import * as service from '@api/configuration'
import BeforeLineTitle from '@components/CommonTitle'
import BaseTable from '@components/BaseTable'
import add from '../regulation/components/add.vue'
import increase from './components/increase.vue'
import keepMixin from '@mixins/keep.mixin'
import { baseDownLoad } from '@utils/util'
import { initPageNum } from './libs/data'
export default {
  name: 'CurvemanagementConfiguration',
  components: {
    BeforeLineTitle,
    BaseTable,
    add,
    increase
    // mind
  },
  mixins: [keepMixin],

  data() {
    return {
      pageSizeList: [50, 100],
      increased: 44004,
      inquire: 44001,
      derive: 44003,
      reset: 44002,
      // 控制曲线簇是否可以修改
      show: true,
      // 控制标准曲线方案簇是否显示
      increaseVisible: false,
      // 控制是否显示分段信息和曲线名称
      subShow: false,
      // 控制思维导图是否显示
      dialogVisibleMind: true,
      // 控制详情是否显示
      dialogFormVisible: false,
      // 控制标签页是否显示
      tabPaneShow: false,
      // 每一行的id
      curveId: null,
      beforeTitle: '标准曲线簇规则配置',
      ruleForm: {
        planNameList: [],
        clusterNameList: [],
        curveNameList: []
      },
      planNameListData: [],
      clusterNameListData: [],
      curveNameListData: [],
      tableList: [],
      columns: [
        {
          label: '序号',
          render: (h, record) => {
            return h('span', record.$index + 1)
          },
          align: 'center',
          width: 50
        },
        {
          label: '标准曲线簇方案ID',
          prop: 'planCd',
          align: 'center'
        },
        {
          label: '标准曲线簇方案名称',
          prop: 'planName',
          align: 'center',
          sortable: true,
          width: 180,
          render: (h, { record }) => {
            return (
              <div>
                <el-button type="text" onClick={() => this.openIncrease(record)}>
                  {record.planName}
                </el-button>
              </div>
            )
          }
        },
        {
          label: '标准曲线簇方案_操作',
          prop: '',
          align: 'center',
          render: (h, { record }) => {
            const { effectStaHistory, checkSta, effectSta } = record
            return (
              <div>
                <el-button
                  type="text"
                  disabled={
                    (effectStaHistory === '是' && checkSta === '通过' && effectSta === '生效') ||
                    (effectStaHistory === '是' && checkSta === '通过' && effectSta === '失效')
                  }
                  onClick={() => this.editIncrease(record)}
                >
                  编辑
                </el-button>
                <el-button
                  type="text"
                  onClick={() => this.checkout(record)}
                  disabled={
                    (checkSta === '通过' && effectSta === '失效' && effectStaHistory === '否') ||
                    (effectStaHistory === '是' && checkSta === '通过' && effectSta === '生效') ||
                    (effectStaHistory === '是' && checkSta === '通过' && effectSta === '失效')
                  }
                >
                  校验
                </el-button>
              </div>
            )
          }
        },
        {
          label: '校验情况',
          prop: 'checkSta',
          align: 'center'
        },
        {
          label: '状态',
          prop: 'effectSta',
          align: 'center'
        },
        {
          label: '是否存在过生效状态',
          prop: 'effectStaHistory',
          align: 'center'
        },
        {
          label: '标准曲线簇ID',
          prop: 'clusterCd',
          align: 'center'
        },
        {
          label: '标准曲线簇名称',
          prop: 'clusterName',
          sortable: true,
          width: 200,
          align: 'center',
          render: (h, { record }) => {
            if (record.clusterStatus === '0') {
              return (
                <div>
                  <el-button
                    type="text"
                    onClick={() => this.curveCluster(record, '2')}
                    style={{ color: 'red' }}
                  >
                    {record.clusterName}*
                  </el-button>
                </div>
              )
            } else {
              return (
                <div>
                  <el-button type="text" onClick={() => this.curveCluster(record, '2')}>
                    {record.clusterName}
                  </el-button>
                </div>
              )
            }
          }
        },
        {
          label: '标准曲线簇_操作',
          prop: '',
          align: 'center',
          render: (h, { record }) => {
            const { effectStaHistory, checkSta, effectSta } = record
            return (
              <div>
                <el-button
                  type="text"
                  disabled={
                    (effectStaHistory === '是' && checkSta === '通过' && effectSta === '生效') ||
                    (effectStaHistory === '是' && checkSta === '通过' && effectSta === '失效')
                  }
                  onClick={() => this.editCurve(record, '2')}
                >
                  编辑
                </el-button>
              </div>
            )
          }
        },
        {
          label: '标准曲线ID',
          prop: 'curveId',
          align: 'center'
        },
        {
          label: '标准曲线名称',
          width: 200,
          prop: 'curveName',
          sortable: true,
          align: 'center',
          render: (h, { record }) => {
            return (
              <div>
                <el-button type="text" onClick={() => this.detCurveName(record, '3')}>
                  {record.curveName}
                </el-button>
              </div>
            )
          }
        },
        {
          label: '标准曲线_操作',
          prop: '',
          align: 'center',
          render: (h, { record }) => {
            const { effectStaHistory, checkSta, effectSta } = record
            return (
              <div>
                <el-button
                  type="text"
                  disabled={
                    (effectStaHistory === '是' && checkSta === '通过' && effectSta === '生效') ||
                    (effectStaHistory === '是' && checkSta === '通过' && effectSta === '失效')
                  }
                  onClick={() => this.editCurveName(record, '3')}
                >
                  编辑
                </el-button>
                <el-button
                  type="text"
                  onClick={() => this.deletePlan(record)}
                  disabled={
                    (effectStaHistory === '是' && checkSta === '通过' && effectSta === '生效') ||
                    (effectStaHistory === '是' && checkSta === '通过' && effectSta === '失效')
                  }
                >
                  删除
                </el-button>
              </div>
            )
          }
        },
        {
          label: '创建日期',
          width: 200,
          prop: 'createTime',
          align: 'center'
        }
      ],
      table: {
        currentPage: 1,
        total: 0,
        pageSize: 50
      },
      type: '',
      // 标准曲线簇方案名称
      planName: '',
      // 曲线名称
      curveName: '',
      // 曲线簇名称
      clusterName: '',
      // 控制add保存按钮是否显示
      btnShow: false,
      // 是否显示参数阀值
      standardShow: false,
      // 曲线簇方案代码
      planCd: '',
      // 当前的曲线簇id
      clusterCd: ''
    }
  },
  watch: {
    // 联动后的标准曲线方案
    'ruleForm.planNameList'() {
      service.getQueryList({ planNameList: this.ruleForm.planNameList }).then(res => {
        this.clusterNameListData = res.data.clusterNameList
      })
      service.getQueryList({ planNameList: this.ruleForm.planNameList }).then(res => {
        this.curveNameListData = res.data.curveNameList
      })
    },
    // 联动后的标准曲线簇
    'ruleForm.clusterNameList'() {
      service
        .getQueryList({
          planNameList: this.ruleForm.planNameList,
          clusterNameList: this.ruleForm.clusterNameList
        })
        .then(res => {
          this.curveNameListData = res.data.curveNameList
        })
    }
  },
  created() {
    this.initDictData()
    this.submitForm()
  },
  methods: {
    initDictData() {
      service.getQueryList({}).then(res => {
        const { data } = res
        this.planNameListData = data.planNameList
        this.clusterNameListData = data.clusterNameList
        this.curveNameListData = data.curveNameList
      })
    },
    submitForm(flag) {
      const { currentPage, pageSize } = this.table
      const { planNameList, clusterNameList, curveNameList } = this.ruleForm
      const params = {
        pageNum: flag ? initPageNum : currentPage,
        pageSize,
        planNameList,
        clusterNameList,
        curveNameList
      }
      service.getQueryData(params).then(res => {
        const { list, total } = res.data
        this.tableList = list
        this.table.total = total
      })
    },
    resetForm() {
      this.ruleForm = {
        planNameList: [],
        clusterNameList: [],
        curveNameList: []
      }
      // this.submitForm();
    },
    handleSize(val) {
      this.table.pageSize = val
      this.table.pageNum = 1
      this.submitForm()
    },
    handleCurrent(val) {
      this.table.currentPage = val
      this.submitForm()
    },
    exportData() {
      const params = {
        planNameList: this.ruleForm.planNameList,
        clusterNameList: this.ruleForm.clusterNameList,
        curveNameList: this.ruleForm.curveNameList
      }
      baseDownLoad(service.getOutExcel, params)
    },
    // 点击标准曲线名称
    curve(curveId) {
      this.curveId = curveId
      this.dialogFormVisible = true
    },
    // 关闭思维导图
    closeMind(val) {
      this.dialogVisibleMind = val
    },
    // 标准曲线簇名称
    curveCluster(scope, type) {
      this.clusterName = scope.clusterName
      this.curveId = scope.clusterCd + ''
      this.planName = scope.planName
      this.type = type
      this.dialogFormVisible = true
      this.subShow = true
      this.btnShow = true
      this.standardShow = true
      this.planCd = scope.planCd
    },
    // 编辑标准曲线簇名称
    editCurve(scope, type) {
      this.$refs.addRef.detailShow = true
      this.clusterName = scope.clusterName
      this.curveId = scope.clusterCd + ''
      this.planName = scope.planName
      this.type = type
      this.dialogFormVisible = true
      this.subShow = true
      this.standardShow = true
      this.planCd = scope.planCd
    },
    // 关闭dialog
    closeAdd(val) {
      this.dialogFormVisible = val
      this.planName = ''
      this.btnShow = false
      this.subShow = false
      this.standardShow = val
    },
    // 删除曲线簇
    deletePlan(scope) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const res = await service.deletePlanAPI({
            clusterCd: scope.clusterCd,
            curveId: scope.curveId,
            planCd: scope.planCd
          })
          if (res.data.status === 200) {
            this.$message.success('删除成功')
            this.submitForm()
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 点击曲线名称回显
    detCurveName(scope, type) {
      this.clusterName = scope.clusterName
      this.planName = scope.planName
      this.curveName = scope.curveName
      this.curveId = scope.curveId + ''
      this.type = type
      this.dialogFormVisible = true
      this.btnShow = true
      this.planCd = scope.planCd
      this.clusterCd = scope.clusterCd
    },
    editCurveName(scope, type) {
      if (scope.clusterStatus === '0') {
        return this.$message.error('请先编辑该曲线所属曲线簇的分段设定与规则')
      } else {
        this.$refs.addRef.detailShow = true
        this.clusterName = scope.clusterName
        this.planName = scope.planName
        this.curveName = scope.curveName
        this.curveId = scope.curveId + ''
        this.clusterCd = scope.clusterCd
        this.type = type
        this.dialogFormVisible = true
        this.planCd = scope.planCd
      }
    },
    // 新增标准曲线簇方案
    addcurveScheme() {
      this.increaseVisible = true
      this.show = false
      this.planCd = ''
    },
    // 关闭曲线簇dialog框要做的事情
    closeScheme(val) {
      this.increaseVisible = val
      this.show = true
      // 重新获取表格数据
      this.submitForm()
    },
    // 打开曲线簇方案名称弹框
    openIncrease(scope) {
      this.planCd = scope.planCd
      this.increaseVisible = true
    },
    // 编辑曲线簇方案名称弹框
    editIncrease(scope) {
      this.increaseVisible = true
      this.planCd = scope.planCd
      this.show = false
      this.planName = scope.planName
    },
    // 点击校验的时候
    async checkout(scope) {
      const { data } = await service.getCheckPlan({ planCd: scope.planCd })
      if (data === '校验成功') {
        this.$message.success(data)
        this.submitForm()
      } else {
        this.$alert(data, '提示', {
          confirmButtonText: '确定',
          callback: action => {
            this.submitForm()
          }
        })
      }
    },
    // 当曲线簇编辑完后红心获取列表
    query() {
      this.submitForm()
    },
    addLater() {
      this.initDictData()
    },
    // 排序时需要
    sortChange() {}
  }
}
</script>
<style lang="scss" scoped>
.configMain {
  padding: 10px;
  background-color: $color-body-bg;

  .bodyWrap {
    background-color: #fff;

    .rightButt {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 10px 12px 25px;
    }
    .form {
      height: 52px;
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
  }
  .notice {
    color: red;
  }
}
</style>
