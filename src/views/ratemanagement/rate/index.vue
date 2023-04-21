<template>
  <!-- 评级管理 -->
  <div class="configMain">
    <el-container direction="vertical" class="bodyWrap">
      <BeforeLineTitle :title="beforeLineTitle" />
      <BaseForm
        :form-data.sync="formData"
        :label-width="130"
        :set-options="setOptions"
        @queryForm="getQueryForm"
        @download="download"
        @resetForm="resetForm"
        @handleImport="handleImport"
        @handleCancel="handleCancel"
        @getRemoteMethod="getRemoteMethod"
        @getFilterMethod="getFilterMethod"
        @trigger="trigger"
        @selectVisible="selectVisible"
        @handleCurrentChangeOrg="handleCurrentChangeOrg"
        @blurValue="blurValue"
        @selectPageChange="selectPageChange"
      />
      <el-tag v-if="tagShow" size="medium" closable class="ml10 mr10 flex" @close="handleClose">评级信息需更新并于12月末录入</el-tag>
      <BaseTable :columns="columns" has-pagination :page-size="1" :data-source="tableList"
        :current-page="table.currentPage" :total="table.total" :loading="listLoading" :page-sizes="[20, 50, 100]"
        @handleCurrent="handleCurrent" @handleSize="handleSize" />
    </el-container>
    <!-- 导入新增评级 -->
    <EditDialog
      ref="dialog"
      title="导入新增评级"
      :dialog-type="'fast'"
      :columns="fastDialogColumns"
      :http-name="'getFileRating'"
      :match-http-name="'ratingMatch'"
      :import-http-name="'getMatchQueryFast'"
      @importDialogSure="importDialogSure"
      @downloadTemplate="downloadTemplate"
    >
    </EditDialog>
  </div>
</template>
<script>
import BeforeLineTitle from '@components/CommonTitle';
import BaseForm from '@components/BaseForm/index.vue';
import { formData, columns, fastDialogColumns } from './libs/data';
import BaseTable from '@components/BaseTable';
import { globalDictMap } from '@utils/dict';
import EditDialog from '@components/EditDialog';
import * as service from '@api/ratemanagement';
import * as servdeal from '@api/bondYield';
import { removeNullInObject, baseDownLoad } from '@utils/util';
import initMixin from '../mixins/initData.mixin.js'
import keepMixin from '@mixins/keep.mixin'

export default {
  name: 'RateManagement',
  components: {
    BeforeLineTitle,
    BaseForm,
    BaseTable,
    EditDialog
  },
  mixins: [initMixin, keepMixin],
  data () {
    return {
      beforeLineTitle: '评级管理',
      setOptions: {},
      formData,
      columns,
      fastDialogColumns,
      tableList: [],
      table: {
        currentPage: 1,
        total: 0,
        pageSize: 20
      },
      newLevelList: [],
      searchParams: {},
      copyOptions: {},
      listLoading: false,
      tagShow: false
    };
  },
  created () {
  },
  mounted () {
    this.initDict();
  },
  methods: {
    // 获取行业
    getIndustry(params) {
      return servdeal.getIndustryList(params);
    },
    initOrgList () {
      let params = {
        pageNum: 1,
        pageSize: 6
      }
      service.getOrgNamePageList(params).then(res => {
        if (res) {
          let {
            list,
            total
          } = res.data;
          this.$set(this.setOptions, 'objName', list)
          const index = this.formData.renderFrom.findIndex(item => item.key === 'objName')
          this.formData.renderFrom[index].getPageInfo.total = total
          this.initOrg = { list, total, index }
        }
      }); // 主体名称初始化
    },
    initDict () {
      this.copyOptions.objType = globalDictMap('2020')
      this.initOrgList()
      service.getOrgAnalystList().then(res => {
        if (res) {
          this.$set(this.setOptions, 'objBelongAnalyst', res.data);
          this.copyOptions.objBelongAnalyst = res.data
        }
      }); // 主体所属分析师列表
      let code = this.globalDictMap(2060).map((item) => {
        return item.code;
      });
      // 申万行业
      this.getIndustry(code[2]).then((res) => {
        if (res) { 
          this.$set(this.setOptions, 'objSWIndustryNew', res.data);
        };
      });
      // 新华内部行业
      this.getIndustry(code[1]).then((res) => {
        this.$set(this.setOptions, 'objInnerIndustryNew', res.data);
      });
      // 新华GICS行业
      this.getIndustry(code[0]).then((res) => {
        this.$set(this.setOptions, 'objGICSIndustryNew', res.data);
      });
      // 获取上一个评估日至今是否已有快速评级提示信息
      service.getParameAssessDay().then(res => {
        if (res && res.status === 200) {
          const index = this.formData.renderFrom.findIndex(item => item.key === 'existFastRatingFlag')
          this.formData.renderFrom[index].notes = `上一评估日期是：${this.$moment(res.data).format('ll')}`
        }
      })
    },
    getQueryForm (fromData) {
      this.searchParams = {...fromData};
      this.queryForm(1)
    },
    queryForm (page, pageSize) {
      this.table.currentPage = page || this.table.currentPage
      this.table.pageSize = pageSize || this.table.pageSize
      const params = {
        pageNum: this.table.currentPage,
        pageSize: this.table.pageSize,
        ...removeNullInObject(this.searchParams)
      };
      const { objName } = params
      if (objName && objName.length === 1) {
        if (this.setOptions.objName && this.setOptions.objName.length === 0) {
          params.blurryObjName = params.objName.join('')
          delete params.objName
        }
      }
      this.listLoading = true
      service.getratingManageQuery(params).then(res => {
        this.listLoading = false
        if (res) {
          const { list, total, messageFlag } = res.data;
          this.tableList = list;
          this.table.total = total;
          this.tagShow = messageFlag
        }
      }).catch(() => {
        this.listLoading = false
      })
    },
    download () {
      if (this.tableList.length < 1) {
        this.$message.warning('暂无数据导出')
        return
      }
      let params = {
        ...this.searchParams
      }
      const { objName } = params
      if (objName && objName.length === 1) {
        if (this.setOptions.objName && this.setOptions.objName.length === 0) {
          params.blurryObjName = objName.join('')
          delete params.objName
        }
      }
      baseDownLoad(service.ratingManageExcel, params, this.table.total)
    },
    handleSize (val) {
      this.table.pageSize = val;
      this.queryForm(1);
    },
    handleCurrent (val) {
      this.table.currentPage = val;
      this.queryForm();
    },
    resetForm (val) {
      this.formData.initData = val;
      this.searchParms = {};
      this.table.currentPage = 1;
      this.resetSelect('objName')
    },
    handleImport() {
      this.$refs.dialog.importDialogOpen();
    },
    importDialogSure() {
      service.saveRating().then(res => {
        if (res.status === 200) {
          this.$message({
            showClose: true,
            message: '保存成功',
            type: 'success'
          });
          this.$refs.dialog.importDialogClose();
        } else {
          this.$message.error(res.message);
        }
      });

    },
    // 下载模板
    downloadTemplate() {
      service.ratingTemplate();
    },
    // 撤销上次导入
    handleCancel() {
      service.revokeLastImport().then((res) => {
        const { status, data } = res
        if (status === 200) {
          data.includes('撤销失败') ? this.$message.error(data) : this.$message.success(data)
        }
      });
    },
    handleClose () {
      this.tagShow = false
    }
  }
};
</script>

<style lang="scss" scoped>
.flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>