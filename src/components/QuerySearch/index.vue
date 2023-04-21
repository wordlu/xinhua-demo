<template>
  <div class="querySearch">
    <el-row v-if="isShowSizer" class="chose">
      <el-col
        v-for="(item, i) in sizers"
        :key="item.name"
        class="chose-item"
        :offset="1"
      >
        <el-button
          class="choseBtn"
          type="primary"
          size="small"
          @click="item.fn(1222)"
        >
          {{ item.name }}
          <i
            v-if="item.icon"
            :class="item.icon ? item.icon : ''"
            class="el-icon--right"
          ></i>
        </el-button>
        <div class="box">
          <p
            v-for="(selected, j) in item.selectedList"
            :key="selected.name"
            class="selectedItem"
          >
            {{ selected }}
            <i
              class="delBodyItem el-icon-close"
              @click="deleteItem({ parentIndex: i, childIndex: j })"
            ></i>
          </p>
        </div>
        <el-button @click="handleEmpty(i)">清空</el-button>
      </el-col>
    </el-row>
    <!-- <el-form v-model="queryParams" :label-width="labelWidth">
      <el-row :gutter="16">
        <el-col v-for="(item, index) in queryItems" :key="index" :span="6">
          <el-form-item v-if="item.type === 'text'" :label="item.label + '：'">
            <el-input v-model="queryParams[item.prop]" :placeholder="item.placeholder ? item.placeholder : '请输入'"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form> -->
  </div>
</template>

<script>
import queryMixin from '@mixins/query.mixin';
export default {
  mixins: [queryMixin],
  props: {
    isShowSizer: {
      type: Boolean,
      default: false
    },
    sizers: {
      type: Array,
      default: () => []
    },
    queryItems: {
      type: Array,
      default: () => []
    },
    labelWidth: {
      type: String,
      default: '120px'
    }
  },
  data() {
    return {};
  },
  methods: {
    deleteItem(data) {
      this.$emit('deleItem', data);
    },
    handleEmpty(data) {
      this.$emit('handleEmpty', data);
    }
  }
};
</script>

<style lang="scss" scoped>
.querySearch {
  margin: 40px 0 40px 40px;
  .choseBtn {
    margin-right: 20px;
  }
  .chose-item {
    display: flex;
    margin-bottom: 20px;
  }
  .box {
    display: flex;
    width: 60%;
    margin-right: 10px;
    overflow: auto;
    border: 1px solid #e0e3e5;
    &::-webkit-scrollbar {
      display: none;
      width: 0;
    }
    .selectedItem {
      position: relative;
      height: 20px;
      padding: 0 15px;
      margin: 7px 10px;
      line-height: 20px;
      white-space: nowrap;
      background: #e0e3e5;
      border-radius: 4px;
      .delBodyItem {
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
      .el-input {
        .el-input__inner {
          padding-right: 51px !important;
        }
      }
    }
  }
}
</style>