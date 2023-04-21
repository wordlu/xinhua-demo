<template>
  <div class="base-table">
    <div v-if="itemIndex === 'tabThirdData'" class="rightButt">
      <el-button v-btnShow="show" @click="efficacious"
        >展示{{ conjunction ? '当前有效' : '全部' }}规则</el-button
      >
      <el-button v-btnShow="derive" @click="exportData">导出</el-button>
      <el-button v-btnShow="Batchexport" @click="batchMaturity">批量到期</el-button>
      <el-button v-btnShow="subject" @click="downloadSubject">导入异常主体</el-button>
      <el-button v-btnShow="amount" @click="downloadAmount">导入异常债项</el-button>
    </div>
    <div v-if="selectShow" class="letButt">
      <el-form ref="ruleForm" :model="ruleForm" label-width="100px">
        <div class="form-border-radius">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="曲线簇名称">
                <el-select
                  v-model="ruleForm.clusterName"
                  placeholder="请选择曲线簇名称"
                  clearable
                  multiple
                  collapse-tags
                >
                  <el-option
                    v-for="(i, indexs) in clusterList"
                    :key="i.code + '' + indexs"
                    :label="i.name"
                    :value="i.code"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="参数名称">
                <el-select
                  v-model="ruleForm.paramCdList"
                  placeholder="请选择参数名称"
                  clearable
                  multiple
                  collapse-tags
                >
                  <el-option
                    v-for="(i, indexs) in paramNameList"
                    :key="i.code + '' + indexs"
                    :label="i.name"
                    :value="i.code"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-button v-btnShow="inquire" type="primary" @click="onSubmit">查询</el-button>
            </el-col>
          </el-row>
        </div>
      </el-form>
    </div>
    <div class="table-wrap">
      <el-table
        ref="tableRef"
        :key="itemIndex"
        v-loading="loading"
        :data="tableData"
        :height="tableHeight"
        v
        :row-key="getRowKey"
        border
        row-class-name="table-row-class"
        :header-cell-style="{ background: '#fff', color: '#85878C' }"
        @selection-change="handleSelectionChange"
      >
        <el-table-column v-if="selection" type="selection" width="55" reserve-selection />
        <el-table-column v-if="indexed" type="index" width="55" label="序号" align="center" />
        <el-table-column
          v-if="
            (itemIndex === 'tabFourthData' && activeTab === '1') ||
              (itemIndex === 'tabFifthData' && activeTab === '1')
          "
          label="标准曲线簇名称"
          align="center"
          width="200"
        >
          <template slot-scope="scope">
            {{ clusterName || handleClusterLabel(clusterList, scope.row.clusterCd) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="paramValue"
          :label="
            itemIndex === 'tabSecondData' || itemIndex === 'tabThirdData' ? '规则名称' : '参数名称'
          "
          align="center"
          width="250"
        >
        </el-table-column>
        <el-table-column
          :label="
            itemIndex === 'tabSecondData'
              ? '曲线设置规则描述'
              : itemIndex === 'tabThirdData'
              ? '异常值剔除规则描述/主体或债项名称'
              : '参数阈值描述'
          "
          align="center"
        >
          <template slot-scope="scope">
            <!-- 备选样本券阈值配置 -->
            <div v-if="scope.row.infoList && scope.row.paramCd === '10001'">
              样本券相关主体季末债券余额滚动年度成交量大于等于
              <el-input-number
                v-model="scope.row.infoList[0].className"
                :min="0"
                :max="10000"
                :precision="2"
                :controls="false"
                :disabled="!scope.row.medifieSta"
              />
              亿元以上
            </div>
            <div v-if="scope.row.infoList && scope.row.paramCd === '10002'">
              每年
              <el-input-number
                v-model="scope.row.infoList[0].className"
                :precision="0"
                :min="1"
                :max="12"
                :controls="false"
                :disabled="!scope.row.medifieSta"
              />月
              <el-input-number
                v-model="scope.row.infoList[1].className"
                :controls="false"
                :disabled="!scope.row.medifieSta"
              />日
              <el-input-number
                v-model="scope.row.infoList[2].className"
                :min="0"
                :max="24"
                :controls="false"
                :disabled="!scope.row.medifieSta"
              />
              点时添加提示，直至完成年度快速评级，取消提示。
            </div>
            <div v-if="scope.row.infoList && scope.row.paramCd === '10003'">
              当前日期下统计：自上一个
              <el-input-number
                v-model="scope.row.infoList[0].className"
                :precision="0"
                :min="1"
                :max="12"
                :controls="false"
                :disabled="!scope.row.medifieSta"
              />月
              <el-input-number
                v-model="scope.row.infoList[1].className"
                :controls="false"
                :disabled="!scope.row.medifieSta"
              />日起前推
              <el-input-number
                v-model="scope.row.infoList[2].className"
                :min="0"
                :max="10000"
                :controls="false"
                :disabled="!scope.row.medifieSta"
              />
              年内，主体下所有债券累计成交金额总额大于
              <el-input-number
                v-model="scope.row.infoList[3].className"
                :min="0"
                :max="10000"
                :controls="false"
                :precision="2"
                :disabled="!scope.row.medifieSta"
              />亿元的主体，需要更新人工快速评级
            </div>
            <div v-if="scope.row.infoList && scope.row.paramCd === '10004'">
              当前日期下统计：主体在上一个
              <el-input-number
                v-model="scope.row.infoList[0].className"
                :precision="0"
                :min="1"
                :max="12"
                :controls="false"
                :disabled="!scope.row.medifieSta"
              />月
              <el-input-number
                v-model="scope.row.infoList[1].className"
                :controls="false"
                :disabled="!scope.row.medifieSta"
              />日存续普通信用债数量大于
              <el-input-number
                v-model="scope.row.infoList[2].className"
                :min="0"
                :max="10000"
                :controls="false"
                :disabled="!scope.row.medifieSta"
              />
              个，需要更新人工快速评级
            </div>
            <!-- 自定义曲线分组规则 -->
            <div v-if="scope.row.infoList && scope.row.paramCd === '20001'">
              金融机构与一般工商企业不得出现在同一分组内
            </div>
            <div v-if="scope.row.infoList && scope.row.paramCd === '20002'">
              新增自定义曲线规则时，需要校验筛选出的债项个数大于等于
              <el-input-number
                v-model="scope.row.infoList[0].className"
                :precision="0"
                :min="0"
                :max="10000"
                :controls="false"
                :disabled="!scope.row.medifieSta"
              />个，且小于等于
              <el-input-number
                v-model="scope.row.infoList[1].className"
                :precision="0"
                :min="0"
                :max="10000"
                :controls="false"
                :disabled="!scope.row.medifieSta"
              />个，此规则才能通过
            </div>
            <!-- 全局异常值剔除规则 -->
            <div
              v-if="
                itemIndex === 'tabThirdData' && scope.row.infoList && scope.row.paramCd === '30001'
              "
            >
              债券上市后
              <el-input-number
                v-model="scope.row.infoList[0].className"
                :precision="0"
                :min="0"
                :max="10000"
                :controls="false"
                :disabled="!scope.row.medifieSta"
              />日内的成交数据为异常值
            </div>
            <div
              v-if="
                itemIndex === 'tabThirdData' && scope.row.infoList && scope.row.paramCd === '30002'
              "
            >
              交易金额小于
              <el-input-number
                v-model="scope.row.infoList[0].className"
                :min="0"
                :max="10000"
                :precision="2"
                :controls="false"
                :disabled="!scope.row.medifieSta"
              />万元的交易为异常值
            </div>
            <div
              v-if="
                itemIndex === 'tabThirdData' && scope.row.infoList && scope.row.paramCd === '30003'
              "
            >
              收益率大于
              <el-input-number
                v-model="scope.row.infoList[0].className"
                :min="0"
                :max="100"
                :precision="2"
                :controls="false"
                :disabled="!scope.row.medifieSta"
              />%或小于
              <el-input-number
                v-model="scope.row.infoList[1].className"
                :min="0"
                :max="100"
                :precision="2"
                :controls="false"
                :disabled="!scope.row.medifieSta"
              />%的交易为异常值
            </div>
            <div
              v-if="
                itemIndex === 'tabThirdData' &&
                  scope.row.paramCd !== '30001' &&
                  scope.row.paramCd !== '30002' &&
                  scope.row.paramCd !== '30003'
              "
            >
              {{ scope.row.className }}
            </div>
            <!-- 曲线模型配置—— 一般工商企业曲线簇 -->
            <div v-if="scope.row.infoList && scope.row.paramCd === '40001'">
              当曲线计算拟合样本点不足时，则需要追加拟合用虚拟样本点，并给这些虚拟成交赋予固定的交易金额：拟合用虚拟成交的交易金额（中债估值）为
              <el-input-number
                v-model="scope.row.infoList[0].className"
                :min="0"
                :max="10000"
                :precision="2"
                :controls="false"
                :disabled="!scope.row.medifieSta"
              />
              万元，拟合用虚拟成交的交易金额（曲线点）为
              <el-input-number
                v-model="scope.row.infoList[1].className"
                :min="0"
                :max="10000"
                :precision="2"
                :controls="false"
                :disabled="!scope.row.medifieSta"
              />
              万元
            </div>
            <div v-if="scope.row.infoList && scope.row.paramCd === '40002'">
              拟合数据向前追溯时，每向前一天权重衰减至
              <el-input-number
                v-model="scope.row.infoList[0].className"
                :min="0"
                :max="100"
                :precision="2"
                :controls="false"
                :disabled="!scope.row.medifieSta"
              />% （时间折扣系数）
            </div>
            <div v-if="scope.row.infoList && scope.row.paramCd === '40003'">
              标准曲线簇拟合时向前追溯
              <el-input-number
                v-model="scope.row.infoList[0].className"
                :precision="0"
                :min="0"
                :max="10000"
                :controls="false"
                :disabled="!scope.row.medifieSta"
              />个工作日（含当日）
            </div>
            <div v-if="scope.row.infoList && scope.row.paramCd === '40004'">
              曲线计算时，补充拟合用虚拟样本点后样本点总量仍然不够的情况下，则继续前推交易日，重算，每次增加
              <el-input-number
                v-model="scope.row.infoList[0].className"
                :precision="0"
                :min="0"
                :max="10000"
                :controls="false"
                :disabled="!scope.row.medifieSta"
              />个。标准曲线回溯天数上限为
              <el-input-number
                v-model="scope.row.infoList[1].className"
                :precision="0"
                :min="0"
                :max="10000"
                :controls="false"
                :disabled="!scope.row.medifieSta"
              />个交易日。
            </div>
            <div v-if="scope.row.infoList && scope.row.paramCd === '40005'">
              将交易量映射到0-1之间，
              <el-input-number
                v-model="scope.row.infoList[0].className"
                :min="0"
                :max="10000"
                :controls="false"
                :disabled="!scope.row.medifieSta"
              />
              亿元对应1,0-{{ scope.row.infoList[0].className }}亿元线性映射，{{
                scope.row.infoList[0].className
              }}亿元以上当做{{ scope.row.infoList[0].className }}亿元处理
            </div>
            <div v-if="scope.row.infoList && scope.row.paramCd === '40006'">
              偏离度上限为
              <el-input-number
                v-model="scope.row.infoList[0].className"
                :min="0"
                :max="100"
                :precision="2"
                :controls="false"
                :disabled="!scope.row.medifieSta"
              />%，超出就被认为是异常值；偏离度步长为
              <el-input-number
                v-model="scope.row.infoList[1].className"
                :min="0"
                :max="100"
                :precision="2"
                :controls="false"
                :disabled="!scope.row.medifieSta"
              />%；偏离度折扣系数为
              <el-input-number
                v-model="scope.row.infoList[2].className"
                :min="0"
                :max="1"
                :precision="2"
                :controls="false"
                :disabled="!scope.row.medifieSta"
              />
              每超过一个步长，权重就乘以一次折扣系数
            </div>
            <!-- 曲线模型配置—— 城投曲线簇 -->
            <div v-if="scope.row.infoList && scope.row.paramCd === '40016'">
              标准曲线簇拟合时向前追溯
              <el-input-number
                v-model="scope.row.infoList[0].className"
                :precision="0"
                :min="0"
                :max="10000"
                :controls="false"
                :disabled="!scope.row.medifieSta"
              />个工作日（含当日）
            </div>
            <div v-if="scope.row.infoList && scope.row.paramCd === '40017'">
              曲线计算时，补充拟合用虚拟样本点后样本点总量仍然不够的情况下，则继续前推交易日，重算，每次增加
              <el-input-number
                v-model="scope.row.infoList[0].className"
                :precision="0"
                :min="0"
                :max="10000"
                :controls="false"
                :disabled="!scope.row.medifieSta"
              />个。标准曲线回溯天数上限为
              <el-input-number
                v-model="scope.row.infoList[1].className"
                :precision="0"
                :min="0"
                :max="10000"
                :controls="false"
                :disabled="!scope.row.medifieSta"
              />个交易日。
            </div>
            <div v-if="scope.row.infoList && scope.row.paramCd === '40018'">
              将交易量映射到0-1之间，
              <el-input-number
                v-model="scope.row.infoList[0].className"
                :min="0"
                :max="10000"
                :controls="false"
                :disabled="!scope.row.medifieSta"
              />
              亿元对应1,0-2亿元线性映射，2亿元以上当做2亿元处理
            </div>
            <div v-if="scope.row.infoList && scope.row.paramCd === '40019'">
              偏离度上限为
              <el-input-number
                v-model="scope.row.infoList[0].className"
                :min="0"
                :max="100"
                :precision="2"
                :controls="false"
                :disabled="!scope.row.medifieSta"
              />%，超出就被认为是异常值；偏离度步长为
              <el-input-number
                v-model="scope.row.infoList[1].className"
                :min="0"
                :max="100"
                :precision="2"
                :controls="false"
                :disabled="!scope.row.medifieSta"
              />%；偏离度折扣系数为
              <el-input-number
                v-model="scope.row.infoList[2].className"
                :min="0"
                :max="1"
                :precision="2"
                :controls="false"
                :disabled="!scope.row.medifieSta"
              />
              每超过一个步长，权重就乘以一次折扣系数
            </div>
            <!-- 曲线模型配置—— 房地产曲线簇 -->
            <div v-if="scope.row.infoList && scope.row.paramCd === '40020'">
              标准曲线簇拟合时向前追溯
              <el-input-number
                v-model="scope.row.infoList[0].className"
                :precision="0"
                :min="0"
                :max="10000"
                :controls="false"
                :disabled="!scope.row.medifieSta"
              />个工作日（含当日）
            </div>
            <div v-if="scope.row.infoList && scope.row.paramCd === '40021'">
              曲线计算时，补充拟合用虚拟样本点后样本点总量仍然不够的情况下，则继续前推交易日，重算，每次增加
              <el-input-number
                v-model="scope.row.infoList[0].className"
                :precision="0"
                :min="0"
                :max="10000"
                :controls="false"
                :disabled="!scope.row.medifieSta"
              />个。标准曲线回溯天数上限为
              <el-input-number
                v-model="scope.row.infoList[1].className"
                :precision="0"
                :min="0"
                :max="10000"
                :controls="false"
                :disabled="!scope.row.medifieSta"
              />个交易日。
            </div>
            <div v-if="scope.row.infoList && scope.row.paramCd === '40022'">
              将交易量映射到0-1之间，
              <el-input-number
                v-model="scope.row.infoList[0].className"
                :min="0"
                :max="10000"
                :controls="false"
                :disabled="!scope.row.medifieSta"
              />
              亿元对应1,0-2亿元线性映射，2亿元以上当做2亿元处理
            </div>
            <div v-if="scope.row.infoList && scope.row.paramCd === '40023'">
              偏离度上限为
              <el-input-number
                v-model="scope.row.infoList[0].className"
                :min="0"
                :max="100"
                :precision="2"
                :controls="false"
                :disabled="!scope.row.medifieSta"
              />%，超出就被认为是异常值；偏离度步长为
              <el-input-number
                v-model="scope.row.infoList[1].className"
                :min="0"
                :max="100"
                :precision="2"
                :controls="false"
                :disabled="!scope.row.medifieSta"
              />%；偏离度折扣系数为
              <el-input-number
                v-model="scope.row.infoList[2].className"
                :min="0"
                :max="1"
                :precision="2"
                :controls="false"
                :disabled="!scope.row.medifieSta"
              />
              每超过一个步长，权重就乘以一次折扣系数
            </div>
            <!-- 曲线模型配置—— 银行曲线簇 -->
            <div v-if="scope.row.infoList && scope.row.paramCd === '40024'">
              标准曲线簇拟合时向前追溯
              <el-input-number
                v-model="scope.row.infoList[0].className"
                :precision="0"
                :min="0"
                :max="10000"
                :controls="false"
                :disabled="!scope.row.medifieSta"
              />个工作日（含当日）
            </div>
            <div v-if="scope.row.infoList && scope.row.paramCd === '40025'">
              曲线计算时，补充拟合用虚拟样本点后样本点总量仍然不够的情况下，则继续前推交易日，重算，每次增加
              <el-input-number
                v-model="scope.row.infoList[0].className"
                :precision="0"
                :min="0"
                :max="10000"
                :controls="false"
                :disabled="!scope.row.medifieSta"
              />个。标准曲线回溯天数上限为
              <el-input-number
                v-model="scope.row.infoList[1].className"
                :precision="0"
                :min="0"
                :max="10000"
                :controls="false"
                :disabled="!scope.row.medifieSta"
              />个交易日。
            </div>
            <div v-if="scope.row.infoList && scope.row.paramCd === '40026'">
              将交易量映射到0-1之间，
              <el-input-number
                v-model="scope.row.infoList[0].className"
                :min="0"
                :max="10000"
                :controls="false"
                :disabled="!scope.row.medifieSta"
              />
              亿元对应1,0-2亿元线性映射，2亿元以上当做2亿元处理
            </div>
            <div v-if="scope.row.infoList && scope.row.paramCd === '40027'">
              偏离度上限为
              <el-input-number
                v-model="scope.row.infoList[0].className"
                :min="0"
                :max="100"
                :precision="2"
                :controls="false"
                :disabled="!scope.row.medifieSta"
              />%，超出就被认为是异常值；偏离度步长为
              <el-input-number
                v-model="scope.row.infoList[1].className"
                :min="0"
                :max="100"
                :precision="2"
                :controls="false"
                :disabled="!scope.row.medifieSta"
              />%；偏离度折扣系数为
              <el-input-number
                v-model="scope.row.infoList[2].className"
                :min="0"
                :max="1"
                :precision="2"
                :controls="false"
                :disabled="!scope.row.medifieSta"
              />
              每超过一个步长，权重就乘以一次折扣系数
            </div>
            <!-- 曲线模型配置—— 非银金融机构曲线簇 -->
            <div v-if="scope.row.infoList && scope.row.paramCd === '40028'">
              标准曲线簇拟合时向前追溯
              <el-input-number
                v-model="scope.row.infoList[0].className"
                :precision="0"
                :min="0"
                :max="10000"
                :controls="false"
                :disabled="!scope.row.medifieSta"
              />个工作日（含当日）
            </div>
            <div v-if="scope.row.infoList && scope.row.paramCd === '40029'">
              曲线计算时，补充拟合用虚拟样本点后样本点总量仍然不够的情况下，则继续前推交易日，重算，每次增加
              <el-input-number
                v-model="scope.row.infoList[0].className"
                :precision="0"
                :min="0"
                :max="10000"
                :controls="false"
                :disabled="!scope.row.medifieSta"
              />个。标准曲线回溯天数上限为
              <el-input-number
                v-model="scope.row.infoList[1].className"
                :precision="0"
                :min="0"
                :max="10000"
                :controls="false"
                :disabled="!scope.row.medifieSta"
              />个交易日。
            </div>
            <div v-if="scope.row.infoList && scope.row.paramCd === '40030'">
              将交易量映射到0-1之间，
              <el-input-number
                v-model="scope.row.infoList[0].className"
                :min="0"
                :max="10000"
                :controls="false"
                :disabled="!scope.row.medifieSta"
              />
              亿元对应1,0-2亿元线性映射，2亿元以上当做2亿元处理
            </div>
            <div v-if="scope.row.infoList && scope.row.paramCd === '40031'">
              偏离度上限为
              <el-input-number
                v-model="scope.row.infoList[0].className"
                :min="0"
                :max="100"
                :precision="2"
                :controls="false"
                :disabled="!scope.row.medifieSta"
              />%，超出就被认为是异常值；偏离度步长为
              <el-input-number
                v-model="scope.row.infoList[1].className"
                :min="0"
                :max="100"
                :precision="2"
                :controls="false"
                :disabled="!scope.row.medifieSta"
              />%；偏离度折扣系数为
              <el-input-number
                v-model="scope.row.infoList[2].className"
                :min="0"
                :max="1"
                :precision="2"
                :controls="false"
                :disabled="!scope.row.medifieSta"
              />
              每超过一个步长，权重就乘以一次折扣系数
            </div>
            <!-- 自定义曲线模型配置 -->
            <div v-if="scope.row.infoList && scope.row.paramCd === '40007'">
              自定义曲线簇拟合时向前追溯
              <el-input-number
                v-model="scope.row.infoList[0].className"
                :precision="0"
                :min="0"
                :max="10000"
                :controls="false"
                :disabled="!scope.row.medifieSta"
              />个工作日（含当日）
            </div>
            <div v-if="scope.row.infoList && scope.row.paramCd === '40008'">
              曲线计算时，补充拟合用虚拟样本点后样本点总量仍然不够的情况下，则继续前推交易日，重算，每次增加
              <el-input-number
                v-model="scope.row.infoList[0].className"
                :precision="0"
                :min="0"
                :max="10000"
                :controls="false"
                :disabled="!scope.row.medifieSta"
              />个。自定义曲线回溯天数上限为
              <el-input-number
                v-model="scope.row.infoList[1].className"
                :precision="0"
                :min="0"
                :max="10000"
                :controls="false"
                :disabled="!scope.row.medifieSta"
              />个交易日
            </div>
            <div v-if="scope.row.infoList && scope.row.paramCd === '40009'">
              当曲线计算拟合样本点不足时，则需要追加拟合用虚拟样本点，并给这些虚拟成交赋予固定的交易金额：拟合用虚拟成交的交易金额（中债估值）为
              <el-input-number
                v-model="scope.row.infoList[0].className"
                :min="0"
                :max="10000"
                :precision="2"
                :controls="false"
                :disabled="!scope.row.medifieSta"
              />万元，拟合用虚拟成交的交易金额（曲线点）为
              <el-input-number
                v-model="scope.row.infoList[1].className"
                :min="0"
                :max="10000"
                :precision="2"
                :controls="false"
                :disabled="!scope.row.medifieSta"
              />万元
            </div>
            <div v-if="scope.row.infoList && scope.row.paramCd === '40010'">
              拟合数据向前追溯时，每向前一天权重衰减至
              <el-input-number
                v-model="scope.row.infoList[0].className"
                :min="0"
                :max="100"
                :precision="2"
                :controls="false"
                :disabled="!scope.row.medifieSta"
              />% （时间折扣系数）
            </div>
            <div v-if="scope.row.infoList && scope.row.paramCd === '40011'">
              将交易量映射到0-1之间，
              <el-input-number
                v-model="scope.row.infoList[0].className"
                :min="0"
                :max="10000"
                :controls="false"
                :disabled="!scope.row.medifieSta"
              />
              亿元对应1,0-{{ scope.row.infoList[0].className }}亿元线性映射，{{
                scope.row.infoList[0].className
              }}亿元以上当做{{ scope.row.infoList[0].className }}亿元处理
            </div>
            <div v-if="scope.row.infoList && scope.row.paramCd === '40012'">
              偏离度上限为
              <el-input-number
                v-model="scope.row.infoList[0].className"
                :min="0"
                :max="100"
                :precision="2"
                :controls="false"
                :disabled="!scope.row.medifieSta"
              />%，超出就被认为是异常值；偏离度步长为
              <el-input-number
                v-model="scope.row.infoList[1].className"
                :min="0"
                :max="100"
                :precision="2"
                :controls="false"
                :disabled="!scope.row.medifieSta"
              />%；偏离度折扣系数为
              <el-input-number
                v-model="scope.row.infoList[2].className"
                :min="0"
                :max="1"
                :precision="2"
                :controls="false"
                :disabled="!scope.row.medifieSta"
              />
              每超过一个步长，权重就乘以一次折扣系数
            </div>
            <div v-if="scope.row.infoList && scope.row.paramCd === '40013'">
              自定义曲线延时计算的交易日天数上限
              <el-input-number
                v-model="scope.row.infoList[0].className"
                :min="0"
                :max="10000"
                :controls="false"
                :disabled="!scope.row.medifieSta"
              />
              年
            </div>
            <div v-if="scope.row.infoList && scope.row.paramCd === '40014'">
              自定义曲线实时计算的交易日天数上限为
              <el-input-number
                v-model="scope.row.infoList[0].className"
                :precision="0"
                :min="0"
                :max="10000"
                :controls="false"
                :disabled="!scope.row.medifieSta"
              />
              个交易日
            </div>
            <div v-if="scope.row.infoList && scope.row.paramCd === '40015'">
              自定义曲线如连续
              <el-input-number
                v-model="scope.row.infoList[0].className"
                :precision="0"
                :min="0"
                :max="10000"
                :controls="false"
                :disabled="!scope.row.medifieSta"
              />
              个工作日计算失败，则会判定曲线设定存在问题
            </div>

            <!-- 估值参数配置 -->
            <div v-if="itemShow(scope.row, ['50001', '50004', '50007', '50010', '50013'])">
              标准曲线簇估值时向前追溯
              <el-input-number
                v-model="scope.row.infoList[0].className"
                :precision="0"
                :min="1"
                :max="10000"
                :controls="false"
                :disabled="!scope.row.medifieSta"
              />个工作日（含当日）
            </div>
            <div v-if="itemShow(scope.row, ['50002', '50005', '50008', '50011', '50014'])">
              估值时，针对同主体的有效样本点设置下限
              <el-input-number
                v-model="scope.row.infoList[0].className"
                :min="1"
                :max="10000"
                :controls="false"
                :disabled="!scope.row.medifieSta"
              />个，否则需要补虚拟样本点或继续前推日期
            </div>
            <div v-if="itemShow(scope.row, ['50003', '50006', '50009', '50012', '50015'])">
              估值时，补充估值用虚拟样本点后样本点总量仍然不够的情况下，则继续前推交易日，重算，每次增加
              <el-input-number
                v-model="scope.row.infoList[0].className"
                :precision="0"
                :min="1"
                :max="10000"
                :controls="false"
                :disabled="!scope.row.medifieSta"
              />个；标准曲线回溯天数上限为
              <el-input-number
                v-model="scope.row.infoList[1].className"
                :precision="0"
                :min="1"
                :max="10000"
                :controls="false"
                :disabled="!scope.row.medifieSta"
              />个交易日
            </div>

            <!-- 自定义曲线估值参数配置 -->
            <div v-if="scope.row.infoList && scope.row.paramCd === '50016'">
              自定义曲线估值时向前追溯
              <el-input-number
                v-model="scope.row.infoList[0].className"
                :precision="0"
                :min="1"
                :max="10000"
                :controls="false"
                :disabled="!scope.row.medifieSta"
              />个工作日（含当日）
            </div>
            <div v-if="scope.row.infoList && scope.row.paramCd === '50017'">
              估值时，针对同主体的有效样本点设置下限
              <el-input-number
                v-model="scope.row.infoList[0].className"
                :precision="0"
                :min="1"
                :max="10000"
                :controls="false"
                :disabled="!scope.row.medifieSta"
              />个，否则需要补虚拟样本点或继续前推日期
            </div>
            <div v-if="scope.row.infoList && scope.row.paramCd === '50018'">
              估值时，补充估值用虚拟样本点后样本点总量仍然不够的情况下，则继续前推交易日，重算，每次增加
              <el-input-number
                v-model="scope.row.infoList[0].className"
                :precision="0"
                :min="1"
                :max="10000"
                :controls="false"
                :disabled="!scope.row.medifieSta"
              />个；自定义曲线回溯天数上限为
              <el-input-number
                v-model="scope.row.infoList[1].className"
                :precision="0"
                :min="1"
                :max="10000"
                :controls="false"
                :disabled="!scope.row.medifieSta"
              />个交易日
            </div>
          </template>
        </el-table-column>
        <!-- 自定义曲线分组规则 -->
        <el-table-column
          v-if="itemIndex === 'tabSecondData'"
          prop=" validSta"
          label="状态"
          align="center"
          width="150"
        >
          <template slot-scope="scope">
            {{ scope.row.validSta === 1 ? '启用' : '禁用' }}
          </template>
        </el-table-column>
        <!-- 全局异常值剔除规则 -->
        <el-table-column
          v-if="itemIndex === 'tabThirdData'"
          prop="createTime"
          label="创建日期"
          align="center"
          width="120"
        >
          <template slot-scope="scope">
            {{ showDate(scope.row) }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="itemIndex === 'tabThirdData'"
          prop="exBegindate"
          label="异常值起始日"
          align="center"
          width="120"
        >
          <template slot-scope="scope">
            {{ scope.row.exBegindate || '--' }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="itemIndex === 'tabThirdData'"
          prop="exEnddate"
          label="异常值结束日"
          align="center"
          width="120"
        >
          <template slot-scope="scope">
            {{ scope.row.exEnddate || '--' }}
          </template>
        </el-table-column>
        <el-table-column
          v-if="itemIndex === 'tabThirdData'"
          prop="validSta"
          label="状态"
          align="center"
          width="100"
        >
          <template slot-scope="scope">
            {{ templateShow(scope.row) }}
          </template>
        </el-table-column>
        <!-- 备选样本券阈值配置 -->
        <el-table-column
          v-if="
            itemIndex === 'tabFirstData' ||
              itemIndex === 'tabFourthData' ||
              itemIndex === 'tabFifthData'
          "
          fixed="right"
          label="操作"
          width="150"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              v-if="!scope.row.medifieSta"
              v-disBtn="editPermission"
              size="small"
              type="text"
              @click.native.prevent="editRow(scope.$index, scope.row, true)"
            >
              编辑
            </el-button>
            <el-button
              v-if="scope.row.medifieSta"
              size="small"
              type="text"
              @click.native.prevent="saveRow(scope.$index, scope.row, false)"
            >
              保存
            </el-button>
            <el-button
              v-if="scope.row.medifieSta"
              size="small"
              type="text"
              @click.native.prevent="callRow(scope.$index, scope.row, false)"
            >
              取消
            </el-button>
          </template>
        </el-table-column>
        <!-- 自定义曲线分组规则 -->
        <el-table-column
          v-if="itemIndex === 'tabSecondData'"
          fixed="right"
          label="操作"
          width="170"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              v-if="editBtnShow(scope.row)"
              v-disBtn="editPermission"
              size="small"
              type="text"
              @click.native.prevent="editRow(scope.$index, scope.row, true)"
            >
              编辑
            </el-button>
            <el-button
              v-if="scope.row.medifieSta"
              size="small"
              type="text"
              @click.native.prevent="saveRow(scope.$index, scope.row, false)"
            >
              保存
            </el-button>
            <el-button
              v-if="scope.row.medifieSta"
              size="small"
              type="text"
              @click.native.prevent="callRow(scope.$index, scope.row, false)"
            >
              取消
            </el-button>
            <el-button
              v-if="scope.row.validSta === 0"
              v-disBtn="enable"
              size="small"
              type="text"
              @click.native.prevent="forbiddenRow(scope.$index, scope.row)"
            >
              启用
            </el-button>
            <el-button
              v-if="scope.row.validSta === 1 && !scope.row.medifieSta"
              v-disBtn="forbidden"
              size="small"
              type="text"
              @click.native.prevent="forbiddenRow(scope.$index, scope.row)"
            >
              禁用
            </el-button>
          </template>
        </el-table-column>
        <!-- 异常值剔除阈值设置 -->
        <el-table-column
          v-if="itemIndex === 'tabThirdData'"
          fixed="right"
          label="操作"
          width="150"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              v-if="editShow(scope.row)"
              v-disBtn="editPermissionTwo"
              size="small"
              type="text"
              @click.native.prevent="editRow(scope.$index, scope.row, true)"
            >
              编辑
            </el-button>
            <el-button
              v-if="saveShow(scope.row)"
              size="small"
              type="text"
              @click.native.prevent="saveRow(scope.$index, scope.row, false)"
            >
              保存
            </el-button>
            <el-button
              v-if="saveShow(scope.row)"
              size="small"
              type="text"
              @click.native.prevent="callRow(scope.$index, scope.row, false)"
            >
              取消
            </el-button>
            <el-button
              v-if="validStaCan(scope.row)"
              v-disBtn="expire"
              size="small"
              type="text"
              @click.native.prevent="expireRow(scope.$index, scope.row, false)"
            >
              到期
            </el-button>
            <el-button v-if="validStaCant(scope.row)" type="text" disabled>到期</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="base-pagination"
        :total="total"
        :layout="showLayout"
        :page-size="pageSize"
        :page-sizes="pageSizes.length === 0 ? computePageSizes : pageSizes"
        :current-page="currentPage"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        v-on="$listeners"
      >
      </el-pagination>
    </div>
  </div>
</template>
<script>
import * as service from '@api/parameter'
export default {
  name: 'TabFirstData',
  props: {
    selection: {
      type: Boolean,
      default: false
    },
    indexed: {
      type: Boolean,
      default: false
    },
    itemIndex: {
      type: String,
      default: () => ''
    },
    loading: {
      type: Boolean,
      default: false
    },
    activeTab: {
      type: String,
      default: ''
    },
    curveSelect: {
      type: Boolean,
      default: false
    },
    tableHeight: {
      type: String,
      default: () => ''
    },
    total: {
      type: Number,
      default: () => 15
    },
    pageSizes: {
      type: Array,
      default: () => []
    },
    currentPage: {
      type: Number,
      default: () => 1
    },
    pageSize: {
      type: Number,
      default: () => 0
    },
    // 控制是否只显示曲线管理的
    clusterShow: {
      type: Boolean,
      default: false
    },
    // 传过来的曲线簇名称
    clusterName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      expire: 84219,
      editPermissionTwo: 84216,
      forbidden: 84211,
      enable: 84212,
      editPermission: null,
      show: 21005,
      derive: 21006,
      Batchexport: 21007,
      subject: 21008,
      amount: 21009,
      inquire: 21011,
      tableData: [],
      tableDataIndex: [],
      ruleForm: {
        paramCdList: '',
        clusterName: ''
      },
      conjunction: true,
      multipleSelection: [],
      paramNameList: [],
      clusterList: [] // 曲线簇名称
    }
  },
  computed: {
    computePageSizes: function() {
      let sizes = []
      let size = 10
      size = this.showCurrentSize ? 16 : 16
      sizes = [size, 50, 100, 500, 5000]
      return sizes
    },
    showLayout: function() {
      // 通过表头计算页面选择器 默认展示16/页还是18/页
      let defaultLayout = ['total', 'sizes', 'prev', 'pager', 'next', 'jumper']
      let layout = this.layout ? this.layout.split(',').map(item => item.trim()) : defaultLayout
      layout = layout.join(',')
      return layout
    },
    selectShow() {
      return (
        ((this.itemIndex === 'tabFourthData' && this.activeTab === '1') ||
          (this.itemIndex === 'tabFifthData' && this.activeTab === '1')) &&
        this.curveSelect === false
      )
    }
  },
  watch: {
    itemIndex: {
      handler(nv) {
        switch (nv) {
          case 'tabFirstData':
            this.editPermission = 84210 // 备选样本券阈值配置中的编辑
            break
          case 'tabFourthData':
            this.editPermission = 84217 // 标准曲线模型配置的编辑
            break
          case 'tabFifthData':
            this.editPermission = 84218 // 估值参数配置的编辑
            break
          case 'tabSecondData':
            this.editPermission = 84213 // 自定义曲线分组规则中的编辑
            break
          default:
            break
        }
        if (nv === 'tabFourthData' || nv === 'tabFifthData') {
          this.getParamsName()
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.getClusterName()
  },
  methods: {
    getRowKey(row) {
      return row.id
    },
    handleCurrentChange(val) {
      this.$emit('handleCurrent', val)
    },
    handleSizeChange(val) {
      this.$emit('handleSize', val)
    },
    onSubmit() {
      this.$emit('submit', this.ruleForm)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    batchMaturity() {
      if (this.multipleSelection.length === 0) {
        this.$message({
          message: '请选中到期数据',
          type: 'error'
        })
      } else {
        service.getUpdateBatchExpireTime({ paramsCDList: this.multipleSelection }).then(res => {
          if (res.status === 200) {
            this.$message({
              type: 'success',
              message: '批量设置成功'
            })
            this.multipleSelection = []
            this.$refs.tableRef.clearSelection()
            this.tableData = []
            this.$emit('query')
          }
        })
      }
    },
    efficacious() {
      this.conjunction = !this.conjunction
      this.$emit('lifecycle', this.conjunction)
    },
    editRow(index, row, val) {
      this.tableDataIndex.push(index)
      this.$emit('onTableDataIndex', this.tableDataIndex)
      this.tableData[index].medifieSta = val
    },
    saveRow(index, row, val) {
      // 判断大小月
      if (['10002', '10003', '10004'].includes(row.paramCd)) {
        let mouth = this.tableData[index].infoList[0].className
        let day = this.tableData[index].infoList[1].className
        let big = [1, 3, 5, 7, 8, 10, 12]
        let small = [4, 6, 9, 11]
        if (big.includes(mouth)) {
          let regDate = /^(?:[1-9]|[12][0-9]|3[01])$/
          if (!regDate.test(day)) {
            this.$message.warning('请输入正确的日期')
            return false
          }
        } else if (small.includes(mouth)) {
          let regDate = /^(?:[1-9]|[12][0-9]|30)$/
          if (!regDate.test(day)) {
            this.$message.warning('请输入正确的日期')
            return false
          }
        } else {
          let regDate = /^(?:[1-9]|[12][0-8])$/
          if (!regDate.test(day)) {
            this.$message.warning('请输入正确的日期')
            return false
          }
        }
      }
      // 记录数据
      let ins = this.tableDataIndex.indexOf(index)
      this.tableDataIndex.splice(ins, 1)
      this.$emit('onTableDataIndex', this.tableDataIndex)
      // 保存
      const params = this.tableData[index].infoList
      this.postSaveParamInfo(params)
      // 改变当前状态值
      this.tableData[index].medifieSta = val
    },
    callRow(index, row, val) {
      let item = JSON.parse(sessionStorage.getItem('tableList'))[index]
      let ins = this.tableDataIndex.indexOf(index)
      this.tableDataIndex.splice(ins, 1)
      this.$emit('onTableDataIndex', this.tableDataIndex)
      this.tableData[index].infoList = item.infoList
      this.tableData[index].medifieSta = val
    },
    expireRow(index, row, val) {
      this.$confirm('是否确定将此主体异常值规则置为到期？', '到期', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          service.getUpdateExpireTime(row.id).then(res => {
            if (res.status === 200) {
              this.$message({
                type: 'success',
                message: '设置成功'
              })
              this.tableData = []
              this.$emit('query')
            }
          })
        })
        .catch(() => {})
    },
    exportData() {
      service.getExportExcel().then(() => {
        this.$message({
          showClose: true,
          message: '导出成功',
          type: 'success'
        })
      })
    },
    forbiddenRow(index, val) {
      const paramCd = val.paramCd
      service.postUpdateState({ paramCd }).then(res => {
        const { status, message } = res
        if (status === 200) {
          this.$emit('refresh')
          this.$message({
            showClose: true,
            message: message,
            type: 'success'
          })
        } else {
          this.$message({
            message: message,
            type: 'error'
          })
        }
      })
    },
    postSaveParamInfo(val) {
      service.postSaveParamInfo({ globalParamInfoList: val }).then(res => {
        const { status, message } = res
        if (status === 200) {
          this.$emit('refresh', '保存')
          this.$message({
            showClose: true,
            message: message,
            type: 'success'
          })
        } else {
          this.$message({
            message: message,
            type: 'error'
          })
        }
      })
    },
    // 获取曲线簇名称
    getClusterName() {
      service.getClusterName().then(res => {
        const { status, data } = res
        if (status === 200) {
          this.clusterList = data
        }
      })
    },
    getParamsName() {
      this.ruleForm = {
        paramCdList: '',
        clusterName: ''
      }
      let params = this.itemIndex === 'tabFourthData' ? 4 : 5
      service.getParamsName(params).then(res => {
        const { status, data } = res
        if (status === 200) {
          this.paramNameList = data
        }
      })
    },
    handleClusterLabel(arr, value) {
      let item = arr.filter(i => i.code === value)
      let result = item.length > 0 ? item[0].name : '--'
      return result
    },
    downloadSubject() {
      this.$emit('handleImport', '导入异常主体')
    },
    downloadAmount() {
      this.$emit('handleImport', '导入异常债项')
    },
    templateShow(row) {
      const { validSta } = row
      const noArr = ['30001', '30002', '30003']
      return noArr.includes(row.paramCd)
        ? '--'
        : validSta === 1
        ? '当前有效'
        : validSta === 0
        ? '历史有效'
        : '--'
    },
    itemShow(row, arr) {
      const { infoList, paramCd } = row
      return infoList && arr.includes(paramCd)
    },
    editShow(row) {
      const { medifieSta, paramCd } = row
      return !medifieSta && (paramCd === '30001' || paramCd === '30002' || paramCd === '30003')
    },
    saveShow(row) {
      const { medifieSta, paramCd } = row
      return medifieSta && (paramCd === '30001' || paramCd === '30002' || paramCd === '30003')
    },
    validStaCan(row) {
      const { validSta, paramCd } = row
      return validSta === 1 && !['30001', '30002', '30003'].includes(paramCd)
    },
    validStaCant(row) {
      const { validSta, paramCd } = row
      return validSta === 0 && !['30001', '30002', '30003'].includes(paramCd)
    },
    showDate(row) {
      const { createTime, paramCd } = row
      return ['30001', '30002', '30003'].includes(paramCd) ? '--' : createTime
    },
    editBtnShow(row) {
      const { validSta, medifieSta, paramValue } = row
      return validSta === 1 && !medifieSta && paramValue !== '自定义曲线设置规则限制1'
    }
  }
}
</script>
<style lang="scss" scoped>
.el-form-item {
  margin-bottom: 10px !important;
}

::v-deep .el-input-number {
  width: 70px !important;
}

::v-deep.el-input-number .el-input__inner {
  height: 30px;
  padding: 0 !important;
}
</style>
<style lang="scss" scoped>
.a-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.el-table th,
.el-table td {
  padding: 8px 0;
}

.el-table--border {
  // border: none;
  td {
    border-right-color: #fff;
  }
}

.sortTable {
  .el-table th {
    padding: 0 !important;

    .cell {
      text-align: center;
    }
  }
}

.base-table {
  background-color: $color-white;

  .rightButt {
    padding-right: 10px;
    margin-bottom: 15px;
    text-align: right;
  }

  .letButt {
    .el-form {
      .el-input {
        width: 100% !important;
      }

      .el-select {
        position: relative !important;
        width: 100% !important;
      }
    }
  }

  .table-wrap {
    padding: 10px;

    .el-table--group,
    .el-table--border {
      border: 0;
    }

    .el-table th.el-table__cell.is-leaf,
    .el-table td.el-table__cell {
      border: 1px solid #ebeef5 !important;
    }

    .borderStyle {
      border: 1px solid rgba($color-mainfont, 0.2);
      border-top: none;
      border-bottom: none;
    }

    .el-table__row td {
      height: 40px;
      padding: 0;
      font-size: 12px;

      .el-button {
        padding: 0;
      }
    }

    .table {
      font-size: 12px;

      .sort-caret.descending {
        border-top-color: $color-black;
      }

      .sort-caret.ascending {
        border-bottom-color: $color-black;
      }

      .ascending {
        .sort-caret.ascending {
          border-bottom-color: #de680b;
        }
      }

      .descending {
        .sort-caret.descending {
          border-top-color: #de680b;
        }
      }

      .el-table-column--selection .cell {
        overflow: visible !important;
      }

      .table_head {
        th {
          align-self: center;
          height: 34px;
          padding: 0;
          font-size: 14px;
          font-weight: bold;
          color: $color-black;
          background-color: $color-table-header-bg;
          border-right: 1px solid $color-background;

          .el-checkbox__input.is-indeterminate,
          .el-checkbox__input.is-checked,
          .el-checkbox__input.is-focus {
            .el-checkbox__inner {
              background-color: #fff;
              border-color: #fff;
            }
          }

          .el-checkbox__inner::before {
            background-color: $color-main;
          }

          .el-checkbox__inner::after {
            border-color: $color-main;
          }

          .cell {
            display: flex;
            justify-content: center;
            overflow: hidden;
            text-overflow: ellipsis;
            border-bottom: none;

            .thead-cell {
              display: inline-flex;
              flex-direction: row;
              align-items: left;
              padding: 0;
              overflow: initial;
              cursor: pointer;
            }
          }

          .el-table__fixed {
            cursor: not-allowed;
          }
        }

        .el-checkbox.is-checked {
          color: $color-background;
        }
      }

      .el-table__footer {
        &::after {
          position: absolute;
          bottom: 0;
          left: 0;
          display: block;
          width: 100%;
          height: 2px;
          content: '';
          background-color: rgba($color-mainfont, 0.4);
        }

        tbody td {
          height: 36px;
          padding: 0;
          font-size: 14px;
          font-weight: bold;
          line-height: 36px;
          color: $color-mainfont;
        }
      }
    }

    .table .el-table__footer-wrapper .el-table__footer {
      &::before {
        position: absolute;
        left: 0;
        z-index: 4;
        display: block;
        width: 100%;
        height: 2px;
        content: '';
        background-color: rgba($color-mainfont, 0.4);
      }
    }

    .base-pagination {
      height: 50px;
      padding: 0 5px;
      text-align: right;
      background-color: $color-white;

      .el-pagination__total,
      .el-pagination__sizes,
      .el-pagination__jump {
        font-size: 14px;
        line-height: 50px;
      }

      .el-pagination__total {
        float: left;
      }

      .el-pagination .el-icon {
        color: #929292;
      }

      .el-input__suffix {
        height: 30px;
      }

      .btn-prev,
      .btn-next,
      .el-pager li {
        margin: 10px 5px;
        font-size: 14px;
      }

      .el-pager li {
        font-weight: 400;
        color: #606266;
      }

      .el-pager li:not(.disabled).active {
        color: $color-main;
        background-color: $color-white;
      }

      .el-input .el-input__inner {
        height: 30px;
        line-height: 30px;
        color: #4a4a4a;
      }
    }
  }

  .el-table__fixed::before,
  .el-table__fixed-right::before,
  .el-table::before,
  .el-table--group::after,
  .el-table--border::after {
    width: 0;
  }

  .summary {
    .borderStyle {
      border-bottom: 1px solid rgba($color-mainfont, 0.2);
    }
  }

  .table .el-table__fixed-header-wrapper {
    .table_head th:last-child {
      border-right: none;
    }
  }
}

.pd20 {
  padding-bottom: 20px;
}

.polymerization-table {
  .base-table {
    .table-wrap {
      .table {
        .table_head {
          th {
            color: $color-mainfont;
            background-color: rgba($color-main, 0.2);
          }
        }
      }
    }
  }
}

.pageNumber {
  padding: 6px 0 16px 10px;
  margin: 0;
  font-size: 14px;
  color: $color-mainfont;
  background-color: $color-white;
}

.el-tooltip__popper {
  max-width: 350px;
}

.form-border-radius {
  padding: 8px 8px 0;
  margin: 0 10px;
  border: 1px solid #e6e9eb;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}
</style>
