<template>
  <div ref="tableWapper" class="base-table">
    <slot name="radio"></slot>
    <div class="table-wrap">
      <el-table
        id="tableID"
        ref="tableWapper"
        v-loading="loading"
        class="table"
        :data="tableData"
        :height="tableHeight"
      >
        <template v-for="(item, index) in tableColumn">
          <!-- 一级表头 -->
          <el-table-column
            v-if="item.children"
            :key="index"
            :prop="item.prop"
            :label="item.name"
            :width="item.width"
            align="center"
          >
            <!-- 二级表头 -->
            <template v-for="(itemchild, index1) in item.children">
              <el-table-column
                v-if="itemchild.children"
                :key="index1"
                :prop="itemchild.prop"
                :label="itemchild.name"
                align="center"
              >
                <template v-for="(itemchilds, indexs1) in itemchild.children">
                  <el-table-column
                    v-if="itemchilds.children"
                    :key="indexs1"
                    :prop="itemchilds.prop"
                    :label="itemchilds.name"
                    align="center"
                  >
                  </el-table-column>
                  <el-table-column
                    v-else
                    :key="indexs1 + 'i'"
                    :prop="itemchilds.prop"
                    :label="itemchilds.name"
                    align="center"
                  >
                  </el-table-column>
                </template>
              </el-table-column>
              <el-table-column
                v-else
                :key="index1 + 'i'"
                :prop="itemchild.prop"
                :label="itemchild.name"
                :width="item.width"
                align="center"
              >
              </el-table-column>
            </template>
          </el-table-column>
          <el-table-column
            v-else
            :key="index + 'i'"
            :prop="item.prop"
            :label="item.name"
            align="center"
            :width="item.width"
          >
          </el-table-column>
        </template>
      </el-table>
      <el-pagination
        v-if="hasPagination"
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
export default {
  name: 'BaseTable',
  props: {
    tableData: {
      type: Array,
      default: () => []
    },
    tableHeight: {
      type: String,
      default: () => ''
    },
    tableColumn: {
      type: Array,
      default: () => []
    },
    hasPagination: {
      type: Boolean,
      default: false
    },
    total: {
      type: Number,
      default: () => 20
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
    pagerCount: {
      type: Number,
      default: 5
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  computed: {
    computePageSizes: function() {
      let sizes = []
      let size = 18
      size = this.showCurrentSize ? 16 : 18
      sizes = [size, 50, 100, 500, 5000]
      return sizes
    },
    showLayout: function() {
      // 通过表头计算页面选择器 默认展示16/页还是18/页
      let defaultLayout = ['total', 'sizes', 'prev', 'pager', 'next', 'jumper']
      let layout = this.layout ? this.layout.split(',').map(item => item.trim()) : defaultLayout
      layout = layout.join(',')
      return layout
    }
  },
  // watch: {
  //   tableColumn (newV, oldV) {
  //     this.column = newV;
  //   }
  // },
  mounted() {},
  methods: {
    handleCurrentChange(val) {
      this.$emit('handleCurrent', val)
    },
    handleSizeChange(val) {
      this.$emit('handleSize', val)
    }
  }
}
</script>
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
      // max-height: 700px;
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
            display: flex;
            justify-content: center;
            overflow: hidden;
            text-overflow: ellipsis;
            // white-space: nowrap;
            border-bottom: none;

            .thead-cell {
              display: inline-flex;
              flex-direction: row;
              align-items: left;
              padding: 0;
              overflow: initial;
              cursor: pointer;
              // &::before {
              //   position: absolute;
              //   top: 0;
              //   right: 0;
              //   bottom: 0;
              //   left: 0;
              //   content: '';
              // }
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
