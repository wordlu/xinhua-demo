<template>
  <div class="configMain">
    <el-container direction="vertical" class="bodyWrap">
      <BeforeLineTitle title="菜单管理" />
      <BaseForm :form-data="formData" :label-width="140" @queryForm="add" @inquire="inquire" />
      <BaseTable
        ref="ref1"
        :data-source="dataList"
        :columns="list"
        :total="total"
        :page-size="table.pageSize"
        :current-page="table.pageNum"
        :loading="false"
        :page-sizes="[10, 50, 100]"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        row-key="id"
        :default-expand-all="false"
        :relevance="relevance"
        @rowSelect="rowSelect"
        @selectAll="selectAll"
      />
      <examine :examine-visible="examineVisible" :examine-data="examineData" @close="close" />
    </el-container>
  </div>
</template>

<script>
import BeforeLineTitle from '@components/CommonTitle'
import BaseForm from '@components/BaseForm'
import BaseTable from '@components/BaseTable'
import { formData, list } from './libs/data'
import examine from './components/examine.vue'
import { getTreeListAPI, getMenuIdAPI, deleteMenuAPI } from '@api/manage'
import { recursion } from './libs/recursion'
import cloneDeep from 'lodash/cloneDeep'
import keepMixin from '@mixins/keep.mixin'

export default {
  name: 'Manage',
  components: {
    BaseForm,
    BeforeLineTitle,
    BaseTable,
    examine
  },
  mixins: [keepMixin],

  data() {
    return {
      // form表单的数据
      formData,
      // 表格需要发送的数据
      list: [
        ...list
        // 后续可能会需要，先注释调
        // ...[
        //   {
        //     label: '操作',
        //     prop: '',
        //     'header-align': 'center',
        //     align: 'center',
        //     render: (h, { record }) => {
        //       return (
        //         <div>
        //           <el-button
        //             type="text"
        //             onClick={() => {
        //               this.edit(record)
        //             }}
        //           >
        //             编辑
        //           </el-button>
        //           <el-button
        //             type="text"
        //             onClick={() => {
        //               this.examines(record)
        //             }}
        //           >
        //             查看
        //           </el-button>
        //           <el-button
        //             type="text"
        //             onClick={() => {
        //               this.deleteMenuFN(record)
        //             }}
        //           >
        //             删除
        //           </el-button>
        //         </div>
        //       )
        //     }
        //   }
        // ]
      ],
      // 表格数据
      dataList: [],
      total: null,
      table: {
        pageNum: 1,
        pageSize: 10
      },
      // 控制查看dialog框的显示和隐藏
      examineVisible: false,
      // 点击查看的数据
      examineData: {},
      deleteData: '',
      // 全选需要的数据
      relevance: true
    }
  },
  created() {
    this.getMenuListFN()
  },
  methods: {
    // 新增dialog框关闭的时候
    appendClose(val) {
      this.appendVisible = val
    },
    add() {
      this.$router.push({
        path: '/administration/menu/edit'
      })
    },
    async getMenuListFN() {
      const { data } = await getTreeListAPI({ lazy: false, parentId: 1 })
      this.dataList = data
      const list = cloneDeep(data)
      const newList = recursion(list)
      this.formData.renderFrom[0].tree = newList
    },
    // 点击编辑的时候
    async edit(record) {
      if (record.parentId === -1) {
        record.parentId = ''
        record.type = Number(record.type)
      } else {
        const { data } = await getMenuIdAPI(record.parentId)
        record.parentid = record.parentId
        record.parentId = data.name
        record.type = Number(record.type)
      }
      this.$router.push({
        path: '/administration/menu/edit',
        query: {
          record
        }
      })
    },
    // 点击查看的时候
    examines(record) {
      this.examineVisible = true
      if (record.type === 0) {
        record.type = '菜单'
      } else {
        record.type = '按钮'
      }
      this.examineData = record
    },
    close() {
      this.examineVisible = false
    },
    async deleteMenuFN(record) {
      this.$confirm('确定删除么', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { status } = await deleteMenuAPI({ id: record.id })
          if (status === 200) {
            this.$message.success('删除成功')
            this.getMenuListFN()
          }
        })
        .catch(() => {
          this.$message({
            type: 'warning',
            message: '已取消删除'
          })
        })
    },
    // 批量删除    这个功能后续可能会要  需求会和客户那边确认
    // async batchDelete() {
    //   this.$confirm('确定批量删除么', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   })
    //     .then(async () => {
    //       if (!this.deleteData) {
    //         this.$message.success('请选择要删除的菜单')
    //       } else {
    //         const { status } = await deleteBatchMenuAPI({ menuIds: this.deleteData })
    //         if (status === 200) {
    //           this.$message.success('删除成功')
    //           this.getMenuListFN()
    //           this.deleteData = ''
    //         }
    //       }
    //     })
    //     .catch(() => {
    //       this.$message({
    //         type: 'warning',
    //         message: '已取消删除'
    //       })
    //     })
    // },
    // 点击单选的时候
    rowSelect(selection) {
      this.deleteData = selection.map(item => item.id).join()
    },
    // 点击多选的时候
    selectAll(selection) {
      this.deleteData = selection.map(item => item.id).join()
    },
    // 点击查询的时候
    inquire(val) {
      this.getMenuListFN()
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
}
</style>
