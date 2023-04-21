<template>
  <div>
    <div class="form">
      <el-form ref="formRef" :rules="rules" :model="params">
        <el-row>
          <el-col :span="8">
            <el-form-item label="开始日期：" prop="startDt">
              <el-date-picker
                v-model="params.startDt"
                type="date"
                placeholder="选择日期"
                align="center"
                :picker-options="pickerOptions"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="结束日期：" prop="endDt">
              <el-date-picker
                v-model="params.endDt"
                type="date"
                placeholder="选择日期"
                align="center"
                :picker-options="pickerOptions"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="拟合结果：">
              <el-select v-model="params.fitResult" clearable placeholder="请选择">
                <el-option
                  v-for="item in fittingList"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item>
              <el-button type="primary" @click="inquire">查询</el-button>
              <el-button type="primary" @click="clear">重置</el-button>
              <el-button type="primary" :disabled="!(loginName === createrName)" @click="pop"
                >发起计算</el-button
              >
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="lable">
      <BaseTable :data-source="fittingData" :columns="columns" :height="300" :loading="loading" />
    </div>
    <div v-if="percentage !== 0" class="mt">
      <i :class="percentage === 100 ? 'el-icon-check' : 'el-icon-loading'"></i>
      <span>实时计算预期等待时间</span>
      <el-progress :percentage="percentage" :format="format"></el-progress>
    </div>
    <div v-for="(item, index) in TaskList" :key="item.id" class="delayed">
      <div>
        <span class="font"
          >延时计算任务{{ index + 1 }}:
          <span style=" margin-left:16px; font-weight: 400; color: #646769">
            {{ item.startDt }} 至 {{ item.endDt }}
          </span>
        </span>
      </div>
      <div>
        <el-button type="primary" size="mini" @click="cancel(item.id)">取消任务</el-button>
      </div>
    </div>
    <calculate
      :dialog-visible="dialogVisible"
      :curve-id="curveId"
      :sponsor-title="sponsorTitle"
      :record="record"
      @calClose="close"
      @showClose="showClose"
    />
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep'
import { dateConfig } from '@utils/util'
import BaseTable from '@components/BaseTable'
import calculate from './calculate.vue'
import { mapGetters } from 'vuex'
import {
  curveFitResultListAPI,
  calculationAPI,
  getCurveCalTaskList,
  cancelAPI,
  curveCalTimeAPI
} from '@api/curveRoule'
export default {
  components: {
    BaseTable,
    calculate
  },
  props: {
    curveId: {
      type: String,
      default: ''
    },
    loginName: {
      type: String,
      default: ''
    },
    createrName: {
      type: String,
      default: ''
    }
  },
  data() {
    const startDtverify = (rule, value, callback) => {
      if (!value && this.params.endDt) {
        callback(new Error('请选择完整时间'))
      } else {
        callback()
      }
    }
    const endDtverify = (rule, value, callback) => {
      if (!value && this.params.startDt) {
        callback(new Error('请选择完整时间'))
      } else {
        callback()
      }
    }
    return {
      pickerOptions: {
        disabledDate: time => {
          return !this.ableDate.includes(this.$moment(time).format('YYYYMMDD'))
        }
      },
      loading: true,
      fittingData: [],
      columns: [
        {
          type: 'selection',
          align: 'center'
        },
        {
          label: '序号',
          align: 'center',
          render: (h, record) => {
            return h('span', record.$index + 1)
          }
        },
        {
          label: '开始日期',
          prop: 'startDt',
          align: 'center'
        },
        {
          label: '结束日期',
          prop: 'endDt',
          align: 'center'
        },
        {
          label: '拟合结果',
          prop: 'fitResult',
          align: 'center',
          render(h, { record }) {
            let { fitResult } = record
            if (fitResult === '未拟合' || fitResult === '系统异常') {
              return <div class="yellow">{fitResult}</div>
            } else if (fitResult === '延时计算') {
              return <div class="blur">{fitResult}</div>
            } else if (fitResult === '缺失数据') {
              return <div class="red">{fitResult}</div>
            } else {
              return <div>{fitResult}</div>
            }
          }
        },
        {
          label: '操作',
          prop: '',
          width: 300,
          'header-align': 'center',
          align: 'center',
          render: (h, { record }) => {
            return (
              <div>
                <el-button
                  type="text"
                  onClick={() => this.sponsor(record, 0)}
                  disabled={
                    !(record.fitResult !== '拟合成功' && record.fitResult !== '缺失数据') ||
                    !(this.loginName === this.createrName)
                  }
                >
                  发起实时计算
                </el-button>
                <el-button
                  type="text"
                  onClick={() => this.sponsor(record, 1)}
                  disabled={
                    !(
                      record.fitResult !== '拟合成功' &&
                      record.fitResult !== '缺失数据' &&
                      record.fitResult !== '延时计算'
                    ) || !(this.loginName === this.createrName)
                  }
                >
                  发起延时计算
                </el-button>
                <span class="blueBar" />
              </div>
            )
          }
        }
      ],
      params: {
        // 开始日期
        startDt: this.$moment(dateConfig().beginDate).format('YYYY/MM/DD'),
        // 结束日期
        endDt: this.$moment(dateConfig().endDate).format('YYYY/MM/DD'),
        fitResult: null,
        pageNum: 1
        // pageSize: 10
      },
      // 总数
      total: null,
      // 拟合结果
      fittingList: [
        { code: '拟合成功', name: '拟合成功' },
        { code: '缺失数据', name: '缺失数据' },
        { code: '重新计算', name: '重新计算' },
        { code: '系统异常', name: '系统异常' },
        { code: '失效', name: '失效' },
        { code: '未拟合', name: '未拟合' },
        { code: '延时计算', name: '延时计算' }
      ],
      // 延时计算任务列表
      TaskList: [],
      // 控制  calculate dialog框显示
      dialogVisible: false,
      rules: {
        startDt: [{ validator: startDtverify, trigger: 'blur' }],
        endDt: [{ validator: endDtverify, trigger: 'blur' }]
      },
      percentage: 0,
      times: null,
      record: null,
      sponsorTitle: ''
    }
  },
  computed: {
    ...mapGetters({ ableDate: 'ableDate' })
  },
  created() {
    this.getCount()
    this.$nextTick(() => {
      this.inquire()
    })
  },
  methods: {
    async inquire() {
      this.$refs.formRef.validate(async valid => {
        if (valid) {
          let params = {}
          const { startDt, endDt, fitResult } = this.params
          params.startDt = this.$moment(startDt).format('YYYYMMDD')
          params.endDt = this.$moment(endDt).format('YYYYMMDD')
          params.fitResult = fitResult
          if (!startDt) {
            params.startDt = ''
          }
          if (!endDt) {
            params.endDt = ''
          }
          const { data } = await curveFitResultListAPI({ ...params, curveId: this.curveId })
          this.loading = false
          this.fittingData = data.list.map(item => {
            if (item.fitResult === '1') {
              item.fitResult = '拟合成功'
            } else if (item.fitResult === '2') {
              item.fitResult = '缺失数据'
            } else if (item.fitResult === '3') {
              item.fitResult = '重新计算'
            }
            return item
          })
        }
      })
    },
    async pop() {
      const { data } = await curveCalTimeAPI({ curveId: this.curveId })
      this.record = { startDt: cloneDeep(data.code), endDt: cloneDeep(data.name) }
      this.sponsorTitle = '发起计算'
      this.dialogVisible = true
    },
    // 显示弹框
    async sponsor(record, val) {
      this.dialogVisible = true
      this.sponsorTitle = val === 0 ? '实时计算' : '延时计算'
      this.record = record
    },
    // 发起延时计算和实时计算
    async count(record, val) {
      let params = {
        curveId: this.curveId,
        startDt: record.startDt,
        endDt: record.endDt,
        type: val,
        overrideResults: 0
      }
      if (val === 0) {
        this.times = setInterval(() => {
          this.percentage += 1
          if (this.percentage === 100) {
            clearInterval(this.times)
          }
        }, 250)
      }
      const res = await calculationAPI(params)
      const { data, status } = res
      if (status === 200) {
        if (val === 0) {
          this.percentage = 0
          clearTimeout(this.times)
        }
        if (data === '延时计算天数超出参数管理配置') {
          this.$message.error(data)
        } else if (data.includes('此次')) {
          this.$alert(data, '提示', {
            confirmButtonText: '确定',
            callback: action => {
              this.close()
            }
          })
          // 发起计算完成后退出页面
        } else if (data.includes('延时计算提交成功')) {
          this.$message.success(data)
          const res = await getCurveCalTaskList({ curveId: this.curveId })
          this.TaskList = res.data
        } else {
          this.$message.error(data)
        }
      }
      this.getCount()
    },
    // 获取延时计算任务列表
    async getCount() {
      const { data } = await getCurveCalTaskList({ curveId: this.curveId })
      this.TaskList = data
    },
    // 取消任务
    async cancel(id) {
      const res = await cancelAPI({ id })
      if (res.status === 200) {
        this.$message.success('取消成功')
        this.getCount()
        this.inquire()
      }
    },
    // 点击重置
    clear() {
      this.params = {
        // 开始日期
        startDt: '',
        // 结束日期
        endDt: '',
        fitResult: null,
        pageNum: 1
        // pageSize: 10
      }
    },
    showClose() {
      this.percentage = 0
      clearInterval(this.times)
      this.dialogVisible = false
      this.$emit('showClose')
    },
    // 关闭calculate diaLog框的时候
    close() {
      this.percentage = 0
      clearInterval(this.times)
      this.inquire()
      this.getCount()
      this.dialogVisible = false
      this.percentage = 0
      this.loading = true
      this.record = null
    },
    format(percentage) {
      return percentage === 100 ? '完成' : `${percentage}%`
    }
  }
}
</script>

<style lang="scss" scoped>
.delayed {
  display: flex;
  align-items: center;
  justify-content: space-between;
  // width: 100%;
  height: 40px;
  padding: 0 16px;
  margin-top: 12px;
  background: #ecf6ff;
  border: 1px solid #b3d9ff;
  border-left: 3px solid #409eff;
  border-radius: 4px;
  .font {
    font-size: 14px;
    font-weight: 800;
    color: #323537;
    text-align: justify;
    letter-spacing: 0;
  }
}
.mt {
  margin-top: 20px;
}
::v-deep .yellow {
  color: #f90;
}
::v-deep .blur {
  color: #409eff;
}
::v-deep .red {
  color: red;
}
</style>
