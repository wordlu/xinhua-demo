<script>
import // createdElementInput
// createdElementSelect,
// createdElementRadio,
// createdElementCheck
'./formItems';
export default {
  name: 'SelectComponent',
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

    let options = this.item.data.map((optionItem) => {
      return h('el-option', {
        props: {
          value: optionItem.value,
          key: optionItem.value,
          label: optionItem.label
        }
      });
    });
    return h(
      'el-select',
      {
        props: {
          value: this.item.value,
          ...this.item.props,
          ...rules
        },
        on: {
          change: (value) => {
            this.item.record[this.item.prop] = value;
          }
        }
      },
      options
    );
  }
};
</script>
