<template>
  <el-row :gutter="20" class="dynamicForm">
    <div v-for="item in formList" :key="item.prop" :span="rowNum" class="box">
      <el-form-item
        :key="item.key"
        :label="item.label"
        label-width="36%"
        :prop="item.key"
        :item="item"
      >
        <!-- <ControlComponent
          v-if="item.type === 'INPUT'"
          :item="item"
        ></ControlComponent> -->
        <ItemRender
          :type="item.type"
          :config="{
            placeholder: item.placeholder || '',
            ...item.config,
            model,
            key: item.key
          }"
        />
        <!-- <SelectComponent
          v-if="item.type === SELECT"
          :item="item"
        ></SelectComponent> -->
      </el-form-item>
    </div>
    <!-- <el-col
      :span="
        formList.length % 3 === 0 ? 24 : formList.length % 3 === 1 ? 16 : 8
      "
      style=" padding-bottom: 20px; text-align: right"
    > -->
    <div class="box boxBtn1">
      <el-button
        v-for="(btn, index) in btnGroup"
        :key="index"
        :type="btn.type"
        @click="btn.click"
        >{{ btn.text }}</el-button
      >
    </div>
    <!--:type="index % 2 === 0 ? 'primary' : null"-->
    <!-- </el-col> -->
  </el-row>
</template>

<script>
// import ControlComponent from './ControlComponent';
import ItemRender from '@components/renders/ItemRender';
// import SelectComponent from './SelectComponent';
export default {
  name: 'DynamicForm',
  components: { ItemRender },
  props: {
    formList: {
      type: Object,
      default: () => []
    },
    btnGroup: {
      type: Object,
      default: () => []
    },
    model: {
      type: Object,
      default: () => []
    }
  },
  data() {
    return {
      rowNum: 8
    };
  },
  mounted() {
    if (this.formList.length < 3) {
      this.rowNum = 24 / ((this.formList.length % 3) + 1);
    } else {
      this.rowNum = 8;
    }
  }
};
</script>
<style lang="scss" scoped>
.dynamicForm {
  padding-right: 40px;
  .box {
    display: inline-block;
    width: 20%;
    .el-form-item {
      // width: 337px;
      margin-bottom: 10px;
    }
  }
  .boxBtn1 {
    float: right;
    text-align: right;
  }
}
</style>
