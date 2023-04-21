<template>
  <div class="configMain">
    <el-container direction="vertical" class="bodyWrap">
      <BeforeLineTitle :title="title" />
      <div class="content">
        <TabPane
          v-model="activeTab"
          :tab-list="tabData"
          :type="'card'"
          :default-name="activeTab"
          @handleTabChange="handleTabOnChange"
        />
        <div v-if="activeTab === 'Echarts'"></div>
        <BaseTable
          v-else
          ref="baseTable"
          :columns="getColumns"
          has-pagination
          :page-size="table.pageSize"
          :data-source="dataList"
          :current-page="table.currentPage"
          :total="table.total"
          :loading="listLoading"
          :page-sizes="[50, 100, 200, 500]"
          @handleCurrent="handleCurrentChange"
          @handleSize="handleSizeChange"
        ></BaseTable>
      </div>
    </el-container>

    <DialogCurve
      :dialog-form-visible="dialogFormVisible"
      :curve-id="curveId"
      :tab-pane-show="true"
      :edit-btn-show="true"
      :type="'1'"
      :add-show="addShow"
      :sub-show="subShow"
      :main-show="mainShow"
      :standard-show="standardShow"
      @close="addClose"
      @cancel="addCancel"
    ></DialogCurve>
  </div>
</template>

<script>
import BeforeLineTitle from '@components/CommonTitle'
import TabPane from '@components/TabPane'
import BaseTable from '@components/BaseTable'
import DialogCurve from '../curvemanagement/regulation/components/add.vue'
import * as service from '@api/home'
import keepMixin from '@mixins/keep.mixin'

export default {
  name: 'InvestmentManager',
  components: {
    BeforeLineTitle,
    BaseTable,
    TabPane,
    DialogCurve
  },
  mixins: [keepMixin],
  data() {
    return {
      title: '投资经理首页',
      activeTab: 'CustomCurve',
      tabData: [
        {
          label: '我的自定义曲线',
          name: 'CustomCurve'
        }
      ],
      columnsCustomCurve: [
        {
          label: '序号',
          fix: 'left',
          type: 'index',
          align: 'center',
          width: '60'
        },
        {
          label: '自定义曲线名称',
          prop: 'curveName',
          align: 'center',
          render: (h, { record }) => {
            let btnProps = {
              type: 'text',
              size: 'small'
            }
            return h(
              'el-button',
              {
                props: btnProps,
                on: {
                  click: () => {
                    this.openCurveDialog(record.curveId)
                  }
                }
              },
              record.curveName
            )
          }
        },
        {
          label: '创建日期',
          prop: 'createTime',
          align: 'center'
        },
        {
          label: '是否每日计算',
          prop: 'isDailyCal',
          align: 'center'
        },
        {
          label: '是否存在连续多日数据不足的情形',
          prop: 'fiveDay',
          align: 'center'
        },
        {
          label: '操作',
          fix: 'right',
          width: '120',
          align: 'center',
          actions: [
            {
              text: '删除曲线',
              onClick: item => {
                this.deleteTableItem(item)
              }
            }
          ]
        }
      ],
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
      // 控制参数阀值是否显示
      standardShow: false,
      dataList: [],
      table: {
        currentPage: 1,
        total: 0,
        pageSize: 50
      },
      listLoading: false
    }
  },
  computed: {
    getColumns() {
      return this[`columns${this.activeTab}`]
    }
  },
  created() {
    const { routerList } = this.$store.state.user
    if (routerList[0].path === '/home' && routerList[0].children.length === 1) {
      this.title = `${this.$store.state.user.roleName}首页`
    }
  },
  mounted() {
    this.query(1)
  },
  activated() {
    this.$refs.baseTable.$refs.commonTable && this.$refs.baseTable.$refs.commonTable.doLayout()
  },
  methods: {
    handleTabOnChange(tab) {
      this.activeTab = tab.name
    },
    getTableList(params) {
      return service[`get${this.activeTab}`](params)
    },
    handleCurrentChange(page) {
      this.table.currentPage = page
      this.query()
    },
    handleSizeChange(pageSize) {
      this.table.pageSize = pageSize
      this.query(1)
    },
    query(page, pageSize) {
      this.listLoading = true
      this.table.currentPage = page || this.table.currentPage
      this.table.pageSize = pageSize || this.table.pageSize
      let params = {
        pageNum: this.table.currentPage,
        pageSize: this.table.pageSize
      }
      service[`get${this.activeTab}`](params)
        .then(res => {
          const { status, data, message } = res
          this.listLoading = false
          if (status === 200) {
            this.dataList = data.list
            this.table.total = data.total
          } else {
            this.dataList = []
            message && this.$Message.error(message)
          }
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    deleteTableItem(item) {
      this.$confirm('是否确认删除该自定义曲线?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          service.delCurveInfo({ curveId: item.curveId }).then(res => {
            if (res.status === 200) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.query(1)
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // addDialog框关闭的时候
    addClose() {
      this.tabPaneShow = false
      this.dialogFormVisible = false
      this.curveId = ''
    },
    addCancel() {
      this.tabPaneShow = false
      this.dialogFormVisible = false
      this.curveId = ''
    },
    openCurveDialog(val) {
      this.dialogFormVisible = true
      this.tabPaneShow = true
      this.curveId = val
    }
  }
}
</script>
