<!--曲线规则中发起计算-->
<template>
  <div>
    <el-dialog
      title="发起计算"
      :visible="dialogVisible"
      :close-on-click-modal="false"
      width="1040px"
      :append-to-body="true"
      @close="close"
      @open="open"
    >
      <div>
        <el-form ref="formRef" :model="params" :rules="rules">
          <el-row>
            <el-col :span="7">
              <el-form-item label="开始日期:" prop="startDt">
                <el-date-picker
                  v-model="params.startDt"
                  type="date"
                  placeholder="选择日期"
                  align="center"
                  style="width:200px"
                  :picker-options="pickerOptions"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="结束日期:" prop="endDt">
                <el-date-picker
                  v-model="params.endDt"
                  type="date"
                  placeholder="选择日期"
                  align="center"
                  style="width:200px"
                  :picker-options="pickerOptions"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="10">
              <el-form-item label="是否覆盖人工重算结果:" prop="overrideResults">
                <el-select v-model="params.overrideResults" style="width:200px">
                  <el-option
                    v-for="item in cover"
                    :key="item.label"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <div>
        <div class="calculate">
          <span class="span"
            >注意：自定义曲线实时计算的交易日天数上限为{{
              upper
            }}个交易日(如有较长期间的实时计算需求，可联系业务管理员王骋宇（6710）发起临时计算命令)</span
          >
          <div>
            <el-button type="text" class="fontSize" @click="skip"
              >点击跳转至曲线拟合结果界面</el-button
            >
            <el-button :loading="isDisabled" type="primary" @click="initiate(0)"
              >发起实时计算</el-button
            >
            <el-button type="primary" class="marginBot" @click="initiate(1)"
              >发起延时计算</el-button
            >
          </div>
        </div>
        <!-- 进度条 -->
        <div v-if="percentage !== 0" class="marginTop">
          <i :class="percentage === 100 ? 'el-icon-check' : 'el-icon-loading'"></i>
          <span>实时计算预期等待时间</span>
          <el-progress :percentage="percentage" :format="format"></el-progress>
        </div>
        <div v-for="(item, index) in TaskList" :key="item.id" class="delayed">
          <div>
            <span class="font"
              >延时计算任务{{ index + 1 }}:
              <span class="itemTime"> {{ item.startDt }} 至 {{ item.endDt }} </span>
            </span>
          </div>
          <div>
            <el-button type="primary" size="mini" @click="cancel(item.id)">取消任务</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  calculationAPI,
  cancelAPI,
  getCurveCalTaskList,
  calButtonChackAPI,
  getCusCurveParamAPI,
  getcurveSkipParamAPI,
  curveCalTimeAPI,
  curveCalTimeBeforeTwentyDay,
  curveCalTimeByDelayed
} from '@api/curveRoule'
import { mapGetters } from 'vuex'

export default {
  name: 'Calculate',
  props: {
    dialogVisible: {
      type: Boolean
    },
    curveId: {
      type: String,
      default: null
    },
    record: {
      type: Object,
      default: null
    },
    sponsorTitle: {
      type: String,
      default: ''
    }
  },

  data() {
    const validator = (rule, value, callback) => {
      if (value < this.params.startDt) {
        callback(new Error('结束日期不可以小于开始日期'))
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
      params: {
        // 开始日期
        startDt: null,
        // 结束日期
        endDt: null,
        // 覆盖人工
        overrideResults: 0,
        // 任务状态变更
        status: 1,
        // 计算类型
        type: null
      },
      // 延时计算任务列表
      TaskList: [],
      // 延时计算的id
      id: '',
      // 是否覆盖数据自己准备
      cover: [
        {
          label: '是',
          value: 1
        },
        {
          label: '否',
          value: 0
        }
      ],
      // 参数上限
      upper: null,
      // 校验规则
      rules: {
        startDt: [{ required: true, message: '请选择开始时间', trigger: 'blur' }],
        endDt: [
          { required: true, message: '请选择结束时间', trigger: 'blur' },
          { validator: validator, trigger: 'blur' }
        ],
        overrideResults: [{ required: true, message: '是否覆盖人工', trigger: 'blur' }]
      },
      percentage: 0,
      // 定时器标识
      times: null,
      isDisabled: false
    }
  },

  computed: {
    ...mapGetters({ ableDate: 'ableDate' })
  },
  methods: {
    close() {
      this.params = {
        // 开始日期
        startDt: null,
        // 结束日期
        endDt: null,
        // 覆盖人工
        overrideResults: 0,
        // 任务状态变更
        status: 1,
        // 计算类型
        type: null
      }
      this.isDisabled = false
      this.percentage = 0
      clearInterval(this.times)
      this.$refs['formRef'].resetFields()
      this.$emit('calClose', false)
    },
    showClose() {
      this.$emit('showClose')
    },
    // 发起计算
    initiate(type) {
      this.$refs.formRef.validate(async valid => {
        if (valid) {
          this.percentage = 0
          clearInterval(this.times)
          let params = {}
          params.type = type
          params.startDt = this.$moment(this.params.startDt).format('YYYYMMDD')
          params.endDt = this.$moment(this.params.endDt).format('YYYYMMDD')
          params.overrideResults = this.params.overrideResults
          params.status = this.params.status
          if (type === 0) {
            this.isDisabled = true
            const { data } = await calButtonChackAPI({ ...params, ...{ curveId: this.curveId } })
            if (data.code === '1') {
              this.isDisabled = false
              return this.$message.error(
                `已存在实时计算或计算日期超过参数管理配置,当前需计算${data.name}交易日`
              )
            } else if (data.code === '0') {
              this.times = setInterval(() => {
                this.percentage += 1
                if (this.percentage === 100) {
                  clearInterval(this.times)
                  this.isDisabled = false
                }
              }, 250)
            }
          }
          const res = await calculationAPI({ ...params, ...{ curveId: this.curveId } })
          const { status, data } = res
          if (status === 200) {
            if (data === '延时计算天数超出参数管理配置') {
              this.$message.error(data)
              this.isDisabled = false
            } else if (data.includes('此次')) {
              this.percentage = 0
              clearTimeout(this.times)
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
              this.isDisabled = false
            }
          }
        }
      })
    },
    // 打开时获取最新的计算任务
    async open() {
      if (this.record) {
        if (this.sponsorTitle === '发起计算') {
          const { data } = await curveCalTimeAPI({ curveId: this.curveId })
          this.params.startDt = data.code
          this.params.endDt = data.name
        } else if (this.sponsorTitle === '实时计算') {
          const { data } = await curveCalTimeBeforeTwentyDay(this.record.endDt)
          this.params.startDt = data.code
          this.params.endDt = data.name
        } else {
          const { startDt, endDt } = this.record
          let params = {
            startDate: startDt,
            endDate: endDt
          }
          const { data } = await curveCalTimeByDelayed(params)
          this.params.startDt = this.$moment(data.code).format('YYYY/MM/DD')
          this.params.endDt = this.$moment(data.name).format('YYYY/MM/DD')
        }
      }
      this.getCusCurveParamFN()
      const { data } = await getCurveCalTaskList({ curveId: this.curveId })
      this.TaskList = data
    },
    async cancel(id) {
      const res = await cancelAPI({ id })
      if (res.status === 200) {
        this.$message.success('取消成功')
        this.open()
      }
    },
    format(percentage) {
      return percentage === 100 ? '完成' : `${percentage}%`
    },
    // 获取参数上限
    async getCusCurveParamFN() {
      const { data } = await getCusCurveParamAPI()
      this.upper = data
    },
    // 点击曲线视图链接的时候
    async skip() {
      this.showClose()
      const { data } = await getcurveSkipParamAPI({ curveId: this.curveId })
      localStorage.setItem('structure', JSON.stringify(data))
      this.$router.push({
        path: '/curvefitting/curvefitting-structure'
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.el-dialog {
  padding: 0 16px;
}
.calculate {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  .span {
    display: -webkit-box;
    width: 470px;
    overflow: hidden;
    font-size: 14px;
    color: red;
    text-overflow: ellipsis;
    word-break: break-all;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }
}
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
.fontSize {
  font-size: 16px;
}
.marginBot {
  margin-bottom: 12px;
}
.marginTop {
  margin-top: 20px;
}
.itemTime {
  margin-left: 16px;
  font-weight: 400;
  color: #646769;
}
</style>
