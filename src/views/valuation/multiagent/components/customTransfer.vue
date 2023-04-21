<template>
  <!-- 需求个性化 需自定义穿梭框 -->
  <div class="transfer-contanier">
    <div class="el-transfer">
      <!-- 左列表 -->
      <div class="el-transfer-panel">
        <div class="el-transfer-panel__header">
          <label class="el-checkbox">
            <span>查询结果</span>
            <span class="text-r">{{ selectedLeft.length }}/{{ total }}</span>
          </label>
        </div>
        <!-- 左侧穿梭框搜索 -->
        <div class="el-transfer-panel__filter el-input el-input--small el-input--prefix">
          <el-input v-model="serarch" @input="searchInput"></el-input>
          <span class="el-input__prefix"><i class="el-input__icon el-icon-search"></i></span>
        </div>
        <div class="el-transfer-panel__body pb25">
          <BaseTable
            ref="leftTable"
            :columns="columns"
            :page-size="1"
            :data-source="dataListLeft"
            :height="300"
            :loading="listLoading"
            @rowSelect="rowSelect"
            @selectAll="selectAll"
          ></BaseTable>
        </div>
        <p class="el-transfer-panel__footer text-align-r">
          <el-pagination
            :current-page.sync="pageLeft.currentPage"
            :page-size="pageLeft.pageSize"
            layout="prev, pager, next, jumper"
            :total="pageLeft.total"
            :pager-count="5"
            @current-change="handleCurrentChange" />
        </p>
      </div>
      <!-- 方向箭头 -->
      <div class="el-transfer__buttons">
        <button class="el-button  el-transfer__button"
          :class="disabledTransferBtn(selectedRight)"
          :disabled="selectedRight.length <= 0" @click="leftTransfer">
          <span><i class="el-icon-arrow-left"></i></span>
        </button>
        <button class="el-button  el-transfer__button"
          :class="disabledTransferBtn(selectedLeft)"
          :disabled="selectedLeft.length <= 0 " @click="rightTransfer">
          <span><i class="el-icon-arrow-right"></i></span>
        </button>
      </div>
      <!-- 右列表 -->
      <div class="el-transfer-panel">
        <div class="el-transfer-panel__header">
          <label class="el-checkbox">
            <span>选中结果</span>
            <span class="text-r">{{ selectedRight.length }}/{{ dataListRight.length }}</span>
          </label>
        </div>
        <!-- 右侧穿梭框搜索 -->
        <div class="el-transfer-panel__filter el-input el-input--small el-input--prefix">
          <el-input v-model="serarchRight" @input="searchInputRight"></el-input>
          <span class="el-input__prefix"><i class="el-input__icon el-icon-search"></i></span>
        </div>
        <div class="el-transfer-panel__body">
          <BaseTable
            ref="rightTable"
            :columns="columns"
            :page-size="1"
            :data-source="dataListRight"
            :height="300"
            :loading="false"
            @rowSelect="rowSelectRight"
            @selectAll="selectAllRight"
          ></BaseTable>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BaseTable from '@components/BaseTable';
export default {
  components: {
    BaseTable
  },
  props: {
    transferData: {
      type: Array,
      default: () => []
    },
    selectedData: {
      type: Array,
      default: () => []
    },
    total: {
      type: Number,
      default: 0
    },
    transferType: {
      type: String,
      default: '主体名称'
    }
  },
  data () {
    return {
      dataListLeft: [], // 左侧数据
      defaultDataListLeft: [], // 左侧数据初始值
      dataListRight: [], // 右侧数据
      columns: [ // 暂时写死
        {
          type: 'selection',
          align: 'center'
        },
        {
          label: this.transferType,
          prop: "name",
          align: 'left'
        }
      ],
      pageLeft: {
        currentPage: 1,
        pageSize: 100,
        total: 0
      },
      selectedLeft: [], // 左侧已选择项
      selectedRight: [],// 右侧已选择项
      codeArrLeft: [], // 左侧已选择项code数据
      codeArrRight: [],  // 右侧已选择项code数据
      serarch: '', // 搜索条件
      serarchRight: '',
      defaultDataListRight: [], // 右侧数据初始值
      listLoading: false
    };
  },
  watch: {
    // 父组件传入的左侧数据
    transferData: {
      handler (nv) {
        this.dataListLeft = nv;
        this.defaultDataListLeft = nv;
        this.selectedLeft = []
        this.codeArrLeft = []
      },
      immediate: true
    },
    // 父组件传入的右侧数据
    selectedData: {
      handler (nv) {
        this.dataListRight = nv;
      },
      immediate: true
    },
    total: {
      handler (nv) {
        this.pageLeft.total = nv
      },
      immediate: true
    }
  },
  methods: {
    // 左侧搜索框搜索结果
    searchInput (val) {
      this.$emit('searchInputLeft', val)
    },
    // 右侧侧搜索框搜索结果
    searchInputRight (val) {
      if (val !== '') {
        this.dataListRight = this.defaultDataListRight.filter(item => item.name.includes(val))
      } else {
        this.dataListRight = this.defaultDataListRight
      }
      this.toggleSelectionRight()
    },
    // 搜索时，input数据变化时，给已选中项标记已选
    toggleSelectionRight () {
      this.$nextTick(() => {
        this.selectedRight.forEach(row => {
          this.$refs.rightTable.$refs.commonTable.toggleRowSelection(
            this.defaultDataListRight.find(item => { return row.code === item.code;}
          ), true);
        });
      })
    },
    disabledTransferBtn (list) {
      return list.length > 0 ? 'el-button--primary' : 'el-button--primary is-disabled';
    },
    // 左侧穿梭按钮
    leftTransfer () {
      this.dataListRight = this.dataListRight.filter(item => !this.codeArrRight.includes(item.code));

      if (this.dataListLeft.length > 0) {
        this.dataListLeft.map(item => {
          this.selectedRight.map((i, index) => {
            if (i.code === item.code) {
              this.selectedRight.splice(index, 1);
            }
          });
        });
      }

      this.dataListLeft = this.dataListLeft.concat(this.selectedRight);
      this.defaultDataListLeft = this.defaultDataListLeft.concat(this.selectedRight)

      this.selectedRight = []
      this.codeArrRight = []
    },
    // 右侧穿梭框按钮
    rightTransfer () {
      if (this.dataListRight.length > 0) {
        this.dataListRight.map(item => {
          this.selectedLeft.map((i, index) => {
            if (i.code === item.code) {
              this.selectedLeft.splice(index, 1);
            }
          });
        });
      }
      
      this.dataListRight = this.dataListRight.concat(this.selectedLeft);
      this.defaultDataListRight = [...this.dataListRight]
      this.$refs.leftTable.$refs.commonTable.clearSelection()
      // 初始化已选项
      this.selectedLeft = [];
      this.codeArrLeft = [];
    },
    // 选中table某一项方法
    rowSelect (data, row) {
      const { code } = row
      if (!this.codeArrLeft.includes(code)) this.codeArrLeft.push(code);
      this.selectedLeft = data.filter(item => item !== undefined);
    },
    // table全选
    selectAll (data) {
      data.map(item => {
        const { code } = item
        if (!this.codeArrLeft.includes(code)) this.codeArrLeft.push(code)
      })
      this.selectedLeft = data
    },
    rowSelectRight (data, row) {
      this.selectedRight = data
      this.codeArrRight = []
      this.selectedRight.map(item => { this.codeArrRight.push(item.code) })
    },
    selectAllRight (data) {
      data.map(item => {
        const { code } = item
        if (!this.codeArrRight.includes(code)) this.codeArrRight.push(code)
      })
      this.selectedRight = data
    },
    handleCurrentChange (val) {
      this.pageLeft.currentPage = val
      this.$emit('handleCurrentChange', val)
    }
  }
};
</script>

<style lang="scss" scoped>
.transfer-contanier{
  // margin-top: 40px;
  text-align: center;
}
.el-transfer-panel {
  position: relative;
  box-sizing: border-box;
  display: inline-block;
  width: 40%;
  height: 100%;
  overflow: hidden;
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

  .el-transfer-panel__body {
    height: 100% !important;
  }
}
.el-transfer-panel__filter {
  margin: 10px 15px 0;
  .el-input__icon {
    margin-left: 2px;
  }
}
.el-input--small .el-input__icon {
  line-height: 35px;
}
.text-r{
  float: right;
  margin-right: 10px;
}
.text-align-r {
  text-align: right;
}
</style>
