<script>
import // createdElementInput
// createdElementSelect,
// createdElementRadio,
// createdElementCheck
'./formItems';
export default {
  name: 'ControlComponent',
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  },
  mounted() {},
  render: function(h) {
    let rules = {};
    if (this.item.rules) {
      rules = this.item.rules;
    }
    return h('el-input', {
      props: {
        value: this.item.record[this.item.prop],
        ...rules
      },
      on: {
        input: (val) => {
          this.item.record[this.item.prop] = val;
        }
      }
    });
  }
};
</script>

<!--<style lang="scss" scoped>-->
<!--div{-->
<!---->
<!--}-->
<!--</style>-->
