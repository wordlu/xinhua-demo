<template>
  <div class="configMain">
    <el-dialog
      :visible="authorizationDialogVisible"
      :close-on-click-modal="false"
      width="70%"
      :title="title"
      @close="close"
      @open="open"
    >
      <el-container direction="vertical" class="bodyWrap">
        <div class="right">
          <el-button type="text" icon="el-icon-circle-plus-outline" class="button" @click="impower"
            >授权</el-button
          >
          <el-button type="text" icon="el-icon-circle-close" class="button" @click="cancel"
            >取消</el-button
          >
        </div>
        <BaseTable
          ref="tableRef"
          :data-source="dataList"
          :columns="list"
          :total="total"
          :page-size="table.pageSize"
          :current-page="table.pageNum"
          :loading="loading"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          row-key="id"
          :default-expand-all="false"
          :relevance="relevance"
          @rowSelect="rowSelect"
          @selectAll="selectAll"
        />
      </el-container>
    </el-dialog>
  </div>
</template>

<script>
import BaseTable from '@components/BaseTable'
import { list } from './libs/authorization'
import { getTreeListAPI, postRoleAPI, getRresentMenyAPI } from '@api/manage'
import { recursion } from './libs/recursion'
export default {
  name: 'Zzz',
  components: {
    BaseTable
  },
  props: {
    authorizationDialogVisible: {
      type: Boolean,
      default: false
    },
    roleId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      title: '授权',
      // 表格需要发送的数据
      list,
      // 表格数据
      dataList: [],
      total: null,
      table: {
        pageNum: 1,
        pageSize: 10
      },
      appendVisible: false,
      treeProps: {
        children: 'children',
        hasChildren: 'hasChildren'
      },
      id: 'key',
      menuIds: '',
      loading: false,
      relevance: true
    }
  },
  methods: {
    // 获取Tree菜单数据
    async getTreeListFN() {
      const { data } = await getTreeListAPI({ lazy: false, parentId: 1 })
      this.dataList = data
    },
    // 点击单选的时候
    rowSelect(selection) {
      this.menuIds = selection.map(item => item.id).join()
    },
    // 点击全选和取消全选的时候
    selectAll(selection) {
      this.menuIds = recursion(selection).join()
    },
    // 点击授权的时候
    async impower() {
      if (!this.menuIds) {
        return this.$message.error('请选择授权的选项')
      }
      if (!this.roleId) {
        return this.$message.error('请您选择需要授权的角色')
      }
      this.loading = true
      const { status } = await postRoleAPI({
        menuIds: this.menuIds,
        roleId: this.roleId
      })
      if (status === 200) {
        this.$message.success('授权成功')
      }
      this.loading = false
      this.close()
    },
    // 点击取消的时候
    cancel() {
      this.close()
    },
    // 获取当前角色的菜单
    async getRresentMenyFN() {
      const { data } = await getRresentMenyAPI(this.roleId)
      this.$refs.tableRef.onToggleSelection(this.dataList, data)
    },
    close() {
      this.$emit('authorizationClose')
    },
    async open() {
      await this.getTreeListFN()
      if (this.roleId) {
        this.getRresentMenyFN()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.configMain {
  // padding: 10px;
  background-color: $color-body-bg;

  .bodyWrap {
    background-color: #fff;
  }
  .right {
    text-align: right;
  }
  .button {
    font-size: 16px;
    color: rgb(0, 153, 255);
  }
}
</style>
