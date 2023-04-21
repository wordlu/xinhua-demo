<template>
  <div class="mainBox">
    <el-form
      v-if="show"
      ref="myForm"
      :model="useData.initData"
      :rules="useData.rules"
      :label-width="labelWidth + 'px'"
      label-position="right"
      class="grid"
      @submit.native.prevent
    >
      <div v-if="defaultControl.length > 0" class="form-border-top" :class="hasBottomLine">
        <el-row v-for="(rowItem, rowIndex) in useData.maxRow" :key="rowIndex">
          <el-col
            v-for="(item, index) in filterRenderControl(renderControl, rowItem)"
            :key="index"
            :span="searchSapn(item)"
          >
            <template v-if="item.type !== 'Slot'">
              <el-form-item
                :label="item.label"
                :label-width="item.labelWidth"
                :prop="setProp(item.key)"
                :class="returnClass(item)"
              >
                <el-date-picker
                  v-if="item.type === 'DatePicker'"
                  ref="datePicker"
                  :key="item.key"
                  v-model="useData.initData[item.key]"
                  :class="item.class"
                  type="date"
                  align="center"
                  :append-to-body="false"
                  :placeholder="item.placeholder || '选择日期'"
                  :value-format="item.format || 'yyyyMMdd'"
                  :picker-options="item.options"
                  @change="val => onTrigger(useData.initData, item, val)"
                  @input.native="val => onDatePickerInput(val, useData.initData, item)"
                  @blur="onDatePickerBlur($event, useData.initData, item)"
                  @keydown.native="handleKeydown($event, useData.initData, item)"
                >
                </el-date-picker>
                <el-select
                  v-else-if="item.type === 'Select'"
                  v-model="useData.initData[item.key]"
                  :class="item.class"
                  :disabled="item.disabled"
                  :filterable="item.filterable"
                  :remote="item.remote"
                  :clearable="item.clearable"
                  :multiple="item.multiple"
                  :popper-append-to-body="false"
                  :collapse-tags="item.multiple"
                  :filter-method="item.filterMethod && (val => getFilterMethod(val, item))"
                  :remote-method="val => getRemoteMethod(val, item)"
                  :reserve-keyword="item.reserveKeyword"
                  placeholder="请选择"
                  @change="onTrigger(useData.initData, item)"
                  @visible-change="val => onVisibleTrigger(useData.initData, item, val)"
                  @clear="onClear(useData.initData, item)"
                >
                  <!-- 多选适配全选与取消全选功能，如果需要全选项，renderForm 加上 optionsHasSelectAll: true -->
                  <el-checkbox
                    v-if="showSelectAll(item)"
                    v-model="item.checked"
                    class="ml20"
                    @change="selectAll(useData.initData, item)"
                    >全选</el-checkbox
                  >
                  <el-option
                    v-for="(i, indexs) in item.options || []"
                    :key="i.code + '' + indexs"
                    :label="i.name"
                    :value="i.code"
                  ></el-option>
                </el-select>
                <el-cascader
                  v-else-if="item.type === 'Cascader'"
                  ref="cascaderRef"
                  :key="item.key"
                  v-model="useData.initData[item.key]"
                  :class="item.class"
                  :options="item.options"
                  :append-to-body="item.appendbody"
                  :filterable="item.filterable"
                  :props="dealProp(item)"
                  collapse-tags
                  :clearable="item.clearable"
                  popper-class="popper"
                  @change="onCascader(useData.initData[item.key], item, useData.initData)"
                >
                </el-cascader>
                <el-radio-group
                  v-else-if="item.type === 'Radio'"
                  v-model="useData.initData[item.key]"
                >
                  <el-radio v-for="(i, indexs) in item.options || []" :key="indexs" :label="i.code"
                    >{{ i.name }}
                  </el-radio>
                </el-radio-group>
                <el-switch
                  v-else-if="item.type === 'Switch'"
                  v-model="useData.initData[item.key]"
                  active-value="1"
                  inactive-value="0"
                >
                </el-switch>
                <el-input
                  v-else-if="item.type === 'Input'"
                  v-model="useData.initData[item.key]"
                  :placeholder="item.placeholder"
                  :disabled="item.show"
                  :readonly="item.readonly"
                  :show-password="item.password"
                  autocomplete="new-password"
                  :onfocus="item.onfocus"
                  :maxlength="item.maxlength"
                  @input="changeInput(item, useData.initData[item.key])"
                  @click.native="clickInput(item)"
                >
                </el-input>
                <el-input-number
                  v-else-if="item.type === 'InputNumber'"
                  v-model="useData.initData[item.key]"
                  :min="0"
                  :precision="2"
                >
                </el-input-number>
                <el-select
                  v-else-if="item.type === 'childrenSelect'"
                  ref="selects"
                  v-model="useData.initData[item.key]"
                  clearable
                  size="mini"
                >
                  <el-input
                    v-model="treeFilter"
                    size="mini"
                    :prefix-icon="item.icon"
                    placeholder="此处键入'关键词'搜索查询"
                    clearable
                    class="select-tree"
                  >
                  </el-input>
                  <el-option
                    key="id"
                    :value="useData.initData[item.key]"
                    :label="selectName"
                    hidden
                  >
                  </el-option>
                  <el-tree
                    ref="treeRef"
                    :data="item.options"
                    :props="item.defaultProps"
                    :expand-on-click-node="true"
                    :check-on-click-node="false"
                    node-key="id"
                    :default-expand-all="true"
                    :filter-node-method="filterNode"
                    @node-click="handleNodeClick"
                  >
                  </el-tree>
                </el-select>
                <newPageSelect
                  v-else-if="item.type === 'newPageSelect'"
                  ref="newPageSelect"
                  :select-val="useData.initData[item.key]"
                  :get-page-info="item.getPageInfo"
                  :data-list="item.options"
                  :disabled="item.disabled"
                  :loading="item.loading"
                  :filterable="item.filterable"
                  :remote="item.remote"
                  :clearable="item.clearable"
                  :multiple="item.multiple"
                  :collapse-tags="item.multiple"
                  :reserve-keyword="item.reserveKeyword"
                  :remote-method="val => getRemoteMethod(val, item)"
                  :show-pagination="isShowPagination(item.showPagination)"
                  @onBlurValue="() => blurValue(useData.initData, item)"
                  @selectPageChange="
                    (val, ref) => selectPageChange(val, useData.initData, item, ref)
                  "
                  @handleCurrentChangeOrg="val => handleCurrentChangeOrg(val, item)"
                  @getRemoteMethod="val => getRemoteMethod(val, item, useData.initData)"
                  @change="onTrigger(useData.initData, item)"
                  @visible-change="val => onVisibleTrigger(useData.initData, item, val)"
                  @handlClear="onClear(useData.initData, item)"
                ></newPageSelect>
                <div v-else-if="item.type === 'Reminder'" class="Reminder">{{ item.key }}</div>
                <div v-show="item.notes" class="Reminder">{{ item.notes }}</div>
              </el-form-item>
            </template>
            <slot v-else :name="item.slotName" :data="useData.initData" :rowItem="item"></slot>
          </el-col>
          <el-col v-if="btnPositionInner(rowItem)" :class="positionRightClass" :span="6">
            <div :class="positionMl20">
              <el-button
                v-for="(btnItem, btnIndex) in renderButtons"
                :key="btnIndex"
                v-btnShow="btnItem.btnShow"
                :type="btnItem.btnType"
                @click="trigger(btnItem.onClick)"
                >{{ btnItem.label }}</el-button
              >
              <slot name="otherBtn" />
            </div>
          </el-col>
        </el-row>
      </div>
      <el-row v-if="btnPositionBottom" class="form-border-bottom">
        <el-col :span="24" class="fold-box">
          <span>
            <el-button
              v-for="(btnItem, btnIndex) in renderButtons"
              :key="btnIndex"
              v-btnShow="btnItem.btnShow"
              :type="btnItem.btnType"
              @click="trigger(btnItem.onClick)"
              >{{ btnItem.label }}</el-button
            >
            <slot name="otherBtn" />
          </span>
          <span v-if="useData.isFoldRow" class="fold" @click="changeFolding(useData.Folding)">
            {{ useData.Folding ? '展开' : '收起'
            }}<i :class="['el-icon-arrow-up', useData.Folding ? 'homing' : 'spin']"></i>
          </span>
        </el-col>
      </el-row>
    </el-form>
    <div v-if="useData.showButt" class="butt-border">
      <div
        v-for="(item, index) in useData.butData"
        :key="index"
        :class="item.type !== 'admonish' ? 'butDataR' : 'butDataL'"
      >
        <el-button
          v-if="item.type !== 'admonish'"
          v-btnShow="item.btnShow"
          :type="item.type"
          @click="handle(item.onClick, item)"
        >
          {{ item.label }}
        </el-button>
        <div v-else>{{ item.label }}</div>
      </div>
    </div>
  </div>
</template>

<script>
// label --- 名称
// key   --- 双向绑定
// type  --- 类型 DatePicker 时间  Select 下拉 Cascader 级联 Input 输入框
// rowId --- 第几行
// options --- 数据
// multiple --- 是否多选
// filterable --- 是否可以输入
// clearable --- 是否可以清除
// allRow -- form-item是否占一整行
// remote -- select是否使用远程搜索
// reserveKeyword -- select是否是否保留搜索关键词
// optionsHasSelectAll -- select是否有全选项
// checked -- select有全选功能时 对应的是否全选标识
// filterMethod -- select是否使用自定义搜索，select有全选时建议使用
import cloneDeep from 'lodash/cloneDeep'
import { dateConfig } from '@utils/util'
import newPageSelect from '@components/NewPageSelect'
export default {
  name: 'Wwwww',
  components: {
    newPageSelect
  },
  props: {
    formData: {
      type: Object,
      default: () => {}
    },
    labelWidth: {
      type: Number,
      default: 80
    },
    setOptions: {
      type: Object,
      default: () => {},
      deep: true
    }
  },
  data() {
    return {
      form: {},
      CachedData: {},
      renderColNum: 0,
      renderControl: [],
      defaultControl: [], // 默认值，展开收起用默认值来判断查询按钮位置
      renderButtons: [],
      useData: {},
      selectName: '',
      treeFilter: '',
      show: true,
      list: [],
      input: null,
      optionsCopy: {},
      modelData: [],
      modelList: []
    }
  },
  // 目前系统默认一行放置4个筛选条件
  computed: {
    // 如果搜索条件与按钮在一行，给外层加下border
    hasBottomLine() {
      return this.defaultControl.length <= this.useData.maxCol - 1 ? 'form-border-radius' : ''
    },
    // 如果搜索条件是3个，按钮置于右侧
    positionRightClass() {
      return this.defaultControl.length === this.useData.maxCol - 1 ? 'text-right' : ''
    },
    // 如果搜索条件小于3个，按钮在条件右侧20px处
    positionMl20() {
      return this.defaultControl.length < this.useData.maxCol - 1 ? 'ml-20' : ''
    },
    // 按钮在下方
    btnPositionBottom() {
      return this.defaultControl.length > this.useData.maxCol - 1
    }
  },
  watch: {
    setOptions: {
      handler(nv) {
        this.setDataOptions(nv)
      },
      deep: true
    },
    treeFilter(val) {
      this.$refs.treeRef[0].filter(val)
    },
    'useData.initData': {
      handler(val) {
        if (!val.parentId && !val.curveId) {
          this.selectName = ''
        }
      },
      deep: true
    }
  },
  created() {
    this.init()
    this.setOptions && this.setDataOptions(this.setOptions)
    this.initOptions()
  },
  methods: {
    onCascader(model, item, initData) {
      let modelAll = JSON.parse(JSON.stringify(model))
      let filtraArr = null
      // 1、树结构扁平化处理数组放到vuex
      this.$store.commit('cascaderData', this.treeArr(item.options))
      // 2、记录点击选中与上一次得数据
      if (this.modelData.length === 0) {
        this.modelData = [...model]
      } else {
        this.modelList = [...this.modelData]
        this.modelData = [...model]
      }
      // 3、过滤出当前选中得数据（判断选中数据大于等2是且记录数据不为0，并且选中数据大于记录数据）
      if (this.modelData.length >= 2 && this.modelList.length !== 0) {
        if (this.modelData.length > this.modelList.length) {
          filtraArr = this.filtrationArr(this.modelData, this.modelList)
        }
      }
      // 4、根据选中得值跟 扁平化数据对比
      if (filtraArr !== undefined && filtraArr !== null) {
        let arr = filtraArr[0] // 选中当前code
        let flatData = this.$store.state.user.cascaderData // 扁平数据
        let currentValue = arr[arr.length - 1]
        let currentNode = flatData.filter(item => item.code === currentValue)[0]
        let parent = flatData.filter(item => item.code === currentNode.parentCode)[0]
        let count = 1
        const deleteCodes = []
        if (parent !== undefined) {
          const { code, parentCode } = parent
          deleteCodes.push(code)
          // 往上寻找
          while (parent.level !== '1' && count < 10) {
            parent = flatData.filter(item => item.code === parentCode)[0]
            deleteCodes.push(parent.code)
            count++
          }
        }
        // 往下寻找
        let childrenNodes = flatData.filter(item => item.parentCode === currentValue)
        let childrenCodes = []
        childrenNodes.forEach(item => {
          childrenCodes.push(item.code)
        })
        while (childrenCodes.length > 0) {
          const code = childrenCodes.shift()
          deleteCodes.push(code)
          const children = flatData.filter(item => item.parentCode === code)
          if (children.length > 0) {
            children.forEach(item => {
              childrenCodes.push(item.code)
            })
          }
        }
        //
        const modelArr = []
        modelAll.forEach(item => {
          let deleteModelCode = item[item.length - 1]
          let deleteState = deleteCodes.indexOf(deleteModelCode)
          if (deleteState === -1) {
            modelArr.push(item)
          }
        })
        // 拿到当前值，进行修改
        let index = this.returnCurrentPicker(this.$refs.cascaderRef, item.key)
        this.$nextTick(() => {
          this.$refs.cascaderRef[index].checkedValue = [...modelArr]
        })
      }
    },
    // 过滤出当前点击得code
    filtrationArr(arr, arr1) {
      const tempArr = []
      arr.forEach(item => {
        const itemStr = item.toString()
        let flag = false
        arr1.forEach(item1 => {
          const itemStr1 = item1.toString()
          if (itemStr === itemStr1) {
            flag = true
          }
        })
        if (!flag) {
          tempArr.push(item)
        }
      })
      return tempArr
    },
    // 数据将属性结构扁平化
    treeArr(data, parentCode, res = []) {
      data.forEach(item => {
        const { code, name, level, childrenList } = item
        res.push({
          code: code,
          parentCode: parentCode,
          name: name,
          level: level
        })
        if (childrenList && childrenList.length) {
          this.treeArr(childrenList, code, res)
        }
      })
      return res
    },
    setDataOptions(data) {
      let keyAry = Object.keys(data)
      keyAry.forEach(i => {
        if (this.renderControl.length > 0) {
          const index = this.renderControl.findIndex(item => item.key === i)
          if (index !== -1) {
            this.$set(this.renderControl[index], 'options', data[i])
          }
        }
      })
    },
    initOptions() {
      let opt = this.formData.renderFrom.filter(i => i.type !== 'Buttons')
      opt.map(i => {
        this.optionsCopy[i.key] = i.options || []
      })
    },
    init() {
      this.renderControl = this.formData.renderFrom.filter(i => i.type !== 'Buttons')
      this.defaultControl = this.renderControl
      // 初始化的时候(页面切换或者tab切换时)，把有全选功能的select checked重置为false
      this.renderControl = this.renderControl.map(item => {
        if (item.optionsHasSelectAll) {
          item.checked = false
        }
        return item
      })
      this.renderButtons = this.formData.renderFrom.find(i => i.type === 'Buttons').children
      this.useData = cloneDeep(this.formData)
      this.list = this.renderControl.map(item => {
        return item
      })
    },
    // 折叠成一行
    changeFolding(status) {
      if (status) {
        const { renderFrom, maxRow, maxCol } = this.formData
        this.$set(this, 'renderControl', renderFrom)
        this.$set(this.useData, 'renderFrom', this.renderControl)
        this.$set(this.useData, 'maxRow', maxRow)
        this.$set(this.useData, 'maxCol', maxCol)
      } else {
        const newRenderFrom = this.renderControl.filter(i => i.rowId === 1)
        this.$set(this, 'renderControl', newRenderFrom)
      }
      this.$set(this.useData, 'Folding', !status)
    },
    trigger(fn) {
      const { initData } = this.useData
      let returnData = {}
      if (this.useData.Folding) {
        //  去掉折叠数据
        for (const key in this.useData.initData) {
          if (this.renderControl.map(i => i.key).includes(key)) {
            returnData[key] = initData[key]
          }
        }
      } else {
        returnData = initData
      }
      fn(returnData, this.useData, this)
    },
    onVisibleTrigger(data, item, val) {
      // 下拉隐藏的时候，处理下拉数据初始化
      let { type, remote, key, options, multiple } = item
      if (val && type === 'Select' && !remote && multiple && this.optionsCopy[key]) {
        // trigger方法 select 有输入值的时候，以及不是远程搜索，以及是多选
        let length = options.length
        const hasOptions = !options || length < 1
        const optionsQuiteCopyOptions = !hasOptions && length !== this.optionsCopy[key].length
        if (optionsQuiteCopyOptions || hasOptions) {
          let opt = this.optionsCopy[key].length > 0 ? this.optionsCopy : this.setOptions
          let setOpt = {
            ...opt,
            [key]: opt[key]
          }
          this.setDataOptions(setOpt)
        }
      }
      this.$emit('selectVisible', data, item, val)
    },
    onTrigger(data, item, val) {
      // change方法判断 select 全选状态
      const { type, optionsHasSelectAll, key, options } = item
      if (type === 'Select' && optionsHasSelectAll) {
        let length = options.length
        if (
          (data[key] && data[key].length) === (options && length) &&
          data[key].length !== 0 &&
          length !== 0
        ) {
          item.checked = true
        } else {
          item.checked = false
        }
      }
      // 日期组件加了非交易日校验，需要在change的时候再赋值
      if (type === 'DatePicker') {
        data[key] = val
      }
      if (data.type === 1) {
        let arr = ['path', 'sort']
        this.renderControl = this.renderControl.filter(item => {
          return !arr.includes(item.key)
        })
      } else {
        this.renderControl = this.list
      }
      this.$emit('trigger', data, item)
    },
    handle(fn, val) {
      fn(val, this)
    },
    // 动态添加表单prop属性
    setProp(key) {
      const { rules } = this.useData
      if (rules) {
        let propsName = Object.keys(this.useData.rules)
        if (propsName.length > 0 && propsName.includes(key)) {
          return key
        } else {
          return ''
        }
      }
    },
    // select远程搜索方法
    getRemoteMethod(val, item, initData) {
      this.$emit('getRemoteMethod', val, item, initData)
    },
    // col span 计算
    searchSapn(item) {
      const { allRow, span } = item
      return allRow ? 24 : span || 24 / this.useData.maxCol
    },
    showSelectAll(item) {
      const { options, optionsHasSelectAll } = item
      return options && options.length && optionsHasSelectAll
    },
    // select 全选 或 取消全选
    selectAll(initData, item) {
      let selectedArr = []
      const { key, options, checked } = item
      if (checked) {
        options.map(i => {
          selectedArr.push(i.code)
        })
      } else {
        selectedArr = []
      }
      initData[key] = selectedArr
    },
    returnClass(item) {
      return item.type === 'Reminder' ? 'formItemS' : 'formItem'
    },
    // 处理renderControl
    filterRenderControl(arr, item) {
      return arr.filter(i => i.rowId === item)
    },
    dealProp(item) {
      return {
        emitPath: true,
        checkStrictly: true,
        multiple: item.multiple,
        expandTrigger: 'hover',
        value: 'code',
        label: 'name',
        children: 'childrenList'
      }
    },
    // 下拉多选+可搜索+全选时，自定义搜索方法
    getFilterMethod(val, item) {
      let { key } = item
      let arr = this.optionsCopy[key].length > 0 ? this.optionsCopy : this.setOptions
      let setOpt = {}
      if (val) {
        let opt = arr[key].filter(i => i.name.includes(val))
        setOpt = {
          ...this.optionsCopy,
          [key]: opt
        }
      } else {
        setOpt = { ...arr }
      }
      this.setDataOptions(setOpt)
      this.$emit('getFilterMethod', val, item)
    },
    // 查询按钮在行内
    btnPositionInner(rowItem) {
      return (
        this.defaultControl.length <= this.useData.maxCol - 1 && this.useData.maxRow === rowItem
      )
    },
    changeInput(item, val) {
      if (item.key === 'password') {
        this.$emit('change', val)
      }
    },
    // 模糊查询（搜索过滤），实质为筛选出树形控件中符合输入条件的选项，过滤掉其他选项
    filterNode(value, data) {
      if (!value) return true
      let filterRes
      const { label, name } = data
      if (label) {
        filterRes = label.indexOf(value) !== -1
      } else {
        filterRes = name.indexOf(value) !== -1
      }
      return filterRes
    },
    // 结构树点击事件
    handleNodeClick(data) {
      const { childrenList, parentId, id, code, label, name } = data
      if (childrenList) return
      if (parentId) {
        this.useData.initData.parentId = id // select绑定值为点击的选项的value
      } else {
        this.useData.initData.curveId = code // select绑定值为点击的选项的value
      }
      this.selectName = name || label // input中显示值为label
      this.treeFilter = '' // 点击后搜索框清空
      this.$refs.selects[0].blur() // 点击后关闭下拉框，因为点击树形控件后select不会自动折叠
    },
    clickInput(val) {
      if (val.key === 'role') {
        this.$emit('clickInput')
      }
    },
    onClear(initData, item) {
      this.$emit('handleClear', initData, item)
    },
    // 以下为日期校验方法 - 非交易日跳最近的交易日
    onDatePickerInput(val) {
      // 日期组件input事件，获取输入的内容
      this.input = val.target.value
    },
    // 日期组件keydown - Enter 处理
    handleKeydown(event, data, item) {
      const { keyCode } = event
      const { key } = item
      const index = this.returnCurrentPicker(this.$refs.datePicker, key)
      const datePicker = this.$refs.datePicker[index]
      if (keyCode === 13) {
        this.$nextTick(() => {
          this.onDatePickerInput(event)
          this.onDatePickerBlur(datePicker, data, item)
          if (item.options) {
            datePicker.pickerVisible = datePicker.picker.visible = false
          } else {
            datePicker.pickerVisible = false
          }
          datePicker.blur()
        })
        event.stopPropagation()
        return false
      }
    },
    returnCurrentPicker(refs, key) {
      let index = null
      refs.map((item, idx) => {
        if (item.$vnode.key === key) {
          index = idx
        }
      })
      return index
    },
    onDatePickerBlur(val, data, item) {
      // 日期组件blur事件，获取输入的内容
      // val为日期组件实例
      // input 是否有值
      if (this.input === null || this.input === '' || this.input === undefined) return false
      // 值是否是日期格式
      let regDateTypeOne = new RegExp(/^(\d{4})-(\d{2}|\d{1})-(\d{2}|\d{1})$/) // 日期带横杠的正则
      let regDateTypeTwo = new RegExp(/^(\d{4})(\d{2}|\d{1})(\d{2}|\d{1})$/) // 日期不带横杠的正则
      const { key, options } = item
      if (regDateTypeOne.test(this.input) || regDateTypeTwo.test(this.input)) {
        // 拿实例里的校验方法，验证传入的日期是否为交易日
        // common为普通日期选择，没有这个字段或者为false，是有交易日限制的日期组件
        const { isValidValue, parseString } = val
        const result =
          options === undefined
            ? this.input
            : this.handleSearchNearDate(isValidValue, parseString, this.input)
        // Suppress the warnings
        const triggerValue = regDateTypeOne.test(result)
          ? this.$moment(result).format('YYYYMMDD')
          : result
        this.onTrigger(data, item, triggerValue)
        this.$refs.myForm.validateField(key)
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
    },
    // 失去焦点事件
    blurValue(data, item) {
      this.$emit('blurValue', data, item)
    },
    // 分页事件
    handleCurrentChangeOrg(val, item) {
      this.$emit('handleCurrentChangeOrg', val, item)
    },
    selectPageChange(val, data, item, ref) {
      const { key } = item
      data[key] = val
      this.$emit('selectPageChange', val, data, item, ref)
    },
    isShowPagination(type) {
      if (type === undefined || type === null || type === true) {
        return true
      } else {
        return false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.form-border-top {
  padding: 12px 8px 2px;
  margin: 0 10px;
  border: 1px solid #e6e9eb;
  border-bottom: none;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}

.form-border-radius {
  border-bottom: 1px solid #e6e9eb;
  border-bottom-right-radius: 4px;
  border-bottom-left-radius: 4px;
}

.form-border-bottom {
  padding: 6px 0;
  margin: 0 10px;
  border: 1px solid #e6e9eb;
  border-bottom-right-radius: 4px;
  border-bottom-left-radius: 4px;
}

.el-button {
  height: 34px;
  font-size: 14px;
  line-height: 0;
}

.butt-border {
  height: 36px;
  margin: 8px 10px;
}

.Reminder {
  padding-left: 10px;
  font-size: 10px;
  line-height: 20px;
  color: #409eff;
}

.el-form-item {
  margin-bottom: 12px;
  ::v-deep.el-form-item__error {
    padding-top: 0 !important;
  }
}

.select-tree {
  ::v-deep .el-input__suffix {
    display: inline-block;
    width: 30px;
  }
}

.text-right {
  margin-top: 3px;
  text-align: right;
}

.ml-20 {
  margin-top: 3px;
  margin-left: 20px;
}

.formItem {
  margin-left: 5px;

  .el-cascader,
  .el-input,
  .el-date-editor,
  .el-select {
    width: 100%;
  }

  .el-cascader {
    ::v-deep .el-input {
      .el-input__inner {
        height: 36px !important;
      }
    }
  }
}

.search-action {
  text-align: right;
}

.fold-box {
  text-align: center;

  .fold {
    display: inline-block;
    margin-left: 10px;
    font-size: 12px;
    color: #409eff;
    cursor: pointer;
    transition: 1s;

    .spin {
      transition: 0.5s;
      transform: rotate(0deg);
    }

    .homing {
      transition: 0.5s;
      transform: rotate(180deg);
    }
  }
}

.butDataL {
  // display: inline-block;
  float: left;
  padding-left: 10px;

  div {
    height: 36px;
    line-height: 36px;
    color: red;
  }
}

.butDataR {
  float: right;
  padding-left: 10px;

  div {
    height: 36px;
    line-height: 36px;
    color: red;
  }
}

::v-deep .el-input-number__decrease {
  display: none !important;
}
::v-deep .el-input-number__increase {
  display: none !important;
}
::v-deep .el-input-number {
  width: 305px !important;
}

::v-deep .el-form-item {
  margin-left: 5px !important;

  .el-select {
    width: 100% !important;
  }
  .detectZoom150 {
    position: relative;
    .el-select-dropdown {
      left: 1255px !important;
    }
    .el-cascader__dropdown {
      left: 1255px !important;
    }
  }
  .detectZoom300 {
    position: relative;
    .el-select-dropdown {
      left: 1220px !important;
    }
    .el-cascader__dropdown {
      left: 1220px !important;
    }
  }
}
</style>
<style>
.formItemS .el-form-item__content {
  margin-left: 0 !important;
}

.popper .el-cascader-panel .el-radio {
  position: absolute;
  top: 0;
  left: 10px;
  z-index: 20;
  width: 100%;
  height: 100%;
}
.popper .el-cascader-panel .el-checkbox {
  position: absolute;
  top: 0;
  left: 10px;
  z-index: 20;
  width: 100%;
  height: 100%;
}

.popper .el-cascader-panel .el-cascader-node__label {
  margin-left: 10px;
}
.popper .el-cascader-panel .el-radio__input {
  margin-top: 10px;
  margin-left: 8px;
}
.popper .el-cascader-panel .el-checkbox__input {
  margin-top: 2px;
  margin-left: 8px;
}
.popper .el-cascader-panel .el-cascader-node__postfix {
  top: 10px;
}
</style>
