<template>
  <div class="inner-table">
    <div class="table-wrap">
      <el-table
        v-loading="loading"
        :data="tableData"
        stripe
        border
        :header-row-class-name="'table_header'"
        :row-class-name="'row'"
        :row-style="rowStyle"
      >
        <el-table-column
          v-for="(item, index) in columns"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :align="item.align">
        </el-table-column>
      </el-table>
    </div>
  </div>
  
</template>

<script>
export default {
  props: {
    tableData: {
      type: Array,
      default: () => []
    },
    columns: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    },
    rowStyle: {
      type: Function,
      default() {
        return 'row'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.inner-table{
  background-color: $color-white;
  .table-wrap {
    padding: 10px 0 10px 10px;
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
    .el-table {
      width: 100%;
      font-size: 12px;
      color: $color-mainfont;
      ::v-deep.el-table__body-wrapper {
        .el-table__cell {
          padding: 6px 0;
        }
      }
      .el-table-column--selection .cell {
        overflow: visible !important;
      }
      ::v-deep.el-table__header-wrapper {
        .table_header {
          .el-table__cell {
            height: 34px;
            padding: 0 !important;
            font-size: 14px;
            font-weight: bold;
            color: $color-black;
            user-select: initial;
            background-color: $color-table-header-bg;
            border-right: 1px solid $color-background;
            .cell {
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
  }
  .el-table__fixed::before,
  .el-table__fixed-right::before,
  .el-table::before,
  .el-table--group::after,
  .el-table--border::after {
    width: 0;
  }
  .table .el-table__fixed-header-wrapper {
    .table_head th:last-child {
      border-right: none;
    }
  }
}
</style>