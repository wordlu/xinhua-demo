<template>
  <div class="configMain">
    <el-container direction="vertical" class="bodyWrap">
      <BeforeLineTitle :title="beforeTitle" />
      <div class="switchover">
        <div class="nav">
          <el-radio-group v-model="tabPosition">
            <el-radio-button
              v-for="(item, index) in tabs"
              :key="index"
              :label="item.name"
              @click.native.prevent="onCtabs(item)"
            >
              {{ item.name }}
            </el-radio-button>
          </el-radio-group>
        </div>
        <div class="tableContent">
          <TabPane
            v-model="activeTab"
            :tab-list="tabList"
            :type="'card'"
            :default-name="activeTab"
            @handleTabChange="handleTabChange"
          ></TabPane>
          <TabFirstData
            :ref="itemRef"
            indexed
            :selection="itemIndex === 'tabThirdData'"
            :active-tab="
              itemIndex === 'tabFourthData' || itemIndex === 'tabFifthData' ? activeTab : ''
            "
            :item-index="itemIndex"
            :table-height="'550px'"
            :loading="loading"
            :page-size="table.pageSize"
            :current-page="table.pageNum"
            :total="table.total"
            :page-sizes="[20, 50, 100]"
            @refresh="onRefresh"
            @onTableDataIndex="onTableDataIndex"
            @handleSize="handleSizeChange"
            @handleCurrent="handleCurrent"
            @submit="onSubmit"
            @query="initData"
            @lifecycle="lifecycle"
            @handleImport="handleImport"
          >
          </TabFirstData>
        </div>
      </div>
    </el-container>
    <!-- 导入 -->
    <EditDialog
      ref="dialog"
      :title="dialogTitle"
      :dialog-type="dialogTitle === '导入异常主体' ? 'orgName' : 'fast'"
      :columns="fastDialogColumns"
      :http-name="dialogTitle === '导入异常主体' ? 'postObjImport' : 'postBondImport'"
      :match-http-name="dialogTitle === '导入异常主体' ? 'postObjListMatch' : 'postBondListMatch'"
      :import-http-name="dialogTitle === '导入异常主体' ? 'getOrgMatchData' : 'getBondMatchData'"
      @importDialogSure="importDialogSure"
      @downloadTemplate="downloadTemplate"
      @importDialogClose="importDialogClose"
    >
      <template slot="ruleName">
        <el-form
          ref="rulesForm"
          :model="rulesForm"
          :rules="rules"
          label-width="80px"
          class="ruleName"
        >
          <el-form-item label="规则名称" prop="name">
            <el-input v-model="rulesForm.name" :maxlength="30"></el-input>
          </el-form-item>
        </el-form>
      </template>
    </EditDialog>
  </div>
</template>

<script>
import * as compreData from './libs/data'
import * as service from '@api/parameter'
import BeforeLineTitle from '@components/CommonTitle'
import TabPane from '@components/TabPane'
import TabFirstData from './components/tabFirstData'
import EditDialog from './components/EditDialog'
import { removeNullInObject } from '@utils/util'
export default {
  components: {
    BeforeLineTitle,
    TabPane,
    TabFirstData,
    EditDialog
  },
  data() {
    const validName = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入规则名称'))
      } else {
        service.checkRuleName(value).then(res => {
          if (res.status === 200) {
            res.data === 'true' ? callback() : callback(new Error('规则名称重复'))
          }
        })
      }
    }
    return {
      beforeTitle: '参数管理',
      tabPosition: '备选样本券阈值配置',
      tabs: compreData.tabs,
      itemIndex: 'tabFirstData',
      itemRef: 'tabFirstDataRef',
      numerical: '1',
      activeTab: '1',
      tabList: compreData.tabFirstData,
      table: {
        pageNum: 1,
        pageSize: 20,
        total: 0
      },
      ruleForm: {},
      loading: false,
      multipleSelection: [],
      validSta: true,
      fastDialogColumns: compreData.objDialogColumns,
      dialogTitle: '导入异常主体',
      rulesForm: {
        name: ''
      },
      rules: {
        name: [{ validator: validName, required: true, trigger: 'blur' }]
      }
    }
  },
  created() {
    this.initData()
  },
  methods: {
    onCtabs(item) {
      this.tabPosition = item.name
      this.itemIndex = item.value
      this.itemRef = item.ref
      this.numerical = item.numerical
      this.tabList = compreData[item.value]
      this.activeTab = '1'
      this.table = {
        pageNum: 1,
        pageSize: 20,
        total: 0
      }
      this.ruleForm = {}
      this.initData()
    },
    handleTabChange(data) {
      this.activeTab = data.name
      this.table = {
        pageNum: 1,
        pageSize: 20,
        total: 0
      }
      this.initData()
      this.dataList = []
    },
    handleSizeChange(v) {
      this.table.pageSize = v
      this.table.pageNum = 1
      this.initData()
    },
    handleCurrent(v) {
      this.table.pageNum = v
      this.initData()
    },
    onSubmit(val) {
      this.ruleForm = val
      this.initData()
    },
    lifecycle(val) {
      this.validSta = val
      this.table.pageNum = 1
      this.initData()
    },
    initData(val) {
      let params = {
        classCd: '',
        className: '',
        paramCd: '',
        dataTp: this.numerical,
        paramTp: this.activeTab,
        pageSize: this.table.pageSize,
        pageNum: this.table.pageNum,
        validSta: this.validSta ? '' : '1'
      }
      if (
        (this.itemIndex === 'tabFourthData' && this.activeTab === '1') ||
        (this.itemIndex === 'tabFifthData' && this.activeTab === '1')
      ) {
        params.paramCdList = this.ruleForm.paramCdList || ''
        params.clusterName = this.ruleForm.clusterName || ''
      }
      this.loading = true
      service.getParamInfoList(removeNullInObject(params)).then(res => {
        const { list, total } = res.data
        if (val) {
          if (this.tableDataIndex) {
            this.tableDataIndex.forEach(element => {
              list[element].medifieSta = true
            })
          }
        }
        sessionStorage.setItem('tableList', JSON.stringify(list))
        this.$refs[this.itemRef].tableData = list
        this.$refs[this.itemRef].$refs.tableRef.doLayout()
        this.table.total = total
        this.loading = false
      })
    },
    onRefresh(val) {
      this.initData(val)
    },
    onTableDataIndex(val) {
      this.tableDataIndex = this.newArrFn(val)
    },
    newArrFn(arr) {
      // .new Set方法，返回是一个类数组，需要结合 Array.from ，转成真实数组
      return Array.from(new Set(arr))
    },
    handleImport(val) {
      this.dialogTitle = val
      this.fastDialogColumns =
        this.dialogTitle === '导入异常主体'
          ? compreData.objDialogColumns
          : compreData.bontDialogColumns
      this.$set(
        this.rulesForm,
        'name',
        `${this.$moment(new Date()).format('YYYY/MM/DD')}-${
          this.dialogTitle === '导入异常主体' ? '主体列表' : '债券列表'
        }-${this.$store.state.user.userInfo.loginName}`
      )
      this.$refs.dialog.importDialogOpen()
    },
    //  取消关闭
    importDialogClose() {
      this.$refs.rulesForm.resetFields()
    },
    // 确认
    importDialogSure(objTablelist) {
      this.$refs.rulesForm.validate(valid => {
        if (valid) {
          const data = {
            groupName: this.rulesForm.name,
            matchList: objTablelist
          }
          service[this.dialogTitle === '导入异常主体' ? 'postObjConfirm' : 'postBondConfirm'](
            data
          ).then(res => {
            if (res.status === 200) {
              this.$message({
                showClose: true,
                message: '保存成功',
                type: 'success'
              })
              this.$refs.dialog.importDialogClose()
              this.initData()
            } else {
              this.$message.error(res.message)
            }
          })
        } else {
          return false
        }
      })
    },
    // 下载模板
    downloadTemplate() {
      if (this.dialogTitle === '导入异常主体') {
        service.getObjTemplateDownload()
      } else if (this.dialogTitle === '导入异常债项') {
        service.getBondTemplateDownload()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.configMain {
  background-color: $color-body-bg;

  .bodyWrap {
    background-color: #fff;

    .switchover {
      position: relative;
      width: 100%;
      margin: 10px 0;

      .nav {
        display: flex;
        height: 40px;
        padding: 0 10px;
        line-height: 40px;

        .btn {
          position: relative;
          padding: 0 20px;
          color: #606266;
          cursor: pointer;
          background: #fff;
          border: 1px solid #dcdfe6;
        }

        .el-radio-button:focus:not(.is-focus):not(:active):not(.is-disabled) {
          box-shadow: 0 0 0 0 #409eff;
        }
      }

      .tableContent {
        padding-top: 10px;
      }
    }
  }
}

.ruleName {
  position: relative;

  .el-input {
    width: 300px;
  }
}
</style>
