<template>
  <div class="sizer">
    <el-row v-if="isShowSizer" class="chose">
      <el-col class="chose-item">
        <el-button class="choseBtn" type="primary" size="small" @click="handleShow">
          {{ btnName }}
          <i v-if="btnIcon" class="el-icon--right" :class="btnIcon"></i>
        </el-button>
      </el-col>
    </el-row>
    <div style="display:flex; align-items:center;">
      <span>添加主体：</span>
      <div class="box">
        <p v-for="(item, index) in addMain" :key="item.code" class="selected-item">
          {{ item.name }}
          <i class="del-select-item el-icon-close" @click="deleteItem(index)" />
        </p>
      </div>
    </div>
    <div style="display:flex; align-items:center;">
      <span>删除主体：</span>
      <div class="box">
        <p v-for="(item, index) in delMain" :key="item.code" class="selected-item">
          {{ item.name }}
          <i class="del-select-item el-icon-close" @click="deleteItem2(index)" />
        </p>
      </div>
    </div>

    <el-dialog
      :visible.sync="isShow"
      :title="dialogTitle"
      :before-close="handleDialogClose"
      width="1140px"
      :close-on-click-modal="false"
      :append-to-body="true"
      @open="open"
      @close="sizerClose"
    >
      <BaseForm
        v-if="showDiaolog"
        ref="searchForm"
        :set-options="setOptions"
        :form-data="formData"
        @queryForm="queryForm"
        @blurValue="blurValue"
        @handleCurrentChangeOrg="handleCurrentChangeOrg"
        @getRemoteMethod="getRemoteMethod"
        @selectPageChange="selectPageChange"
      />
      <slot name="btn"></slot>
      <div class="main">
        <el-button type="primary" @click="Mainimport">主体列表导入</el-button>
      </div>
      <!-- 左边 -->
      <div style=" display:flex;align-items: center; justify-content: center;width:100%;">
        <div style="width:400px;height:406px; border:1px solid #dfe3ea">
          <div class="header">
            <el-checkbox v-model="MainCheck" :indeterminate="indeterminate" @change="allChange"
              >主体列表</el-checkbox
            >
            <span>{{ checkList.length }}/{{ total || checkData.length }}</span>
          </div>
          <div class="search">
            <el-input
              v-model="state1"
              class="inline-input"
              placeholder="请输入内容"
              style="width:300px;border-radius:50px;"
              prefix-icon="el-icon-search"
              @input="input"
            ></el-input>
          </div>
          <div class="checked">
            <el-checkbox-group v-model="checkList" @change="changeCheckList">
              <el-checkbox
                v-for="item in checkData"
                :key="item.code"
                :label="item.code"
                style="display:block;margin-top:5px"
                >{{ item.name }}</el-checkbox
              >
            </el-checkbox-group>
          </div>

          <el-pagination
            :current-page="pageNum"
            :page-size="pageSize"
            layout="prev, pager, next, jumper"
            :total="total"
            hide-on-single-page
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          >
          </el-pagination>
        </div>
        <!-- 按钮 -->
        <div style="margin-right:30px;margin-left:30px">
          <!-- 添加的按钮 -->
          <div>
            <div>
              <el-button type="primary" icon="el-icon-arrow-right" @click="addRight"></el-button>
            </div>
            <div style="margin-top:20px">
              <el-button type="primary" icon="el-icon-arrow-left" @click="addLeft"></el-button>
            </div>
          </div>
          <div>
            <!-- 删除的按钮 -->
            <div style="margin-top:120px">
              <el-button type="primary" icon="el-icon-arrow-right" @click="delRight"></el-button>
            </div>
            <div style="margin-top:20px">
              <el-button type="primary" icon="el-icon-arrow-left" @click="delLeft"></el-button>
            </div>
          </div>
        </div>
        <!-- 右边 -->
        <div>
          <!-- 右上 -->
          <div style="width:400px;; border:1px solid #dfe3ea ">
            <div class="header">
              <el-checkbox v-model="addCheck" :indeterminate="addIndeterminate" @change="addChange"
                >添加主体</el-checkbox
              >
              <span>{{ addCheckList.length }}/{{ addCheckData.length }}</span>
            </div>
            <div class="checked-right">
              <el-checkbox-group v-model="addCheckList" @change="changeAddCheckList">
                <el-checkbox
                  v-for="item in addCheckData"
                  :key="item.code"
                  :label="item.code"
                  style="display:block;margin-top:5px"
                  >{{ item.name }}</el-checkbox
                >
              </el-checkbox-group>
            </div>
          </div>
          <!-- 右下 -->
          <div style="width:400px; margin-top:50px; border:1px solid #dfe3ea">
            <div class="header">
              <el-checkbox v-model="delCheck" :indeterminate="delIndeterminate" @change="delChange"
                >删除主体</el-checkbox
              >
              <span>{{ delCheckList.length }}/{{ delCheckData.length }}</span>
            </div>
            <div class="checked-right">
              <el-checkbox-group v-model="delCheckList" @change="changeDelCheckList">
                <el-checkbox
                  v-for="item in delCheckData"
                  :key="item.code"
                  :label="item.code"
                  style="display:block;margin-top:5px"
                  >{{ item.name }}</el-checkbox
                >
              </el-checkbox-group>
            </div>
          </div>
        </div>
      </div>
      <slot></slot>
      <slot
        name="footer"
        :handleClose="handleDialogClose"
        :handleSave="handleDialogSave"
        :selectedData="selectedData"
      ></slot>
      <query :dialog-visible="dialogVisible" @close="close" @transmit="transmit" />
    </el-dialog>
  </div>
</template>

<script>
/**
 * @props
 * isShowSizer: 是否显示筛选器
 * isShowTransfer: 是否显示穿梭框
 * sizers：筛选器 配置
 * labelWidth：表单label宽度
 */
import { mapGetters } from 'vuex'
import query from './query.vue'
import { dateConfig } from '@utils/util'
import BaseForm from '@components/BaseForm'
import { formData } from './main'
import {
  getIndustryList,
  getOrgAnalystList,
  getMainList,
  getSubjNameList,
  getOrgMuniRregionlist,
  getOrgRregionList
} from '@api/bondYield'
import cloneDeep from 'lodash/cloneDeep'

export default {
  name: 'Qq',
  components: {
    query,
    BaseForm
  },
  props: {
    isShowSizer: {
      type: Boolean,
      default: false
    },
    isShowTransfer: {
      type: Boolean,
      default: false
    },
    sizerTitle: {
      type: String,
      default: ''
    },
    btnName: {
      type: String,
      default: ''
    },
    btnIcon: {
      type: String,
      default: ''
    },
    sizers: {
      type: Array,
      default: () => []
    },
    labelWidth: {
      type: String,
      default: () => '120px'
    },
    dataType: {
      type: String,
      default: 'formData'
    },
    transferData: {
      type: Array,
      default: () => []
    },
    formList: {
      type: Array,
      default: () => []
    },
    selected: {
      type: Array,
      default: () => {}
    },
    dialogTitle: {
      type: String,
      default: ''
    },
    dialogWidth: {
      type: String,
      default: '1300px'
    },
    sizerForm: {
      type: Object,
      default: () => {}
    },
    rules: {
      type: Object,
      default: () => {}
    },
    dialogShow: {
      type: Boolean,
      default: false
    },
    shuttleData: {
      type: Array,
      default: () => []
    },
    checkData1: {
      type: Array,
      default: () => []
    },
    addCurveRuleList: {
      type: Array,
      default: () => []
    },
    delCurveRuleList: {
      type: Array,
      default: () => []
    },
    mainBtn: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      setOptions: {},
      showDiaolog: true,
      formData,
      shade: false,
      pickerOptions: {
        disabledDate: time => {
          return !this.ableDate.includes(this.$moment(time).format('YYYYMMDD'))
        }
      },
      dialogFormData: {},
      dialogName: '',
      sizerData: {},
      // formList: [],
      selectedData: [], // 穿梭框数据。
      currentType: '',
      isShow: false,
      // selectedDataNames: []
      pageConfig: {
        total: 0,
        current: 1,
        pageSize: 100
      },
      transferPageConfig: {
        currentPage: 1,
        total: 0,
        pageSize: 100
      },
      // 列表主体
      checkList: [],
      // // 列表数据
      checkData: [],
      // 添加的列表主体
      addCheckList: [],
      // 添加的列表数据:
      addCheckData: [...this.addCurveRuleList],
      // 删除的列表主体，
      delCheckList: [],
      // 删除的列表数据
      delCheckData: [...this.delCurveRuleList],
      state1: '',
      // 添加主体需要的数据
      addMain: [...this.addCurveRuleList],
      // 删除主体需要的数据
      delMain: [...this.delCurveRuleList],
      // 控制主体列表导入
      dialogVisible: false,
      // 主体列表全选反选按钮
      MainCheck: false,
      // 主体列表的全选反选按钮图标
      indeterminate: false,
      // 添加列表的全选反选按钮
      addCheck: false,
      // 添加列表的全选反选按钮图标
      addIndeterminate: false,
      // 删除列表的全选反选按钮
      delCheck: false,
      // 删除列表的全选反选按钮图标
      delIndeterminate: false,
      // 穿梭框的
      pageNum: 1,
      // 穿梭框的
      pageSize: 100,
      tabel: {
        pageNum: 1,
        pageSize: 100
      },
      // 穿梭框当前的总数
      total: 0,
      // form表单的深拷贝数据
      val: {},
      // ◆  模糊查询的
      pageNumOne: 1,
      // 模糊查询的字符串
      queryVal: '',
      // 时间
      bizDate: '',
      initOrg: {
        list: [],
        total: 0,
        index: 0
      }
    }
  },
  computed: {
    selectedDataNames() {
      let result = this.transferData.filter((item, index) => {
        let { code, name } = item
        if (this.selectedData.includes(code)) {
          return name
        }
      })
      return result
    },
    ...mapGetters({ ableDate: 'ableDate' }),
    defaultValue() {
      return dateConfig().endDate
    }
  },
  watch: {
    sizerData: {
      handler(n) {
        this.sizerData = n
      },
      deep: true
    },
    formList: {
      handler(n) {
        this.formList = n
      },
      deep: true
    },
    dialogShow: {
      handler(v) {
        this.isShow = this.dialogShow
      },
      immediate: true
    },
    transferData: {
      handler(n) {
        this.transferData = n
      },
      deep: true
    },
    shuttleData: {
      handler(arr) {},
      immediate: true
    },
    checkData1(val) {
      let addcode = this.addCheckData.map(item => item.code)
      let delcode = this.delCheckData.map(item => item.code)
      val = val.filter(item => ![...addcode, ...delcode].includes(item.code))
      this.checkData = val
    },
    delCurveRuleList: {
      handler(arr) {},
      deep: true
    },
    checkList: {
      handler(val) {
        if (val.length === 0) {
          this.indeterminate = false
          this.MainCheck = false
        }
      },
      deep: true
    },
    addCheckList: {
      handler(val) {
        if (val.length === 0) {
          this.addIndeterminate = false
          this.addCheck = false
        }
      },
      deep: true
    },
    delCheckList: {
      handler(val) {
        if (val.length === 0) {
          this.delIndeterminate = false
          this.delCheck = false
        }
      },
      deep: true
    }
  },
  methods: {
    change(v) {
      this.$emit('change', v)
    },
    init() {
      let arr = this.formList
      let obj = {}
      if (arr.length > 0) {
        arr.map(item => {
          let { defaultValue, prop, props, defaultValues } = item
          if (defaultValue) {
            obj[prop] = defaultValue || ''
          }
          if (defaultValues && defaultValues.length > 0) {
            obj[props[0]] = defaultValues[0] || ''
            obj[props[1]] = defaultValues[1] || ''
          }
        })
      }
      this.sizerData = Object.assign({}, obj)
    },
    initDialogForm() {},
    // 弹窗事件
    handleShow() {
      this.change(true)
      this.isShow = true
    },
    // 弹窗关闭事件
    handleDialogClose() {
      this.isShow = false
    },
    // 点击确定返回选择数据
    handleDialogSave() {
      this.$message.success('确定操作')
      // this.addMain = this.addCheckData.filter(item => {
      //   return this.addCheckList.includes(item.code)
      // })
      this.addMain = this.addCheckData
      // this.delMain = this.delCheckData.filter(item => {
      //   return this.delCheckList.includes(item.code)
      // })
      this.delMain = this.delCheckData
      if (this.addMain !== []) {
        this.$emit('handleSave', this.addMain, this.delMain)
      } else {
        this.$emit('handleSave', this.selectedData)
      }
      this.isShow = false
    },
    inputFormat(val, key) {
      let value = val.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1').replace(/^0+(\d)/, '$1')
      this.sizerForm[key] = value
    },
    handleDateChange(date) {
      this.$emit('bizDateChange', date)
    },
    // 清空
    handleEmpty(current) {
      this.selectedData = []
      this.$emit('handleEmpty', current)
    },
    deleteItem(params) {
      if (this.addMain.length > 0) {
        this.addMain.splice(params, 1)
        this.addCheckData = this.addMain
        this.$emit('handleSave', this.addMain, this.delMain)
      }
    },
    deleteItem2(params) {
      if (this.delMain.length > 0) {
        this.delMain.splice(params, 1)
        this.delCheckData = this.delMain
        this.$emit('handleSave', this.addMain, this.delMain)
      }
    },
    // 重置
    handleReset() {
      this.selectedData = []
      this.$refs['sizerForm'].resetFields()
      this.$emit('handleReset')
    },
    transferPageChange(v) {
      this.transferPageConfig.currentPage = v
      this.handleSearch()
      this.$emit('sizerPageChange', this.sizerForm)
    },
    handleSearch() {
      let { pageSize, currentPage } = this.transferPageConfig
      this.sizerForm.pageSize = pageSize
      this.sizerForm.pageNum = currentPage
      this.$emit('transferSearch', this.sizerForm)
    },
    // 点击添加右箭头时
    addRight() {
      let newAddCheckData = this.checkData.filter(item => {
        return this.checkList.includes(item.code)
      })
      this.addCheckData = [...newAddCheckData, ...this.addCheckData]
      this.checkData = this.checkData.filter(item => {
        return !this.checkList.includes(item.code)
      })
      this.checkList = []
    },
    // 点击添加左箭头时
    addLeft() {
      let arr = this.addCheckData.filter(item => {
        return this.addCheckList.includes(item.code)
      })
      this.addCheckData = this.addCheckData.filter(item => {
        return !this.addCheckList.includes(item.code)
      })
      this.checkData = [...arr, ...this.checkData]
      this.addCheckList = []
    },
    // 点击删除右箭头时
    delRight() {
      let newAddCheckData = this.checkData.filter(item => {
        return this.checkList.includes(item.code)
      })
      this.delCheckData = [...newAddCheckData, ...this.delCheckData]
      this.checkData = this.checkData.filter(item => {
        return !this.checkList.includes(item.code)
      })
      this.checkList = []
    },
    // 点击删除左箭头时
    delLeft() {
      let arr = this.delCheckData.filter(item => {
        return this.delCheckList.includes(item.code)
      })
      this.delCheckData = this.delCheckData.filter(item => {
        return !this.delCheckList.includes(item.code)
      })
      this.checkData = [...arr, ...this.checkData]
      this.delCheckList = []
    },

    handleSave1(val) {},
    // 当添加的主体发生变化的时候
    changeAddCheckList(val) {
      this.addMain = this.addCheckData.filter(item => {
        return this.addCheckList.includes(item.code)
      })
      let checkedCount = val.length
      this.addCheck = checkedCount === this.addCheckData.length
      this.addIndeterminate = checkedCount > 0 && checkedCount < this.addCheckData.length
    },
    // 当删除的主体发生变化的时候
    changeDelCheckList(val) {
      this.delMain = this.delCheckData.filter(item => {
        return this.delCheckList.includes(item.code)
      })
      let checkedCount = val.length
      this.delCheck = checkedCount === this.delCheckData.length
      this.delIndeterminate = checkedCount > 0 && checkedCount < this.delCheckData.length
    },
    // 关闭主体列表导入
    close(val) {
      this.dialogVisible = val
      this.shade = false
    },
    // 接受来自主体列表导入的数据
    transmit(arr) {
      const code = this.addCheckData.map(item => item.code)
      this.checkData = arr.filter(item => {
        return !code.includes(item.code)
      })
    },
    // 点击主体列表的全选和反选
    allChange(val) {
      let checkData = this.checkData.map(item => {
        return item.code
      })
      this.checkList = val ? checkData : []
      this.indeterminate = false
    },
    // 当主体列表发生变化话的时候
    changeCheckList(val) {
      let checkedCount = val.length
      this.MainCheck = checkedCount === this.checkData.length
      this.indeterminate = checkedCount > 0 && checkedCount < this.checkData.length
    },
    // 点击添加主体列表的全选和反选
    addChange(val) {
      let addCheckData = this.addCheckData.map(item => item.code)
      this.addCheckList = val ? addCheckData : []
      this.addIndeterminate = false
    },
    // 点击删除主体列表的全选和反选
    delChange(val) {
      let delCheckData = this.delCheckData.map(item => item.code)
      this.delCheckList = val ? delCheckData : []
      this.delIndeterminate = false
    },
    // 主体列表导入
    Mainimport() {
      this.dialogVisible = true
      this.shade = true
    },
    // 当搜索的时候
    input(val) {
      if (!val) {
        this.checkData = this.checkData1
      }
      this.checkData = this.checkData.filter(item => {
        return item.name.includes(val)
      })
    },
    // 获取新华等行业
    getIndustryList(params) {
      let code = this.globalDictMap('2060')[0].code
      getIndustryList(code).then(res => {
        if (res && res.status === 200) {
          let { data } = res
          this.formData.renderFrom[3].options = data
        }
      })
      const code1 = this.globalDictMap('2060')[1].code
      getIndustryList(code1).then(res => {
        if (res && res.status === 200) {
          let { data } = res
          this.formData.renderFrom[4].options = data
        }
      })
      const code2 = this.globalDictMap('2060')[2].code
      getIndustryList(code2).then(res => {
        if (res && res.status === 200) {
          let { data } = res
          this.formData.renderFrom[5].options = data
        }
      })
    },
    // 获取主体城投区域二级
    async getOrgRregionFN() {
      const { data } = await getOrgRregionList()
      this.formData.renderFrom[11].options = data
    },
    // 获取主体分析师
    async getOrgAnalystAPI() {
      const res = await getOrgAnalystList()
      this.setOptions.orgAnalystList = res.data
    },
    // 获取主体城投区域三级
    async getOrgMuniRregionlistFN() {
      const { data } = await getOrgMuniRregionlist()
      this.formData.renderFrom[10].options = data
    },
    open() {
      this.showDiaolog = true
      this.getIndustryList()
      this.getOrgAnalystAPI()
      this.getOrgMuniRregionlistFN()
      this.getOrgRregionFN()
      this.bizDate = this.formData.initData.bizDate
      this.initDataList('', this.bizDate)
      this.$emit('open')
    },
    select(val) {
      if (val === 'orgList' && !this.sizerForm.bizDate) {
        this.$message.warning('请先选择日期')
      }
    },
    handleChange(val) {},
    // 远程搜索的时候
    getMainList(val) {
      this.$emit('getMainList', val)
    },
    // 当前页条数发生变化的时候
    handleSizeChange(val) {},
    handleCurrentChange(val) {
      this.tabel.pageNum = val
      this.queryForm(this.val, true)
    },
    // 点击查询的时候
    async queryForm(value, flag) {
      this.val = cloneDeep(value)
      if (!flag) {
        this.checkList = []
        this.tabel.pageNum = 1
      }
      for (const key in this.val) {
        if (!this.val[key] || this.val[key].length === 0) {
          delete this.val[key]
        }
      }
      if (this.val.orgList && this.val.orgList.length === 1) {
        if (this.formData.renderFrom[1].options.length === 0) {
          this.val.boxCode = this.val.orgList.join('')
          delete this.val.orgList
        }
      }
      const res = await getMainList({ ...this.val, ...this.tabel })
      // 获取当删除主体的code码和添加主体的code码
      const addcode = this.addCheckData.map(item => {
        return item.code
      })
      const delcode = this.delCheckData.map(item => {
        return item.code
      })
      const code = [...addcode, ...delcode]
      this.checkData = res.data.list.filter(item => {
        return !code.includes(item.code)
      })
      this.total = res.data.total
    },
    handleCurrentChangeOrg(val, item) {
      this.pageNumOne = val
      this.getDataList(this.queryVal, this.bizDate, item.key)
    },
    blurValue(initData, item) {
      let current = initData[item.key]
      if ((current === undefined || current === '' || current.length === 0) && this.queryVal) {
        initData[item.key] = [this.queryVal]
        this.formData.renderFrom[1].options = []
      }
      this.queryVal = ''
    },
    // 远程搜索
    getRemoteMethod(val, item, formData) {
      const { key } = item
      let initData = cloneDeep(formData)
      const { bizDate } = initData
      if (!bizDate) {
        this.$message.warning('请先选择日期')
        return
      }
      this.bizDate = bizDate
      this.queryVal = val
      this.getDataList(val, bizDate, key)
    },
    getDataList(val, bizDate, key) {
      let params = {}
      params.bizDate = bizDate
      params.code = val
      params.pageNum = this.pageNumOne
      params.pageSize = 6
      getSubjNameList(params).then(res => {
        this.loading = false
        if (res) {
          let { list, total } = res.data
          const index = this.formData.renderFrom.findIndex(item => item.key === 'orgList')
          this.formData.renderFrom[index].options = list
          this.formData.renderFrom[index].getPageInfo.total = total
        }
      })
    },
    initDataList(val, bizDate) {
      let params = {
        bizDate,
        code: val,
        pageNum: this.pageNumOne,
        pageSize: 6
      }
      getSubjNameList(params).then(res => {
        this.loading = false
        if (res) {
          let { list, total } = res.data
          const index = this.formData.renderFrom.findIndex(item => item.key === 'orgList')
          this.formData.renderFrom[index].options = list
          this.formData.renderFrom[index].getPageInfo.total = total
          this.initOrg = { list, total, index }
        }
      })
    },
    sizerClose() {
      this.total = 0
      this.checkData = []
      this.formData.renderFrom[1].getPageInfo.pageNum = 1
      this.pageNumOne = 1
      this.showDiaolog = false
      this.checkList = []
    },
    selectPageChange(val, data, item) {
      if (val.length === 0) {
        const { list, total, index } = this.initOrg
        this.formData.renderFrom[index].options = list
        this.formData.renderFrom[index].getPageInfo.total = total
        this.formData.renderFrom[index].getPageInfo.pageNum = 1
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.sizer {
  margin: 20px 40px 0 40px;

  .choseBtn {
    margin-right: 20px;
  }

  .chose-item {
    display: flex;
  }

  .box {
    display: flex;
    flex: 8;
    height: 40px;
    margin-top: 12px;
    margin-right: 10px;
    margin-bottom: 12px;
    overflow: auto;
    border: 1px solid #e0e3e5;
    border-radius: 4px;
    &::-webkit-scrollbar {
      display: none;
      width: 0;
    }

    .selected-item {
      position: relative;
      height: 20px;
      padding: 0 15px;
      margin: 7px 10px;
      line-height: 20px;
      white-space: nowrap;
      background: #e0e3e5;
      border-radius: 4px;

      .del-select-item {
        position: absolute;
        top: -7px;
        right: 3px;
        display: block;
        width: 5px;
        height: 5px;
        cursor: pointer;

        .el-icon-close {
          &::before {
            font-size: 12px;
            font-weight: 600 !important;
            content: '' !important;
          }
        }
      }
    }
  }
}

.el-form-item {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  margin-right: 0;
  ::v-deep .el-form-item__label {
    line-height: 16px;
  }
  ::v-deep .el-form-item__content {
    margin-left: 0 !important;
    .el-select {
      width: 200px;
      .el-input {
        .el-input__inner {
          padding-right: 51px !important;
        }
      }
    }
  }
  ::v-deep .el-form-item__error {
    width: 220px;
  }
}
.fix-number {
  width: 220px;
  .el-form-item {
    width: 100% !important;
  }
}
.el-scrollbar__view {
  position: relative;
  .select-page {
    position: absolute;
    bottom: 0;
    padding: 0;
  }
}
::v-deep .el-transfer-panel {
  width: 350px !important;
}
.transfer-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 7px;
}
::v-deep .header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48px;
  padding-right: 10px;
  padding-left: 10px;
  margin-bottom: 10px;
  background-color: #f7f8fa;
  border: 1px solid #dfe3ea;
}
::v-deep .search {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
}
::v-deep .checked {
  height: 240px;
  padding-left: 20px;
  overflow-y: scroll;
}
::v-deep .checked-right {
  height: 120px;
  padding-left: 20px;
  overflow-y: scroll;
}
.shade {
  position: absolute;
  top: -500px;
  left: -500px;
  z-index: 2000;
  width: 2000px;
  height: 1500px;
  background-color: rgba($color: #000, $alpha: 0.5);
}
.picker {
  width: 250px !important;
}
::v-deep .el-cascader__tags {
  flex-wrap: nowrap !important;
  overflow: hidden;
  .el-tag--info {
    width: 150px;
  }
}
.el-pagination {
  margin-top: 8px;
  ::v-deep .el-pager {
    width: 204px;
    overflow: hidden;
  }
}
.main {
  margin-top: -34px !important;
  margin-bottom: 20px !important;
}
</style>
