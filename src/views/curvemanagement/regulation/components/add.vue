<template>
  <div>
    <el-dialog
      :title="title"
      :visible="dialogFormVisible"
      :close-on-click-modal="false"
      width="1040px"
      @close="close"
      @open="open"
    >
      <el-card v-loading="loading" :class="{ dialog: !detailShow }">
        <div>
          <span class="info"></span>
          <span class="infoTow">基本信息</span>
        </div>
        <!-- 头部 -->
        <div class="header">
          <!-- 新增或者详情的 -->
          <div v-if="addShow" class="nav">
            <!-- 表单 -->
            <el-form
              ref="form"
              class="demo-form-inline"
              label-position="left"
              :model="curveBasicPO"
              :rules="rules"
              hide-required-asterisk
              inline
            >
              <el-form-item label="自定义曲线名称:" prop="curveName">
                <el-input
                  v-model="curveBasicPO.curveName"
                  style="width:220px"
                  placeholder="请输入"
                  :disabled="showFN"
                ></el-input>
              </el-form-item>
              <el-form-item label="是否每日自动拟合曲线:" prop="isDailyCal">
                <el-select
                  v-model="curveBasicPO.isDailyCal"
                  placeholder="请选择"
                  style="width:220px"
                  :disabled="showFN"
                >
                  <el-option
                    v-for="item in isDailyCalList"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                v-if="curveBasicPO.createrName || curveBasicPO.createrName === 0"
                label="曲线创建人:"
              >
                <el-input
                  v-model="curveBasicPO.createrName"
                  readonly
                  disabled
                  style="width:220px;margin-left:29px"
                ></el-input>
              </el-form-item>
              <el-form-item v-if="curveBasicPO.createTime" label="曲线创建时间:">
                <el-input
                  v-model="curveBasicPO.createTime"
                  disabled
                  readonly
                  style="width:220px;margin-left:55px"
                ></el-input>
              </el-form-item>
            </el-form>
            <!-- 当前用户是否可以编辑 -->
            <div class="btnEdat">
              <el-button
                v-if="editBtnShow"
                type="primary"
                :disabled="!(curveBasicPO.createrName === loginName) && type === '1'"
                @click="editBtn"
                >编辑</el-button
              >
            </div>
          </div>
          <!-- 标准曲线方案 -->
          <div v-else>
            <el-form label-position="left">
              <el-row>
                <el-col :span="8">
                  <el-form-item label="曲线簇方案名称">
                    <el-input v-model="planName" :disabled="true" style="width:200px"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="曲线簇名称">
                    <el-input v-model="clusterName" :disabled="true" style="width:200px"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item v-if="!subShow" label="标准曲线名称">
                    <el-input v-model="curveName" :disabled="true" style="width:200px"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
          <div v-if="subShow">
            <div>
              <span>曲线分段设定：</span>
              <span class="suggest">
                为保证成交数据满足曲线拟合需求，建议设置期限范围为：城投0.25-7年，一般工商企业和非银0.25-5年，房地产和银行0.25-3年。
              </span>
            </div>
            <div class="subsection">
              <span>（含权）剩余期限起始点:</span>
              <el-input-number
                v-model="curveSectionList.termStartVal"
                size="small"
                :controls="false"
                width="20"
                disabled
                class="input"
              ></el-input-number>
              <span style="margin-left:16px">（含权）剩余期限终止点:</span>
              <el-input-number
                v-model="curveSectionList.termEndVal"
                :precision="0"
                size="small"
                :controls="false"
                width="20"
                class="input"
                :disabled="flag || showFN"
                :max="10"
                :min="1"
              ></el-input-number>
              <el-button
                type="primary"
                style="margin-left:16px"
                :disabled="showFN"
                @click="designate"
                >{{ flag ? '修改' : '选定' }}</el-button
              >
              <el-button type="primary" style="margin-left:16px" :disabled="showFN" @click="recover"
                >恢复默认设定</el-button
              >
            </div>
            <!-- 分段点 -->
            <div>
              <span class="subsectionOne">分段点:</span>
              <span class="subsectionTow">
                <el-checkbox-group v-model="checkList" @change="checkChange">
                  <template v-for="(item, index) in breakpointList">
                    <el-checkbox :key="index" :label="item" :disabled="showFN"
                      >{{ item }}年</el-checkbox
                    >
                  </template>
                </el-checkbox-group>
              </span>
            </div>
            <!-- 自定义曲线分段 -->
            <div>
              <p style="margin-bottom:0">
                自定义曲线分为{{ checkList.length === 0 ? 0 : checkList.length + 1 }}段：
                <span>{{ segmentation }}</span>
              </p>
            </div>
          </div>
        </div>
        <el-button
          v-if="type === '1'"
          type="text"
          :class="tabPaneShow ? 'btnRemind' : 'btnRemindTwo'"
          @click="link"
          >点击跳转至曲线利率期限结构页面</el-button
        >
        <el-button
          v-if="type === '1'"
          type="text"
          :class="tabPaneShow ? 'btnTrend' : 'btnTrendTwo'"
          @click="trend"
          >点击跳转至曲线利率走势分析页面</el-button
        >

        <!-- 标签页 -->
        <TabPane
          v-if="tabPaneShow"
          v-model="activeTab"
          :tab-list="tabList"
          :type="'card'"
          :default-name="activeTab"
          @handleTabChange="handleTabOnChange"
        />
        <div v-if="activeTab === 'curveRules'">
          <!-- 按钮 -->
          <span class="info"></span>
          <span class="infoTow">
            标签规则
            <el-checkbox v-model="Labelrules" class="checkALL"></el-checkbox>
          </span>
          <div class="attention">
            <span>注意：如不使用标签规则请勿勾选，否则会导致债券数量超标</span>
          </div>
          <!-- 标签规则 -->

          <div v-if="Labelrules" class="rule">
            <el-form>
              <el-row>
                <el-col :span="24">
                  <el-form-item label="主体评级类型:">
                    <el-radio-group v-model="dicRuleInfoList[0].curveRulePO.fieldId">
                      <el-radio
                        v-for="item in selectList.rating"
                        :key="item.id"
                        :label="item.dicCd"
                        :disabled="showFN || industryLost.length > 0"
                        >{{ item.dicName }}</el-radio
                      >
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="主体评级:">
                    <div class="checkbox">
                      <el-checkbox-group v-model="dicRuleInfoList[0].curveRulePO.conditValue">
                        <el-checkbox
                          v-for="item in selectList.dicInfoPOList"
                          :key="item.id"
                          :disabled="showFN || subjectRating.includes(item.dicCd)"
                          :label="item.dicCd"
                          >{{ item.dicName }}</el-checkbox
                        >
                      </el-checkbox-group>
                    </div>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item label="主体类型:">
                    <el-select
                      v-model="dicRuleInfoList[1].curveRulePO.conditValue"
                      class="mainOne"
                      placeholder="请选择"
                      multiple
                      collapse-tags
                      :disabled="showFN || mainData.length > 0"
                      @change="selectChange"
                    >
                      <el-option
                        v-for="item in selectList.mainList"
                        :key="item.id"
                        :label="item.dicName"
                        :value="item.dicCd"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>

                <el-col :span="8" class="shareholder">
                  <el-form-item label="股东背景:">
                    <el-select
                      v-model="dicRuleInfoList[3].curveRulePO.conditValue"
                      class="shareholderOne"
                      placeholder="请选择"
                      multiple
                      collapse-tags
                      :disabled="showFN || shareholderList.length > 0"
                    >
                      <el-option
                        v-for="item in selectList.shareholderList"
                        :key="item.id"
                        :label="item.dicName"
                        :value="item.dicCd"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="8" class="company">
                  <el-form-item label="是否上市公司:">
                    <el-select
                      v-model="dicRuleInfoList[4].curveRulePO.conditValue"
                      placeholder="请选择"
                      :disabled="showFN || ListingList.length > 0"
                      style="margin-left"
                    >
                      <el-option
                        v-for="item in selectList.ListingList"
                        :key="item.id"
                        :label="item.dicName"
                        :value="item.dicCd"
                      >
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="主体注册地所在区域:">
                    <el-card class="box-card">
                      <el-tree
                        ref="maintreeTwo"
                        :data="cityListTwo"
                        show-checkbox
                        node-key="code"
                        highlight-current
                        :props="defaultProps"
                        auto-expand-parent
                        :filter-node-method="filterNode"
                      >
                      </el-tree>
                    </el-card>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="主体行业:">
                    <el-radio-group v-model="dicRuleInfoList[5].curveRulePO.fieldId">
                      <el-radio
                        v-for="item in selectList.industryLost"
                        :key="item.id"
                        :label="item.dicCd"
                        :disabled="showFN || industryLost.length > 0"
                        @change="radioChange"
                        >{{ item.dicName }}</el-radio
                      >
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item>
                    <el-card class="box-card cardOne">
                      <el-input v-model="filterText" placeholder="输入关键字进行过滤"> </el-input>
                      <el-tree
                        ref="tree"
                        :data="treeList"
                        show-checkbox
                        node-key="code"
                        highlight-current
                        :props="defaultProps"
                        auto-expand-parent
                        :filter-node-method="filterNode"
                        @check="treeChange"
                      >
                      </el-tree>
                    </el-card>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="12">
                  <el-form-item label="主体城投区域:">
                    <el-card class="box-card cardTwo">
                      <el-tree
                        ref="maintree"
                        :data="cityList"
                        show-checkbox
                        node-key="code"
                        highlight-current
                        :props="defaultProps"
                        auto-expand-parent
                        :filter-node-method="filterNode"
                      >
                      </el-tree>
                    </el-card>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="主体城投层级：" label-width="120px">
                    <el-select
                      v-model="dicRuleInfoList[7].curveRulePO.conditValue"
                      placeholder="请选择"
                      multiple
                      collapse-tags
                      :disabled="!treeFlag || tierLiST.length > 0 || showFN"
                      style="width:200px"
                    >
                      <el-option
                        v-for="item in selectList.tierLiST"
                        :key="item.id"
                        :label="item.dicName"
                        :value="item.dicCd"
                      ></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="债项评级:">
                    <el-checkbox-group
                      v-model="dicRuleInfoList[8].curveRulePO.conditValue"
                      class="checkbox"
                    >
                      <el-checkbox
                        v-for="item in selectList.debtRating"
                        :key="item.id"
                        :disabled="showFN || debtRating.includes(item.dicCd)"
                        :label="item.dicCd"
                        >{{ item.dicName }}</el-checkbox
                      >
                    </el-checkbox-group>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="债项类型:">
                    <el-card class="box-card cardOne">
                      <el-tree
                        ref="amounttree"
                        :data="amountList"
                        show-checkbox
                        node-key="code"
                        highlight-current
                        :props="defaultProps"
                        auto-expand-parent
                        :filter-node-method="filterNode"
                      >
                      </el-tree>
                    </el-card>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="增信措施:">
                    <el-checkbox-group
                      v-model="dicRuleInfoList[10].curveRulePO.conditValue"
                      class="checkbox"
                    >
                      <el-checkbox
                        v-for="item in selectList.creditList"
                        :key="item.id"
                        :disabled="
                          !['3'].includes(item.dicCd) || showFN || creditList.includes(item.dicCd)
                        "
                        :label="item.dicCd"
                        >{{ item.dicName }}</el-checkbox
                      >
                    </el-checkbox-group>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="债项计息方式:">
                    <el-checkbox-group
                      v-model="dicRuleInfoList[11].curveRulePO.conditValue"
                      class="checkbox"
                    >
                      <el-checkbox
                        v-for="item in selectList.modeList"
                        :key="item.id"
                        :disabled="showFN || modeList.includes(item.dicCd)"
                        :label="item.dicCd"
                        >{{ item.dicName }}</el-checkbox
                      >
                    </el-checkbox-group>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item label="债券交易市场:">
                    <el-checkbox-group v-model="dicRuleInfoList[12].curveRulePO.conditValue">
                      <el-checkbox
                        v-for="item in selectList.bazaarList"
                        :key="item.id"
                        :disabled="showFN || bazaarList.includes(item.dicCd)"
                        :label="item.dicCd"
                        >{{ item.dicName }}</el-checkbox
                      >
                    </el-checkbox-group>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <el-form :model="scale" :rules="scaleRules">
              <el-row>
                <el-col :span="7">
                  <el-form-item label="债券发行规模:" prop="issueend">
                    <el-input-number
                      v-model="scale.issuestart"
                      :precision="2"
                      size="small"
                      :controls="false"
                      width="20"
                      :min="0"
                      :disabled="numberShow(issuestart, issuestart)"
                    ></el-input-number>
                    ~
                    <el-input-number
                      v-model="scale.issueend"
                      :precision="2"
                      size="small"
                      :controls="false"
                      width="20"
                      :min="0"
                      :disabled="numberShow(issuestart, issueend)"
                    ></el-input-number>
                    亿元
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item label="剩余规模:" prop="residueend">
                    <el-input-number
                      v-model="scale.residuestart"
                      :precision="2"
                      size="small"
                      :controls="false"
                      width="20"
                      :min="0"
                      :disabled="numberShow(issuestart, residuestart)"
                    ></el-input-number>
                    ~
                    <el-input-number
                      v-model="scale.residueend"
                      :precision="2"
                      size="small"
                      :controls="false"
                      width="20"
                      :min="0"
                      :disabled="numberShow(issuestart, residueend)"
                    ></el-input-number>
                    亿元
                  </el-form-item>
                </el-col>
                <el-col :span="7">
                  <el-form-item label="发行利率:" prop="interestend" style="margin-left:10px">
                    <el-input-number
                      v-model="scale.intereststart"
                      :precision="2"
                      size="small"
                      :controls="false"
                      width="20"
                      :min="0"
                      :disabled="numberShow(issuestart, intereststart)"
                    ></el-input-number>
                    %~
                    <el-input-number
                      v-model="scale.interestend"
                      :precision="2"
                      size="small"
                      :controls="false"
                      width="20"
                      :min="0"
                      :disabled="numberShow(issuestart, interestend)"
                    >
                    </el-input-number>
                    %
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
          <!-- 主体列表 -->
          <div v-if="mainShow">
            <span class="info"></span>
            <span class="infoTow">
              主体列表
              <el-checkbox v-model="mainList"></el-checkbox>
            </span>
            <div v-if="mainList" class="list">
              <Main
                :del-curve-rule-list="delMain"
                :add-curve-rule-list="addMain"
                :main-btn="mainBtn"
                @getMain="getMain"
              />
            </div>
          </div>
        </div>
        <div v-if="activeTab === 'fittingResult'">
          <fitting
            :curve-id="curveId"
            :login-name="loginName"
            :creater-name="curveBasicPO.createrName"
            @calClose="close"
            @showClose="showClose"
          />
        </div>
        <standard
          v-if="standardShow"
          ref="stanRef"
          :indexed="true"
          :table-height="'550px'"
          :page-size="pageParam.pageSize"
          :current-page="pageParam.pageNum"
          :total="pageParam.total"
          :page-sizes="[20, 50, 100]"
          item-index="tabFourthData"
          active-tab="1"
          :curve-select="true"
          :cluster-name="clusterName"
        />
        <div class="result">
          <el-button type="primary" @click="cancel">取消</el-button>
          <el-button :disabled="showFN" type="primary" @click="add">保存</el-button>
        </div>
      </el-card>
    </el-dialog>
  </div>
</template>
<script>
import TabPane from '@components/TabPane'
import {
  getAddAPI,
  postInfoAPI,
  getTreeAPI,
  getCurveNameAPI,
  getLogInNameAPI,
  getCurveCreatorCheckout,
  getBndTreeListAPI,
  getcurveSkipParamAPI,
  getProvinceTreeListAPI,
  getprovinceTreeListTwoAPI,
  saveCurveCalAPI,
  curveSkipParamTwoAPI
} from '@/src/api/curveRoule'
import { getCurveInfoAPI, savePlanAPI } from '@/src/api/configuration'
import Main from './main.vue'
import fitting from './fitting.vue'
import standard from '@/src/views/parameter/components/tabFirstData.vue'
import * as service from '@api/parameter'
import cloneDeep from 'lodash/cloneDeep'
export default {
  name: 'Addd',
  components: {
    Main,
    TabPane,
    fitting,
    standard
  },
  props: {
    // 控制参数阀值是否显示
    standardShow: {
      type: Boolean
    },
    // dialog框是否显示
    dialogFormVisible: {
      type: Boolean
    },
    // 标签页是否显示
    tabPaneShow: {
      type: Boolean,
      default: false
    },
    // 传的id
    curveId: {
      type: String,
      default: null
    },
    // 主体内容是否显示
    mainShow: {
      type: Boolean,
      default: false
    },
    addShow: {
      type: Boolean,
      default: false
    },
    // 控制分段是否显示
    subShow: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: ''
    },
    // 曲线簇方案名称
    planName: {
      type: String,
      default: ''
    },
    planCd: {
      type: String,
      default: ''
    },
    // 曲线名称
    curveName: {
      type: String,
      default: ''
    },
    // 曲线簇名称
    clusterName: {
      type: String,
      default: ''
    },
    // 控制是否可以修改
    btnShow: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    // 控制编辑按钮是否显示
    editBtnShow: {
      type: Boolean,
      default: false
    },
    // 曲线簇名称的id
    clusterId: {
      type: String,
      default: ''
    },
    detailInfo: {
      type: Object,
      default: () => {}
    },
    activeType: {
      type: Number,
      default: null
    }
  },
  data() {
    let allCurvesName = (rule, value, callback) => {
      if (this.allName.includes(value)) {
        callback(new Error('自定义曲线名称重复'))
      } else {
        callback()
      }
    }
    let issueValidator = (rule, value, callback) => {
      if (!value && !this.scale.issuestart && this.scale.issuestart !== 0) {
        if (value === 0 && !this.scale.issuestar) {
          callback(new Error('请输入完整范围'))
        }
        callback()
      } else {
        if (value || value === 0) {
          if (this.scale.issuestart || this.scale.issuestart === 0) {
            if (this.scale.issueend >= this.scale.issuestart) {
              callback()
            } else {
              callback(new Error('输入范围无效，后方数值应大于等于前方数值'))
            }
          } else {
            callback(new Error('请输入完整范围'))
          }
        } else {
          callback(new Error('请输入完整范围'))
        }
      }
    }
    let residueValidator = (rule, value, callback) => {
      if (!value && !this.scale.residuestart && this.scale.residuestart !== 0) {
        if (value === 0 && !this.scale.residuestart) {
          callback(new Error('请输入完整范围'))
        }
        callback()
      } else {
        if (value || value === 0) {
          if (this.scale.residuestart || this.scale.residuestart === 0) {
            if (this.scale.residueend >= this.scale.residuestart) {
              callback()
            } else {
              callback(new Error('输入范围无效，后方数值应大于等于前方数值'))
            }
          } else {
            callback(new Error('请输入完整范围'))
          }
        } else {
          callback(new Error('请输入完整范围'))
        }
      }
    }
    let interestValidator = (rule, value, callback) => {
      if (!value && !this.scale.intereststart && this.scale.intereststart !== 0) {
        if (value === 0 && !this.scale.intereststart) {
          callback(new Error('请输入完整范围'))
        }
        callback()
      } else {
        if (value || value === 0) {
          if (this.scale.intereststart || this.scale.intereststart === 0) {
            if (this.scale.interestend >= this.scale.intereststart) {
              callback()
            } else {
              callback(new Error('输入范围无效，后方数值应大于等于前方数值'))
            }
          } else {
            callback(new Error('请输入完整范围'))
          }
        } else {
          callback(new Error('请输入完整范围'))
        }
      }
    }
    return {
      // 主体城投区域的值
      data: null,
      // type为3时,获取父的分段信息
      clusterSectionList: [],
      // 控制主体按钮是否显示
      mainBtn: false,
      // 筛选tree的数据
      filterText: '',
      // 默认显示的标签页
      activeTab: 'curveRules',
      tabList: [
        {
          label: '曲线规则',
          name: 'curveRules'
        },
        {
          label: '曲线已拟合/未拟合日期情况',
          name: 'fittingResult'
        }
      ],
      activeName: 'first',
      // tree的数据
      treeList: [],
      amountList: [],
      cityList: [],
      // 只有二级的省市县
      cityListTwo: [],
      // 控制tree的选项
      defaultProps: {
        children: 'childrenList',
        label: 'name'
      },
      // 基本信息数据
      curveBasicPO: {
        // 曲线名字
        curveName: '',
        // 是否每日自动拟合曲线
        isDailyCal: 1,
        curveRuleTp: ''
      },
      // 分段设定
      curveSectionList: {
        // 剩余期限起始值
        termStartVal: 0.25,
        // 剩余期限结束值
        termEndVal: 5,
        // 曲线分段信息
        curveSectionList: []
        // 主题评级数据
      },
      flag: true,
      // 标签规则
      dicRuleInfoList: [
        {
          curveRulePO: {
            ruleTp: '',
            conditValue: [],
            groupId: '',
            fieldId: 'ZZ'
          }
        },
        {
          curveRulePO: {
            ruleTp: '',
            conditValue: null,
            groupId: ''
          }
        },
        {
          curveRulePO: {
            ruleTp: '',
            conditValue: null,
            groupId: ''
          }
        },
        {
          curveRulePO: {
            ruleTp: '',
            conditValue: null,
            groupId: ''
          }
        },
        {
          curveRulePO: {
            ruleTp: '',
            conditValue: null,
            groupId: ''
          }
        },
        {
          curveRulePO: {
            ruleTp: '',
            conditValue: null,
            groupId: '',
            fieldId: 'XHGICS'
          }
        },
        {
          curveRulePO: {
            ruleTp: '',
            conditValue: null,
            groupId: ''
          }
        },
        {
          curveRulePO: {
            ruleTp: '',
            conditValue: null,
            groupId: ''
          }
        },
        {
          curveRulePO: {
            ruleTp: '',
            conditValue: [],
            groupId: ''
          }
        },
        {
          curveRulePO: {
            ruleTp: '',
            conditValue: null,
            groupId: ''
          }
        },
        {
          curveRulePO: {
            ruleTp: '',
            conditValue: ['0'],
            groupId: ''
          }
        },
        {
          curveRulePO: {
            ruleTp: '',
            conditValue: [],
            groupId: ''
          }
        },
        {
          curveRulePO: {
            ruleTp: '',
            conditValue: [],
            groupId: ''
          }
        },
        {
          curveRulePO: {
            ruleTp: '',
            conditValue: '',
            groupId: ''
          }
        },
        {
          curveRulePO: {
            ruleTp: '',
            conditValue: '',
            groupId: ''
          }
        },
        {
          curveRulePO: {
            ruleTp: '',
            conditValue: '',
            groupId: ''
          }
        },
        {
          curveRulePO: {
            ruleTp: '',
            conditValue: '',
            groupId: ''
          }
        }
      ],
      // 是否每日拟合数据
      isDailyCalList: [
        {
          name: '是',
          value: 1
        },
        {
          name: '否',
          value: 0
        }
      ],
      // 分段多选按钮
      checkList: [],
      // 显示的分段点
      showSurve: '',
      // 主体标签选中
      Labelrules: false,
      // 主体列表选中
      mainList: false,
      selectList: {
        // 主体评级数据
        dicInfoPOList: [],
        // 主体类型数据
        mainList: [],
        // 主体注册所在区域
        mainEnroll: [],
        // 股东背景
        shareholderList: [],
        // 是否上市
        ListingList: [],
        // 主体行业数据
        industryLost: [],
        // 主体城投区域
        districtList: [],
        // 主体城投层级
        tierLiST: [],
        // 债项评级
        debtRating: [],
        // 债项类型
        debtItem: [],
        // 增信措施
        creditList: [],
        // 债项记息方式,
        modeList: [],
        // 债券交易市场
        bazaarList: [],
        // 主体评级类型
        rating: []
      },
      // 债券发行规模
      scale: {
        issuestart: undefined,
        issueend: undefined,
        residuestart: undefined,
        residueend: undefined,
        intereststart: undefined,
        interestend: undefined
      },
      // 基本信息的验证规则
      rules: {
        curveName: [
          { required: true, message: '请输入自定义名称', trigger: 'blur' },
          { validator: allCurvesName, trigger: 'blur' }
        ],
        isDailyCal: { required: true, message: '请选择是否每日拟合曲线', trigger: 'blur' }
      },
      scaleRules: {
        issueend: [{ validator: issueValidator, trigger: 'blur' }],
        residueend: [{ validator: residueValidator, trigger: 'blur' }],
        interestend: [{ validator: interestValidator, trigger: 'blur' }]
      },
      // 所有的曲线名称
      allName: [],
      // 主体删除的内容
      delMain: [],
      // 主体添加的内容
      addMain: [],
      //* ***************
      // 曲线簇名称id
      clusterCd: '',
      // tree默认选中的节点
      keys: [],
      // 参数阀值需要的数据
      dataTp: '4',
      paramTp: '1',
      pageParam: {
        pageNum: 1,
        pageSize: 20,
        total: 0
      },
      // 当前登录用户名
      loginName: this.$store.state.user.userInfo.userName,
      // tree组件选中的值
      treeData: [],
      treeFlag: false,
      detailShow: false,
      // 标准曲线中用到的数据
      // 主体评级
      subjectRating: [],
      // 主体类型
      mainData: '',
      // 主体注册所在区域
      mainEnroll: [],
      // 股东背景
      shareholderList: [],
      // 是否上市
      ListingList: [],
      // 主体行业数据
      industryLost: [],
      // 主体城投区域
      districtList: [],
      // 主体城投层级
      tierLiST: [],
      // 债项评级
      debtRating: [],
      // 债项类型
      debtItem: [],
      // 增信措施
      creditList: [],
      // 债项记息方式,
      modeList: [],
      // 债券交易市场
      bazaarList: [],
      // 债券发行规模
      issuestart: '',
      issueend: '',
      // 剩余规模
      residuestart: '',
      residueend: '',
      // 发行利率
      intereststart: '',
      interestend: '',
      // 继承曲线簇tree的数据
      clusterTreeList: [],
      // loading的显示
      loading: false
    }
  },
  computed: {
    // 分段点调整
    breakpointList() {
      let arr = []
      for (let i = 1; i < this.curveSectionList.termEndVal; i++) {
        arr.push(i)
      }
      return arr
    },
    // 自定义曲线分段
    segmentation() {
      let arr = []
      let arr1 = []
      arr = [...this.checkList].sort((a, b) => {
        return a - b
      })
      if (this.curveSectionList.termEndVal === 1) {
        arr1.push(`[0.25年,1年]`)
      } else {
        for (let i = 0; i < arr.length; i++) {
          if (i === 0) {
            arr1.push(`[0.25年,${arr[i]}年)`)
            if (i === arr.length - 1) {
              arr1.push(`[${arr[i]}年,${this.curveSectionList.termEndVal}年]`)
            }
          } else if (i < arr.length) {
            arr1.push(`[${arr[i - 1]}年,${arr[i]}年)`)
            if (i === arr.length - 1) {
              arr1.push(`[${arr[i]}年,${this.curveSectionList.termEndVal}年]`)
            }
          }
        }
      }
      return arr1.join()
    },
    // 判断当前用户是否禁用
    showFN() {
      return !this.detailShow && (this.type === '1' || this.type === '2' || this.type === '3')
    }
  },
  watch: {
    Labelrules(val) {
      if (val) {
        this.dicRuleInfoList.forEach(item => {
          item.curveRulePO.ruleTp = '0'
        })
        if (this.mainList) {
          this.curveBasicPO.curveRuleTp = '4'
        } else {
          this.curveBasicPO.curveRuleTp = '1'
        }
      } else {
        this.dicRuleInfoList.forEach(item => {
          item.curveRulePO.ruleTp = ''
        })
        if (this.mainList) {
          this.curveBasicPO.curveRuleTp = '2'
        } else {
          this.curveBasicPO.curveRuleTp = ''
        }
      }
    },
    'curveSectionList.termEndVal'() {
      this.checkList = []
    },
    mainList(val) {
      if (val) {
        if (this.Labelrules) {
          this.curveBasicPO.curveRuleTp = '4'
        } else {
          this.curveBasicPO.curveRuleTp = '2'
        }
      } else {
        if (this.Labelrules) {
          this.curveBasicPO.curveRuleTp = '1'
        } else {
          this.curveBasicPO.curveRuleTp = ''
        }
      }
    },
    filterText(val) {
      this.$refs.tree.filter(val)
    },
    treeFlag(val) {
      this.getProvinceTreeListFN()
    },
    dicRuleInfoList: {
      handler(val) {
        if (this.dicRuleInfoList[1].curveRulePO.conditValue) {
          this.treeFlag =
            this.dicRuleInfoList[1].curveRulePO.conditValue.some(item => item === 'CT') ||
            this.treeData.some(item => {
              return [
                '902020',
                '90202010',
                '90202020',
                '90202030',
                '90202040',
                '90202050'
              ].includes(item)
            })
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    // 修改标签页数据
    handleTabOnChange(val) {
      this.activeTab = val.name
    },
    // 曲线分段信息
    checkChange() {
      let arr = []
      arr = [...this.checkList].sort((a, b) => {
        return a - b
      })
      arr.unshift(0.25)
      arr.push(this.curveSectionList.termEndVal)
      let arr1 = []
      for (let i = 0; i < arr.length - 1; i++) {
        arr1.push({
          sectionCount: this.checkList.length + 1,
          sectionOrder: i + 1,
          termStartVal: arr[i],
          termEndVal: arr[i + 1]
        })
      }
      this.curveSectionList.curveSectionList = arr1
    },
    // 初次获取展示的数据
    async getRatingFN() {
      const res = await getAddAPI({})
      this.selectList.dicInfoPOList = res.data.dicRuleInfoList[0].dicInfoPOList
      this.selectList.mainList = res.data.dicRuleInfoList[1].dicInfoPOList
      this.selectList.mainEnroll = res.data.dicRuleInfoList[2].dicInfoPOList
      this.selectList.shareholderList = res.data.dicRuleInfoList[3].dicInfoPOList
      this.selectList.ListingList = res.data.dicRuleInfoList[4].dicInfoPOList
      this.selectList.industryLost = res.data.dicRuleInfoList[5].dicInfoPOList
      this.selectList.districtList = res.data.dicRuleInfoList[6].dicInfoPOList
      this.selectList.tierLiST = res.data.dicRuleInfoList[7].dicInfoPOList
      this.selectList.debtRating = res.data.dicRuleInfoList[8].dicInfoPOList
      // this.selectList.debtItem = res.data.dicRuleInfoList[9].dicInfoPOList
      this.selectList.creditList = res.data.dicRuleInfoList[10].dicInfoPOList
      this.selectList.modeList = res.data.dicRuleInfoList[11].dicInfoPOList
      this.selectList.bazaarList = res.data.dicRuleInfoList[12].dicInfoPOList
      this.selectList.rating = res.data.dicRuleInfoList[16].dicInfoPOList
      // 循环赋值
      let classCd = res.data.dicRuleInfoList.map(item => {
        return item.dicInfoPOList[0].classCd
      })
      this.dicRuleInfoList.forEach((item, index) => {
        classCd.forEach((p, i) => {
          if (index === i) {
            item.curveRulePO.groupId = p
          }
        })
      })
      // 循环赋值
      let className = res.data.dicRuleInfoList.map(item => {
        return item.dicInfoPOList[0].className
      })
      this.dicRuleInfoList.forEach((item, index) => {
        className.forEach((p, i) => {
          if (index === i) {
            item.curveRulePO.groupName = p
          }
        })
      })
    },
    // 获取主体树状图
    async getTreeList(treeId) {
      const { data } = await getTreeAPI({ treeId })
      if (this.type === '3') {
        const recursion = arr => {
          arr.forEach(item => {
            let { code, childrenList } = item
            if (this.clusterTreeList.includes(code)) {
              item.disabled = true
            }
            if (childrenList && childrenList.length > 0) {
              recursion(childrenList)
            }
          })
          return arr
        }
        const Newrecursion = arr => {
          arr.forEach(item => {
            let { childrenList } = item
            item.disabled = true
            if (childrenList && childrenList.length > 0) {
              Newrecursion(childrenList)
            }
          })
          return arr
        }
        if (this.detailShow) {
          if (this.clusterTreeList.length > 0) {
            this.treeList = recursion(data)
          } else {
            this.treeList = data
          }
        } else {
          this.treeList = Newrecursion(data)
        }
      } else if (this.type === '1') {
        const recursion = arr => {
          arr.forEach(item => {
            let { childrenList } = item
            item.disabled = true
            if (childrenList && childrenList.length > 0) {
              recursion(childrenList)
            }
          })
          return arr
        }
        if (!this.detailShow) {
          this.treeList = recursion(data)
        } else {
          this.treeList = data
        }
      } else if (this.type === '2') {
        const recursion = arr => {
          arr.forEach(item => {
            let { childrenList } = item
            item.disabled = true
            if (childrenList && childrenList.length > 0) {
              recursion(childrenList)
            }
          })
          return arr
        }
        if (!this.detailShow) {
          this.treeList = recursion(data)
        } else {
          this.treeList = data
        }
      } else {
        this.treeList = data
      }
    },

    cancel() {
      this.close()
    },
    // 添加发送数据
    async add() {
      if ((this.type === '1' || this.type === '') && !this.curveBasicPO.curveName) {
        return this.$message.warning('请填写自定义曲线名称')
      }
      if (
        (this.type === '1' || this.type === '') &&
        !this.curveBasicPO.isDailyCal &&
        this.curveBasicPO.isDailyCal !== 0
      ) {
        return this.$message.warning('请选择是否自动拟合曲线')
      }
      if (!this.Labelrules && !this.mainList) {
        this.$message.error('请选择曲线规则类型')
        return
      }
      if (this.allName.includes(this.curveBasicPO.curveName)) {
        return this.$message.warning('自定义曲线名称重复')
      }

      let str = [this.scale.issuestart, this.scale.issueend]
        .map(item => item * 100000000)
        .filter(item => item || item === 0)
        .join()
      if (str === ',') {
        str = ''
      }
      this.dicRuleInfoList[13].curveRulePO.conditValue = str
      this.dicRuleInfoList[13].curveRulePO.conditName = '亿元'
      let str1 = [this.scale.residuestart, this.scale.residueend]
        .map(item => item * 100000000)
        .filter(item => item || item === 0)
        .join()
      let str2 = [this.scale.intereststart, this.scale.interestend]
        .map(item => item / 100)
        .filter(item => item || item === 0)
        .join()
      if (str1 === ',') {
        str1 = ''
      }
      this.dicRuleInfoList[14].curveRulePO.conditValue = str1
      this.dicRuleInfoList[14].curveRulePO.conditName = '亿元'
      if (str2 === ',') {
        str2 = ''
      }
      this.dicRuleInfoList[15].curveRulePO.conditValue = str2
      this.dicRuleInfoList[15].curveRulePO.conditName = '%'
      // 给主体评级添加一个属性conditName
      this.dicRuleInfoList[0].curveRulePO.conditName = this.selectList.dicInfoPOList
        .map(item => {
          if (this.dicRuleInfoList[0].curveRulePO.conditValue.includes(item.dicCd)) {
            return item.dicName
          }
        })
        .filter(item => {
          return item
        })
        .join()
      this.dicRuleInfoList[1].curveRulePO.conditName = this.selectList.mainList
        .map(item => {
          if (this.dicRuleInfoList[1].curveRulePO.conditValue === item.dicCd) {
            return item.dicName
          }
        })
        .filter(item => {
          return item
        })
        .join()
      this.dicRuleInfoList[2].curveRulePO.conditName = this.selectList.mainEnroll
        .map(item => {
          if (this.dicRuleInfoList[2].curveRulePO.conditValue === item.dicCd) {
            return item.dicName
          }
        })
        .filter(item => {
          return item
        })
        .join()
      this.dicRuleInfoList[3].curveRulePO.conditName = this.selectList.shareholderList
        .map(item => {
          if (this.dicRuleInfoList[3].curveRulePO.conditValue === item.dicCd) {
            return item.dicName
          }
        })
        .filter(item => {
          return item
        })
        .join()
      this.dicRuleInfoList[4].curveRulePO.conditName = this.selectList.ListingList.map(item => {
        if (this.dicRuleInfoList[4].curveRulePO.conditValue === item.dicCd) {
          return item.dicName
        }
      })
        .filter(item => {
          return item
        })
        .join()

      this.dicRuleInfoList[5].curveRulePO.conditName = this.selectList.industryLost
        .map(item => {
          if (this.dicRuleInfoList[5].curveRulePO.fieldId === item.dicCd) {
            return item.dicName
          }
        })
        .filter(item => {
          return item
        })
        .join()
      this.dicRuleInfoList[6].curveRulePO.conditName = this.selectList.districtList
        .map(item => {
          if (this.dicRuleInfoList[6].curveRulePO.conditValue === item.dicCd) {
            return item.dicName
          }
        })
        .filter(item => {
          return item
        })
        .join()
      this.dicRuleInfoList[7].curveRulePO.conditName = this.selectList.tierLiST
        .map(item => {
          if (this.dicRuleInfoList[7].curveRulePO.conditValue === item.dicCd) {
            return item.dicName
          }
        })
        .filter(item => {
          return item
        })
        .join()
      this.dicRuleInfoList[8].curveRulePO.conditName = this.selectList.debtRating
        .map(item => {
          if (this.dicRuleInfoList[8].curveRulePO.conditValue.includes(item.dicCd)) {
            return item.dicName
          }
        })
        .filter(item => {
          return item
        })
        .join()
      this.dicRuleInfoList[9].curveRulePO.conditName = this.selectList.debtItem
        .map(item => {
          if (this.dicRuleInfoList[9].curveRulePO.conditValue.includes(item.dicCd)) {
            return item.dicName
          }
        })
        .filter(item => {
          return item
        })
        .join()
      this.dicRuleInfoList[10].curveRulePO.conditName = this.selectList.creditList
        .map(item => {
          if (this.dicRuleInfoList[10].curveRulePO.conditValue.includes(item.dicCd)) {
            return item.dicName
          }
        })
        .filter(item => {
          return item
        })
        .join()
      this.dicRuleInfoList[11].curveRulePO.conditName = this.selectList.modeList
        .map(item => {
          if (this.dicRuleInfoList[11].curveRulePO.conditValue.includes(item.dicCd)) {
            return item.dicName
          }
        })
        .filter(item => {
          return item
        })
        .join()
      this.dicRuleInfoList[12].curveRulePO.conditName = this.selectList.bazaarList
        .map(item => {
          if (this.dicRuleInfoList[12].curveRulePO.conditValue.includes(item.dicCd)) {
            return item.dicName
          }
        })
        .filter(item => {
          return item
        })
        .join()
      this.dicRuleInfoList[16].curveRulePO.conditName = this.selectList.rating
        .map(item => {
          if (this.dicRuleInfoList[0].curveRulePO.fieldId.includes(item.dicCd)) {
            return item.dicName
          }
        })
        .filter(item => {
          return item
        })
        .join()
      // 曲线分段信息
      let curveSectionList = this.curveSectionList.curveSectionList
      if (curveSectionList.length === 0 && this.curveSectionList.termEndVal === 5) {
        curveSectionList.push(
          {
            sectionCount: 2,
            sectionOrder: 1,
            termStartVal: 0.25,
            termEndVal: 3
          },
          {
            sectionCount: 2,
            sectionOrder: 2,
            termEndVal: 5,
            termStartVal: 3
          }
        )
      }
      // 如果没有填写默认分段信息为0.25-结束点
      if (curveSectionList.length === 0) {
        curveSectionList.push({
          sectionCount: 1,
          sectionOrder: 1,
          termStartVal: 0.25,
          termEndVal: this.curveSectionList.termEndVal
        })
      }

      const dicRuleInfoList = cloneDeep(this.dicRuleInfoList).map(item => {
        if (item.curveRulePO.conditValue instanceof Array && item.curveRulePO.conditValue !== []) {
          item.curveRulePO.conditValue = item.curveRulePO.conditValue.join()
          return item
        }
        return item
      })
      // 添加loading时间
      this.loading = true
      // 定义要添加的数据
      let obj = {}
      // 如果详情保存有时间的话去掉
      delete this.curveBasicPO.createTime
      // 如果没有传type

      if (!this.type || this.type === '1') {
        if (this.Labelrules && !this.mainList) {
          if (this.activeTab === 'curveRules') {
            this.dicRuleInfoList[5].curveRulePO.conditValue = this.$refs.tree.getCheckedKeys()
            dicRuleInfoList[5].curveRulePO.conditValue = this.dicRuleInfoList[5].curveRulePO.conditValue.join()
            dicRuleInfoList[5].curveRulePO.fieldName = this.dicRuleInfoList[5].curveRulePO.conditName
            dicRuleInfoList[0].curveRulePO.fieldName = this.dicRuleInfoList[16].curveRulePO.conditName
            this.dicRuleInfoList[9].curveRulePO.conditValue = this.$refs.amounttree.getCheckedKeys()
            dicRuleInfoList[9].curveRulePO.conditValue = this.dicRuleInfoList[9].curveRulePO.conditValue.join()
            this.dicRuleInfoList[6].curveRulePO.conditValue = this.$refs.maintree.getCheckedKeys()
            dicRuleInfoList[6].curveRulePO.conditValue = this.dicRuleInfoList[6].curveRulePO.conditValue.join()
            this.dicRuleInfoList[2].curveRulePO.conditValue = this.$refs.maintreeTwo.getCheckedKeys()
            dicRuleInfoList[2].curveRulePO.conditValue = this.dicRuleInfoList[2].curveRulePO.conditValue.join()
          }
          obj = {
            curveSectionList,
            curveBasicPO: this.curveBasicPO,
            dicRuleInfoList: dicRuleInfoList
          }
          // 如果空值不传
          obj.dicRuleInfoList = dicRuleInfoList.filter(item => {
            if (item.curveRulePO.groupId === '2060' && item.curveRulePO.conditValue.length === 0) {
              item.curveRulePO.conditValue = '@N'
            }
            // }
            return item.curveRulePO.conditValue || item.curveRulePO.groupId === '2060'
          })
          // 清楚回显的时间数据
          delete obj.curveBasicPO.createTime
        } else if (!this.Labelrules && this.mainList) {
          obj = {
            curveSectionList,
            curveBasicPO: this.curveBasicPO,
            addCurveRuleList: this.addMain,
            delCurveRuleList: this.delMain
          }
        } else {
          if (this.activeTab === 'curveRules') {
            this.dicRuleInfoList[5].curveRulePO.conditValue = this.$refs.tree.getCheckedKeys()
            dicRuleInfoList[5].curveRulePO.conditValue = this.dicRuleInfoList[5].curveRulePO.conditValue.join()
            dicRuleInfoList[5].curveRulePO.fieldName = this.dicRuleInfoList[5].curveRulePO.conditName
            dicRuleInfoList[0].curveRulePO.fieldName = this.dicRuleInfoList[16].curveRulePO.conditName
            this.dicRuleInfoList[9].curveRulePO.conditValue = this.$refs.amounttree.getCheckedKeys()
            dicRuleInfoList[9].curveRulePO.conditValue = this.dicRuleInfoList[9].curveRulePO.conditValue.join()
            this.dicRuleInfoList[6].curveRulePO.conditValue = this.$refs.maintree.getCheckedKeys()
            dicRuleInfoList[6].curveRulePO.conditValue = this.dicRuleInfoList[6].curveRulePO.conditValue.join()
            this.dicRuleInfoList[2].curveRulePO.conditValue = this.$refs.maintreeTwo.getCheckedKeys()
            dicRuleInfoList[2].curveRulePO.conditValue = this.dicRuleInfoList[2].curveRulePO.conditValue.join()
          }
          obj = {
            curveSectionList,
            curveBasicPO: this.curveBasicPO,
            addCurveRuleList: this.addMain,
            delCurveRuleList: this.delMain,
            dicRuleInfoList: dicRuleInfoList
          }
          if (!this.type) {
            obj.type = 'insert'
          } else if (this.type === '1') {
            obj.type = 'update'
          }
        }
        // 判断当前是否超出10条创建
        if (this.type !== '1') {
          const { status, message } = await getCurveCreatorCheckout()
          if (status === 201) {
            this.$message.error(message)
            return
          }
        }
        if (this.type === '1') {
          this.$confirm('此前计算过的曲线数据将被清除, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(async () => {
              const { data, status } = await postInfoAPI(obj)
              if (status === 200) {
                if (data.name === '保存成功') {
                  this.$confirm(
                    '是否计算最近40个交易日曲线数据并跳转至曲线利率期限结构页面？',
                    '提示',
                    {
                      confirmButtonText: '确定',
                      cancelButtonText: '取消',
                      type: 'warning'
                    }
                  )
                    .then(async () => {
                      this.$message.success(`${data.name}，正在发起实时计算`)
                      const res = await saveCurveCalAPI({ curveId: this.curveId })
                      this.loading = false
                      if (res.status === 200) {
                        this.$message.success(res.data)
                        const { data } = await getcurveSkipParamAPI({ curveId: this.curveId })
                        localStorage.setItem('structure', JSON.stringify(data))
                        this.$router.push({
                          path: '/curvefitting/curvefitting-structure'
                        })
                        this.close()
                      }
                    })
                    .catch(() => {
                      this.loading = false
                      this.close()
                    })
                } else {
                  this.loading = false
                  return this.$message({
                    message: data.name,
                    type: 'error',
                    showClose: true,
                    duration: 10000
                  })
                }
              }
            })
            .catch(() => {
              this.loading = false
              this.$message({
                type: 'info',
                message: '已取消保存'
              })
              this.close()
            })
        } else {
          const { data, status } = await postInfoAPI(obj)
          if (status === 200) {
            if (data.name === '保存成功') {
              this.$confirm('是否计算最近40天曲线数据并跳转至拟合结果界面?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              })
                .then(async () => {
                  const code = data.code
                  this.$message.success(`${data.name}，正在发起实时计算`)
                  const res = await saveCurveCalAPI({ curveId: data.code })
                  this.loading = false
                  if (res.status === 200) {
                    const { data } = await getcurveSkipParamAPI({ curveId: code })
                    localStorage.setItem('structure', JSON.stringify(data))
                    this.$router.push({
                      path: '/curvefitting/curvefitting-structure'
                    })
                    this.close()
                  }
                })
                .catch(() => {
                  this.$message({
                    type: 'info',
                    message: '已取消计算'
                  })
                  this.close('添加完成')
                })
            } else {
              this.loading = false
              return this.$message({
                message: data.name,
                type: 'error',
                showClose: true,
                duration: 10000
              })
            }
          }
        }
      } else if (this.type === '2') {
        // 曲线簇方案代码
        obj.planCd = this.planCd
        // 曲线簇方案名字
        obj.planName = this.planName
        // type标识
        obj.type = this.type
        dicRuleInfoList[5].curveRulePO.fieldName = this.dicRuleInfoList[5].curveRulePO.conditName
        dicRuleInfoList[0].curveRulePO.fieldName = this.dicRuleInfoList[16].curveRulePO.conditName
        this.dicRuleInfoList[5].curveRulePO.conditValue = this.$refs.tree.getCheckedKeys()
        dicRuleInfoList[5].curveRulePO.conditValue = this.dicRuleInfoList[5].curveRulePO.conditValue.join()
        this.dicRuleInfoList[6].curveRulePO.conditValue = this.$refs.maintree.getCheckedKeys()
        dicRuleInfoList[6].curveRulePO.conditValue = this.dicRuleInfoList[6].curveRulePO.conditValue.join()
        this.dicRuleInfoList[9].curveRulePO.conditValue = this.$refs.amounttree.getCheckedKeys()
        dicRuleInfoList[9].curveRulePO.conditValue = this.dicRuleInfoList[9].curveRulePO.conditValue.join()
        this.dicRuleInfoList[2].curveRulePO.conditValue = this.$refs.maintreeTwo.getCheckedKeys()
        dicRuleInfoList[2].curveRulePO.conditValue = this.dicRuleInfoList[2].curveRulePO.conditValue.join()
        // 曲线信息
        obj.clusterInfo = {}
        obj.clusterInfo.clusterCd = this.clusterCd
        obj.clusterInfo.clusterName = this.clusterName
        obj.clusterInfo.clusterSectionList = curveSectionList
        obj.clusterInfo.clusterDicRuleInfoList = dicRuleInfoList
        obj.clusterInfo.clusterDicRuleInfoList = dicRuleInfoList.filter(item => {
          if (item.curveRulePO.groupId === '2060' && item.curveRulePO.conditValue.length === 0) {
            item.curveRulePO.conditValue = '@N'
          }
          // }
          return item.curveRulePO.conditValue || item.curveRulePO.groupId === '2060'
        })
        await savePlanAPI(obj)
        this.loading = false

        this.$emit('query')
        this.close('添加完成')
      } else {
        obj.planCd = this.planCd
        // 曲线簇方案名字
        obj.planName = this.planName
        obj.type = this.type
        obj.planCd = this.planCd
        obj.curveInfo = {}
        obj.curveInfo.curveBasicPO = this.curveBasicPO
        dicRuleInfoList[5].curveRulePO.fieldName = this.dicRuleInfoList[5].curveRulePO.conditName
        dicRuleInfoList[0].curveRulePO.fieldName = this.dicRuleInfoList[16].curveRulePO.conditName
        this.dicRuleInfoList[5].curveRulePO.conditValue = this.$refs.tree.getCheckedKeys()
        dicRuleInfoList[5].curveRulePO.conditValue = this.dicRuleInfoList[5].curveRulePO.conditValue.join()
        this.dicRuleInfoList[6].curveRulePO.conditValue = this.$refs.maintree.getCheckedKeys()
        dicRuleInfoList[6].curveRulePO.conditValue = this.dicRuleInfoList[6].curveRulePO.conditValue.join()
        this.dicRuleInfoList[9].curveRulePO.conditValue = this.$refs.amounttree.getCheckedKeys()
        dicRuleInfoList[9].curveRulePO.conditValue = this.dicRuleInfoList[9].curveRulePO.conditValue.join()
        this.dicRuleInfoList[2].curveRulePO.conditValue = this.$refs.maintreeTwo.getCheckedKeys()
        dicRuleInfoList[2].curveRulePO.conditValue = this.dicRuleInfoList[2].curveRulePO.conditValue.join()
        obj.curveInfo.dicRuleInfoList = dicRuleInfoList
        obj.curveInfo.dicRuleInfoList = dicRuleInfoList.filter(item => {
          if (item.curveRulePO.groupId === '2060' && item.curveRulePO.conditValue.length === 0) {
            item.curveRulePO.conditValue = '@N'
          }
          // }
          return item.curveRulePO.conditValue || item.curveRulePO.groupId === '2060'
        })
        obj.curveInfo.curveSectionList = this.clusterSectionList
        await savePlanAPI(obj)
        this.close('添加完成')
        this.loading = false
      }
      // 清空分段多选按钮
      this.checkList = []
      // 清空标签规则
      this.Labelrules = false
      // 清空主体列表
      this.mainList = false
    },
    // 当主体行业发生变化的时候
    radioChange(val) {
      this.getTreeList(val)
    },
    // 关闭的回调
    close(val, type) {
      this.treeData = []
      this.data = null
      this.loading = false
      this.filterText = ''
      this.treeFlag = false
      this.mainBtn = false
      this.flag = true
      this.detailShow = false
      this.curveBasicPO = []
      this.Labelrules = false
      this.mainList = false
      this.activeTab = 'curveRules'
      this.curveBasicPO = {
        // 曲线名字
        curveName: '',
        // 是否每日自动拟合曲线
        isDailyCal: 1,
        curveRuleTp: ''
      }
      this.dicRuleInfoList = [
        {
          curveRulePO: {
            ruleTp: '',
            conditValue: [],
            groupId: '',
            fieldId: 'ZZ'
          }
        },
        {
          curveRulePO: {
            ruleTp: '',
            conditValue: null,
            groupId: ''
          }
        },
        {
          curveRulePO: {
            ruleTp: '',
            conditValue: null,
            groupId: ''
          }
        },
        {
          curveRulePO: {
            ruleTp: '',
            conditValue: null,
            groupId: ''
          }
        },
        {
          curveRulePO: {
            ruleTp: '',
            conditValue: null,
            groupId: ''
          }
        },
        {
          curveRulePO: {
            ruleTp: '',
            conditValue: '',
            groupId: '',
            fieldId: 'XHGICS'
          }
        },
        {
          curveRulePO: {
            ruleTp: '',
            conditValue: null,
            groupId: ''
          }
        },
        {
          curveRulePO: {
            ruleTp: '',
            conditValue: null,
            groupId: ''
          }
        },
        {
          curveRulePO: {
            ruleTp: '',
            conditValue: [],
            groupId: ''
          }
        },
        {
          curveRulePO: {
            ruleTp: '',
            conditValue: null,
            groupId: ''
          }
        },
        {
          curveRulePO: {
            ruleTp: '',
            conditValue: [],
            groupId: ''
          }
        },
        {
          curveRulePO: {
            ruleTp: '',
            conditValue: [],
            groupId: ''
          }
        },
        {
          curveRulePO: {
            ruleTp: '',
            conditValue: [],
            groupId: ''
          }
        },
        {
          curveRulePO: {
            ruleTp: '',
            conditValue: '',
            groupId: ''
          }
        },
        {
          curveRulePO: {
            ruleTp: '',
            conditValue: '',
            groupId: ''
          }
        },
        {
          curveRulePO: {
            ruleTp: '',
            conditValue: '',
            groupId: ''
          }
        },
        {
          curveRulePO: {
            ruleTp: '',
            conditValue: '',
            groupId: ''
          }
        }
      ]
      // 清空分段点
      this.curveSectionList = {
        // 剩余期限起始值
        termStartVal: 0.25,
        // 剩余期限结束值
        termEndVal: 5,
        // 曲线分段信息
        curveSectionList: []
        // 主题评级数据
      }
      // 清空分段多选按钮
      this.checkList = []
      this.scale = {
        issuestart: undefined,
        issueend: undefined,
        residuestart: undefined,
        residueend: undefined,
        intereststart: undefined,
        interestend: undefined
      }
      // 清楚校验规则
      if (!this.type) {
        this.$refs.form.resetFields()
      }
      // 清楚选中的主体
      this.addMain = []
      this.delMain = []
      // 清空曲线簇名称
      if (val === '添加完成') {
        this.$emit('close', false, type)
      } else {
        this.$emit('cancel', false)
      }
      // 清除曲线簇父级的数据
      // 主体评级
      this.subjectRating = []
      // 主体类型
      this.mainData = ''
      // 主体注册所在区域
      this.mainEnroll = []
      // 股东背景
      this.shareholderList = []
      // 是否上市
      this.ListingList = []
      // 主体行业数据
      this.industryLost = []
      // 主体城投区域
      this.districtList = []
      // 主体城投层级
      this.tierLiST = []
      // 债项评级
      this.debtRating = []
      // 债项类型
      this.debtItem = []
      // 增信措施
      this.creditList = []
      // 债项记息方式
      this.modeList = []
      // 债券交易市场
      this.bazaarList = []
      // 债券发行规模
      this.issuestart = ''
      this.issueend = ''
      // 剩余规模
      this.residuestart = ''
      this.residueend = ''
      // 发行利率
      this.intereststart = ''
      this.interestend = ''
      // 继承曲线簇tree的数据
      this.clusterTreeList = []
    },
    // 剩余期限起始点 恢复默认数量
    recover() {
      this.curveSectionList.termEndVal = 5
      // if (this.checkList.length === 0) {
      this.$nextTick(() => {
        this.$set(this.checkList, 0, 3)
      })
      // }
    },
    // 获取当前详情
    async open() {
      if (this.type === '') {
        this.detailShow = true
      }
      this.loading = true
      // 默认选中分段点3年
      if (!this.type) {
        this.$set(this.checkList, 0, 3)
      }
      if (this.type !== '3') {
        this.getBndTreeListFN()
        this.getProvinceTreeListFN()
        // 获取二级的省市县
        this.getprovinceTreeListTwoFN()
      }
      if (this.activeType === 1) {
        this.activeTab = 'fittingResult'
      }
      await this.getRatingFN()
      await this.getLogInNameFN()
      if (this.curveId) {
        if (this.type === '2') {
          // 获取当前用户的所有曲线名称
          let params = {
            dataTp: this.dataTp,
            paramTp: this.paramTp,
            pageSize: this.pageParam.pageSize,
            pageNum: this.pageParam.pageNum,
            clusterName: [this.curveId]
          }
          const resOne = await service.getParamInfoList(params)
          let params1 = {
            dataTp: '5',
            paramTp: '1',
            pageSize: this.pageParam.pageSize,
            pageNum: this.pageParam.pageNum,
            clusterName: [this.curveId]
          }
          const resTow = await service.getParamInfoList(params1)
          let all = [...resOne.data.list, ...resTow.data.list]
          this.pageParam.total = resOne.data.total + resTow.data.total
          this.$refs.stanRef.tableData = all
          // 把数据存在本地
          sessionStorage.setItem('tableList', JSON.stringify(all))
          const res = await getCurveInfoAPI({
            curveId: this.curveId,
            type: this.type
          })
          // 曲线簇名称
          this.clusterCd = res.data.clusterInfo.clusterCd
          // 给标签规则回显
          let code = [
            '2010',
            '2020',
            '2040',
            '2030',
            '2090',
            '2100',
            '2110',
            '2120',
            '2130',
            '2060',
            '2070',
            '2080'
          ]
          this.Labelrules = true
          this.dicRuleInfoList.forEach((i, index) => {
            res.data.clusterInfo.clusterDicRuleInfoList.forEach(item => {
              if (item.curveRulePO.groupId === i.curveRulePO.groupId) {
                i.curveRulePO = item.curveRulePO
                if (code.includes(i.curveRulePO.groupId)) {
                  i.curveRulePO.conditValue = i.curveRulePO.conditValue.split(',')
                }
              }
            })
          })
          if (res.data.clusterInfo.clusterSectionList.length > 0) {
            this.curveSectionList.termEndVal =
              res.data.clusterInfo.clusterSectionList[
                res.data.clusterInfo.clusterSectionList.length - 1
              ].termEndVal
            // 控制按钮是否选中
            let arr = res.data.clusterInfo.clusterSectionList
              .map((item, index) => {
                if (index !== res.data.clusterInfo.clusterSectionList.length - 1) {
                  return item.termEndVal
                }
              })
              .filter(item => item)
            this.$nextTick(() => {
              this.checkList = arr
            })
            this.curveSectionList.curveSectionList = res.data.clusterInfo.clusterSectionList
            // 获取tree形组件的数据
            if (this.dicRuleInfoList[5].curveRulePO.conditValue) {
              this.getTreeList(this.dicRuleInfoList[5].curveRulePO.fieldId)
            } else {
              this.getTreeList('XHGICS')
            }
            // tree形组件回显
            if (this.dicRuleInfoList[5].curveRulePO.conditValue) {
              if (this.activeTab === 'curveRules') {
                this.$nextTick(() => {
                  this.$refs.tree.setCheckedKeys(
                    this.dicRuleInfoList[5].curveRulePO.conditValue,
                    true
                  )
                })
              }
            }
            // 城市行业数回显
            if (this.dicRuleInfoList[6].curveRulePO.conditValue) {
              if (this.activeTab === 'curveRules') {
                this.$nextTick(() => {
                  this.$refs.maintree.setCheckedKeys(
                    this.dicRuleInfoList[6].curveRulePO.conditValue
                  )
                })
              }
            }
            // 获取债项tree组件的数据
            if (this.dicRuleInfoList[9].curveRulePO.conditValue) {
              if (this.activeTab === 'curveRules') {
                this.$nextTick(() => {
                  this.$refs.amounttree.setCheckedKeys(
                    this.dicRuleInfoList[9].curveRulePO.conditValue
                  )
                })
              }
            }
            // 主体注册所在区域回显
            if (this.dicRuleInfoList[2].curveRulePO.conditValue) {
              if (this.activeTab === 'curveRules') {
                this.$nextTick(() => {
                  this.$refs.maintreeTwo.setCheckedKeys(
                    this.dicRuleInfoList[2].curveRulePO.conditValue
                  )
                })
              }
            }
            // 债券发行规模回显
            if (this.dicRuleInfoList[13].curveRulePO.conditValue) {
              let num = this.dicRuleInfoList[13].curveRulePO.conditValue.indexOf(',')
              this.scale.issuestart =
                this.dicRuleInfoList[13].curveRulePO.conditValue.substring(0, num) / 100000000
              this.scale.issueend =
                this.dicRuleInfoList[13].curveRulePO.conditValue.substring(num + 1) / 100000000
            }
            if (this.dicRuleInfoList[14].curveRulePO.conditValue) {
              let num = this.dicRuleInfoList[14].curveRulePO.conditValue.indexOf(',')
              this.scale.residuestart =
                this.dicRuleInfoList[14].curveRulePO.conditValue.substring(0, num) / 100000000
              this.scale.residueend =
                this.dicRuleInfoList[14].curveRulePO.conditValue.substring(num + 1) / 100000000
            }
            if (this.dicRuleInfoList[15].curveRulePO.conditValue) {
              let num = this.dicRuleInfoList[15].curveRulePO.conditValue.indexOf(',')
              this.scale.intereststart =
                this.dicRuleInfoList[15].curveRulePO.conditValue.substring(0, num) * 100
              this.scale.interestend =
                this.dicRuleInfoList[15].curveRulePO.conditValue.substring(num + 1) * 100
            }
            if (this.mainList) {
              this.addMain = res.data.addCurveRuleList
              this.delMain = res.data.delCurveRuleList
            }
          } else {
            this.getTreeList('XHGICS')
          }
        } else if (this.type === '3') {
          // 先获取曲线簇的规则信息
          const { data } = await getCurveInfoAPI({
            curveId: this.clusterId,
            type: '2'
          })
          const { clusterInfo } = data
          clusterInfo.clusterDicRuleInfoList.forEach(item => {
            const { groupName, conditValue, fieldId } = item.curveRulePO
            switch (groupName) {
              case '主体评级':
                this.subjectRating = conditValue.split(',')
                break
              case '主体类型':
                this.mainData = conditValue.split(',')
                break
              case '主体注册地所在区域':
                this.mainEnroll = conditValue.split(',')
                break
              case '股东背景':
                this.shareholderList = conditValue.split(',')
                break
              case '是否上市公司':
                this.ListingList = conditValue.split(',')
                break
              case '主体行业':
                this.industryLost = fieldId
                this.clusterTreeList = conditValue.split(',')
                break
              case '主体城投区域':
                this.districtList = conditValue.split(',')
                break
              case '城投层级':
                this.tierLiST = conditValue.split(',')
                break
              case '债项评级':
                this.debtRating = conditValue.split(',')
                break
              case '债券类型':
                this.debtItem = conditValue.split(',')
                break
              case '增信措施':
                this.creditList = conditValue.split(',')
                break
              case '债项计息方式':
                this.modeList = conditValue.split(',')
                break
              case '债券交易市场':
                this.bazaarList = conditValue.split(',')
                break
              case '债券发行规模':
                this.issuestart = conditValue.substring(0, 1)
                this.issueend = conditValue.substring(1, 2)
                break
              case '剩余规模':
                this.residuestart = conditValue.substring(0, 1)
                this.residueend = conditValue.substring(1, 2)
                break
              case '发行利率':
                this.intereststart = conditValue.substring(0, 1)
                this.interestend = conditValue.substring(1, 2)
                break
            }
          })
          this.clusterSectionList = clusterInfo.clusterSectionList
          const res = await getCurveInfoAPI({
            curveId: this.curveId,
            type: this.type
          })
          this.getProvinceTreeListFN()
          this.getBndTreeListFN()
          this.getprovinceTreeListTwoFN()
          this.Labelrules = true
          // 曲线基本信息获取
          this.curveBasicPO = res.data.curveInfo.curveBasicPO
          // 给标签规则回显
          let code = [
            '2010',
            '2020',
            '2040',
            '2030',
            '2090',
            '2100',
            '2110',
            '2120',
            '2130',
            '2060',
            '2070',
            '2080'
          ]
          this.Labelrules = true
          this.dicRuleInfoList.forEach((i, index) => {
            res.data.curveInfo.dicRuleInfoList.forEach(item => {
              if (item.curveRulePO.groupId === i.curveRulePO.groupId) {
                i.curveRulePO = item.curveRulePO
                if (code.includes(i.curveRulePO.groupId)) {
                  i.curveRulePO.conditValue = i.curveRulePO.conditValue.split(',')
                }
              }
            })
          })
          // 获取tree形组件的数据
          if (this.dicRuleInfoList[5].curveRulePO.fieldId) {
            this.getTreeList(this.dicRuleInfoList[5].curveRulePO.fieldId)
          } else {
            this.getTreeList('XHGICS')
          }
          // tree形组件回显
          if (this.dicRuleInfoList[5].curveRulePO.conditValue) {
            if (this.activeTab === 'curveRules') {
              this.$nextTick(() => {
                this.$refs.tree.setCheckedKeys(
                  this.dicRuleInfoList[5].curveRulePO.conditValue,
                  true
                )
              })
            }
          }
          // 城市tree组件回显
          if (this.dicRuleInfoList[6].curveRulePO.conditValue) {
            if (this.activeTab === 'curveRules') {
              this.$nextTick(() => {
                this.$refs.maintree.setCheckedKeys(this.dicRuleInfoList[6].curveRulePO.conditValue)
              })
            }
          }
          // 债项tree形组件回显
          if (this.dicRuleInfoList[9].curveRulePO.conditValue) {
            if (this.activeTab === 'curveRules') {
              this.$nextTick(() => {
                this.$refs.amounttree.setCheckedKeys(
                  this.dicRuleInfoList[9].curveRulePO.conditValue
                )
              })
            }
          }
          // 主体注册所在区域回显
          if (this.dicRuleInfoList[2].curveRulePO.conditValue) {
            if (this.activeTab === 'curveRules') {
              this.$nextTick(() => {
                this.$refs.maintreeTwo.setCheckedKeys(
                  this.dicRuleInfoList[2].curveRulePO.conditValue
                )
              })
            }
          }
          // 债券发行规模回显
          if (this.dicRuleInfoList[13].curveRulePO.conditValue) {
            let num = this.dicRuleInfoList[13].curveRulePO.conditValue.indexOf(',')
            this.scale.issuestart =
              this.dicRuleInfoList[13].curveRulePO.conditValue.substring(0, num) / 100000000
            this.scale.issueend =
              this.dicRuleInfoList[13].curveRulePO.conditValue.substring(num + 1) / 100000000
          }
          if (this.dicRuleInfoList[14].curveRulePO.conditValue) {
            let num = this.dicRuleInfoList[14].curveRulePO.conditValue.indexOf(',')
            this.scale.residuestart =
              this.dicRuleInfoList[14].curveRulePO.conditValue.substring(0, num) / 100000000
            this.scale.residueend =
              this.dicRuleInfoList[14].curveRulePO.conditValue.substring(num + 1) / 100000000
          }
          if (this.dicRuleInfoList[15].curveRulePO.conditValue) {
            let num = this.dicRuleInfoList[15].curveRulePO.conditValue.indexOf(',')
            this.scale.intereststart =
              this.dicRuleInfoList[15].curveRulePO.conditValue.substring(0, num) * 100
            this.scale.interestend =
              this.dicRuleInfoList[15].curveRulePO.conditValue.substring(num + 1) * 100
          }
        } else if (this.type === '1') {
          // 先给主体列表中的选择主体置灰
          this.mainBtn = true
          const res = await getAddAPI({ curveId: this.curveId })
          // 如果分段信息不为空，在给赋值
          if (res.data.curveBasicPO) {
            this.curveBasicPO = res.data.curveBasicPO
            // 修改时间格式
            this.curveBasicPO.createTime = this.$moment(this.curveBasicPO.createTime).format(
              'YYYY年MM月DD日'
            )
            // 显示什么类型;
            if (res.data.curveBasicPO.curveRuleTp === 1) {
              this.Labelrules = true
            } else if (res.data.curveBasicPO.curveRuleTp === 2) {
              this.mainList = true
            } else {
              this.Labelrules = true
              this.mainList = true
            }
          }
          if (res.data.curveSectionList.length > 0) {
            this.curveSectionList.termEndVal =
              res.data.curveSectionList[res.data.curveSectionList.length - 1].termEndVal
            // 控制按钮是否选中
            let arr = res.data.curveSectionList
              .map((item, index) => {
                if (index !== res.data.curveSectionList.length - 1) {
                  return item.termEndVal
                }
              })
              .filter(item => item)
            this.$nextTick(() => {
              this.checkList = arr
            })
            this.curveSectionList.curveSectionList = res.data.curveSectionList
          }
          // 标签规则回填;
          // if (this.dicRuleInfoList) {
          // }
          let code = [
            '2010',
            '2020',
            '2040',
            '2030',
            '2090',
            '2100',
            '2110',
            '2120',
            '2130',
            '2060',
            '2070',
            '2080'
          ]
          this.dicRuleInfoList.forEach((i, index) => {
            res.data.dicRuleInfoList.forEach(item => {
              if (item.curveRulePO.groupId === i.curveRulePO.groupId) {
                i.curveRulePO = item.curveRulePO
                if (code.includes(i.curveRulePO.groupId)) {
                  i.curveRulePO.conditValue = i.curveRulePO.conditValue.split(',')
                }
              }
            })
          })
          // 获取tree形组件的数据
          if (this.dicRuleInfoList[5].curveRulePO.fieldId) {
            this.getTreeList(this.dicRuleInfoList[5].curveRulePO.fieldId)
          } else {
            this.getTreeList('XHGICS')
          }
          // tree形组件回显
          if (this.dicRuleInfoList[5].curveRulePO.conditValue) {
            // this.keys = this.dicRuleInfoList[5].curveRulePO.conditValue
            if (this.activeTab === 'curveRules') {
              this.$nextTick(() => {
                this.$refs.tree.setCheckedKeys(
                  this.dicRuleInfoList[5].curveRulePO.conditValue,
                  true
                )
              })
            }
          }
          // 城市tree组件回显
          if (this.dicRuleInfoList[6].curveRulePO.conditValue) {
            // this.keys = this.dicRuleInfoList[6].curveRulePO.conditValue
            if (this.activeTab === 'curveRules') {
              this.$nextTick(() => {
                this.$refs.maintree.setCheckedKeys(this.dicRuleInfoList[6].curveRulePO.conditValue)
              })
            }
          }
          // 债项tree组件回显
          if (this.dicRuleInfoList[9].curveRulePO.conditValue) {
            if (this.activeTab === 'curveRules') {
              this.$nextTick(() => {
                this.$refs.amounttree.setCheckedKeys(
                  this.dicRuleInfoList[9].curveRulePO.conditValue
                )
              })
            }
          }
          // 主体注册所在区域回显
          if (this.dicRuleInfoList[2].curveRulePO.conditValue) {
            if (this.activeTab === 'curveRules') {
              this.$nextTick(() => {
                this.$refs.maintreeTwo.setCheckedKeys(
                  this.dicRuleInfoList[2].curveRulePO.conditValue
                )
              })
            }
          }
          // 债券发行规模回显
          if (this.dicRuleInfoList[13].curveRulePO.conditValue) {
            let num = this.dicRuleInfoList[13].curveRulePO.conditValue.indexOf(',')
            this.scale.issuestart =
              this.dicRuleInfoList[13].curveRulePO.conditValue.substring(0, num) / 100000000
            this.scale.issueend =
              this.dicRuleInfoList[13].curveRulePO.conditValue.substring(num + 1) / 100000000
          }
          if (this.dicRuleInfoList[14].curveRulePO.conditValue) {
            let num = this.dicRuleInfoList[14].curveRulePO.conditValue.indexOf(',')
            this.scale.residuestart =
              this.dicRuleInfoList[14].curveRulePO.conditValue.substring(0, num) / 100000000
            this.scale.residueend =
              this.dicRuleInfoList[14].curveRulePO.conditValue.substring(num + 1) / 100000000
          }
          if (this.dicRuleInfoList[15].curveRulePO.conditValue) {
            let num = this.dicRuleInfoList[15].curveRulePO.conditValue.indexOf(',')
            this.scale.intereststart =
              this.dicRuleInfoList[15].curveRulePO.conditValue.substring(0, num) * 100
            this.scale.interestend =
              this.dicRuleInfoList[15].curveRulePO.conditValue.substring(num + 1) * 100
          }
          if (this.mainList) {
            this.addMain = res.data.addCurveRuleList
            this.delMain = res.data.delCurveRuleList
          }
        }
      } else {
        this.getTreeList('XHGICS')
      }
      // 获取所有的曲线名称
      this.curveNameCheckFN()
      this.loading = false
    },
    // 获取当前的所有名字
    async curveNameCheckFN() {
      const res = await getCurveNameAPI()
      if (this.curveId) {
        this.allName = res.data.filter(item => {
          return item !== this.curveBasicPO.curveName
        })
      } else {
        this.allName = res.data
      }
    },
    // 获取主体数据
    getMain(add, del) {
      this.addMain = add
      this.delMain = del
    },
    // 获取当前登录用户名
    async getLogInNameFN() {
      const { data } = await getLogInNameAPI()
      this.loginName = data.name
    },
    editBtn() {
      if (this.detailShow) {
        this.detailShow = false
        this.mainBtn = true
      } else {
        this.mainBtn = false
        this.detailShow = true
      }
      this.getTreeList(this.dicRuleInfoList[5].curveRulePO.fieldId)
      this.$emit('editBtn')
      this.getBndTreeListFN()
      this.getProvinceTreeListFN()
      this.getprovinceTreeListTwoFN()
    },
    // 当点击tree时获取当前的选中的code码
    treeChange(data, code) {
      this.treeData = code.checkedKeys
      this.treeFlag =
        this.treeData.some(item => {
          return ['902020', '90202010', '90202020', '90202030', '90202040', '90202050'].includes(
            item
          )
        }) || this.dicRuleInfoList[1].curveRulePO.conditValue.some(item => item === 'CT')
    },
    // 当主体类型发生变化的时候
    selectChange(val) {
      this.treeFlag = val.some(item => item === 'CT')
    },
    // 点击曲线试图链接的时候
    async link() {
      const { data } = await getcurveSkipParamAPI({ curveId: this.curveId })
      localStorage.setItem('structure', JSON.stringify(data))
      this.$router.push({
        path: '/curvefitting/curvefitting-structure'
      })
      this.close()
    },
    // 点击跳转至曲线利率走势分析页面
    async trend() {
      const { data } = await curveSkipParamTwoAPI({ curveId: this.curveId })
      localStorage.setItem('analysis', JSON.stringify(data))
      this.$router.push({
        path: '/curvefitting/curvefitting-analysis'
      })
      this.close()
    },
    // 获取所有的债项树
    async getBndTreeListFN() {
      const { data } = await getBndTreeListAPI()
      let code = [
        '6',
        '611',
        '612',
        '613',
        '621',
        '622',
        '623',
        '621',
        '631',
        '632',
        '641',
        '651',
        '5',
        '511',
        '512',
        '521',
        '522',
        '523',
        '531',
        '532',
        '541',
        '542',
        '543',
        '590'
      ]
      const screen = function(arr) {
        return arr.map(item => {
          if (!code.includes(item.code)) {
            item.disabled = true
            if (item.childrenList.length > 0) {
              item.childrenList.forEach(i => {
                if (!code.includes(i.code)) {
                  i.disabled = true
                }
              })
            }
          }
          return item
        })
      }
      const newScreen = arr => {
        return arr.map(item => {
          item.disabled = true
          if (item.childrenList.length > 0) {
            item.childrenList.forEach(item => {
              item.disabled = true
            })
          }
          return item
        })
      }
      // 新增页债项数据禁用状态
      if (this.type === '') {
        this.amountList = screen(data)
      } else if (this.type === '1') {
        if (!this.detailShow) {
          this.amountList = newScreen(data)
        } else {
          this.amountList = screen(data)
        }
      } else if (this.type === '2') {
        if (!this.detailShow) {
          this.amountList = newScreen(data)
        } else {
          this.amountList = screen(data)
        }
      } else {
        if (!this.detailShow) {
          this.amountList = newScreen(data)
        } else {
          this.amountList = screen(data).map(item => {
            if (this.debtItem.includes(item.code)) {
              item.disabled = true
              if (item.childrenList.length > 0) {
                item.childrenList.forEach(item => {
                  item.disabled = true
                })
              }
            }
            return item
          })
        }
      }
    },
    // 获取所有的省份行业树
    async getProvinceTreeListFN() {
      const newScreen = arr => {
        arr.forEach(item => {
          item.disabled = true
          if (item.childrenList) {
            newScreen(item.childrenList)
          }
        })
        return arr
      }
      if (!this.data) {
        const { data } = await getProvinceTreeListAPI()
        this.data = cloneDeep(data)
      }
      if (this.type === '') {
        if (!this.treeFlag) {
          this.cityList = newScreen(cloneDeep(this.data))
        } else if (this.treeFlag) {
          this.cityList = cloneDeep(this.data)
        }
      } else if (this.type === '1') {
        if ((this.treeFlag && !this.detailShow) || !this.treeFlag) {
          this.cityList = newScreen(cloneDeep(this.data))
        } else if (this.treeFlag && this.detailShow) {
          this.cityList = cloneDeep(this.data)
        }
      } else if (this.type === '2') {
        if (!this.detailShow || !this.treeFlag) {
          this.cityList = newScreen(cloneDeep(this.data))
        } else if (this.detailShow && this.treeFlag) {
          this.cityList = cloneDeep(this.data)
        }
      } else if (this.type === '3') {
        if (!this.detailShow || !this.treeFlag) {
          this.cityList = newScreen(cloneDeep(this.data))
        } else if (this.treeFlag) {
          const Screen = arr => {
            arr.forEach(item => {
              const { code, childrenList } = item
              if (this.districtList.includes(code)) {
                item.disabled = true
                if (childrenList) {
                  Screen(childrenList)
                }
              }
            })
            return arr
          }
          this.cityList = Screen(cloneDeep(this.data))
        }
      }
    },
    // 债券发行规模等禁用方法
    numberShow(data, val) {
      return this.showFN || (data !== '' && val.length > 0)
    },
    // 点击选定的时候
    designate() {
      this.flag = !this.flag
    },
    // 获取只有二级的省市县
    async getprovinceTreeListTwoFN() {
      const newScreen = arr => {
        arr.forEach(item => {
          item.disabled = true
          if (item && item.childrenList) {
            newScreen(item.childrenList)
          }
        })
        return arr
      }
      const { data } = await getprovinceTreeListTwoAPI()
      if (this.type === '') {
        this.cityListTwo = data
      } else if (this.type === '1' || this.type === '2') {
        if (this.detailShow) {
          this.cityListTwo = data
        } else {
          this.cityListTwo = newScreen(data)
        }
      } else if (this.type === '3') {
        if (!this.detailShow) {
          this.cityListTwo = newScreen(data)
        } else {
          this.cityListTwo = data.map(item => {
            if (this.mainEnroll.includes(item.code)) {
              item.disabled = true
            }
            if (item.childrenList && item.childrenList.length > 0) {
              item.childrenList.forEach(i => {
                if (this.mainEnroll.includes(i.code)) {
                  i.disabled = true
                }
              })
            }
            return item
          })
        }
      }
    },
    showClose() {
      this.dialogFormVisible = false
    }
  }
}
</script>
<style lang="scss" scoped>
.input {
  margin-right: 20px;
  margin-left: 10px;
  color: #ccc;
  text-align: center;
  border-radius: 4px;
}
.box {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.el-input-number {
  width: 60px;
}
.main {
  display: flex;
  align-items: flex-start;
}
::v-deep .el-dialog__wrapper {
  // margin: 0 auto;
  overflow: hidden;
  overflow-y: auto;
}
.btn {
  position: absolute;
  right: 39px;
  bottom: 5px;
  width: 40px;
  height: 20px;
  font-size: 12px;
  color: #fff;
  background-color: #409eff;
  border: 0 solid red;
  border-radius: 5px;
}
::v-deep .el-dialog__header {
  display: flex;
  // line-height: 48px;
  align-items: center;
  height: 48px;
  background: #fff;
  border-radius: 4px 4px 0 0;
  box-shadow: inset 0 -1px 0 0 #e6e9eb;
  .el-dialog__headerbtn {
    position: absolute;
    top: 15px;
    right: 10px;
  }
}
.demo-form-inline {
  ::v-deep .el-form-item__label {
    font-size: 14px;
    font-weight: 400;
    color: #646769;
    text-align: right;
    letter-spacing: 0;
  }
}
.subsection {
  padding: 10px 0 10px 1px;
  margin-top: 12px;
  margin-bottom: 10px;
  background: #f5f8fa;
  border-radius: 4px;
  ::v-deep .el-input__inner {
    width: 80px;
    height: 24px;
  }
  ::v-deep .el-button {
    padding: 8px 15px;
  }
}
.subsectionOne {
  display: inline-block;
  width: 57px;
  height: 20px;
}
.subsectionTow {
  display: inline-block;
  ::v-deep .el-checkbox {
    margin-right: 18px !important;
  }
  ::v-deep .el-checkbox__label {
    padding-left: 6px !important;
  }
}
.header {
  padding: 16px;
  margin-top: 8px;
  margin-bottom: 16px;
  background: #fff;
  border-radius: 4px;
  box-shadow: inset 0 1px 0 0 #e6e9eb, inset 0 -1px 0 0 #e6e9eb, inset 1px 0 0 0 #e6e9eb,
    inset -1px 0 0 0 #e6e9eb;
}
::v-deep .el-dialog__body {
  padding: 0;
}
.info {
  display: inline-block;
  width: 3px;
  height: 12px;
  background: #409eff;
  border-radius: 1.5px;
}
.infoTow {
  margin-left: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #323537;
  text-align: justify;
  letter-spacing: 0;
}
.rule {
  padding: 12px 0 0 16px;
  margin-top: 8px;
  margin-bottom: 16px;
  background: #fff;
  border-radius: 4px;
  box-shadow: inset 0 1px 0 0 #e6e9eb, inset 0 -1px 0 0 #e6e9eb, inset 1px 0 0 0 #e6e9eb,
    inset -1px 0 0 0 #e6e9eb;
  ::v-deep .el-select {
    width: 200px;
    height: 40px;
  }
  .checkbox {
    margin-left: 72px;
  }
  ::v-deep .el-form-item {
    margin-bottom: 14px;
  }
  ::v-deep .el-input--small .el-input__inner {
    width: 64px;
    height: 28px;
  }
}
.list {
  padding: 12px 0 16px 16px;
  margin-top: 8px;
  margin-bottom: 16px;
  background: #fff;
  border-radius: 4px;
  box-shadow: inset 0 1px 0 0 #e6e9eb, inset 0 -1px 0 0 #e6e9eb, inset 1px 0 0 0 #e6e9eb,
    inset -1px 0 0 0 #e6e9eb;
  ::v-deep .sizer {
    margin: 0;
  }
}
.btnEdat {
  position: absolute;
  top: 105px;
  right: 45px;
}
.result {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}
.box-card {
  width: 335px;
  height: 208px;
  margin-left: 75px;
  overflow: auto;
}
// .shareholder {
//   margin-top: -140px;
// }
// .company {
//   margin-top: -57px;
// }
.cardOne {
  margin-left: 143px;
}
.cardTwo {
  margin-left: 144px;
}
.btnRemind {
  position: relative;
  top: 27px;
  left: 355px;
  z-index: 999;
  padding: 0;
  font-size: 16px;
}
.btnRemindTwo {
  position: relative;
  top: 18px;
  left: 118px;
  z-index: 999;
  padding: 0;
  font-size: 16px;
}
.btnTrend {
  position: relative;
  top: 27px;
  left: 415px;
  z-index: 999;
  padding: 0;
  font-size: 16px;
}
.btnTrendTwo {
  position: relative;
  top: 18px;
  left: 168px;
  z-index: 999;
  padding: 0;
  font-size: 16px;
}
.dialog {
  ::v-deep .el-checkbox__inner {
    background-color: #f2f6fc;
    border-color: #dcdfe6 !important;
  }
  ::v-deep .el-checkbox__inner::after {
    border-color: #2990fb !important;
  }
  ::v-deep .el-radio__inner::after {
    background-color: #2990fb !important;
  }
  ::v-deep .el-tag--small {
    background-color: #fff;
  }
}
.attention {
  padding-top: 1px;
  margin-top: 3px;
  margin-bottom: 3px;
  // margin-left: 20px;
  font-weight: 400;
  color: #f90;
}
.suggest {
  font-size: 14px;
  color: #f90;
}
::v-deep .el-tree-node__expand-icon {
  color: #96999b;
}
::v-deep .el-tree-node__label {
  color: #646769;
}
::v-deep .el-checkbox__input.is-disabled + span.el-checkbox__label {
  color: #646769;
}
::v-deep .el-radio__input.is-disabled + span.el-radio__label {
  color: #646769;
}
::v-deep .el-checkbox__input.is-disabled.is-indeterminate .el-checkbox__inner::before {
  background-color: #2990fb !important;
  border-color: #2990fb;
}
</style>
