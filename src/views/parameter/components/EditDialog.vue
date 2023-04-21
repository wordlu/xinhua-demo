<template>
  <div>
    <el-dialog :title="title" :visible.sync="visible" width="60%" :close-on-click-modal="false"
      :close-on-press-escape="false" @close="importDialogClose" v-on="$listeners">
      <div>
        <slot name="ruleName"></slot>
        <div style="position: relative;">
          <el-button class="download-temp" size="small" type="success" @click="downloadTemplate"><i
              class="el-icon-download"></i>下载模板</el-button>
          <BaseUpload :options="options" @httpRequest="httpRequest"></BaseUpload>
        </div>
        <div style="margin:20px 0">
          <span>{{ matchResult }}</span>
          <span class="tip-show">
            <el-checkbox v-model="objChecked" :disabled="isDisabled" @change="handleMatchFail">只看匹配失败</el-checkbox>
          </span>
        </div>
        <!-- 保留slot -->
        <slot></slot>
        <!-- table -->
        <el-table v-loading="tableLoading" :data="objTablelist" border :row-class-name="rowClassName"
          :cell-style="cellClassName" max-height="400px">
          <div slot="empty">
            <div>暂无数据</div>
          </div>
          <el-table-column v-for="(item, index) in columns" :key="item.label + index" :label="item.label"
            :align="item.align" :prop="item.prop" :width="item.width" :min-width="item.minWidth">
            <template slot-scope="scope">
              <el-input v-if="item.input" v-model.trim="scope.row[item.prop]" clearable></el-input>
              <el-select v-else-if="item.select" v-model="scope.row[item.prop]">
                <el-option v-for="i in item.options" :key="i.code" :label="i.name" :value="i.code">
                </el-option>
              </el-select>
              <span v-else>{{ item.prop ? scope.row[item.prop] : (scope.$index + 1) }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer">
        <el-button type="primary" size="small" @click="importDialogMatch">匹配</el-button>
        <el-button size="small" @click="importDialogClose">取消</el-button>
        <el-button :loading="submitLoading" type="primary" size="small" @click="importDialogSure">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import BaseUpload from '@components/BaseUpload'
import * as service from '@api/ratemanagement';
import * as serviceParamter from '@api/parameter';
export default {
  name: 'ImportDialog',
  components: {
    BaseUpload
  },
  props: {
    title: {
      type: String,
      default: () => ''
    },
    // 弹窗类型
    // orgName：主体；
    // bnd：债项
    // fast：新增快速评级；
    dialogType: {
      type: String,
      default: 'orgName'
    },
    columns: { // table columns
      type: Array,
      default: () => []
    },
    httpName: { // 上传文件 接口方法名
      type: String,
      default: ''
    },
    matchHttpName: { // 匹配默认是匹配主体接口，其他可以传入接口name
      type: String,
      default: 'orgNameMatch'
    },
    importHttpName: { // 只看匹配失败为false时，返回所有数据，传日对应的接口name --默认为主体名称导入查询
      type: String,
      default: ''
    },
    ruleName: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      visible: false,
      objChecked: false,
      isDisabled: true,
      objTablelist: [],
      matchResult: '',
      tempTableList: [],
      options: {
        btnName: '上传文件',
        showFileList: false,
        extensions: ['xlsx'],
        maxSize: 10 * 1024,
        multiple: false,
        limit: 1,
        tips: '只能上传xlsx文件，且不超过10M'
      },
      tableLoading: false,
      submitLoading: false
    };
  },
  methods: {
    importDialogOpen () {
      this.visible = true;
    },
    importDialogClose () {
      this.visible = false;
      this.objTablelist = []
      this.tempTableList = []
      this.matchResult = ''
      this.isDisabled = false
      this.objChecked = false
      this.tableLoading = false
      this.$emit('importDialogClose')
    },
    // 确认按钮
    importDialogSure () {
      if (this.objTablelist.length === 0) {
        this.$message.error('请先选择上传文件');
        return false;
      }
      let objCodeArray = [];
      // 不是新增快速评级，把成功的抛出反显到父组件；
      // 新增快速评级返回列表，父组件请求接口
      if (this.dialogType !== 'fast') {
        this.objTablelist.forEach(item => {
          const { matchResult } = item
          if (!matchResult.includes('匹配失败')) {
            objCodeArray.push(item);
          }
        });
      } else {
        objCodeArray = this.objTablelist
      }
      this.$emit('importDialogSure', objCodeArray);
    },
    // 匹配按钮
    importDialogMatch () {
      if (this.objTablelist.length === 0) {
        this.$message.error('请先选择上传文件');
        return false;
      }
      this.tableLoading = true
      service[this.matchHttpName](this.objTablelist).then(res => {
        this.tableLoading = false
        if (res && res.status === 200) {
          const { matchResult, matchList } = res.data
          this.matchResult = matchResult;
          this.objTablelist = matchList;
          this.tempTableList = matchList;
          if (this.objChecked) {
            const matchFailList = [];
            this.objTablelist.map((item) => {
              if (item.matchResult.includes('匹配失败')) {
                matchFailList.push(item);
              }
            });
            this.objTablelist = matchFailList;
          }
        }
      });
      this.$emit('importDialogMatch');
    },
    // 下载模板
    downloadTemplate () {
      this.$emit('downloadTemplate');
    },
    // 上次文件
    httpRequest (formData) {
      if (this.httpName) {
        this.tableLoading = true
        service[this.httpName](formData).then((res) => {
          this.tableLoading = false
          if (res && res.status === 200) {
            const { matchResult, matchList, excelCheck } = res.data
            if (!excelCheck) {
              this.$message.warning(matchResult)
              return false
            }
            this.matchResult = matchResult;
            this.objTablelist = matchList;
            this.tempTableList = matchList;
            this.isDisabled = false;
            this.objChecked = false
          }
        }).catch(() => {
          this.tableLoading = false
        })
      }
      this.$emit('getFileData', formData);
    },
    // 只看匹配失败
    handleMatchFail (val) {
      if (this.tempTableList.length === 0) {
        this.$message.error('请先选择上传文件');
        this.isDisabled = false;
      }
      if (val) {
        const matchFailList = [];
        this.objTablelist.map((item) => {
          if (item.matchResult.includes('匹配失败')) {
            matchFailList.push(item);
          }
        });
        this.objTablelist = matchFailList;
      } else {
        this.getTableList()
      }
      this.$emit('handleMatchFail', val);
    },
    // 只匹配失败选项为false时，返回所有数据列表
    getTableList () {
      this.tableLoading = true
      serviceParamter[this.importHttpName]().then(res => {
        this.tableLoading = false
        if (res && res.status === 200) {
          const { matchList = [], matchResult } = res.data
          this.matchResult = matchResult
          this.objTablelist = matchList;
        }
      })
    },
    // table样式
    rowClassName ({ row, rowIndex }) {
      const indexRow = rowIndex + 1;
      this.$set(row, 'index', indexRow);
    },
    cellClassName ({ row, column }) {
      if (row.matchResult.includes('匹配失败') && column.property === 'matchResult') {
        return 'color: #F56C6C';
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.tip-show {
  display: block;
  float: right;
}

.download-temp {
  position: absolute;
  top: 0;
  left: 100px
}
</style>
