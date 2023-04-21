<template>
  <div class="shuttle">
    <el-row class="chose">
      <el-col class="chose-item">
        <el-button class="choseBtn" type="primary" size="small" @click="handleShow">
          {{ btnName }}
          <i v-if="btnIcon" class="el-icon--right" :class="btnIcon"></i>
        </el-button>
        <div class="box">
          <p v-for="(item, index) in selectedData" :key="index" class="selected-item">
            {{ queryDate(item) }}
            <i class="del-select-item el-icon-close" @click="deleteItem(index)"></i>
          </p>
        </div>
        <el-button @click="handleEmpty">清空</el-button>
      </el-col>
    </el-row>
    <el-dialog
      :visible.sync="isShow"
      :title="dialogTitle"
      :before-close="handleDialogClose"
      :width="dialogWidth"
      :close-on-click-modal="false"
    >
      <div class="el-transfer">
        <!-- 左列表 -->
        <div class="el-transfer-panel">
          <div class="formI">
            <el-form ref="myForm" :model="initData.form" label-width="100px">
              <el-form-item
                v-for="(item, index) in initData.data"
                :key="index"
                :label="item.label"
                :class="item.class"
              >
                <el-select
                  v-if="item.type === 'Select'"
                  v-model="initData[item.key]"
                  :filterable="item.filterable"
                  :clearable="item.clearable"
                  :multiple="item.multiple"
                  :collapse-tags="item.multiple"
                  placeholder="请选择"
                  @change="onTrigger(initData[item.key], item)"
                >
                  <el-option
                    v-for="(i, indexs) in item.options || []"
                    :key="indexs"
                    :label="i.name"
                    :value="i.code"
                  >
                  </el-option>
                </el-select>
                <el-button
                  v-else-if="item.type === 'Button'"
                  :disabled="item.key === '查询' && onlefSearchList"
                  type="primary"
                  @click="onSubmit"
                  >{{ item.key }}
                </el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="el-transfer-panel__header">
            <label class="el-checkbox">
              <input
                v-model="leftCheckAll"
                class="el-checkbox__input"
                type="checkbox"
                @change="leftCheckedAll"
              />
              <div class="el-checkbox__label">
                列表1
                <span>{{ count(leftList) }}/{{ leftList.length }}</span>
              </div>
            </label>
          </div>
          <div v-loading="onlefSearchList" class="el-transfer-panel__body">
            <div class="el-checkbox-group el-transfer-panel__list">
              <label
                v-for="(lef, index) in lefSearchList"
                :key="index"
                class="el-checkbox el-transfer-panel__item is-checked"
              >
                <input v-model="lef.check" type="checkbox" @change="leftCheckChange" />
                {{ lef.curveName }}
              </label>
            </div>
          </div>
        </div>
        <!-- 方向箭头 -->
        <div class="el-transfer__buttons">
          <button
            class="el-button  el-transfer__button"
            :class="rigthList.length > 0 ? 'el-button--primary' : 'el-button--primary is-disabled'"
            :disabled="rigthList.length === 0"
            @click="leftTransfer"
          >
            <span><i class="el-icon-arrow-left"></i></span>
          </button>
          <button
            class="el-button  el-transfer__button"
            :class="leftList.length > 0 ? 'el-button--primary' : 'el-button--primary is-disabled'"
            :disabled="leftList.length === 0"
            @click="rightTransfer"
          >
            <span><i class="el-icon-arrow-right"></i></span>
          </button>
        </div>
        <!-- 右列表 -->
        <div class="el-transfer-panel transferRight" style="height:473px">
          <div class="el-transfer-panel__header">
            <label class="el-checkbox">
              <input
                v-model="rightCheckAll"
                class="el-checkbox__input"
                type="checkbox"
                @change="rightCheckedAll"
              />
              <div class="el-checkbox__label">
                列表2
                <span>{{ countTwo(rigthList) }}/{{ rigthList.length }}</span>
              </div>
            </label>
          </div>
          <div class="el-transfer-panel__body">
            <div class="el-checkbox-group el-transfer-panel__list">
              <label
                v-for="(leq, index) in rigSearchList"
                :key="index"
                class="el-checkbox el-transfer-panel__item is-checked"
              >
                <input
                  v-model="leq.checks"
                  type="checkbox"
                  class="curveInput"
                  @change="rightCheckChange"
                />
                <span
                  :title="leq.curveName"
                  class="curveName"
                  :class="
                    leq.timePicker ? 'curveName' : leq.timeSelect ? 'curveNameS' : 'curveNameT'
                  "
                >
                  {{ leq.curveName }}</span
                >
                <el-date-picker
                  v-if="leq.timePicker"
                  v-model="leq.queryDate"
                  :picker-options="pickerOptions"
                  type="date"
                  align="center"
                  placeholder="选择日期"
                  value-format="yyyyMMdd"
                  class="curvePicker"
                  @change="selectTime(leq, index)"
                  @input.native="val => onDatePickerInput(val)"
                  @blur="onDatePickerBlur($event, index)"
                >
                </el-date-picker>
                <el-input
                  v-if="leq.timeSelect"
                  v-model="leq.remainPeriod"
                  placeholder="请输入"
                  class="inputFor"
                  @change="timeInput(leq, index)"
                  @input="
                    inputFormat(
                      leq.remainPeriod,
                      leq.curveSectionPeriodMax,
                      leq.curveSectionPeriodMin,
                      index
                    )
                  "
                />
                <span v-if="leq.timeSelect" class="inputForSpan">年</span>
              </label>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleDialogClose">取消</el-button>
        <el-button type="primary" @click="submitForm">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import * as servicRou from '@api/curveRoule'
import { dateConfig } from '@utils/util'
export default {
  props: {
    dialogShow: {
      type: Boolean,
      default: false
    },
    btnName: {
      type: String,
      default: ''
    },
    btnIcon: {
      type: String,
      default: ''
    },
    dialogTitle: {
      type: String,
      default: ''
    },
    dialogWidth: {
      type: String,
      default: ''
    },
    shuttleData: {
      type: Array,
      default: () => []
    },
    initData: {
      type: Object,
      default: () => {}
    },
    selectedList: {
      type: Array,
      default: () => []
    },
    headlineTitle: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      pickerOptions: {
        disabledDate: time => {
          return !this.ableDate.includes(this.$moment(time).format('YYYYMMDD'))
        }
      },
      isShow: false,
      selectedData: [], // 穿梭框数据。
      lefSearchValue: '',
      rigSearchValue: '',
      leftCheckAll: false,
      rightCheckAll: false,
      leftList: [],
      rigthList: [],
      rigthBackups: [],
      originalData: [],
      DictMap: [],
      filtration: true,
      onlefSearchList: false
    }
  },
  computed: {
    lefSearchList() {
      return this.leftList.filter(v => v.curveName.indexOf(this.lefSearchValue) !== -1)
    },
    rigSearchList() {
      return this.rigthList.filter(v => v.curveName.indexOf(this.rigSearchValue) !== -1)
    },
    ...mapGetters({ ableDate: 'ableDate' })
  },
  watch: {
    dialogShow: {
      handler(v) {
        this.isShow = this.dialogShow
      },
      immediate: true
    },
    shuttleData() {
      this.leftList = this.shuttleData
    }
  },
  mounted() {},
  methods: {
    inputFormat(val, curveSectionPeriodMax, curveSectionPeriodMin, index) {
      let value = val.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1').replace(/^0+(\d)/, '$1')
      if (Number(curveSectionPeriodMax) >= Number(value) >= Number(curveSectionPeriodMin)) {
        this.rigSearchList[index].remainPeriod = value
      } else {
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.rigSearchList[index].remainPeriod = ''
        }, 500)
      }
    },
    queryDate(item) {
      const { queryDate, curveName, remainPeriod } = item
      return queryDate
        ? curveName + '(' + queryDate + ')'
        : remainPeriod
        ? curveName + '(' + remainPeriod + '年' + ')'
        : curveName
    },
    selectTime(val, index) {
      for (let i = 0; i < this.rigSearchList.length; i++) {
        if (index === 0 && this.rigSearchList[i].queryDate === '') {
          this.rigSearchList[i].queryDate = val.queryDate
        }
      }
    },
    timeInput(val, index) {
      for (let i = 0; i < this.rigSearchList.length; i++) {
        if (index === 0 && this.rigSearchList[i].remainPeriod === '') {
          this.inputFormat(
            val.remainPeriod,
            this.rigSearchList[i].curveSectionPeriodMax,
            this.rigSearchList[i].curveSectionPeriodMin,
            i
          )
        }
      }
    },
    handleShow() {
      this.isShow = true
    }, // 打开
    handleDialogClose() {
      // this.selectedData = []
      this.isShow = false
      this.dialogShow = false
      this.rigthList = this.originalData
      if (this.originalData.length === this.rigthList.length) {
        this.rigthList = [...this.selectedData]
      } else if (this.selectedData.length === this.rigthList.length) {
        this.rigthList = [...this.originalData]
      }
    }, // 关闭
    handleEmpty() {
      this.selectedData = []
      this.rigthList = []
      this.$emit('empty', this.selectedData)
    }, // 清空
    submitForm() {
      if (this.btnName === '选择单曲线' && this.rigthList.length >= 2) {
        this.$message({
          message: '单曲线选择数量已超出、请移除多余曲线',
          type: 'warning'
        })
      } else if (this.btnName === '选择多曲线' && this.rigthList.length > 10) {
        this.$message({
          message: '多曲线选择数量已超出10条、请移除多余曲线',
          type: 'warning'
        })
      } else {
        this.originalData = []
        this.selectedData = []
        this.originalData = [...this.rigthList]
        for (let i = 0; i < this.originalData.length; i++) {
          if (this.headlineTitle === '曲线利率期限结构' || this.headlineTitle === '曲线试算') {
            if (this.originalData[i].queryDate === null || this.originalData[i].queryDate === '') {
              this.$message({
                message: this.originalData[i].curveName + '请选择日期',
                type: 'warning'
              })
              this.filtration = false
              return
            }
          } else if (this.headlineTitle === '曲线利率走势分析') {
            if (this.originalData[i].remainPeriod === '') {
              this.$message({
                message: this.originalData[i].curveName + '请输入年限',
                type: 'warning'
              })
              this.filtration = false
              return
            }
          }
        }
        this.dialogShow = false
        this.isShow = false
        if (
          this.headlineTitle === '曲线利率走势分析' ||
          this.headlineTitle === '曲线利率期限结构'
        ) {
          let data = []
          this.originalData.forEach(item => {
            if (data.length === 0) {
              data.push(item)
            } else {
              let isDiff = true
              for (let i = 0; i < data.length; i++) {
                let dataItem = data[i]
                if (
                  dataItem.curveId === item.curveId &&
                  (dataItem.remainPeriod
                    ? dataItem.remainPeriod === item.remainPeriod
                    : dataItem.queryDate === item.queryDate)
                ) {
                  isDiff = false
                  break
                }
              }
              if (isDiff) {
                data.push(item)
              }
            }
          })
          this.selectedData = data
          this.rigthList = data
        } else {
          this.selectedData = this.originalData
        }
        this.$emit('submitForm', this.selectedData)
      }
    }, // 保存
    count(data) {
      return data.filter(v => v.check).length
    },
    countTwo(data) {
      return data.filter(v => v.checks).length
    },
    rightTransfer() {
      this.rigthBackups = []
      let selectTags = this.leftList.filter(v => v.check)
      this.rigthBackups.push(...selectTags)
      this.rigthBackups.forEach((item, index) => {
        this.rigthList.push({
          id: index,
          ...item
        })
      })
      if (this.btnName === '选择单曲线') {
        this.rigthList = this.removeDp(selectTags, this.rigthList)
      }
      this.leftList.forEach(element => {
        element.check = false
      })
      this.leftCheckAll = false
    },
    getRandomInt(min, max) {
      min = Math.ceil(min)
      max = Math.floor(max)
      return Math.floor(Math.random() * (max - min)) + min
    },
    removeDp(arr1, arr2) {
      let arr = arr1.concat(arr2)
      let obj = {}
      let newArray = arr.reduce((pre, cur) => {
        if (!obj[cur.curveId]) {
          obj[cur.curveId] = true
          pre.push(cur)
        }
        return pre
      }, [])
      return newArray
    },
    leftTransfer() {
      // let selectTags = this.rigthList.filter((v) => v.check);
      // this.leftList.push(...selectTags);
      this.rigthList = this.rigthList.filter(v => !v.checks)
      // this.rigthList.forEach(element => {
      //   element.checks = false
      // });
    },
    leftCheckedAll() {
      this.leftList.forEach(v => {
        v.check = this.leftCheckAll
      })
    },
    rightCheckedAll() {
      this.rigthList.forEach(v => {
        v.checks = this.rightCheckAll
      })
    },
    leftCheckChange() {
      let count = this.leftList.filter(v => v.check).length
      this.leftCheckAll = count === this.leftList.length
    },
    rightCheckChange() {
      let count = this.rigthList.filter(v => v.checks).length
      this.rightCheckAll = count === this.rigthList.length
    },
    handleReset() {
      this.lefSearchValue = ''
      this.rigSearchValue = ''
    },
    deleteItem(params) {
      this.selectedData.splice(params, 1)
      this.$emit('deleteItem', this.selectedData)
    }, // 删除某个
    onSubmit() {
      this.$emit('onSubmit')
    },
    onTrigger(data, item) {
      this.$emit('trigger', data, item)
    },
    canChange(val, index) {
      servicRou.getCurveSectionPeriodInfo({ curveId: val.curveId }).then(res => {
        if (res.status === 200) {
          this.rigSearchList[index].dicList = res.data
          this.rigSearchList[index].loading = false
        }
      })
    },
    onDatePickerInput(val) {
      this.input = val.target.value
    },
    onDatePickerBlur(val, index) {
      // 日期组件blur事件，获取输入的内容
      // val为日期组件实例
      // input 是否有值
      const { isValidValue, parseString } = val
      if (this.input === null || this.input === '' || this.input === undefined) return false
      // 值是否是日期格式
      let timeOne = new RegExp(/^(\d{4})-(\d{2}|\d{1})-(\d{2}|\d{1})$/)
      let timeTwo = new RegExp(/^(\d{4})(\d{2}|\d{1})(\d{2}|\d{1})$/)
      if (timeOne.test(this.input) || timeTwo.test(this.input)) {
        // 拿实例里的校验方法，验证传入的日期是否为交易日
        // common为普通日期选择，没有这个字段或者为false，是有交易日限制的日期组件
        const result = this.handleSearchNearDate(isValidValue, parseString, this.input)
        this.rigSearchList[index].queryDate = timeOne.test(result)
          ? this.$moment(result).format('YYYYMMDD')
          : result
        for (let i = 0; i < this.rigSearchList.length; i++) {
          if (index === 0 && this.rigSearchList[i].queryDate === '') {
            this.rigSearchList[i].queryDate = this.rigSearchList[index].queryDate
          }
        }
      }
      this.input = null
    },
    // 推算交易日
    handleSearchNearDate(isValidValue, parseString, input) {
      // 大于endDate，返回 endDate，小于beginDate，返回beginDate
      const { beginDate, endDate } = dateConfig()
      // Suppress the warnings
      const argInput = this.$moment(input).format('YYYYMMDD')
      if (argInput < beginDate) {
        return beginDate
      } else if (argInput > endDate) {
        return endDate
      } else {
        // Suppress the warnings
        let dateValue = this.$moment(argInput).format('YYYY-MM-DD')
        // 交易传入的值是否是交易日，不是交易日，向回退一日再次校验，直到找到交易日
        if (isValidValue(parseString(dateValue))) {
          return dateValue
        } else {
          let date = new Date(dateValue)
          // Suppress the warnings
          let time = this.$moment(date.getTime() - 1000 * 60 * 60 * 24).format('YYYY-MM-DD')
          return this.handleSearchNearDate(isValidValue, parseString, time)
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.shuttle {
  padding: 10px;
  margin: 10px;
  border: 1px solid #e6e9eb;
  border-radius: 4px;
  // margin: 20px 55px 0 20px;

  .choseBtn {
    margin-right: 20px;
  }

  .chose-item {
    display: flex;
  }

  .box {
    display: flex;
    width: 100%;
    margin-top: 0;
    margin-right: 10px;
    overflow: auto;
    border: 1px solid #e0e3e5;

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
  margin-right: 0;

  ::v-deep .el-form-item__content {
    .el-select {
      width: 220px;

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
</style>
<style lang="scss" scoped>
.el-transfer {
  font-size: 14px;
  text-align: center;
}

.transferRight {
  .el-transfer-panel__body {
    height: 100% !important;
  }

  .el-transfer-panel__list {
    height: calc(100% - 40px) !important;
  }
}

.el-transfer-panel {
  position: relative;
  box-sizing: border-box;
  display: inline-block;
  // width: 200px;
  height: 100%;
  overflow: hidden;
  text-align: left;
  vertical-align: middle;
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 4px;

  .el-transfer-panel__header {
    box-sizing: border-box;
    height: 40px;
    padding-left: 15px;
    margin: 0;
    line-height: 40px;
    color: #000;
    background: #f5f7fa;
    border-bottom: 1px solid #ebeef5;
  }

  .el-checkbox {
    position: relative;
    display: block;
    height: 38px;
    margin-right: 30px;
    font-size: 14px;
    font-weight: 500;
    line-height: 40px;
    color: #606266;
    white-space: nowrap;
    cursor: pointer;
    user-select: none;

    .curveInput {
      position: relative;
      top: -13px;
    }

    .curveName {
      position: relative;
      display: inline-block;
      width: 150px !important;
      padding-left: 5px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .curveNameT {
      width: 100% !important;
    }
    .curveNameS {
      width: 200px !important;
    }

    .curveSelect {
      position: relative;
      top: -13px;
      width: 120px;
    }

    .curvePicker {
      position: relative;
      top: -13px;
      width: 140px;
    }
    .inputFor {
      position: absolute;
      top: 0;
      right: 15px;
      width: 80px;
    }
    .inputForSpan {
      position: absolute;
      right: -10px;
    }

    .el-checkbox__input {
      position: relative;
      display: inline-block;
      line-height: 1;
      white-space: nowrap;
      vertical-align: middle;
      cursor: pointer;
      outline: none;
    }

    .el-checkbox__label {
      display: inline-block;
      font-size: 16px;
      font-weight: 400;
      color: #303133;

      span {
        position: absolute;
        right: 0;
        font-size: 12px;
        font-weight: 400;
        color: #909399;
      }
    }

    .el-checkbox-group {
      font-size: 0;
    }

    .el-transfer-panel__list {
      box-sizing: border-box;
      height: 100% !important;
      padding: 6px 0;
      margin: 0;
      overflow: auto;
      list-style: none;
    }

    .el-transfer-panel__item {
      display: block !important;
      height: 30px;
      padding-left: 15px;
      line-height: 30px;
    }

    .el-transfer-panel__item .el-checkbox {
      color: #606266;
    }

    .el-transfer__buttons {
      display: inline-block;
      padding: 0 30px;
      vertical-align: middle;
    }
  }
}
</style>
<style lang="scss" scoped>
.formI {
  position: relative;

  ::v-deep .curve {
    .el-form-item__label {
      line-height: normal !important;
    }
  }

  .el-form-item {
    position: relative;
    margin-top: 5px;
    margin-bottom: 5px;

    .el-form-item__content .el-select {
      width: 240px;
    }
  }
}
</style>
