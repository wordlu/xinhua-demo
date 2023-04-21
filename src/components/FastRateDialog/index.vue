<template>
  <!-- 新增快速评级 -->
  <el-dialog
    :visible.sync="visible"
    :title="title"
    :width="width"
    :close-on-click-modal="false"
    @close="handleDialogCancle"
  >
    <template>
      <el-form ref="fastDialog" :model="fastForm" :rules="rulesFast" label-width="160px">
        <el-col :span="24">
          <el-form-item v-show="hasItem" label="主体名称:">
            <span>{{ fastForm.objName }}</span>
          </el-form-item>
          <el-form-item
            v-show="!hasItem"
            v-model="fastForm.objCode"
            label="主体名称:"
            prop="objCode"
          >
            <el-select
              v-model="fastForm.objCode"
              placeholder="请输入关键字"
              filterable
              clearable
              remote
              class="select-w"
              :loading="keyloading"
              :remote-method="handleGetObjNameList"
              @change="changeObj"
              @visible-change="val => selectVisible(val)"
            >
              <el-option
                v-for="item in objNameList"
                :key="item.code + Math.random()"
                :label="item.name"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="新增人工快速评级:" prop="objLevel">
            <el-select v-model="fastForm.objLevel" class="select-w">
              <el-option
                v-for="item in globalDictMap('2010')"
                :key="item.code"
                :label="item.name"
                :value="item.code"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="当前人工正式评级:">
            <span>{{ fastForm.newestOfficialLevel }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="当前人工快速评级:">
            <span>{{ fastForm.newestSpeedyLevel }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="当前批量评级:">
            <span>{{ fastForm.newestBatchLevel }}</span>
          </el-form-item>
        </el-col>
      </el-form>
    </template>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleDialogCancle">取 消</el-button>
      <el-button :loading="submitLoading" type="primary" @click="handleFastSave">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import * as service from '@api/ratemanagement'

export default {
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    showType: {
      type: String,
      default: 'add'
    },
    title: {
      type: String,
      default: ''
    },
    width: {
      type: String,
      default: '48%'
    },
    itemData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      visible: false,
      fastForm: {},
      objNameList: [],
      objNewestLevelList: [],
      keyloading: false,
      rulesFast: {
        objCode: [{ required: true, message: '请选择', trigger: 'blur' }],
        objLevel: [{ required: true, message: '请选择', trigger: 'blur' }]
      },
      defaultList: [],
      submitLoading: false
    }
  },
  computed: {
    hasItem() {
      return Object.keys(this.itemData).length > 0
    }
  },
  watch: {
    isShow: {
      handler(nv) {
        this.visible = nv
        if (nv) {
          this.initOrgList()
        }
      },
      immediate: true
    },
    itemData: {
      handler(nv) {
        if (nv !== undefined && nv !== null && Object.keys(nv).length > 0) {
          const { objName, objCode } = nv
          this.fastForm = {
            objName,
            objCode
          }
          this.changeObj(objCode)
        }
      },
      immediate: true
    }
  },
  methods: {
    handleDialogCancle() {
      this.fastForm = {}
      if (!this.submitLoading) {
        this.$emit('dialogClose')
      } else {
        this.$message.warning('提交未完成，请稍后关闭弹窗')
      }
    },
    handleFastSave() {
      this.$refs.fastDialog.validate(valid => {
        if (valid) {
          this.submitLoading = true
          const { objCode, objLevel } = this.fastForm
          const roleName = JSON.parse(sessionStorage.getItem('NCAM')).user.roleName
          const params = {
            objCode,
            objLevel,
            roleName
          }
          service.addFastRating(params).then(res => {
            this.submitLoading = false
            if (res.status === 200) {
              this.handleDialogCancle()
              this.$emit('success')
              this.$message({
                showClose: true,
                message: '新增成功',
                type: 'success'
              })
            }
          }).catch(() => {
            this.submitLoading = false
          })
        }
      })
    },
    handleGetObjNameList(val) {
      if (val !== '') {
        this.keyloading = true
      }
      service.getorgNameSearchList(val).then(res => {
        if (res) {
          this.objNameList = res.data
          this.keyloading = false
        }
      }) // 主体名称列表
    },
    changeObj(val) {
      service.getNewesRatingLevel(val).then(res => {
        if (res.status === 200) {
          const { batchLevel, officialLevel, speedyLevel } = res.data
          this.$set(this.fastForm, 'newestBatchLevel', batchLevel)
          this.$set(this.fastForm, 'newestOfficialLevel', officialLevel)
          this.$set(this.fastForm, 'newestSpeedyLevel', speedyLevel)
        }
      })
    },
    initOrgList() {
      service.getOrgNameList().then(res => {
        if (res) {
          this.objNameList = res.data
          this.defaultList = res.data
        }
      }) // 初始化主体名称列表
    },
    selectVisible(val) {
      if (val) {
        this.objNameList = this.defaultList
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.select-w {
  width: 280px;
}
</style>
