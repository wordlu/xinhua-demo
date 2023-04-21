<template>
  <div class="sizer-item"> </div>
</template>

<script>
export default {
  name: 'SizerItem',
  components: {
    // Dialog
  },
  props: {
    buttonName: {
      type: String,
      default: '按钮'
    },
    item: {
      type: Object,
      default: () => {}
    },
    handle: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      visible: this.item.isShow
    };
  },
  computed: {
    dialogVisible: {
      get() {
        return this.visible;
      },
      set(v) {
        this.visible = v;
      }
    }
  },
  methods: {
    handleSizer() {
      this.dialogVisible = true;
    },
    trigger(fn) {
      fn(this, true);
    }
  }
};
</script>