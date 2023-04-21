<template>
  <el-form-item :rule="item.rules" :label="item.label" :prop="item.prop">
    <el-input
      v-if="item.type === 'INPUT'"
      :type="item.subtype"
      :placeholder="item.placeholder"
      :disabled="item.disable"
      v-bind="$attrs"
      v-on="$listeners"
    ></el-input>
    <el-select
      v-else-if="item.type === 'SELECT'"
      v-bind="$attrs" :multiple="item.multiple"
      :disabled="item.disabled"
      :multiple-limit="item.multipleLimit"
      v-on="$listeners">
      <el-option
        v-for="o in item.options"
        :key="o.value"
        :label="o.label"
        :value="o.value"
        :disabled="o.disabled">
      </el-option>
    </el-select>
    <el-date-picker
      v-if="item.type === 'DATE'"
      :placeholder="item.placeholder"
      type="date"
      v-bind="$attrs"
      v-on="$listeners">
    </el-date-picker>
  </el-form-item>
</template>

<script>
  export default {
    name: "FormItem"
  };
</script>
