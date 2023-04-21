<template>
  <div v-loading="hideScatterEchart" class="configMain">
    <el-container direction="vertical" class="bodyWrap">
      <BeforeLineTitle :title="beforeTitle" />
      <BeseShuttleBox
        ref="BeseShuttleBox"
        :model="dialogShow"
        :btn-name="'选择单曲线'"
        :btn-icon="'el-icon-plus'"
        :dialog-title="'选择曲线'"
        :dialog-width="'1000px'"
        :shuttle-data="shuttleData"
        :init-data="initData"
        @submitForm="submitForm"
        @deleteItem="deleteItem"
        @trigger="onTrigger"
        @onSubmit="onSubmit"
        @empty="onEmpty"
      >
      </BeseShuttleBox>
      <BaseSelect
        ref="selectBnd"
        :options="selectBndtData"
        @handleEmpty="handleBndmpty"
        @deleteItem="deleteBndItem"
        @handleDialogClose="closeBnd"
        @importDialogSure="importDialogSureBnd"
        @selectSubmitForm="submitFormBnd"
        @selectOpen="selectOpen('bnd')"
        @blurValue="blurValue"
        @selectPageChangeBnd="selectPageChangeBnd"
      >
        <template v-slot:customForm="{ options }">
          <!-- 自定义表单 -->
          <BaseForm
            ref="selectForm"
            :form-data="options.formData"
            :label-width="options.formLabelWith"
            :set-options="options.setOptions"
            @trigger="selectBndTrigger"
            @getRemoteMethod="getBndItemRemoteMethod"
            @queryForm="getBndTransferData"
            @exportBnd="exportFormBnd"
            @templateDownload="templateDownload"
            @blurValue="blurValueBnd"
            @handleCurrentChangeOrg="handleCurrentChangeBnd"
            @selectPageChange="selectPageChangeBnd"
            @resetForm="resetFormBnd"
          >
            <!-- (含权)剩余期限 -->
            <template v-slot:remainPeriod="{ data, rowItem }">
              <el-form-item :label="rowItem.label" class="rowItem">
                <el-row class="fix-number">
                  <el-col :span="11">
                    <el-form-item prop="remainPeriodBegNum">
                      <el-input
                        v-model="data.remainPeriodBegNum"
                        placeholder="请输入"
                        @input="inputFormat(data.remainPeriodBegNum, 'remainPeriodBegNum')"
                      >
                        <template slot="append"
                          >年</template
                        >
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="2" style="text-align: center">-</el-col>
                  <el-col :span="11">
                    <el-form-item prop="remainPeriodEndNum">
                      <el-input
                        v-model="data.remainPeriodEndNum"
                        placeholder="请输入"
                        @input="inputFormat(data.remainPeriodEndNum, 'remainPeriodEndNum')"
                      >
                        <template slot="append"
                          >年</template
                        >
                      </el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form-item>
            </template>
            <!-- 发行规模 -->
            <template v-slot:issueScale="{ data, rowItem }">
              <el-form-item :label="rowItem.label" class="rowItem">
                <el-row class="fix-number">
                  <el-col :span="11">
                    <el-form-item prop="issueScaleBegNum">
                      <el-input
                        v-model="data.issueScaleBegNum"
                        placeholder="请输入"
                        @input="inputFormat(data.issueScaleBegNum, 'issueScaleBegNum')"
                      >
                        <template slot="append"
                          >亿元</template
                        >
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="2" style="text-align: center">-</el-col>
                  <el-col :span="11">
                    <el-form-item prop="issueScaleEndNum">
                      <el-input
                        v-model="data.issueScaleEndNum"
                        placeholder="请输入"
                        @input="inputFormat(data.issueScaleEndNum, 'issueScaleEndNum')"
                      >
                        <template slot="append"
                          >亿元</template
                        >
                      </el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form-item>
            </template>
            <!-- 发行利率 -->
            <template v-slot:issueInterRate="{ data, rowItem }">
              <el-form-item :label="rowItem.label" class="rowItem">
                <el-row class="fix-number">
                  <el-col :span="11">
                    <el-form-item prop="issueRateBegNum">
                      <el-input
                        v-model="data.issueRateBegNum"
                        placeholder="请输入"
                        @input="inputFormat(data.issueRateBegNum, 'issueRateBegNum')"
                      >
                        <template slot="append"
                          >%</template
                        >
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="2" style="text-align: center">-</el-col>
                  <el-col :span="11">
                    <el-form-item prop="issueRateEndNum">
                      <el-input
                        v-model="data.issueRateEndNum"
                        placeholder="请输入"
                        @input="inputFormat(data.issueRateEndNum, 'issueRateEndNum')"
                      >
                        <template slot="append"
                          >%</template
                        >
                      </el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form-item>
            </template>
            <!-- 剩余规模 -->
            <template v-slot:surplusScale="{ data, rowItem }">
              <el-form-item :label="rowItem.label" class="rowItem">
                <el-row class="fix-number mb10">
                  <el-col :span="11">
                    <el-form-item prop="surplusScaleBegNum">
                      <el-input
                        v-model="data.surplusScaleBegNum"
                        placeholder="请输入"
                        @input="inputFormat(data.surplusScaleBegNum, 'surplusScaleBegNum')"
                      >
                        <template slot="append"
                          >亿元</template
                        >
                      </el-input>
                    </el-form-item>
                  </el-col>
                  <el-col :span="2" style="text-align: center">-</el-col>
                  <el-col :span="11">
                    <el-form-item prop="surplusScaleEndNum">
                      <el-input
                        v-model="data.surplusScaleEndNum"
                        placeholder="请输入"
                        @input="inputFormat(data.surplusScaleEndNum, 'surplusScaleEndNum')"
                      >
                        <template slot="append"
                          >亿元</template
                        >
                      </el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form-item>
            </template>
          </BaseForm>
        </template>
        <template v-slot:customTransfer="{ transferData, selectedData, total }">
          <!-- 自定义穿梭框 -->
          <CustomTransfer
            ref="customTransferBnd"
            :transfer-data="transferData"
            :selected-data="selectedData"
            :total="total"
            :transfer-type="'债券简称'"
            @handleCurrentChange="handleBndCurrentChange"
            @searchInputLeft="searchBndInputLeft"
          ></CustomTransfer>
        </template>
        <template v-slot:footer>
          <el-button @click="closeBnd">取消</el-button>
          <el-button type="primary" @click="submitFormBnd">保存</el-button>
        </template>
      </BaseSelect>
      <BaseForm
        :key="BaseFormKey"
        :form-data="formData"
        :label-width="120"
        :set-options="setOptions"
        @queryForm="getQueryForm"
        @diagram="diagram"
        @exportData="exportData"
        @trigger="isTrigger"
      >
        <template v-slot:items="{ data, rowItem }">
          <el-form-item :label="rowItem.label" class="formItem">
            <el-select
              v-model="data.scatterRemainPeriod"
              placeholder="散点剩余期限"
              @change="onRemainPeriod($event)"
            >
              <el-option
                v-for="item in scatterRemainPeriodList"
                :key="item.code"
                :label="item.name"
                :value="item.code"
                :disabled="item.disabled"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </template>
      </BaseForm>
      <div class="proportion">
        <div class="proportionL">
          <Tabs
            v-model="activeTab"
            :tab-list="tabList"
            :type="'card'"
            :default-name="activeTab"
            @handleTabChange="handleTabChange"
          ></Tabs>
          <div v-if="activeTab === '1'" v-loading="hideScatterEchart">
            <div class="inputNumber">
              <el-form label-width="90px">
                <el-form-item label="Y轴区间(%):">
                  <el-input
                    v-model="yminValue"
                    :disabled="!canQuery"
                    placeholder="请输入下限"
                    @input="inputFor(yminValue, 'yminValue')"
                  ></el-input>
                  —
                  <el-input
                    v-model="ymaxValue"
                    :disabled="!canQuery"
                    placeholder="请输入上限"
                    @input="inputFor(ymaxValue, 'ymaxValue')"
                  ></el-input>
                  <el-button type="primary" :disabled="!canQuery" @click="onRefresht"
                    >刷新</el-button
                  >

                  <el-switch
                    v-model="remoCurveName"
                    :disabled="!canQuery"
                    inactive-text="隐藏自定义曲线创建人后缀"
                    @click.native.prevent="onInit"
                  >
                  </el-switch>
                  <el-switch
                    v-model="remoScatt"
                    :disabled="!canQuery"
                    inactive-text="隐藏全部散点"
                    @click.native.prevent="onInit"
                  >
                  </el-switch>
                  <el-dropdown vtrigger="click">
                    <el-button :disabled="!canQuery"
                      >{{ dropdownLabel }}<i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item
                        v-for="(item, index) in dropdownList"
                        :key="index"
                        @click.native="onDropdown(item.label, item.max, item.min)"
                        >{{ item.label }}</el-dropdown-item
                      >
                    </el-dropdown-menu>
                  </el-dropdown>
                </el-form-item>
              </el-form>
            </div>
            <div :style="`height:${echartHeight}px;`">
              <ScatterEchart
                v-if="IsScatterEchart"
                ref="ScatterEchartRef"
                :is-id="'ScatterEchart'"
                :width="echartWidth"
                :height="echartHeight"
              ></ScatterEchart>
            </div>
          </div>
          <FormData
            v-if="activeTab === '2' || activeTab === '3'"
            :table-data="activeTab === '2' ? scatterTableData : morphologyTableData"
            :table-height="'700px'"
            :table-column="activeTab === '2' ? scatterColumns : morphologyColumn"
            has-pagination
            :page-size="1"
            :current-page="table.currentPage"
            :total="table.total"
            :page-sizes="[20, 50, 100]"
            @handleSize="handleSizeChange"
            @handleCurrent="handleCurrent"
          >
          </FormData>
        </div>
        <div v-loading="hideProportionR" class="proportionR">
          <div class="proportionRT">
            <div v-for="(item, index) in bnds" :key="index" class="propItem">{{ item }}</div>
          </div>
          <div class="proportionRT">
            <div v-for="(item, index) in noBnds" :key="index" class="propItem">{{ item }}</div>
          </div>
          <div>
            <el-table :data="collectData" border style="width: 100%">
              <template>
                <el-table-column
                  v-for="(item, index) in collectColumn"
                  :key="index"
                  :prop="item.prop"
                  :label="item.name"
                  align="center"
                >
                </el-table-column>
              </template>
            </el-table>
          </div>
        </div>
      </div>
    </el-container>
  </div>
</template>
<script>
import BeforeLineTitle from '@components/CommonTitle'
import BeseShuttleBox from '@components/ShuttleBox'
import BaseForm from '@components/BaseForm/index.vue'
import FormData from '@components/FormData'
import ScatterEchart from '@components/Echarts/scatterEchart.vue'
import Tabs from '@components/TabPane'
import BaseSelect from '@components/BaseSelect'
import { dateConfig, baseDownLoad, compare, initData, isEmpty } from '@utils/util'
import { graphicTitle, debentureTitle, curveTitle, dropdownList } from '@utils/message'
import initDictMixin from '../../valuation/multiagent/mixins/initData.mixin'
import CustomTransfer from '../../valuation/multiagent/components/customTransfer.vue'
import {
  formData,
  tabList,
  scatterColumns,
  collectColumn,
  morphologyColumn,
  collectData
} from './lib/data'
import cloneDeep from 'lodash/cloneDeep'
import { mapGetters } from 'vuex'
import * as service from '@api/curvefitting'
import * as serviceMang from '@api/curveManagement'
import * as servicRou from '@api/curveRoule'
import * as serviceYid from '@api/bondYield'
import keepMixin from '@mixins/keep.mixin'
import * as bnd from '@libs/selectBndFormData'
export default {
  name: 'CurvefittingDebenture',
  components: {
    BeforeLineTitle,
    BeseShuttleBox,
    BaseForm,
    Tabs,
    ScatterEchart,
    FormData,
    BaseSelect,
    CustomTransfer
  },
  mixins: [keepMixin, initDictMixin],
  data() {
    return {
      beforeTitle: '债券偏离度分析',
      activeTab: '1',
      tabList,
      scatterColumns, // 散点图表头
      scatterColumnsTw: cloneDeep(scatterColumns),
      scatterTableData: [],
      morphologyColumn, // 形态表头
      morphologyTableData: [],
      table: {
        currentPage: 1,
        total: 0,
        pageSize: 20
      },
      collectColumn,
      collectData,
      bndForm: {
        bizDate: dateConfig().endDate
      },
      loading: false,
      selectedBnd: [], // 已选债券
      orgFilterList: [],
      dialogShow: false, // 弹窗状态
      isDownload: false,
      hideScatterEchart: false,
      hideProportionR: false,
      hideTableList: false,
      gradeList: [],
      bndGradeList: [],
      industryList: [],
      formData,
      bondTransferData: [],
      setOptions: {},
      shuttleData: [], // 穿梭框数据
      initData: {
        data: [
          { label: '曲线类型:', key: 'curveTp', type: 'Select', options: [] },
          {
            label: '曲线簇名称/曲线创建人:',
            key: 'creater',
            type: 'Select',
            class: 'curve',
            filterable: true,
            clearable: true,
            multiple: true,
            options: []
          },
          {
            label: '曲线名称:',
            key: 'curveName',
            type: 'Select',
            filterable: true,
            clearable: true,
            multiple: true,
            options: []
          },
          { label: '', key: '查询', type: 'Button' }
        ],
        form: {
          curveType: '',
          curveCreatePrsnList: [],
          curveList: []
        }
      },
      shuttleEnclosure: [],
      ruleForm: {},
      bndNameList: [],
      IsScatterEchart: false,
      yesConfirm: '',
      bnds: ['参与分析债券:'],
      noBnds: ['未参与分析债券:'],
      ymaxValue: '',
      yminValue: '',
      remoCurveName: false,
      remoScatt: false,
      canQuery: false,
      bndInnerCodeList: [],
      scatterRemainPeriodList: [
        { name: '原始', code: '1', disabled: false },
        { name: '投射到3年', code: '2', disabled: false }
      ],
      echartWidth: '',
      echartHeight: '',
      echartOriginalWidth: 1200,
      echartOriginalHeight: 750,
      dropdownLabel: '原始比例',
      dropdownList,
      renderFromCopy: [],
      BaseFormKey: 1
    }
  },
  computed: {
    ...mapGetters({ ableDate: 'ableDate' })
  },
  mounted() {
    this.collectData.forEach(element => {
      element.value = ''
    })
    this.echartWidth = this.echartOriginalWidth
    this.echartHeight = this.echartOriginalHeight
    this.initDict()
  },
  methods: {
    onRemainPeriod(val) {
      let title = ''
      const { beginDate, endDate } = this.ruleForm
      if (beginDate === undefined && endDate === undefined) {
        this.ruleForm = { ...formData.initData }
      }
      if (val === '1') {
        title =
          '注意：①此处将呈现所选曲线的3年期利率走势图及所选债项真实成交样本（不含虚拟成交）平移到3年的散点②下图仅展示已拟合时间区间内的曲线和散点信息'
      } else {
        title =
          '注意：①此处将呈现所选曲线的3年期利率走势图及所选债项真实成交样本（不含虚拟成交）投射到3年的散点②下图仅展示已拟合时间区间内的曲线和散点信息'
      }
      formData.butData[0].label = title
      formData.initData = {
        ...this.ruleForm,
        scatterRemainPeriod: val
      }
      this.BaseFormKey++
    },
    inputFor(val, key) {
      let value = val.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1').replace(/^0+(\d)/, '$1')
      this[key] = value
    },
    inputFormat(val, key) {
      let value = val.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1').replace(/^0+(\d)/, '$1')
      this.bndForm[key] = value
    },
    resetFormBnd() {
      this.initSelect('bnd')
    },
    initDict() {
      serviceMang.getgroupQueryList().then(res => {
        if (res && res.status === 200) {
          const { curveTpList } = res.data
          this.initData.data[0].options = curveTpList
        } // 曲线类型
      })
      servicRou.getcCrveDropDownBox({}).then(res => {
        if (res && res.status === 200) {
          const { curveCreatePrsnList, curveList } = res.data
          this.initData.data[1].options = curveCreatePrsnList
          this.initData.data[2].options = curveList // 曲线名称
          res.data.curveList.forEach(element => {
            const { name, code, defaultCode } = element
            this.shuttleData.push({
              check: false,
              curveName: name,
              curveId: code,
              curveType: defaultCode
            })
          })
        }
      })
    },
    isTrigger(val) {
      this.ruleForm = { ...val }
      if (val.scatterRemainPeriod === '2') {
        this.scatterColumns = [
          ...this.scatterColumns,
          ...[
            {
              name: '投射到3年期后偏离(bp)',
              prop: 'aftThrInter',
              align: 'center'
            }
          ]
        ]
      } else {
        this.scatterColumns = this.scatterColumnsTw
      }
    },
    onTrigger(val, item) {
      const { key } = item
      if (key === 'curveTp') {
        this.initData.form.curveType = val
        this.initData.form.curveCreatePrsnList = []
        this.initData.form.curveList = []
        this.initData.creater = []
        this.initData.curveName = []
      } else if (key === 'creater') {
        this.initData.form.curveCreatePrsnList = val
      } else if (key === 'curveName') {
        this.initData.form.curveList = val
      }
      const data = {
        curveType: this.initData.form.curveType || '',
        curveCreatePrsnList: this.initData.form.curveCreatePrsnList || '',
        curveList: this.initData.form.curveList || ''
      }
      servicRou.getcCrveDropDownBox(data).then(res => {
        if (res && res.status === 200) {
          const { curveCreatePrsnList, curveList } = res.data
          this.initData.data[1].options = curveCreatePrsnList
          if (key !== 'curveName') {
            this.initData.data[2].options = curveList
          }
        }
      }) // 曲线
    },
    onEmpty(val) {
      this.shuttleEnclosure = val
    },
    onSubmit() {
      this.shuttleData = []
      const data = {
        ...this.initData.form
      }
      this.$refs.BeseShuttleBox.onlefSearchList = true
      servicRou.getcCrveDropDownBox(data).then(res => {
        if (res && res.status === 200) {
          res.data.curveList.forEach(element => {
            const { name, code, defaultCode } = element
            this.shuttleData.push({
              check: false,
              curveName: name,
              curveId: code,
              curveType: defaultCode
            })
          })
          this.$refs.BeseShuttleBox.onlefSearchList = false
        }
      })
    },
    handleTabChange(data) {
      this.activeTab = data.name
      this.table = {
        currentPage: 1,
        total: 0,
        pageSize: 20
      }
      if (this.canQuery) {
        if (this.shuttleEnclosure.length === 0) {
          this.$message({
            message: '请选择曲线后进行查询',
            type: 'warning'
          })
          return
        }
        if (this.activeTab === '1') {
          this.init()
        } else if (this.activeTab === '2') {
          this.scatter()
        } else if (this.activeTab === '3') {
          this.morphology()
        }
      }
    }, // tab切换
    handleSizeChange(v) {
      this.table.pageSize = v
      this.table.currentPage = 1
      if (this.activeTab === '2') {
        this.scatter()
      } else if (this.activeTab === '3') {
        this.morphology()
      }
    },
    handleCurrent(v) {
      this.table.currentPage = v
      if (this.activeTab === '2') {
        this.scatter()
      } else if (this.activeTab === '3') {
        this.morphology()
      }
    },
    scatter() {
      const { beginDate, endDate, scatterRemainPeriod } = this.ruleForm
      const { curveId, curveName, curveType } = this.shuttleEnclosure[0]
      const params = {
        beginDate: beginDate,
        endDate: endDate,
        bndInnerCodeList: this.bndInnerCodeList,
        curveId: curveId,
        curveName: curveName,
        curveType: curveType,
        scatterRemainPeriod: scatterRemainPeriod,
        pageNum: this.table.currentPage,
        pageSize: this.table.pageSize,
        pageType: '4',
        yesConfirm: this.yesConfirm || ''
      }
      this.hideScatterEchart = true
      service
        .treScatterQuery(params)
        .then(res => {
          const { status, message } = res
          if (status === 200) {
            const title =
              '因期限选取投射到3年，每日仅展示所选债项中标准曲线对应的估值券的交易点，其余交易点不展示。是否确认？'
            if (message === title) {
              this.$confirm(title, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              })
                .then(() => {
                  this.yesConfirm = true
                  this.init()
                })
                .catch(() => {})
            } else {
              const { list, total } = res.data
              if (scatterRemainPeriod === '1') {
                this.scatterColumns = [...this.scatterColumnsTw]
              } else {
                this.scatterColumns = [
                  ...this.scatterColumnsTw,
                  ...[
                    {
                      name: '投射到3年期后偏离(bp)',
                      prop: 'aftThrInter',
                      align: 'center'
                    }
                  ]
                ]
              }
              this.scatterTableData = list
              this.table.total = total
              this.yesConfirm = ''
              this.hideScatterEchart = false
            }
          } else {
            this.hideScatterEchart = false
          }
        })
        .catch(() => {
          this.hideProportionR = false
        })
    }, // 散点图数据
    morphology() {
      const { beginDate, endDate, scatterRemainPeriod } = this.ruleForm
      const params = {
        beginDate: beginDate,
        curveVOs: this.shuttleEnclosure,
        endDate: endDate,
        pageNum: this.table.currentPage,
        pageSize: this.table.pageSize,
        pageType: '4',
        rateOrInterMargin: '1',
        scatterRemainPeriod: scatterRemainPeriod,
        risklessInterRates: []
      }
      this.hideScatterEchart = true
      service
        .modtQuery(params)
        .then(res => {
          if (res && res.status === 200) {
            const { describe, analRowData, modtColumnVo, total } = res.data
            this.morphologyTableData = analRowData
            this.table.total = total
            this.morphologyColumn = [{ name: describe, prop: '', children: modtColumnVo }]
            this.hideScatterEchart = false
          } else {
            this.hideScatterEchart = false
          }
        })
        .catch(() => {
          this.hideScatterEchart = false
        })
    }, // 形态数据
    collect() {
      const { beginDate, endDate, scatterRemainPeriod } = this.ruleForm
      const { curveId, curveName, curveType } = this.shuttleEnclosure[0]
      const params = {
        beginDate: beginDate,
        endDate: endDate,
        bndInnerCodeList: this.bndInnerCodeList,
        bndNameList: this.bndNameList,
        curveId: curveId,
        curveName: curveName,
        curveType: curveType,
        scatterRemainPeriod: scatterRemainPeriod,
        pageNum: this.table.currentPage,
        pageSize: this.table.pageSize
      }
      this.hideProportionR = true
      service
        .sumQuery(params)
        .then(res => {
          if (res && res.status === 200) {
            const { bnds, noBnds } = res.data
            this.bnds = (bnds && ['参与分析债券:', ...bnds.split(',')]) || ['参与分析债券:']
            this.noBnds = (noBnds && ['未参与分析债券:', ...noBnds.split(',')]) || [
              '未参与分析债券:'
            ]
            collectData.forEach(element => {
              if (res.data[element.key]) {
                element.value = res.data[element.key]
              }
            })
            this.hideProportionR = false
          } else {
            this.hideProportionR = false
          }
        })
        .catch(() => {
          this.hideProportionR = false
        })
    }, // 汇总列表
    onRefresht() {
      if (this.canQuery) {
        if (this.ymaxValue && this.yminValue) {
          if (Number(this.yminValue) > Number(this.ymaxValue)) {
            this.$message.warning('Y轴区间下限应小于等于区间上限，请修改区间设定')
            return false
          }
        } else if (isEmpty(this.yminValue) && isEmpty(this.ymaxValue)) {
          this.init()
          return
        } else {
          this.$message.warning('请完善Y轴上限或下限')
          return false
        }
        if (this.ruleForm.scatterRemainPeriod === '2') {
          this.yesConfirm = true
        }
        this.init()
      }
    },
    init() {
      const { beginDate, endDate, scatterRemainPeriod } = this.ruleForm
      const { curveId, curveName, curveType } = this.shuttleEnclosure[0]
      if (endDate < beginDate) {
        this.$message({
          message: '结束日期必须大于开始日期',
          type: 'warning'
        })
        return
      }
      const params = {
        beginDate: beginDate,
        endDate: endDate,
        bndInnerCodeList: this.bndInnerCodeList,
        curveId: curveId,
        curveName: curveName,
        curveType: curveType,
        scatterRemainPeriod: scatterRemainPeriod,
        yesConfirm: this.yesConfirm || '',
        ymaxValue: this.ymaxValue,
        yminValue: this.yminValue,
        remoCurveName: this.remoCurveName ? 1 : 0,
        remoScatt: this.remoScatt ? 1 : 0
      }
      this.hideScatterEchart = true
      this.initEcharts(params)
    },
    initEcharts(params) {
      service
        .trePointLineDevQuery(params)
        .then(res => {
          const { status, message } = res
          if (status === 200) {
            const title =
              '因期限选取投射到3年，每日仅展示所选债项中标准曲线对应的估值券的交易点，其余交易点不展示。是否确认？'
            if (message === title) {
              this.$confirm(title, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              })
                .then(() => {
                  this.yesConfirm = true
                  this.init()
                })
                .catch(() => {})
            } else {
              this.IsScatterEchart = false
              const { lineList, lineListName, scatterList, scatterListName } = res.data
              const data = {
                configuration: {
                  optionTitle:
                    '◆灰色菱形点：手动删除的点、▲橙色三角形点：本曲线异常值点、■蓝色方形点：虚拟样本点、●绿色圆形点：其余真实成交点',
                  xAxisName: '日期',
                  yAxisName: '收益率/%',
                  boundaryGap: true,
                  xAxisType: 'category',
                  xAxisSplitLineShow: true,
                  xAxisSplitLineShowlineStyle: '#fff',
                  xAxisAxisLineShow: true,
                  xAxisAxisLineShowlineStyle: '#000',
                  xAxisAxisLabelColor: '#000',
                  yAxisType: 'value',
                  yAxisSplitLineShow: true,
                  yAxisSplitLineShowlineStyle: '#fff',
                  yAxisAxisLineShow: true,
                  yAxisAxisLineShowlineStyle: '#000',
                  yAxisAxisLabelColor: '#000',
                  legendShow: true,
                  legendShowType: 'scroll',
                  scatterListName: scatterListName,
                  lineListName: lineListName,
                  seriesType: 'line',
                  seriesSmooth: true,
                  bottomGrid: '15%',
                  leftGrid: '10%',
                  rightGrid: '10%',
                  legendShowBottom: '8%',
                  topGrid: '10%',
                  yAxisMax: this.ymaxValue !== '' ? this.ymaxValue : undefined,
                  yAxisMin: this.yminValue !== '' ? this.yminValue : undefined,
                  lineList: lineList,
                  scatterList: scatterList,
                  scatterTooltipTriggr: 'axis',
                  handleFormatter: this.handleFormatter
                }
              }
              this.IsScatterEchart = true
              this.yesConfirm = ''
              this.$nextTick(() => {
                this.$refs.ScatterEchartRef.init(data)
              })
              this.hideScatterEchart = false
            }
          } else {
            this.hideScatterEchart = false
            this.IsScatterEchart = false
          }
        })
        .catch(() => {
          this.hideScatterEchart = false
          this.IsScatterEchart = false
        })
    },
    handleFormatter(params) {
      let str = ''
      let arr = params.sort(compare('data', 1))
      arr.map(item => {
        const { data, componentSubType, color } = item
        if (componentSubType === 'line') {
          if (data[2] !== undefined || data[6] !== undefined) {
            str += `
          <span class="echart-tip-icon" style="background-color:${color};"></span>
          <span>${data[2]}/(含权)剩余期限:${data[5]}年/收益率:${data[6]}<span><br>`
          } else {
            str += `
          <span class="echart-tip-icon" style="background-color:${color};"></span>
          <span>暂无数据<span><br>`
          }
        } else if (componentSubType === 'scatter') {
          str += `<span class="echart-tip-icon" style="background-color:${color};"></span>
              <span>债券简称:${data[3]}/债券代码:${data[2]}/成交日期:${data[4]}</span><br>
              <span>(含权)剩余期限:${data[5]}年/投射3年收益率:${data[7]}%<span><br>`
        }
      })
      return `日期:` + params[0].axisValue + `<br>` + str
    },
    submitForm(val) {
      this.shuttleEnclosure = val
      if (val[0].curveType === '1') {
        this.scatterRemainPeriodList[1].disabled = true
        formData.initData = {
          ...(Object.values(this.ruleForm).length > 0 ? this.ruleForm : formData.initData),
          scatterRemainPeriod: val[0].curveType
        }
        formData.butData[0].label =
          '注意：①此处将呈现所选曲线的3年期利率走势图及所选债项真实成交样本（不含虚拟成交）平移到3年的散点②下图仅展示已拟合时间区间内的曲线和散点信息'
        this.BaseFormKey++
      } else {
        this.scatterRemainPeriodList[1].disabled = false
      }
    },
    deleteItem(val) {
      this.shuttleEnclosure = val
    },
    getQueryForm(fromData) {
      if (this.shuttleEnclosure.length === 0) {
        this.$message({
          message: '请选择曲线后进行分析',
          type: 'warning'
        })
        return
      }
      this.bndInnerCodeList = []
      this.bndNameList = []
      this.selectBndtData.selectedData.forEach(element => {
        this.bndInnerCodeList.push(element.code)
        this.bndNameList.push(element.name)
      })
      if (this.bndInnerCodeList.length === 0) {
        this.$message({
          message: '请选择债券后进行分析',
          type: 'warning'
        })
        return
      }
      this.canQuery = true
      this.ruleForm = { ...fromData }
      this.yminValue = ''
      this.ymaxValue = ''
      this.table = {
        currentPage: 1,
        total: 0,
        pageSize: 20
      }
      this.queryForm()
    },
    queryForm() {
      if (this.activeTab === '1') {
        this.init()
        this.collect()
      } else if (this.activeTab === '2') {
        this.scatter()
      } else if (this.activeTab === '3') {
        this.morphology()
      }
    },
    diagram() {
      if (this.IsScatterEchart === true && this.activeTab === '1') {
        this.$refs.ScatterEchartRef.download()
      } else {
        this.$message({
          message: graphicTitle,
          type: 'warning'
        })
      }
    },
    exportData() {
      if (this.shuttleEnclosure.length === 0) {
        this.$message({
          message: curveTitle,
          type: 'warning'
        })
        return
      }
      if (this.selectBndtData.selectedData.length === 0) {
        this.$message({
          message: debentureTitle,
          type: 'warning'
        })
        return
      }
      const { beginDate, endDate, scatterRemainPeriod } = this.ruleForm
      const { curveId, curveName, curveType } = this.shuttleEnclosure[0]
      const data = {
        beginDate: beginDate,
        endDate: endDate,
        bndInnerCodeList: this.bndInnerCodeList,
        curveId: curveId,
        curveType: curveType,
        curveName: curveName,
        pageNum: this.table.currentPage,
        pageSize: this.table.pageSize,
        scatterRemainPeriod: scatterRemainPeriod,
        yesConfirm: true
      }
      if (this.canQuery) {
        baseDownLoad(service.treBndDeviExcel, data)
      } else {
        this.$message.warning('请查询数据后导出')
      }
    },
    removeDp(arr1, arr2) {
      let arr = arr1.concat(arr2)
      let obj = {}
      let newArray = arr.reduce((pre, cur) => {
        if (!obj[cur.code]) {
          obj[cur.code] = true
          pre.push(cur)
        }
        return pre
      }, [])
      return newArray
    },
    onInit() {
      if (this.canQuery) {
        this.init()
      }
    },
    selectOpen(type) {
      this.initSelect(type)
    },
    handleBndmpty() {
      this.$set(this.selectBndtData, 'selectedData', [])
      this.searchParam.bndList = []
      this.selectParamsBnd = []
    },
    deleteBndItem(index) {
      this.selectBndtData.selectedData.splice(index, 1)
    },
    closeBnd() {
      this.$refs.customTransferBnd.selectedRight = []
      this.$refs.customTransferBnd.codeArrRight = []
      this.selectBndtData.transferData = []
      this.selectBndtData.total = 0
      this.$refs.customTransferBnd.pageLeft.currentPage = 1
      this.renderFromCopy = cloneDeep(bnd.renderFrom)
      const { formData } = this.selectBndtData
      this.$set(formData, 'initData', initData(formData.renderFrom))
      this.$set(formData, 'renderFrom', this.renderFromCopy)
      this.initSelect('bnd')
      this.$refs.selectBnd.isShow = false
    },
    submitFormBnd() {
      if (!this.selectBndtData.isShowTransfer) {
        const selectedRight = this.$refs.customTransferBnd.selectedRight || []
        const dataListRight = this.$refs.customTransferBnd.dataListRight
        this.selectParamsBnd = selectedRight.length > 0 ? selectedRight : dataListRight
        if (this.selectParamsBnd.length > 200) {
          this.$message.warning('最多选择200个债券')
          return false
        } else {
          this.$set(this.selectBndtData, 'selectedData', this.selectParamsBnd)
          this.closeBnd()
        }
      }
    },
    exportFormBnd() {
      this.$refs.selectBnd.$refs.dialog.importDialogOpen()
    },
    templateDownload() {
      serviceYid.bondTemplate()
    },
    onDropdown(val, max, min) {
      if (this.canQuery) {
        if (val === '原始比例') {
          this.echartWidth = this.echartOriginalWidth
          this.echartHeight = this.echartOriginalHeight
        } else {
          let echartOriginalmax = this.echartOriginalWidth / max
          let echartOriginalmin = this.echartOriginalHeight / min
          let mins = echartOriginalmax > echartOriginalmin ? echartOriginalmin : echartOriginalmax
          this.echartWidth = mins * max
          this.echartHeight = mins * min
        }
        this.dropdownLabel = val
        this.IsScatterEchart = false
        this.hideScatterEchart = true
        this.init()
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

    .proportion {
      position: relative;
      box-sizing: border-box;
      display: flex;
      width: 100%;
      padding-bottom: 20px;
      background-color: #fff;

      .proportionL {
        box-sizing: border-box;
        width: 1200px;
        .inputNumber {
          width: 100%;
          padding: 0 10px;
        }
        ::v-deep .el-input {
          width: 110px !important;
        }
        ::v-deep .el-button {
          margin-left: 20px;
        }
        ::v-deep .el-switch {
          margin-left: 30px;
        }
        ::v-deep .el-switch__label.is-active {
          color: #303133;
        }
      }

      .proportionR {
        position: relative;
        box-sizing: border-box;
        width: calc(100% - 1200px);
        padding: 0 10px;
        margin-top: 40px;
        .proportionRT {
          position: relative;
          display: inline-block;
          width: 100%;
          height: 100px;
          margin-bottom: 10px;
          overflow-y: auto;
          border: 1px solid #e6e9eb;
          border-radius: 4px;
          .propItem {
            position: relative;
            float: left;
            height: 40px;
            padding: 0 10px;
            line-height: 40px;
          }
        }
      }
    }
  }
}
</style>

<style lang="scss" scoped>
.querySearch {
  margin-top: 20px;
}

.chose {
  margin-bottom: 30px;

  .choseMain {
    display: flex;
    margin-bottom: 20px;
  }
}

::v-deep .el-transfer-panel {
  text-align: left !important;
}
::v-deep .el-dialog__header .el-dialog__title {
  top: 0;
}
.bndForm {
  position: relative;
  padding-top: 20px;
  padding-bottom: 0;
  margin-bottom: 20px;
  border: 1px solid #e6e9eb;
  border-radius: 4px;
}
.el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  margin-left: 0;

  ::v-deep .el-form-item__content {
    .el-date-editor.el-input {
      width: 280px;
    }
    .el-select {
      width: 280px;

      .el-input {
        .el-input__inner {
          padding-right: 51px !important;
        }
      }
    }
  }
}

.fix-number {
  width: 280px;

  .el-form-item {
    width: 100% !important;
  }
}
::v-deep .BaseSelect .el-dialog {
  width: 1300px !important;
  margin-top: 3vh !important;
}
::v-deep {
  .el-dialog__body {
    padding: 10px 20px;
    // .el-form-item {
    //   width: (100% / 3);
    // }
    .el-input-group__append {
      padding: 0 10px;
      font-size: 12px;
    }
  }
}

.upload {
  display: inline-block;
  margin-right: 10px;
}

.sizer {
  padding: 10px;
  margin: 0 10px;
  margin-bottom: 10px;
  border: 1px solid #e6e9eb;
  border-radius: 4px;
  ::v-deep .choseBtn {
    width: 125px;
    margin-right: 20px;
  }
}
.sizer-item {
  display: flex;
  height: 34px;
  margin: 10px 0;

  .sizer-head-btn {
    width: 125px !important;
    margin-right: 20px;

    .el-button {
      width: 100%;
    }
  }

  .sizer-container {
    display: flex;
    // justify-content: space-between;
    width: calc(100% - 205px);
    max-width: calc(100% - 205px);
    height: 34px;
    padding: 0 10px;
    overflow: auto;
    line-height: 34px;
    border: 1px solid #e0e3e5;

    .selected-item {
      position: relative;
      height: 20px;
      padding: 0 15px;
      margin: 7px 10px;
      line-height: 20px;
      white-space: nowrap;
      cursor: pointer;
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
  .sizer-container::-webkit-scrollbar {
    display: none !important;
  }

  .sizer-foot-btn {
    width: 60px;
    margin-left: 10px;
  }
}

.el-transfer {
  margin-top: 15px;

  ::v-deep .el-transfer-panel {
    width: 30%;
  }

  ::v-deep .el-transfer-panel__item .el-checkbox__input {
    left: 10px !important;
  }
}
</style>
