<template>
  <div class="configMain">
    <el-container direction="vertical" class="bodyWrap">
      <div class="box">
        <BaseForm :form-data="formData" :label-width="140" @queryForm="addMenu" @cancel="cancel" />
      </div>
    </el-container>
  </div>
</template>

<script>
import BaseForm from '@components/BaseForm'
import { formData } from './libs/edit'
import {
  // getMenuTypeVoAPI,
  getTreeListAPI,
  postAddMenuAPI,
  // getMenuIdAPI
  postUpdateMenuAPI
} from '@api/manage'
import { recursion } from './libs/recursion'
export default {
  name: 'Aa',
  components: {
    BaseForm
  },
  props: {
    appendVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formData: formData,
      setOptions: {}
    }
  },
  created() {
    this.getTreeListFN()
    if (this.$route.query.record) {
      this.formData.initData = this.$route.query.record
    }
  },
  methods: {
    // 获取菜单类型    后续可能需要
    // async getMenuTypeVoFN() {
    //   const { data } = await getMenuTypeVoAPI()
    //   this.formData.renderFrom[0].options = data.map(item => {
    //     item.code = item.value
    //     item.name = item.text
    //     return item
    //   })
    // },
    // 获取所有菜单
    async getTreeListFN() {
      const { data } = await getTreeListAPI({ type: '0' })
      const arr = recursion(data)
      this.formData.renderFrom[1].options = arr
    },
    // 添加菜单
    async addMenu(val) {
      if (this.$route.query.record) {
        if (!val.parentId) {
          val.parentId = -1
        }
        val.menuId = val.id
        const { status } = await postUpdateMenuAPI(val)
        if (status === 200) {
          this.$message.success('修改成功')
          this.formData.renderFrom[1].options = []
          this.$router.back()
        }
      } else {
        const { status } = await postAddMenuAPI(val)
        if (status === 200) {
          this.$message.success('添加成功')
          this.formData.renderFrom[1].options = []
          this.$router.back()
        }
      }
    },
    // 当点击取消的时候
    cancel() {
      this.formData.initData = {}
      this.$router.back()
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (from.name === 'manage') {
        vm.getTreeListFN()
      }
    })
  }
}
</script>
<style lang="scss" scoped>
.configMain {
  // padding: 10px;
  background-color: $color-body-bg;

  .bodyWrap {
    background-color: #fff;
    .box {
      width: 50%;
      margin-top: 50px;
      margin-left: 20%;
    }
  }
}
</style>
