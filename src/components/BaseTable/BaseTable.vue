<template>
  <div
    ref="tableWapper"
    class="base-table"
    :class="{ pd20: !showLayout && showSummary }"
    :style="{ height: lazyLoadData ? `${parseInt(finalHeight)}px` : 'auto' }"
  >
    <div
      class="table-wrap"
      :class="{ summary: !showSummary }"
      :style="{ height: lazyLoadData ? scrollHeight + 'px' : 'auto' }"
    >
      <el-table
        id="tableID"
        ref="commonTable"
        :key="tableKey ? tableKey : randomNum"
        v-loading="loading"
        border
        :row-key="rowKey"
        :default-expand-all="defaultExpandAll"
        :tree-props="treeProps"
        :class="{ borderStyle: borderStyle }"
        class="table"
        :height="finalHeight"
        :stripe="!stripe"
        :data="lazyLoadData ? scrollData : dataSource"
        :row-style="rowStyle"
        :cell-style="cellStyle"
        :show-summary="showSummary"
        :summary-method="summaryMethod"
        :cell-class-name="cellClassName"
        :row-class-name="rowClassName"
        :header-row-class-name="headerRowClassName"
        :header-cell-style="headerCellStyle"
        v-bind="$attrs"
        v-on="$listeners"
        @sort-change="sortChange"
        @selection-change="selectionChange"
        @select="rowSelect"
        @select-all="selectAll"
      >
        <TableColumn
          v-for="(item, index) in columns"
          :key="'table' + index"
          :col="item"
          :render-header="item.lineFeed === true ? lineFeedHandle(item) : renderHeader(item)"
          :formatter="item.format || item.format === '' ? formatNumber(item) : item.formatter"
          :sortable="item.sortable ? item.sortable : false"
          :width="item.width"
        >
        </TableColumn>

        <InfiniteLoading
          v-if="lazyload"
          slot="append"
          :distance="50"
          force-use-infinite-wrapper=".el-table__body-wrapper"
          @infinite="infiniteHandler"
        >
          <div slot="spinner">
            <i class="el-icon-loading"></i>
            <span>正在加载。。。 </span>
          </div>
          <div slot="no-more"></div>
        </InfiniteLoading>
      </el-table>
      <el-pagination
        v-if="hasPagination"
        class="base-pagination"
        :total="total"
        :layout="showLayout"
        :page-size="getPageSize"
        :page-sizes="pageSizes.length === 0 ? computePageSizes : pageSizes"
        :current-page="currentPage"
        :pager-count="pagerCount"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        v-on="$listeners"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading'
import random from 'lodash/random'
import TableColumn from './TableColumn'
import { currencyFormatter } from '@utils/util'
import { tableRecursion } from '@utils/recursion'
export default {
  name: 'BaseTable',
  components: {
    TableColumn,
    InfiniteLoading
  },
  // mixins: [dragColumns],
  props: {
    pageSizes: {
      type: Array,
      default: () => []
    },
    renderHeader: {
      type: Function,
      default: () => ''
    },
    treeProps: {
      type: Object,
      default: () => {}
    },
    rowKey: {
      type: String,
      default: () => ''
    },
    defaultExpandAll: {
      type: Boolean
    },
    col: {
      type: Object,
      default: () => {}
    },
    dataSource: {
      type: Array,
      default: () => []
    },
    columns: {
      type: Array,
      default: () => [],
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    layout: {
      type: String,
      default: () => ''
    },
    defaultHeight: {
      type: Boolean,
      default: false
    },
    showPageSizes: {
      type: String,
      default: () => ''
    },
    showCurrentSize: {
      type: Boolean,
      default: false
    },
    height: {
      type: Number,
      default: () => 0
    },
    render: {
      type: Function,
      default: () => function() {}
    },
    stripe: {
      type: Boolean,
      default: false
    },
    borderStyle: {
      type: Boolean,
      default: false
    },
    currentPage: {
      type: Number,
      default: () => 1
    },
    pageSize: {
      type: Number,
      default: () => 0
    },
    pagerCount: {
      type: Number,
      default: 5
    },
    total: {
      type: Number,
      default: () => 20
    },
    hasPagination: {
      type: Boolean,
      default: false
    },
    cellClassName: {
      type: Function,
      default: () => function() {}
    },
    rowClassName: {
      type: Function,
      default() {
        return 'row'
      }
    },
    headerRowClassName: {
      type: Function,
      default() {
        return 'table_head'
      }
    },
    headerCellStyle: {
      type: Function,
      default: () => function() {}
    },
    summaryMethod: {
      type: Function,
      default: () => function() {}
    },
    showSummary: {
      type: Boolean,
      default: false
    },
    tableKey: {
      type: Number,
      default: () => 1
    },
    rowStyle: {
      type: Function,
      default() {
        return 'row'
      }
    },
    cellStyle: {
      type: Function,
      default: () => function() {}
    },
    lazyload: {
      type: Boolean,
      default: false
    },
    lazyLoadData: {
      type: Boolean,
      default: false
    },
    scrollLoadData: {
      type: Boolean,
      default: false
    },
    realLength: {
      type: Number,
      default: () => 0
    },
    notFixedSize: {
      type: Boolean,
      default: false
    },
    toggleSelectionList: {
      type: Array,
      default: () => []
    },
    relevance: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      params: {
        page: 1,
        limit: 20
      },
      randomNum: random(1, 1000000000000),
      // allSizes: '', // 是否添加全部标识
      // dataSizes: '', // 选择（？/页）值储存
      // pageData: 1, // 懒加载页码
      dataSelect: [], // 选中数据储存
      selectAllBoolean: false, // 是否全选
      scrollData: [],
      deltaCount: 0,
      viewRowCount: 16
    }
  },
  computed: {
    /**
     * 新变更需求 筛选条件有一行筛选条件和一行跳转按钮的时候 页面显示16条数据
     * 只有一行筛选条件页面默认展示18行
     */
    finalHeight: function() {
      let flag = this.columns.some(item => {
        return item.children
      })
      const realRows = this.dataSource.some(item => {
        return item.balanceVOS
      })
      let fh = 730
      if (this.defaultHeight) {
        fh = 'auto' // 如果 defaultHeight fh 返回 auto
      } else {
        if (this.height === 0) {
          // 3.24修改
          let rows = this.dataSource.length
          if (realRows) {
            rows = this.realLength - 2
          }
          let size = this.showCurrentSize ? 16 : 18
          if (this.notFixedSize) {
            rows = rows <= size ? rows : size
          } else {
            rows = size
          }
          if (this.showSummary) {
            if (flag === true) {
              fh = `${107 + rows * 34 + 41}px`
            } else {
              fh = `${52 + rows * 34 + 41}px`
            }
          } else {
            if (flag === true) {
              fh = `${93 + rows * 34}px`
            } else {
              fh = `${59 + rows * 34}px`
              // 估值核算 日终估值 40合适 没有横向滚动条
            }
          }
        } else if (this.height === 909090) {
          // 909090是 不自动计算高度（后端做合并行）
          return false
        } else {
          fh = `${this.height}px`
        }
      }
      this.doLayout()
      return fh
    },
    /**
     * 3.24 根据表格上面 条件所占行数 动态加载页码选择器
     */
    computePageSizes: function() {
      let sizes = []
      let size = 18
      // let total = Number(this.total);
      // if (total > 10) {
      //   sizes.push(10);
      // }
      size = this.showCurrentSize ? 16 : 18
      sizes = [size, 50, 100, 500, 5000]
      // if (total > size) {
      //   sizes.push(size);
      // }
      // if (total > 20) {
      //   sizes.push(20);
      // }
      // if (total > 30) {
      //   sizes.push(30);
      // }
      // if (total > 40) {
      //   sizes.push(40);
      // }
      // if (total > 50) {
      //   sizes.push(50);
      // }
      // if (sizes > 100) {
      //   sizes.push(100);
      // }
      return sizes
    },
    showLayout: function() {
      // 通过表头计算页面选择器 默认展示16/页还是18/页
      let defaultLayout = ['total', 'sizes', 'prev', 'pager', 'next', 'jumper']
      let layout = this.layout ? this.layout.split(',').map(item => item.trim()) : defaultLayout
      layout = layout.join(',')
      return layout
    },
    scrollHeight: function() {
      return this.dataSource.length !== 0 ? (this.realLength || this.dataSource.length) * 34 : 640
    },
    lastScrollTop: function() {
      return this.scrollHeight - (this.finalHeight && Number(this.finalHeight.slice(0, -2)))
    },
    getPageSize() {
      // 3.24通过表头计算页码选择器 默认展示16/页还是18/页
      // 3.26加入特殊表头页码展示数据 由传入的pagesize决定 解决页面内容过多出现双滚动条
      let size = 18
      if (this.pageSize > 0) {
        size = this.pageSize
      } else {
        size = this.showCurrentSize ? 16 : 18
      }
      return size
    }
  },
  watch: {
    dataSource: {
      handler: function() {
        if (this.lazyLoadData) {
          this.initLazyScroll()
        } else if (this.scrollLoadData) {
          this.initScroll()
        }
      },
      immediate: true
    }
  },
  mounted() {
    if (this.lazyLoadData) {
      this.registerScrollEvent('tableWapper')
    } else if (this.scrollLoadData) {
      this.registerScrollEvent('commonTable')
    }
  },
  beforeUpdate() {
    this.$nextTick(() => {
      this.$refs.commonTable && this.$refs.commonTable.doLayout()
    })
  },
  beforeDestroy() {
    if (this.lazyLoadData) {
      let tableDom = this.$refs.tableWapper
      tableDom.removeEventListener('mousewheel', this.handleMouseScroll)
      tableDom.removeEventListener('scroll', this.handleWapperScroll)
    } else if (this.scrollLoadData) {
      let tableDom = this.$refs.commonTable.bodyWrapper
      tableDom.removeEventListener('mousewheel', this.handleMouseScroll)
      tableDom.removeEventListener('scroll', this.handleWapperScroll2)
    }
  },
  methods: {
    toggleRowExpansion(row, expanded) {
      this.$refs.commonTable.toggleRowExpansion(row, expanded)
    },
    registerScrollEvent(ref) {
      let tableDom
      // 添加滚轮事件监听
      if (ref === 'tableWapper') {
        tableDom = this.$refs.tableWapper
        tableDom.addEventListener('mousewheel', this.handleMouseScroll, {
          passive: false
        })
      } else {
        tableDom = this.$refs.commonTable.bodyWrapper
        tableDom.addEventListener('mousewheel', this.handleMouseScroll, {
          passive: false
        })
      }
      // 添加滚动条事件监听
      if (ref === 'tableWapper') {
        tableDom.addEventListener('scroll', this.handleWapperScroll)
      } else {
        tableDom.addEventListener('scroll', this.handleWapperScroll2)
      }
    },
    handleMouseScroll(e) {
      e.preventDefault()
      let tableDom
      if (this.lazyLoadData) {
        tableDom = this.$refs.tableWapper
      } else {
        tableDom = this.$refs.commonTable.bodyWrapper
      }
      if (e.wheelDelta < 0) {
        if (this.deltaCount * 34 <= this.lastScrollTop + 34) {
          this.deltaCount++
          tableDom.scrollTop = this.deltaCount * 34
          if (this.deltaCount * 34 > tableDom.scrollTop) return false
        }
      } else {
        if (this.deltaCount > 0) {
          this.deltaCount--
          tableDom.scrollTop = this.deltaCount * 34
        }
      }
    },
    handleWapperScroll2(e) {
      let scrollTop = e.target.scrollTop
      this.deltaCount = Math.ceil(scrollTop / 34)
    },
    handleCurrentChange(val) {
      this.$emit('handleCurrent', val)
    },
    handleSizeChange(val) {
      this.$emit('handleSize', val)
    },
    rowClick(row, event, column) {
      this.$emit('rowClick', row, event, column)
    },
    rowdblClick(row, event) {
      this.$emit('rowdblClick', row, event)
    },
    cellMouseEnter({ row, column, cell, event }) {
      this.$emit('handleMouseEnter', row, column, cell, event)
    },
    cellMouseLeave({ row, column, cell, event }) {
      this.$emit('handleMouseLeave', row, column, cell, event)
    },
    selectionChange(selection) {
      this.$nextTick(item => {
        selection = this.dataSelect
        this.$emit('selectionChange', selection)
      })
    },
    toggleRowSelection(row, selected) {
      this.$refs.commonTable.toggleRowSelection(row, selected)
    },
    clearSelection() {
      this.$refs.commonTable.clearSelection()
    },
    sortChange(data) {
      this.$emit('sortChange', data)
    },
    rowSelect(selection, row) {
      this.selectAllBoolean = this.dataSelect.length === this.dataSource.length
      if (selection.some(el => row.id === el.id)) {
        // 如果当前选中的有父级
        if (row.parentId) {
          if (row.parentId !== -1) {
            let list = tableRecursion(this.dataSource)
            let parent = list.find(x => x.id === row.parentId)
            this.$refs.commonTable.toggleRowSelection(parent, true)
            selection.push(parent)
            if (parent.parentId !== -1) {
              let father = list.find(i => i.id === parent.parentId)
              selection.push(father)
              this.$refs.commonTable.toggleRowSelection(father, true)
              if (father.parentId !== -1) {
                let grandpa = list.find(index => index.id === father.parentId)
                selection.push(grandpa)
                this.$refs.commonTable.toggleRowSelection(grandpa, true)
              }
            }
          }
          // 如果选中的有子级
          if (row.children.length > 0) {
            row.children.map(item => {
              selection.push(item)
              this.$refs.commonTable.toggleRowSelection(item, true)
              if (item.children.length > 0) {
                item.children.map(i => {
                  selection.push(i)
                  this.$refs.commonTable.toggleRowSelection(i, true)
                  if (i.children.length > 0) {
                    i.children.map(x => {
                      selection.push(x)
                      this.$refs.commonTable.toggleRowSelection(x, true)
                      if (x.children.length > 0) {
                        x.children.map(z => {
                          selection.push(z)
                          this.$refs.commonTable.toggleRowSelection(z, true)
                        })
                      }
                    })
                  }
                })
              }
            })
          }
        }
      } else {
        if (row.children && row.children.length > 0) {
          row.children.map(i => {
            let index = selection.findIndex(s => s.id === i.id)
            selection.splice(index, 1)
            this.$refs.commonTable.toggleRowSelection(i, false)
            if (i.children.length > 0) {
              i.children.map(item => {
                let index = selection.findIndex(ss => ss.id === item.id)
                selection.splice(index, 1)
                this.$refs.commonTable.toggleRowSelection(item, false)
                if (item.children.length > 0) {
                  item.children.map(it => {
                    let index = selection.findIndex(sss => sss.id === it.id)
                    selection.splice(index, 1)
                    this.$refs.commonTable.toggleRowSelection(item, false)
                  })
                }
              })
            }
          })
        }
      }
      this.$emit('rowSelect', selection, row)
    },
    selectAll(selection) {
      if (!this.selectAllBoolean) {
        this.dataSelect = this.dataSource.map(item => item) // 不能做深拷贝，否则改变选中状态时不起作用；不能直接赋值，否则改变dataSelect时会影响dataSource
        this.toggleSelection(this.scrollData, true) // 需要手动设置全选。为了处理以下情况：点击全选 -> 取消某一项 -> 滚动至这一项不在可视区域 -> 点击全选，此时希望的结果是全选数据，但实际会出现没有数据显示选中，滚动后才显示全选，且表头复选框为半选中状态。使用scrollData更流畅一些
        this.selectAllBoolean = true
      } else {
        // 暂时没有遇到 滚动表格 全选问题的场景，目前下边注释的代码会阻断正常全选功能，先注释。
        // this.setTHeadCheckboxStatus(); // 为了处理以下情况：全选 -> 滚动表格 -> 取消全选，此时希望取消全选，实际会出现表头复选框为半选状态，滚动后才正常的情况
        this.selectAllBoolean = false
        // this.dataSelect = [];
      }
      // selection = this.dataSelect;

      if (this.relevance) {
        this.$refs.commonTable.data.map(item => {
          let { isChecked, children } = item
          if (!isChecked) {
            item.isChecked = 1
          }
          if (children) {
            if (item.isChecked === 1) {
              this.$refs.commonTable.toggleRowSelection(item, true)
              item.isChecked = 2
              children.map(i => {
                i.isChecked = 1
                if (i.children) {
                  this.$refs.commonTable.toggleRowSelection(i, true)
                  i.isChecked = 2
                  i.children.map(t => {
                    t.isChecked = 1
                    this.$refs.commonTable.toggleRowSelection(t, true)
                    t.isChecked = 2
                    if (t.children) {
                      t.children.map(p => {
                        p.isChecked = 1
                        this.$refs.commonTable.toggleRowSelection(p, true)
                        p.isChecked = 2
                      })
                    }
                  })
                }
              })
            } else {
              this.$refs.commonTable.toggleRowSelection(item, false)
              item.isChecked = 1
              children.map(i => {
                this.$refs.commonTable.toggleRowSelection(i, false)
                i.children.map(t => {
                  this.$refs.commonTable.toggleRowSelection(t, false)
                  if (t.children) {
                    t.children.map(p => {
                      this.$refs.commonTable.toggleRowSelection(p, false)
                    })
                  }
                })
              })
            }
          }
        })
      }
      this.$emit('selectAll', selection)
    },
    clearSort() {
      this.$refs.commonTable.clearSort()
    },
    doLayout() {
      setTimeout(() => {
        this.$refs.commonTable && this.$refs.commonTable.doLayout()
      }, 100)
    },
    infiniteHandler($state) {
      this.$emit('infinite', $state)
    },
    lineFeedHandle(col) {
      col.renderHeader = (h, { column, $index }) => {
        return h(
          'span',
          {
            style: {
              display: 'inline-block',
              'vertical-align': 'middle',
              'line-height': '18px'
            }
          },
          [
            h('span', {}, column.label.split('|')[0]),
            h(
              'span',
              {
                style: { display: 'block' }
              },
              column.label.split('|')[1]
            )
          ]
        )
      }
    },
    formatNumber(col) {
      col.render = (h, scope) => {
        col.format = col.format === '' ? '2' : col.format
        return <span>{`${currencyFormatter(scope.record[scope.prop], Number(col.format))}`}</span>
      }
    },
    /** 记录是否有跳转和筛选条件 默认false 显示18条数据
     * 表格头上有两行 (都是16条)
     *
     *特殊页面展示表格数据
     */
    computeRows: function() {
      let rows = this.dataSource.length
      rows = rows <= this.pageSize ? rows : this.pageSize
      return rows
    },
    toggleSelection(rows, selected) {
      if (rows.length > 0) {
        rows.forEach(row => {
          this.$refs.commonTable.toggleRowSelection(row)
        })
      }
    },
    handleWapperScroll(e) {
      const scrollTop = e.target.scrollTop
      if (scrollTop + 2 >= this.lastScrollTop) {
        e.target.getElementsByClassName('el-table')[0].scrollTop = this.realLength * 34
      } else {
        this.deltaCount = Math.ceil(scrollTop / 34)
      }
      this.viewRowCount = 16
      this.scrollData = this.dataSource.slice(this.deltaCount, this.deltaCount + this.viewRowCount)
      var tableTbody = e.target.getElementsByClassName('el-table')[0]
      tableTbody.style.transform = 'translateY(' + scrollTop + 'px)'
      // 如果表格有序号列时需要如下处理
      if (this.columns.some(item => item.type === 'index')) {
        this.columns.forEach(item => {
          if (item.type === 'index') {
            this.$set(item, 'index', idx => idx + this.deltaCount + 1)
          }
        })
      }

      // 如果表格有多选行操作时需要如下处理
      if (this.columns.some(item => item.type === 'selection')) {
        this.$nextTick(() => {
          this.selectAllBoolean = this.dataSelect.length === this.dataSource.length
          if (this.dataSelect.length) {
            // 处理数据选中状态
            let dataSelect = []
            if (this.selectAllBoolean) {
              dataSelect = this.scrollData
            } else {
              this.scrollData.map(item => {
                const idx = this.dataSelect.findIndex(
                  innerItem => JSON.stringify(innerItem) === JSON.stringify(item)
                )
                if (idx > -1) {
                  dataSelect.push(item)
                }
              })
            }
            // 使用dataSelect而不直接使用this.dataSelect的原因是：保证this.toggleSelection方法处理的数据在20条以内，否则在数据量大的时候直接设置全部数据的选中状态会导致卡顿
            this.toggleSelection(dataSelect, true)
            // 手动调整表头复选框的状态，为了处理以下情况：全选 -> 取消某一项 -> 滚动至这一项不在可视区，此时由于取消了某一项，表头复选框应为半选中状态，实际出现了全选状态
            if (!this.selectAllBoolean) {
              this.setTHeadCheckboxStatus('is-indeterminate')
            }
          }
        })
      }
    },
    initLazyScroll() {
      this.deltaCount = 0
      if (this.$refs.tableWapper) {
        this.$refs.tableWapper.scrollTop = 0
      }
      this.scrollData = this.dataSource.slice(0, this.viewRowCount)
    },
    initScroll() {
      setTimeout(() => {
        this.deltaCount = 0
        this.$refs.commonTable.bodyWrapper.scrollTop = 0
      }, 100)
    },
    setTHeadCheckboxStatus(status) {
      let thead = document
        .getElementById('tableID')
        .getElementsByClassName('el-table__header-wrapper')[0]
        .getElementsByTagName('table')[0]
        .getElementsByTagName('thead')[0]
        .getElementsByClassName('el-table-column--selection')[0]
      let theadSelection = thead && thead.getElementsByClassName('el-checkbox__input')[0]
      let theadFixed = document
        .getElementById('tableID')
        .getElementsByClassName('el-table__fixed-header-wrapper')[0]
        .getElementsByTagName('table')[0]
        .getElementsByTagName('thead')[0]
        .getElementsByClassName('el-table-column--selection')[0]
      let theadFixedSelection =
        theadFixed && theadFixed.getElementsByClassName('el-checkbox__input')[0]
      let removeStatus = status === 'is-checked' ? 'is-indeterminate' : 'is-checked'
      setTimeout(() => {
        if (theadSelection) {
          if (status) {
            theadSelection.classList.remove(removeStatus)
            theadSelection.classList.add(status)
          } else {
            theadSelection.classList.remove('is-checked', 'is-indeterminate')
          }
        }
        if (theadFixedSelection) {
          if (status) {
            theadFixedSelection.classList.remove(removeStatus)
            theadFixedSelection.classList.add(status)
          } else {
            theadFixedSelection.classList.remove('is-checked', 'is-indeterminate')
          }
        }
      }, 0)
    },
    onToggleSelection(list, val) {
      this.echo(list, val)
    },
    echo(list, ids) {
      list.forEach(item => {
        if (ids.includes(item.id)) {
          this.$refs.commonTable.toggleRowSelection(item, true)
        }
        if (item.children.length > 0) {
          this.echo(item.children, ids)
        }
      })
    }
  }
}
</script>

<style lang="scss">
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
  .table-wrap {
    padding: 10px 10px;
    .borderStyle {
      border: 1px solid rgba($color-mainfont, 0.2);
      border-top: none;
      border-bottom: none;
    }
    .el-table__row td {
      height: 34px;
      padding: 0;
      font-size: 12px;
      .el-button {
        padding: 0;
      }
    }
    .table {
      font-size: 12px;
      color: $color-mainfont;
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
          user-select: initial;
          background-color: $color-table-header-bg;
          border-right: 1px solid $color-background;
          // &:nth-last-child(2) {
          //   border-right: none;
          // }
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
            overflow: hidden;
            text-overflow: ellipsis;
            user-select: initial;
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

        /* th:first-child { */

        /* border-right: none; */

        /* } */
        // th:nth-last-child(2) {
        // border-right: none;
        // }
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
          // background-color: $color-body-bg;
          // border-right-color: $color-body-bg;
        }
      }
    }
    .table .el-table__footer-wrapper .el-table__footer {
      &::before {
        position: absolute;
        // bottom: 39px;
        left: 0;
        z-index: 4;
        display: block;
        width: 100%;
        height: 2px;
        content: '';
        background-color: rgba($color-mainfont, 0.4);
      }
    }
    // .table .el-table__fixed-footer-wrapper .el-table__footer {
    //   &::before {
    //     position: absolute;
    //     top: 0;
    //     left: 0;
    //     z-index: 1;
    //     display: block;
    //     width: 100%;
    //     height: 2px;
    //     content: '';
    //     background-color: rgba($color-mainfont, 0.4);
    //   }
    // }

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
    // .table_head th:nth-last-child(2) {
    //   border-right: 1px solid $color-background;
    // }
  }
  // .table .el-table__body tr.hover-row > td,
  // .el-table__body tr.hover-row.current-row > td,
  // .el-table__body tr.hover-row.el-table__row--striped > td,
  // .el-table__body tr.hover-row.el-table__row--striped.current-row > td {
  //   // background-color: $color-button-bg;
  //   // border-right-color: $color-button-bg;
  // }
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
// .loading {
//   height: 48px;
//   font-size: 14px;
//   line-height: 48px;
//   text-align: center;
//   .el-icon-loading {
//     font-size: 16px;
//   }
// }
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
</style>
<style lang="scss">
// .base-table {
//   .table-wrap {
//     .el-table__body-wrapper,
//     .el-table__fixed {
//       .el-table__body,
//       .el-table__fixed-body-wrapper {
//         .el-checkbox__input.is-checked {
//           .el-checkbox__inner {
//             background-color: $color-table-header-bg;
//             border-color: $color-table-header-bg;
//           }
//           .el-checkbox__inner::before {
//             background-color: #fff;
//           }
//           .el-checkbox__inner::after {
//             border-color: #fff;
//           }
//         }
//       }
//     }
//   }
// }
</style>
