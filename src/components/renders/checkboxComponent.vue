<template>
  <div class="popoverChecked">
    <el-popover
      ref="popoverCol"
      v-model="visible"
      popper-class="popoverCol"
      placement="bottom"
      width="200"
      trigger="click"
      @show="openPop"
      @hide="hidePop"
    >
      <div class="popoverTop">
        <el-checkbox
          v-model="checkAll"
          :indeterminate="isIndeterminate"
          @change="handleCheckAllChange"
          >全选</el-checkbox
        >
        <span class="defaultSort2" @click="defaultSort"
          ><svg-icon icon-class="refresh-line"></svg-icon> 默认排序</span
        >
      </div>
      <div style="margin: 10px 0;"></div>
      <el-input
        v-model="searchValue"
        clearable
        placeholder="请输入查询"
        style="margin-bottom: 10px"
        @input="handleSearch"
        ><i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <el-checkbox-group
        v-model="checkedCol"
        v-loading="loading"
        class="popoverCheck"
        @change="handleCheckedColChange"
      >
        <el-checkbox
          v-for="city in flag ? filterCol : allColumns"
          :key="city.id"
          :label="city.id"
          :disabled="city.fixedFlag === '1'"
          >{{ city.label }}</el-checkbox
        >
      </el-checkbox-group>
      <div class="popoverFooter">
        <el-button size="mini" @click="visible = false">取消</el-button>
        <el-button type="primary" size="mini" @click="onSure">确定</el-button>
      </div>
      <el-button slot="reference" class="columnSelf">
        <span>自定义列</span>
        <svg-icon
          icon-class="arrow-down-s-line"
          class="svg-color6-left"
        ></svg-icon>
        <!-- <i class="el-icon-arrow-down"></i> -->
      </el-button>
      <!-- <i
        slot="reference"
        class="el-icon-arrow-down"
        style="margin-left: -10px;font-size: 14px"
      ></i> -->
    </el-popover>
  </div>
</template>
<script>
// import { queryCustom, saveCustom } from '@api/customColumn';
import cloneDeep from 'lodash/cloneDeep';
export default {
  name: 'CheckboxComponent',
  props: {
    // checkedCol: {
    //   type: Array,
    //   default: () => []
    // },
    // allColumns: {
    //   type: Array,
    //   default: () => []
    // },
    tableCode: {
      type: String,
      default: () => ''
    }
  },
  data() {
    return {
      falg: false,
      visible: false,
      isIndeterminate: true,
      checkAll: false,
      checkedCol: [],
      allColumns: [],
      searchValue: '',
      filterCol: [],
      loading: true,
      scroollDiv: '',
      popDiv: ''
      // showList: this.tableHeader
    };
  },
  mounted() {
    this.scroollDiv = document.getElementsByClassName(
      'conentWrap'
    )[0].childNodes[0];
    this.popDiv = document.getElementsByClassName(
      'el-popover el-popper popoverCol'
    )[0];
  },
  beforeDestroy() {
    if (this.popDiv) {
      this.removeScroll();
    }
  },
  methods: {
    handleCheckAllChange(val) {
      let fixedList = [];
      let fixedIds = [];
      let allchecked = [];
      this.allColumns.forEach((item) => {
        allchecked.push(item.id);
        if (item.fixedFlag === '1') {
          fixedList.push(item);
          fixedIds.push(item.id);
        }
      });
      if (val) {
        this.checkedCol = allchecked;
      } else {
        this.checkedCol = fixedIds;
      }
      // this.checkedCol = val ? allchecked : [];
      this.isIndeterminate = false;
    },
    handleCheckedColChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.allColumns.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.allColumns.length;
    },
    openPop() {
      this.$nextTick(() => {
        this.addScroll();
      });
      let params = {
        tableCode: this.tableCode
      };
      this.queryCustom(params);
    },
    hidePop() {
      this.$nextTick(() => {
        this.removeScroll();
      });
    },
    onSure() {
      // let params = {
      //   showListIds: this.checkedCol,
      //   tableCode: this.tableCode
      // };
      // saveCustom(params).then((data) => {
      //   if (data.error) {
      //     return this.$message.error(
      //       '自定义信息保存失败:' + data.error.message
      //     );
      //   } else {
      //     this.visible = false;
      //     let tempArr = [];
      //     this.checkedCol.forEach((item) => {
      //       let flag = this.allColumns.findIndex((item2) => item2.id === item);
      //       if (flag !== -1) {
      //         tempArr.push(this.allColumns[flag]);
      //       }
      //     });
      //     this.$emit('resetHeader', tempArr);
      //   }
      // });
    },
    addScroll() {
      let that = this;
      this.scroollDiv.addEventListener('scroll', that.ScrollFn, {
        passive: false
      });
    },
    removeScroll() {
      let that = this;
      this.scroollDiv.removeEventListener('scroll', that.ScrollFn, {
        passive: false
      });
    },
    ScrollFn(e) {
      this.popDiv.style.position = 'fixed';
      e.preventDefault();
    },
    // 默认排序
    defaultSort() {
      // this.visible = false;
      this.loading = true;
      let params = {
        tableCode: this.tableCode,
        isDefault: 1
      };
      this.queryCustom(params);
    },
    queryCustom(params) {
      // let { isDefault } = params;
      // queryCustom(params).then((data) => {
      //   if (data.error) {
      //     this.$message.error(data.error.message);
      //   } else {
      //     // if (isDefault) {
      //     //   let temp = [];
      //     //   temp = data.data.showList;
      //     //   this.$emit('resetHeader', temp);
      //     // } else {
      //     this.loading = false;
      //     this.checkedCol = data.data.showList.map((item) => item.id);
      //     this.allColumns = data.data.showList.concat(data.data.hiddenList);
      //     // }
      //   }
      // });
    },
    // 模糊搜索
    handleSearch(val) {
      this.flag = true;
      let previousCol = cloneDeep(this.allColumns);
      this.filterCol = [];
      previousCol.forEach((item) => {
        if (item.label.includes(val)) {
          this.filterCol.push(item);
        }
      });
    }
  }
};
</script>
<style lang="scss">
.el-table th div {
  line-height: 34px;
}
.base-table-demo {
  .el-table th div {
    height: 34px;
    line-height: 34px;
  }
}
.popoverChecked {
  display: inline-block;
  margin-left: 10px;
}
.popoverCol {
  .searchBtn {
    margin-bottom: 10px;
  }
  .el-input .el-input__inner {
    height: 32px;
    line-height: 32px;
  }
  .popoverTop {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .popoverFooter {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-top: 10px;
    .el-button {
      padding: 7px 15px;
    }
  }
  .popoverCheck {
    height: 400px;
    overflow: auto;
    .el-checkbox {
      display: block;
      margin-bottom: 10px;
    }
    .el-checkbox:last-of-type {
      margin-bottom: 0;
    }
  }
  .defaultSort2 {
    margin-left: 10px;
    font-size: 12px;
    cursor: pointer;
  }
}
.columnSelf {
  height: 36px;
  padding: 10px 10px;
}
.svg-color6-left {
  margin-left: 6px;
  color: #929292;
}
</style>
